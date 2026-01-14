import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Application {
  id: string;
  created_at: string;
  nik: string;
  full_name: string;
  email: string;
  phone: string;
  education: string;
  birth_date: string;
  positions: string[];
  cv_url: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}

export function useApplicationStore() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
    } else {
      setApplications(data || []);
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();

    const channel = supabase
      .channel('applications-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => fetchApplications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const submitApplication = async (
    applicationData: Omit<Application, 'id' | 'created_at' | 'status' | 'cv_url'>,
    cvFile: File
  ) => {
    try {
      // 1. Upload CV to Storage
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resumes')
        .upload(filePath, cvFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('applications')
        .insert([{ ...applicationData, cv_url: publicUrl, status: 'pending' }]);

      if (dbError) throw dbError;

      return { success: true };
    } catch (err: any) {
      console.error('Application submission error:', err);
      return { success: false, error: err.message };
    }
  };

  const updateStatus = async (id: string, status: Application['status']) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };

  const deleteApplication = async (id: string, cvUrl: string) => {
    // 1. Extract file path from URL
    // e.g., https://.../storage/v1/object/public/resumes/public/123-abc.pdf
    const pathParts = cvUrl.split('resumes/');
    if (pathParts.length > 1) {
      const filePath = pathParts[1];
      await supabase.storage.from('resumes').remove([filePath]);
    }

    // 2. Delete from DB
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  return {
    applications,
    isLoading,
    error,
    submitApplication,
    updateStatus,
    deleteApplication,
    refresh: fetchApplications
  };
}

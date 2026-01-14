import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Document {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  drive_url: string;
  file_type: string;
  file_size: string;
}

export function useDocumentStore() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      setError(error.message);
    } else {
      setDocuments(data || []);
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocuments();

    const channel = supabase
      .channel('documents-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDocument = async (doc: Omit<Document, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('documents').insert([doc]);
    if (error) throw error;
  };

  const updateDocument = async (id: string, doc: Partial<Document>) => {
    const { error } = await supabase.from('documents').update(doc).eq('id', id);
    if (error) throw error;
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
  };

  return { documents, isLoading, error, addDocument, updateDocument, deleteDocument, refresh: fetchDocuments };
}

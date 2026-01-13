import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
}

export function usePortfolioStore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } else {
      setProjects(data || []);
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    const { error } = await supabase
      .from('projects')
      .insert([project]);

    if (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    const { id, ...dataToUpdate } = updatedProject;
    const { error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return { projects, isLoading, error, addProject, updateProject, deleteProject, refresh: fetchProjects };
}

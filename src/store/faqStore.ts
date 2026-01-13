import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface FAQ {
  id: number;
  created_at: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export function useFAQStore() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching FAQs:', error);
      setError(error.message);
    } else {
      setFaqs(data || []);
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaqs();

    // Set up real-time subscription
    const channel = supabase
      .channel('faqs-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faqs',
        },
        () => {
          fetchFaqs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addFAQ = async (faq: Omit<FAQ, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('faqs')
      .insert([faq]);

    if (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  };

  const updateFAQ = async (updatedFaq: FAQ) => {
    const { id, created_at, ...dataToUpdate } = updatedFaq;
    const { error } = await supabase
      .from('faqs')
      .update(dataToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  };

  const deleteFAQ = async (id: number) => {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  };

  return { faqs, isLoading, error, addFAQ, updateFAQ, deleteFAQ, refresh: fetchFaqs };
}

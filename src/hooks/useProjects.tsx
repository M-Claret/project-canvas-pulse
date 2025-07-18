import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Project } from '@/types/project';
import { useToast } from './use-toast';

export function useProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading projects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Partial<Project>, 'user_id' | 'id' | 'created_at' | 'updated_at'> & { title: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            user_id: user.id,
            color_index: Math.floor(Math.random() * 10),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: 'Project created',
        description: 'Your new project has been created successfully.',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev =>
        prev.map(project => project.id === id ? data : project)
      );

      return data;
    } catch (error: any) {
      toast({
        title: 'Error updating project',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
}
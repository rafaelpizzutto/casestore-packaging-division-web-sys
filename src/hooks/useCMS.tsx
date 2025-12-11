import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  type: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  sort_order: number;
  is_visible: boolean;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  content_type: string;
  content: string | null;
  sort_order: number;
}

// Hooks
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const useAllMenuItems = () => {
  return useQuery({
    queryKey: ['all-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const usePageContent = (page: string) => {
  return useQuery({
    queryKey: ['page-content', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', page)
        .order('sort_order');
      if (error) throw error;
      return data as PageContent[];
    },
  });
};

// Mutations
export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Partial<MenuItem> & { id: string }) => {
      const { id, ...updates } = item;
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<MenuItem, 'id'>) => {
      const { error } = await supabase
        .from('menu_items')
        .insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['all-menu-items'] });
    },
  });
};

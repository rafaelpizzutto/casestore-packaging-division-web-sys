import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAllMenuItems, useUpdateMenuItem, useCreateMenuItem, useDeleteMenuItem } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';

const AdminMenu = () => {
  const { data: menuItems, isLoading } = useAllMenuItems();
  const updateMenuItem = useUpdateMenuItem();
  const createMenuItem = useCreateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const { toast } = useToast();
  
  const [newItem, setNewItem] = useState({ name: '', path: '' });

  const handleUpdate = async (id: string, updates: Record<string, unknown>) => {
    try {
      await updateMenuItem.mutateAsync({ id, ...updates });
      toast({ title: 'Updated', description: 'Menu item updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    if (!newItem.name || !newItem.path) {
      toast({ title: 'Error', description: 'Name and path are required', variant: 'destructive' });
      return;
    }
    
    try {
      const maxOrder = menuItems ? Math.max(...menuItems.map(i => i.sort_order), 0) : 0;
      await createMenuItem.mutateAsync({
        name: newItem.name,
        path: newItem.path,
        sort_order: maxOrder + 1,
        is_visible: true,
      });
      setNewItem({ name: '', path: '' });
      toast({ title: 'Created', description: 'Menu item added' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Menu item removed' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Navigation Menu</h2>
        <p className="text-muted-foreground">Manage your site's navigation links</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
          <CardDescription>Create a new navigation link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="About Us"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="new-path">Path</Label>
              <Input
                id="new-path"
                value={newItem.path}
                onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                placeholder="/about"
              />
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>Drag to reorder, toggle visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {menuItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-accent/50 rounded-lg"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <Input
                  value={item.name}
                  onChange={(e) => handleUpdate(item.id, { name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  value={item.path}
                  onChange={(e) => handleUpdate(item.id, { path: e.target.value })}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor={`visible-${item.id}`} className="text-sm">Visible</Label>
                  <Switch
                    id={`visible-${item.id}`}
                    checked={item.is_visible}
                    onCheckedChange={(checked) => handleUpdate(item.id, { is_visible: checked })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMenu;

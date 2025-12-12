import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      const data: Record<string, string> = {};
      settings.forEach((s) => {
        data[s.key] = s.value || '';
      });
      setFormData(data);
    }
  }, [settings]);

  const handleSave = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key, value: formData[key] });
      toast({ title: 'Saved', description: `${key} updated successfully` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save setting', variant: 'destructive' });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      await updateSetting.mutateAsync({ key: 'logo_url', value: publicUrl });
      setFormData({ ...formData, logo_url: publicUrl });
      toast({ title: 'Uploaded', description: 'Logo uploaded successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload logo', variant: 'destructive' });
    } finally {
      setUploading(false);
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
        <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>
        <p className="text-muted-foreground">Manage your site's basic information</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
            <CardDescription>Your site name and logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <div className="flex gap-2">
                <Input
                  id="site_name"
                  value={formData.site_name || ''}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  placeholder="Your Site Name"
                />
                <Button onClick={() => handleSave('site_name')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload Logo
                </Button>
                {formData.logo_url && (
                  <img 
                    src={formData.logo_url} 
                    alt="Current logo" 
                    className="h-10 object-contain"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="info@yoursite.com"
                />
                <Button onClick={() => handleSave('contact_email')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <div className="flex gap-2">
                <Input
                  id="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
                <Button onClick={() => handleSave('contact_phone')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

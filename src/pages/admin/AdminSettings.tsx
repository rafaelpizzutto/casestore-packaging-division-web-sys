import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
              <div className="flex gap-2 items-center">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={formData.contact_phone || ''}
                  onChange={(value) => setFormData({ ...formData, contact_phone: value || '' })}
                  className="flex-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&>input]:border-0 [&>input]:bg-transparent [&>input]:outline-none [&>input]:flex-1"
                />
                <Button onClick={() => handleSave('contact_phone')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="contact_location"
                  value={formData.contact_location || ''}
                  onChange={(e) => setFormData({ ...formData, contact_location: e.target.value })}
                  placeholder="United States"
                />
                <Button onClick={() => handleSave('contact_location')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_subtitle">Location Subtitle</Label>
              <div className="flex gap-2">
                <Input
                  id="contact_subtitle"
                  value={formData.contact_subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, contact_subtitle: e.target.value })}
                  placeholder="Serving warehouses and businesses nationwide"
                />
                <Button onClick={() => handleSave('contact_subtitle')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <div className="flex gap-2 items-center">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={formData.whatsapp_number || ''}
                  onChange={(value) => setFormData({ ...formData, whatsapp_number: value || '' })}
                  className="flex-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&>input]:border-0 [&>input]:bg-transparent [&>input]:outline-none [&>input]:flex-1"
                />
                <Button onClick={() => handleSave('whatsapp_number')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_hours">Support Hours</Label>
              <div className="flex gap-2">
                <Textarea
                  id="support_hours"
                  value={formData.support_hours || ''}
                  onChange={(e) => setFormData({ ...formData, support_hours: e.target.value })}
                  placeholder="Monday - Friday: 8:00 AM - 6:00 PM EST&#10;Saturday: 9:00 AM - 2:00 PM EST"
                  rows={3}
                />
                <Button onClick={() => handleSave('support_hours')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
            <CardDescription>Customize your footer text and products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer_description">Description (below logo)</Label>
              <div className="flex gap-2">
                <Textarea
                  id="footer_description"
                  value={formData.footer_description || ''}
                  onChange={(e) => setFormData({ ...formData, footer_description: e.target.value })}
                  placeholder="Your company description..."
                  rows={3}
                />
                <Button onClick={() => handleSave('footer_description')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_products">Products List (comma-separated)</Label>
              <div className="flex gap-2">
                <Textarea
                  id="footer_products"
                  value={formData.footer_products || ''}
                  onChange={(e) => setFormData({ ...formData, footer_products: e.target.value })}
                  placeholder="Product 1,Product 2,Product 3"
                  rows={2}
                />
                <Button onClick={() => handleSave('footer_products')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_copyright">Copyright Text</Label>
              <div className="flex gap-2">
                <Input
                  id="footer_copyright"
                  value={formData.footer_copyright || ''}
                  onChange={(e) => setFormData({ ...formData, footer_copyright: e.target.value })}
                  placeholder="Company LLC. All rights reserved."
                />
                <Button onClick={() => handleSave('footer_copyright')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products Page</CardTitle>
            <CardDescription>Customize the products page header and categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="products_title">Page Title</Label>
              <div className="flex gap-2">
                <Input
                  id="products_title"
                  value={formData.products_title || ''}
                  onChange={(e) => setFormData({ ...formData, products_title: e.target.value })}
                  placeholder="Our Products"
                />
                <Button onClick={() => handleSave('products_title')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="products_subtitle">Page Subtitle</Label>
              <div className="flex gap-2">
                <Textarea
                  id="products_subtitle"
                  value={formData.products_subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, products_subtitle: e.target.value })}
                  placeholder="Premium packaging supplies..."
                  rows={2}
                />
                <Button onClick={() => handleSave('products_subtitle')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="products_categories">Categories (comma-separated)</Label>
              <div className="flex gap-2">
                <Input
                  id="products_categories"
                  value={formData.products_categories || ''}
                  onChange={(e) => setFormData({ ...formData, products_categories: e.target.value })}
                  placeholder="All,Film,Boxes,Tape,Protection,Janitorial"
                />
                <Button onClick={() => handleSave('products_categories')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">First category is typically "All" to show all products</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Tracker Page</CardTitle>
            <CardDescription>Customize the Warehouse Tracker AI page content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse_tracker_title">Page Title</Label>
              <div className="flex gap-2">
                <Input
                  id="warehouse_tracker_title"
                  value={formData.warehouse_tracker_title || ''}
                  onChange={(e) => setFormData({ ...formData, warehouse_tracker_title: e.target.value })}
                  placeholder="Warehouse Management Made Simple..."
                />
                <Button onClick={() => handleSave('warehouse_tracker_title')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse_tracker_subtitle">Page Subtitle</Label>
              <div className="flex gap-2">
                <Textarea
                  id="warehouse_tracker_subtitle"
                  value={formData.warehouse_tracker_subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, warehouse_tracker_subtitle: e.target.value })}
                  placeholder="Transform your warehouse operations..."
                  rows={2}
                />
                <Button onClick={() => handleSave('warehouse_tracker_subtitle')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse_tracker_demo_link">Demo Request Link</Label>
              <div className="flex gap-2">
                <Input
                  id="warehouse_tracker_demo_link"
                  value={formData.warehouse_tracker_demo_link || ''}
                  onChange={(e) => setFormData({ ...formData, warehouse_tracker_demo_link: e.target.value })}
                  placeholder="/contact"
                />
                <Button onClick={() => handleSave('warehouse_tracker_demo_link')} size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse_tracker_pricing_json">Pricing Tiers (JSON)</Label>
              <div className="flex gap-2">
                <Textarea
                  id="warehouse_tracker_pricing_json"
                  value={formData.warehouse_tracker_pricing_json || ''}
                  onChange={(e) => setFormData({ ...formData, warehouse_tracker_pricing_json: e.target.value })}
                  placeholder='[{"name":"Starter","description":"...","features":["..."]}]'
                  rows={4}
                  className="font-mono text-xs"
                />
                <Button onClick={() => handleSave('warehouse_tracker_pricing_json')} size="icon" className="self-start">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">JSON array with name, description, features array. Add "recommended": true for highlighted tier.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

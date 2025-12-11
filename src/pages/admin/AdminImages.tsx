import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

const AdminImages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Image Management</h2>
        <p className="text-muted-foreground">Upload and manage site images</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Image upload functionality will be added here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Drag and drop images here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to upload</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImages;

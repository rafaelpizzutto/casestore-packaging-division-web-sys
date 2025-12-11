import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const AdminContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Page Content</h2>
        <p className="text-muted-foreground">Edit hero sections and page content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Page content editor will be added here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Content editing for each page</p>
            <p className="text-sm text-muted-foreground mt-2">Hero sections, text blocks, CTAs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContent;

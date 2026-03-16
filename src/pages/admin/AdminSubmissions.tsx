import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Mail, Phone, Building, Calendar, Trash2, Check, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  product_interest: string | null;
  estimated_quantity: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
}

interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  business_type: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
}

const AdminSubmissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [selectedWaitlist, setSelectedWaitlist] = useState<WaitlistSignup | null>(null);

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pkgweb_contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['quote-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pkgweb_quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as QuoteRequest[];
    },
  });

  const { data: waitlist, isLoading: waitlistLoading } = useQuery({
    queryKey: ['waitlist-signups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pkgweb_waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WaitlistSignup[];
    },
  });

  const updateContactStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('pkgweb_contact_submissions')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({ title: 'Status updated' });
    },
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('pkgweb_quote_requests')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-requests'] });
      toast({ title: 'Status updated' });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pkgweb_contact_submissions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({ title: 'Contact deleted' });
    },
  });

  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pkgweb_quote_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-requests'] });
      toast({ title: 'Quote request deleted' });
    },
  });

  const updateWaitlistStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('pkgweb_waitlist_signups')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-signups'] });
      toast({ title: 'Status updated' });
    },
  });

  const deleteWaitlist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pkgweb_waitlist_signups')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-signups'] });
      toast({ title: 'Waitlist signup deleted' });
    },
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Responded</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Contacted</Badge>;
      default:
        return <Badge variant="default">New</Badge>;
    }
  };

  if (contactsLoading || quotesLoading || waitlistLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Submissions</h2>
        <p className="text-muted-foreground">Manage contact form and quote request submissions</p>
      </div>

      <Tabs defaultValue="waitlist">
        <TabsList>
          <TabsTrigger value="waitlist">
            Waitlist ({waitlist?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="quotes">
            Quote Requests ({quotes?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="contacts">
            Contact Forms ({contacts?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waitlist" className="space-y-4 mt-4">
          {waitlist?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No waitlist signups yet.
              </CardContent>
            </Card>
          ) : (
            waitlist?.map((signup) => (
              <Card key={signup.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {signup.name}
                        {getStatusBadge(signup.status)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {signup.email}
                        </span>
                        {signup.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {signup.phone}
                          </span>
                        )}
                        {signup.company && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {signup.company}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(signup.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Business Type:</strong> {signup.business_type || 'Not specified'}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedWaitlist(signup)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {signup.status !== 'contacted' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateWaitlistStatus.mutate({ id: signup.id, status: 'contacted' })}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Contacted
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteWaitlist.mutate(signup.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4 mt-4">
          {quotes?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No quote requests yet.
              </CardContent>
            </Card>
          ) : (
            quotes?.map((quote) => (
              <Card key={quote.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {quote.name}
                        {getStatusBadge(quote.status)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {quote.email}
                        </span>
                        {quote.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {quote.phone}
                          </span>
                        )}
                        {quote.company && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {quote.company}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(quote.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Products:</strong> {quote.product_interest || 'Not specified'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Quantity:</strong> {quote.estimated_quantity || 'Not specified'}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedQuote(quote)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {quote.status !== 'responded' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuoteStatus.mutate({ id: quote.id, status: 'responded' })}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Responded
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteQuote.mutate(quote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4 mt-4">
          {contacts?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No contact form submissions yet.
              </CardContent>
            </Card>
          ) : (
            contacts?.map((contact) => (
              <Card key={contact.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {contact.name}
                        {getStatusBadge(contact.status)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                        {contact.company && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {contact.company}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(contact.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 whitespace-pre-wrap">{contact.message}</p>
                  <div className="flex gap-2">
                    {contact.status !== 'responded' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateContactStatus.mutate({ id: contact.id, status: 'responded' })}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Responded
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteContact.mutate(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quote Details Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{selectedQuote.name}</p>
                <p className="text-sm text-muted-foreground">{selectedQuote.email}</p>
                {selectedQuote.phone && <p className="text-sm text-muted-foreground">{selectedQuote.phone}</p>}
                {selectedQuote.company && <p className="text-sm text-muted-foreground">{selectedQuote.company}</p>}
              </div>
              <div>
                <p className="font-semibold text-sm">Products</p>
                <p className="text-sm">{selectedQuote.product_interest}</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Quantities</p>
                <p className="text-sm">{selectedQuote.estimated_quantity}</p>
              </div>
              {selectedQuote.message && (
                <div>
                  <p className="font-semibold text-sm">Full Details</p>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">{selectedQuote.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Waitlist Details Dialog */}
      <Dialog open={!!selectedWaitlist} onOpenChange={() => setSelectedWaitlist(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Waitlist Signup Details</DialogTitle>
          </DialogHeader>
          {selectedWaitlist && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{selectedWaitlist.name}</p>
                <p className="text-sm text-muted-foreground">{selectedWaitlist.email}</p>
                {selectedWaitlist.phone && <p className="text-sm text-muted-foreground">{selectedWaitlist.phone}</p>}
                {selectedWaitlist.company && <p className="text-sm text-muted-foreground">{selectedWaitlist.company}</p>}
              </div>
              <div>
                <p className="font-semibold text-sm">Business Type</p>
                <p className="text-sm">{selectedWaitlist.business_type || 'Not specified'}</p>
              </div>
              {selectedWaitlist.notes && (
                <div>
                  <p className="font-semibold text-sm">Notes</p>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">{selectedWaitlist.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;

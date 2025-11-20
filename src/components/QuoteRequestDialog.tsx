import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle?: string;
  productCategory?: string;
}

interface FormData {
  // Customer Info
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Product Details
  productName: string;
  productSpecs: string;
  quantityNow: string;
  quantityPerMonth: string;
  quantityPerYear: string;
  
  // Pricing
  expectedPrice: string;
  additionalNotes: string;
}

const QuoteRequestDialog = ({ open, onOpenChange, productTitle = "", productCategory = "" }: QuoteRequestDialogProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productName: productTitle,
    productSpecs: "",
    quantityNow: "",
    quantityPerMonth: "",
    quantityPerYear: "",
    expectedPrice: "",
    additionalNotes: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all customer information fields.",
          variant: "destructive",
        });
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.productName || !formData.quantityNow) {
        toast({
          title: "Missing Information",
          description: "Please provide product name and current quantity needed.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    // For now, just show success message
    // Later this will send to backend
    toast({
      title: "Quote Request Submitted!",
      description: "We'll review your request and send a quote to your email within 24 hours.",
    });
    
    // Reset form and close
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      productName: "",
      productSpecs: "",
      quantityNow: "",
      quantityPerMonth: "",
      quantityPerYear: "",
      expectedPrice: "",
      additionalNotes: "",
    });
    setStep(1);
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Your Company LLC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => updateField("productName", e.target.value)}
                placeholder="Stretch Film - Machine Grade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productSpecs">Product Specifications</Label>
              <Textarea
                id="productSpecs"
                value={formData.productSpecs}
                onChange={(e) => updateField("productSpecs", e.target.value)}
                placeholder="Size, material, thickness, color, etc."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantityNow">Quantity Needed Now *</Label>
              <Input
                id="quantityNow"
                type="number"
                value={formData.quantityNow}
                onChange={(e) => updateField("quantityNow", e.target.value)}
                placeholder="100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantityPerMonth">Estimated Qty/Month</Label>
                <Input
                  id="quantityPerMonth"
                  type="number"
                  value={formData.quantityPerMonth}
                  onChange={(e) => updateField("quantityPerMonth", e.target.value)}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityPerYear">Estimated Qty/Year</Label>
                <Input
                  id="quantityPerYear"
                  type="number"
                  value={formData.quantityPerYear}
                  onChange={(e) => updateField("quantityPerYear", e.target.value)}
                  placeholder="6000"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expectedPrice">Expected Price Range</Label>
              <Input
                id="expectedPrice"
                value={formData.expectedPrice}
                onChange={(e) => updateField("expectedPrice", e.target.value)}
                placeholder="$X - $Y per unit or total budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes or Requirements</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateField("additionalNotes", e.target.value)}
                placeholder="Delivery timeline, special packaging needs, contract terms, etc."
                rows={5}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <h4 className="font-semibold">Review Your Request:</h4>
              <p><strong>Company:</strong> {formData.companyName}</p>
              <p><strong>Contact:</strong> {formData.contactName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Product:</strong> {formData.productName}</p>
              <p><strong>Quantity:</strong> {formData.quantityNow} units</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Request a Quote - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Customer Info</span>
            <span>Product Details</span>
            <span>Pricing & Submit</span>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Request
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestDialog;

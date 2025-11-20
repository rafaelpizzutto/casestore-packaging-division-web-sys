import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, X, Upload, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle?: string;
  productCategory?: string;
}

interface ProductItem {
  productName: string;
  productSpecs: string;
  quantityNow: string;
  quantityUnit: string;
  quantityPerMonth: string;
  quantityPerYear: string;
  quantityTimeUnit: string;
  attachments: File[];
}

interface FormData {
  // Customer Info
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Products List
  products: ProductItem[];
  
  // Pricing
  expectedPrice: string;
  additionalNotes: string;
}

const emptyProduct: ProductItem = {
  productName: "",
  productSpecs: "",
  quantityNow: "",
  quantityUnit: "units",
  quantityPerMonth: "",
  quantityPerYear: "",
  quantityTimeUnit: "month",
  attachments: [],
};

const QuoteRequestDialog = ({ open, onOpenChange, productTitle = "", productCategory = "" }: QuoteRequestDialogProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    products: [{ ...emptyProduct, productName: productTitle }],
    expectedPrice: "",
    additionalNotes: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateProductField = (field: keyof ProductItem, value: string) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        [field]: value,
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => {
        const updatedProducts = [...prev.products];
        updatedProducts[currentProductIndex] = {
          ...updatedProducts[currentProductIndex],
          attachments: [...updatedProducts[currentProductIndex].attachments, ...newFiles],
        };
        return { ...prev, products: updatedProducts };
      });
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        attachments: updatedProducts[currentProductIndex].attachments.filter((_, i) => i !== index),
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const saveAndAddAnother = () => {
    const currentProduct = formData.products[currentProductIndex];
    if (!currentProduct.productName || !currentProduct.quantityNow) {
      toast({
        title: "Missing Information",
        description: "Please provide product name and quantity before adding another.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { ...emptyProduct }],
    }));
    setCurrentProductIndex(formData.products.length);
    
    toast({
      title: "Product Saved",
      description: "You can now add another product.",
    });
  };

  const removeProduct = (index: number) => {
    if (formData.products.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one product.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
    
    if (currentProductIndex >= formData.products.length - 1) {
      setCurrentProductIndex(Math.max(0, currentProductIndex - 1));
    }
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
      const currentProduct = formData.products[currentProductIndex];
      if (!currentProduct.productName || !currentProduct.quantityNow) {
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

    // Log form data for debugging
    console.log("Quote Request Submitted:", formData);
    
    toast({
      title: "Quote Request Submitted!",
      description: `We'll review your request for ${formData.products.length} product(s) and send a quote to your email within 24 hours.`,
    });
    
    // Reset form and close
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      products: [{ ...emptyProduct }],
      expectedPrice: "",
      additionalNotes: "",
    });
    setStep(1);
    setCurrentProductIndex(0);
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
        const currentProduct = formData.products[currentProductIndex];
        return (
          <div className="space-y-4">
            {formData.products.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {formData.products.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentProductIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentProductIndex(index)}
                  >
                    Product {index + 1}
                    {formData.products.length > 1 && (
                      <X
                        className="ml-2 h-3 w-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProduct(index);
                        }}
                      />
                    )}
                  </Button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={currentProduct.productName}
                onChange={(e) => updateProductField("productName", e.target.value)}
                placeholder="Stretch Film - Machine Grade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productSpecs">Product Specifications</Label>
              <Textarea
                id="productSpecs"
                value={currentProduct.productSpecs}
                onChange={(e) => updateProductField("productSpecs", e.target.value)}
                placeholder="Size, material, thickness, color, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantityNow">Quantity Needed Now *</Label>
              <div className="flex gap-2">
                <Input
                  id="quantityNow"
                  type="number"
                  value={currentProduct.quantityNow}
                  onChange={(e) => updateProductField("quantityNow", e.target.value)}
                  placeholder="100"
                  className="flex-1"
                />
                <Select
                  value={currentProduct.quantityUnit}
                  onValueChange={(value) => updateProductField("quantityUnit", value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="cases">Cases</SelectItem>
                    <SelectItem value="rolls">Rolls</SelectItem>
                    <SelectItem value="pallets">Pallets</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estimated Quantity Over Time</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={currentProduct.quantityPerMonth}
                  onChange={(e) => updateProductField("quantityPerMonth", e.target.value)}
                  placeholder="500"
                />
                <Select
                  value={currentProduct.quantityTimeUnit}
                  onValueChange={(value) => updateProductField("quantityTimeUnit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Per Month</SelectItem>
                    <SelectItem value="quarter">Per Quarter</SelectItem>
                    <SelectItem value="year">Per Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Reference Files (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images/Documents
                </Button>
              </div>
              {currentProduct.attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {currentProduct.attachments.map((file, index) => (
                    <Card key={index}>
                      <CardContent className="p-2 flex items-center justify-between">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={saveAndAddAnother}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Save & Add Another Product
            </Button>
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
              <p><strong>Products:</strong> {formData.products.length}</p>
              {formData.products.map((product, index) => (
                <div key={index} className="pl-4 border-l-2 border-primary/20">
                  <p className="font-medium">{index + 1}. {product.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.quantityNow} {product.quantityUnit}
                    {product.attachments.length > 0 && ` • ${product.attachments.length} file(s) attached`}
                  </p>
                </div>
              ))}
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

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface PricingTierEditorProps {
  value: string;
  onSave: (jsonValue: string) => void;
}

const PricingTierEditor = ({ value, onSave }: PricingTierEditorProps) => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(value || '[]');
      setTiers(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTiers([]);
    }
  }, [value]);

  const handleSave = () => {
    onSave(JSON.stringify(tiers, null, 2));
  };

  const addTier = () => {
    setTiers([...tiers, { name: 'New Tier', description: '', features: [], recommended: false }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], ...updates };
    setTiers(newTiers);
  };

  const addFeature = (tierIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features.push('New feature');
    setTiers(newTiers);
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setTiers(newTiers);
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setTiers(newTiers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Pricing Tiers</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addTier}>
            <Plus className="h-4 w-4 mr-1" /> Add Tier
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save All
          </Button>
        </div>
      </div>

      {tiers.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">No pricing tiers yet. Click "Add Tier" to create one.</p>
      ) : (
        <div className="grid gap-4">
          {tiers.map((tier, tierIndex) => (
            <Card key={tierIndex} className={tier.recommended ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{tier.name || 'Unnamed Tier'}</CardTitle>
                    {tier.recommended && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Recommended</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeTier(tierIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tier Name</Label>
                    <Input
                      value={tier.name}
                      onChange={(e) => updateTier(tierIndex, { name: e.target.value })}
                      placeholder="e.g., Starter, Professional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={tier.description}
                      onChange={(e) => updateTier(tierIndex, { description: e.target.value })}
                      placeholder="e.g., Perfect for small warehouses"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Mark as Recommended</Label>
                  <Switch
                    checked={tier.recommended || false}
                    onCheckedChange={(checked) => updateTier(tierIndex, { recommended: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Features</Label>
                    <Button variant="ghost" size="sm" onClick={() => addFeature(tierIndex)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Feature
                    </Button>
                  </div>
                  {tier.features.length === 0 ? (
                    <p className="text-muted-foreground text-xs">No features added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(tierIndex, featureIndex, e.target.value)}
                            placeholder="Feature description"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(tierIndex, featureIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingTierEditor;

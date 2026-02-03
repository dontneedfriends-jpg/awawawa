"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PartSelection {
  partId: Id<"parts">;
  quantity: number;
}

export function OrderFormDialog({ open, onOpenChange }: OrderFormDialogProps) {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const createOrder = useMutation(api.orders.create);
  const parts = useQuery(api.parts.list, {});
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerTelegram: "",
    markup: 30,
    notes: "",
  });

  const [selectedParts, setSelectedParts] = useState<PartSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPart = () => {
    if (parts && parts.length > 0) {
      setSelectedParts([...selectedParts, { partId: parts[0]._id, quantity: 1 }]);
    }
  };

  const removePart = (index: number) => {
    setSelectedParts(selectedParts.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, field: keyof PartSelection, value: any) => {
    const updated = [...selectedParts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedParts(updated);
  };

  const calculateSubtotal = () => {
    if (!parts) return 0;
    return selectedParts.reduce((sum, item) => {
      const part = parts.find(p => p._id === item.partId);
      return sum + (part ? part.suggestedPrice * item.quantity : 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const markupAmount = subtotal * (formData.markup / 100);
  const total = subtotal + markupAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedParts.length === 0) {
      toast.error("Please add at least one part to the order");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await createOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone || undefined,
        customerEmail: formData.customerEmail || undefined,
        customerTelegram: formData.customerTelegram || undefined,
        parts: selectedParts,
        markup: formData.markup,
        notes: formData.notes || undefined,
      });

      toast.success(t("orders.messages.created"));
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerTelegram: "",
        markup: 30,
        notes: "",
      });
      setSelectedParts([]);
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orders.newOrder")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Customer Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">{t("orders.customerName")} *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">{t("orders.customerPhone")}</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">{t("orders.customerEmail")}</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerTelegram">{t("orders.customerTelegram")}</Label>
                  <Input
                    id="customerTelegram"
                    value={formData.customerTelegram}
                    onChange={(e) => setFormData({ ...formData, customerTelegram: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Parts Selection */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{t("orders.parts")}</h3>
                <Button type="button" size="sm" onClick={addPart}>
                  {t("orders.addPart")}
                </Button>
              </div>

              {selectedParts.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>{t("parts.partName")}</Label>
                    <select
                      className="flex h-10 w-full rounded-md border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-3 py-2 text-sm text-white"
                      value={item.partId}
                      onChange={(e) => updatePart(index, 'partId', e.target.value as Id<"parts">)}
                    >
                      {parts?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} - {formatCurrency(p.suggestedPrice)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24 space-y-2">
                    <Label>{t("orders.quantity")}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePart(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}

              {selectedParts.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No parts added yet. Click "Add Part" to get started.
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-default)]">
              <div className="space-y-2">
                <Label htmlFor="markup">{t("orders.markup")} (%)</Label>
                <Input
                  id="markup"
                  type="number"
                  min="0"
                  max="500"
                  value={formData.markup}
                  onChange={(e) => setFormData({ ...formData, markup: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2 bg-[var(--bg-tertiary)] p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t("orders.subtotal")}</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t("orders.markup")} ({formData.markup}%)</span>
                  <span className="text-white">{formatCurrency(markupAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--border-default)]">
                  <span className="text-white">{t("orders.total")}</span>
                  <span className="text-[var(--accent-orange)]">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t("orders.notes")}</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-3 py-2 text-sm text-white"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

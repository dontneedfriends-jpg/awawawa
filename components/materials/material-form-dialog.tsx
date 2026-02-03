"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/i18n-context";
import { toast } from "sonner";

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialFormDialog({ open, onOpenChange }: MaterialFormDialogProps) {
  const { t } = useI18n();
  const createMaterial = useMutation(api.materials.create);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "PLA",
    color: "",
    brand: "",
    costPerGram: 0,
    currentStockGrams: 1000,
    lowStockThreshold: 200,
    printTempMin: 190,
    printTempMax: 220,
    bedTempMin: 50,
    bedTempMax: 70,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMaterial({
        name: formData.name,
        type: formData.type,
        color: formData.color || undefined,
        brand: formData.brand || undefined,
        costPerGram: formData.costPerGram,
        currentStockGrams: formData.currentStockGrams,
        lowStockThreshold: formData.lowStockThreshold,
        printTempMin: formData.printTempMin,
        printTempMax: formData.printTempMax,
        bedTempMin: formData.bedTempMin,
        bedTempMax: formData.bedTempMax,
        notes: formData.notes || undefined,
      });

      toast.success(t("materials.messages.created"));
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        type: "PLA",
        color: "",
        brand: "",
        costPerGram: 0,
        currentStockGrams: 1000,
        lowStockThreshold: 200,
        printTempMin: 190,
        printTempMax: 220,
        bedTempMin: 50,
        bedTempMax: 70,
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to create material");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("materials.newMaterial")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("materials.materialName")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t("materials.type")} *</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-3 py-2 text-sm text-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="PLA">PLA</option>
                  <option value="PETG">PETG</option>
                  <option value="ABS">ABS</option>
                  <option value="TPU">TPU</option>
                  <option value="Nylon">Nylon</option>
                  <option value="ASA">ASA</option>
                  <option value="PC">PC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">{t("materials.color")}</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">{t("materials.brand")}</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPerGram">{t("materials.costPerGram")} *</Label>
                <Input
                  id="costPerGram"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPerGram}
                  onChange={(e) => setFormData({ ...formData, costPerGram: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStockGrams">{t("materials.currentStock")} (g) *</Label>
                <Input
                  id="currentStockGrams"
                  type="number"
                  min="0"
                  value={formData.currentStockGrams}
                  onChange={(e) => setFormData({ ...formData, currentStockGrams: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">{t("materials.lowStockThreshold")} (g) *</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Print Temperature (°C)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t("materials.minTemp")}
                    value={formData.printTempMin}
                    onChange={(e) => setFormData({ ...formData, printTempMin: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder={t("materials.maxTemp")}
                    value={formData.printTempMax}
                    onChange={(e) => setFormData({ ...formData, printTempMax: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bed Temperature (°C)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t("materials.minTemp")}
                    value={formData.bedTempMin}
                    onChange={(e) => setFormData({ ...formData, bedTempMin: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder={t("materials.maxTemp")}
                    value={formData.bedTempMax}
                    onChange={(e) => setFormData({ ...formData, bedTempMax: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
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

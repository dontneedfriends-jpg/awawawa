"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/i18n-context";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface PartFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartFormDialog({ open, onOpenChange }: PartFormDialogProps) {
  const { t } = useI18n();
  const createPart = useMutation(api.parts.create);
  const materials = useQuery(api.materials.list);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    materialId: "" as Id<"materials"> | "",
    weightGrams: 0,
    printTimeMinutes: 0,
    defaultMarkupPercent: 30,
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.materialId) {
      toast.error("Please select a material");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await createPart({
        name: formData.name,
        description: formData.description || undefined,
        materialId: formData.materialId as Id<"materials">,
        weightGrams: formData.weightGrams,
        printTimeMinutes: formData.printTimeMinutes,
        defaultMarkupPercent: formData.defaultMarkupPercent,
        category: formData.category || undefined,
      });

      toast.success(t("parts.messages.created"));
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        materialId: "",
        weightGrams: 0,
        printTimeMinutes: 0,
        defaultMarkupPercent: 30,
        category: "",
      });
    } catch (error) {
      toast.error("Failed to create part");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("parts.newPart")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("parts.partName")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("common.description")}</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-3 py-2 text-sm text-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialId">{t("parts.material")} *</Label>
                <select
                  id="materialId"
                  className="flex h-10 w-full rounded-md border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-3 py-2 text-sm text-white"
                  value={formData.materialId}
                  onChange={(e) => setFormData({ ...formData, materialId: e.target.value as Id<"materials"> })}
                  required
                >
                  <option value="">{t("parts.selectPart")}</option>
                  {materials?.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("parts.category")}</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weightGrams">{t("parts.weight")} (g) *</Label>
                <Input
                  id="weightGrams"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weightGrams}
                  onChange={(e) => setFormData({ ...formData, weightGrams: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printTimeMinutes">{t("parts.printTime")} (min) *</Label>
                <Input
                  id="printTimeMinutes"
                  type="number"
                  min="0"
                  value={formData.printTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, printTimeMinutes: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultMarkupPercent">{t("parts.defaultMarkup")} (%) *</Label>
                <Input
                  id="defaultMarkupPercent"
                  type="number"
                  min="0"
                  max="500"
                  value={formData.defaultMarkupPercent}
                  onChange={(e) => setFormData({ ...formData, defaultMarkupPercent: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
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

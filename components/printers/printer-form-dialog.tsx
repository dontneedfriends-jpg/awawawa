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

interface PrinterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrinterFormDialog({ open, onOpenChange }: PrinterFormDialogProps) {
  const { t } = useI18n();
  const createPrinter = useMutation(api.printers.create);
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    hourlyRate: 100,
    powerConsumptionWatts: 200,
    electricityCostPerKwh: 0.12,
    maintenanceIntervalHours: 500,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createPrinter({
        name: formData.name,
        model: formData.model || undefined,
        hourlyRate: formData.hourlyRate,
        powerConsumptionWatts: formData.powerConsumptionWatts,
        electricityCostPerKwh: formData.electricityCostPerKwh,
        maintenanceIntervalHours: formData.maintenanceIntervalHours,
      });

      toast.success("Printer created successfully");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        model: "",
        hourlyRate: 100,
        powerConsumptionWatts: 200,
        electricityCostPerKwh: 0.12,
        maintenanceIntervalHours: 500,
      });
    } catch (error) {
      toast.error("Failed to create printer");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("printers.newPrinter")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("printers.printerName")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">{t("printers.model")}</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">{t("printers.hourlyRate")} *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="powerConsumptionWatts">{t("printers.powerConsumption")} (W) *</Label>
                <Input
                  id="powerConsumptionWatts"
                  type="number"
                  min="0"
                  value={formData.powerConsumptionWatts}
                  onChange={(e) => setFormData({ ...formData, powerConsumptionWatts: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricityCostPerKwh">{t("printers.electricityCost")} (per kWh) *</Label>
                <Input
                  id="electricityCostPerKwh"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.electricityCostPerKwh}
                  onChange={(e) => setFormData({ ...formData, electricityCostPerKwh: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceIntervalHours">{t("printers.maintenanceInterval")} (hrs) *</Label>
                <Input
                  id="maintenanceIntervalHours"
                  type="number"
                  min="0"
                  value={formData.maintenanceIntervalHours}
                  onChange={(e) => setFormData({ ...formData, maintenanceIntervalHours: parseInt(e.target.value) || 0 })}
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

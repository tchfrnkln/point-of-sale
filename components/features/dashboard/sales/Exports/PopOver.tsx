"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type ExportRange =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "TOP_PRODUCTS_30"
  | "STAFF_30";

export function ExportPopover({
  onConfirm,
  label
}: {
  label: string;
  onConfirm: (range: ExportRange) => void;
}) {
  const [range, setRange] = useState<ExportRange>("DAILY");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{label}</Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 space-y-4">
        <h4 className="font-semibold">Export Range</h4>

        <RadioGroup
          value={range}
          onValueChange={v => setRange(v as ExportRange)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="DAILY" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="WEEKLY" id="weekly" />
            <Label htmlFor="weekly">Weekly</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MONTHLY" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="TOP_PRODUCTS_30" id="top" />
            <Label htmlFor="top">Top Products (Last 30 days)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="STAFF_30" id="staff" />
            <Label htmlFor="staff">Staff Performance (Last 30 days)</Label>
          </div>
        </RadioGroup>

        <Button
          className="w-full"
          onClick={() => onConfirm(range)}
        >
          Export
        </Button>
      </PopoverContent>
    </Popover>
  );
}

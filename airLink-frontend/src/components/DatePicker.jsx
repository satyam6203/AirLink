

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";


const DatePicker = ({
  label,
  name,
  value,
  error,
  touched,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col  gap-1 w-full">
      <Label htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("justify-between", !value && "text-muted-foreground")}
          >
            {value ? new Date(value).toLocaleDateString() : `Select ${label}`}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto ">
          <Calendar
          className={" p-0"}
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(date.toISOString().split("T")[0]); // only date
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {touched && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;

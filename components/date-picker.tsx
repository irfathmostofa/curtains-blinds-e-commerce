"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addMonths, format, getDay, getDaysInMonth, isBefore, startOfDay, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  minDate,
  id,
  name,
  inline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  id?: string;
  name?: string;
  inline?: boolean;
}) {
  const selected = value ? startOfDay(new Date(`${value}T00:00:00`)) : null;
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => startOfMonth(selected || new Date()));
  const min = startOfDay(minDate || new Date());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(() => {
    const days = getDaysInMonth(cursor);
    const offset = getDay(startOfMonth(cursor));
    const blanks = Array.from({ length: offset }, () => null);
    const dates = Array.from({ length: days }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1));
    return [...blanks, ...dates];
  }, [cursor]);

  function pick(day: Date) {
    if (isBefore(day, min)) return;
    onChange(format(day, "yyyy-MM-dd"));
    if (!inline) setOpen(false);
  }

  const calendar = (
    <div className={cn(inline ? "rounded-2xl border bg-card p-4" : "absolute z-40 mt-2 w-full min-w-[280px] rounded-2xl border bg-card p-4 shadow-lg")}>
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous month"
          onClick={() => setCursor((d) => addMonths(d, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-serif text-lg">{format(cursor, "MMMM yyyy")}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next month"
          onClick={() => setCursor((d) => addMonths(d, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const iso = format(day, "yyyy-MM-dd");
          const disabled = isBefore(day, min);
          const active = value === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => pick(day)}
              className={cn(
                "h-9 rounded-lg text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30",
                active && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (inline) {
    return (
      <div>
        <input type="hidden" id={id} name={name} value={value} readOnly />
        {calendar}
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <input type="hidden" id={id} name={name} value={value} readOnly />
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-4 text-left text-sm"
        onClick={() => {
          setCursor(startOfMonth(selected || new Date()));
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={cn(!value && "text-muted-foreground")}>
          {selected ? format(selected, "EEE d MMM yyyy") : "Select a date"}
        </span>
        <span className="text-xs text-muted-foreground">Calendar</span>
      </button>
      {open ? calendar : null}
    </div>
  );
}

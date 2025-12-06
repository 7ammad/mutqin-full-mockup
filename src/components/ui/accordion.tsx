"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  allowMultiple?: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({ children, type = "single", defaultValue, className }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }
    return new Set();
  });

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple: type === "multiple" }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) throw new Error("AccordionTrigger must be used within AccordionItem");

  const isOpen = context.openItems.has(itemContext.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      context.toggleItem(itemContext.value);
    }
  };

  return (
    <button type="button"
      onClick={() => context.toggleItem(itemContext.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--label)] hover:bg-[var(--system-fill)] transition-colors",
        className
      )}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemContext.value}`}
      id={`accordion-trigger-${itemContext.value}`}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-[var(--secondary-label)] transition-transform",
          isOpen && "transform rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within Accordion");

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) throw new Error("AccordionContent must be used within AccordionItem");

  const isOpen = context.openItems.has(itemContext.value);

  return (
    <div
      id={`accordion-content-${itemContext.value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${itemContext.value}`}
      className={cn(
        "overflow-hidden transition-all",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}
      hidden={!isOpen}
    >
      <div className={cn("px-4 py-3 text-sm text-[var(--secondary-label)]", className)}>
        {children}
      </div>
    </div>
  );
}

const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined);

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border border-[var(--border)] rounded-ios-sm overflow-hidden", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}


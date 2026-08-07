"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <Accordion.Root type="single" collapsible className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq) => (
        <Accordion.Item
          key={faq.id}
          value={faq.id}
          className="glass rounded-xl overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full px-6 py-4 text-left font-semibold text-primary-900 hover:bg-primary-50/50 transition-colors group">
              {faq.question}
              <ChevronDown className="w-5 h-5 text-primary-600 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-4 text-primary-700 leading-relaxed">{faq.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

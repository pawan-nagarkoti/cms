import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CustomAccordion({ heading, children, defaultOpen = false }) {
  const itemValue = `item-${heading}`;
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={defaultOpen ? itemValue : undefined}>
      <AccordionItem value={itemValue} className="mb-5">
        <AccordionTrigger className="text-lg">{heading}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

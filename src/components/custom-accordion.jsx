import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CustomAccordion({ heading, children }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`item-${heading}`} className="mb-5">
        <AccordionTrigger className="text-lg">{heading}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}


import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const faqData = [
  {
    question: "My fridge isn't cooling properly. What should I do?",
    answer: "First, check if the thermostat is set correctly. Ensure the fridge has enough space around it for ventilation (at least 1 inch on all sides). Clean the condenser coils if they are dusty. If the problem persists, it might be an issue with the compressor, sealant, or refrigerant levels, which requires a professional technician."
  },
  {
    question: "My washing machine is not spinning. What's the cause?",
    answer: "This could be due to an unbalanced load; try redistributing the clothes. Check if the lid switch is functioning correctly (the machine won't spin if it thinks the lid is open). A worn-out drive belt or issues with the motor coupling or clutch can also prevent spinning. These often require professional repair."
  },
  {
    question: "Water is leaking from my washing machine. What should I check?",
    answer: "Check the hoses (inlet and drain) for cracks or loose connections. Ensure the drain hose is correctly inserted into the standpipe. Overloading the machine or using too much detergent can also cause leaks. If connections are secure and you're not overloading, there might be an issue with the pump or tub seals."
  },
  {
    question: "How often should I change my water filter?",
    answer: "Most refrigerator water filters should be replaced every 6 months. However, this can vary based on your water quality and usage. Refer to your appliance manual for specific recommendations. A slow water flow from the dispenser or bad tasting water are signs it's time for a change."
  },
  {
    question: "What information do I need to provide when requesting service?",
    answer: "Please provide the type of appliance, a detailed description of the issue, your full name, contact information (email and phone), and the service address. The model and serial number of your appliance can also be very helpful for our technicians."
  },
  {
    question: "Do you offer emergency repair services?",
    answer: "We strive to offer prompt service. Please contact us with your issue, and we will do our best to accommodate urgent requests based on technician availability."
  }
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Lightbulb className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-accent mb-3 sm:mb-4" />
          <CardTitle className="text-3xl sm:text-4xl font-headline">FAQ & Troubleshooting</CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Find answers to common questions and quick troubleshooting tips.</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-border/70 last:border-b-0">
                <AccordionTrigger className="text-base sm:text-lg font-headline hover:no-underline text-left py-4 sm:py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-foreground/80 font-body pb-4 sm:pb-6 px-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

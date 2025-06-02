
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, BrainCircuit, MapPin, HelpCircle, ChevronRight, Sparkles, CheckCircle, Clock } from 'lucide-react';
import Image from "next/legacy/image";

const features = [
  {
    title: "Request Service",
    description: "Easily book a repair for your appliance with our simple online form.",
    icon: Wrench,
    href: "/request-service",
    cta: "Book Now"
  },
];

const whyChooseUs = [
  { title: "Expert Technicians", description: "Certified professionals with years of experience.", icon: CheckCircle },
  { title: "Fast & Reliable", description: "Quick response times and dependable service.", icon: Clock },
  { title: "Transparent Pricing", description: "No hidden fees. Clear and upfront costs.", icon: Sparkles },
];

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-accent/30 via-background to-background rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6 text-primary">
            Appliance Troubles? We Can Help!
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8 md:mb-10 max-w-2xl mx-auto font-body">
            Fast, reliable, and affordable repair services for your fridge, washing machine, filters, and more. Get your appliances back in top shape with Appliance Assist.
          </p>
          <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-200 ease-in-out hover:scale-105 shadow-md text-base sm:text-lg">
            <Link href="/request-service">
              Request a Repair <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-center mb-10 md:mb-12">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-full mb-3 sm:mb-4 text-primary">
                  <feature.icon size={32} strokeWidth={1.5} className="sm:size-10" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <CardDescription className="mb-4 sm:mb-6 text-sm sm:text-base text-foreground/70 font-body">{feature.description}</CardDescription>
                <Button asChild variant="outline" className="mt-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm sm:text-base">
                  <Link href={feature.href}>
                    {feature.cta} <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-secondary/50 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-center mb-10 md:mb-12">Why Choose Appliance Assist?</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="text-center p-4 sm:p-6 bg-card rounded-lg shadow-md">
                <item.icon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-accent mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-headline font-medium mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-foreground/70 font-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-center mb-10 md:mb-12">Simple & Easy Process</h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="text-center p-4 sm:p-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
              <Image src="https://placehold.co/300x300.png" alt="Fill out service request" layout="fill" objectFit="cover" className="rounded-full shadow-lg" data-ai-hint="form writing" />
            </div>
            <h3 className="text-xl sm:text-2xl font-headline font-medium mb-1 sm:mb-2">1. Submit Request</h3>
            <p className="text-sm sm:text-base text-foreground/70 font-body">Fill out our simple online service request form with your appliance details.</p>
          </div>
          <div className="text-center p-4 sm:p-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
              <Image src="https://placehold.co/300x300.png" alt="Book Service" layout="fill" objectFit="cover" className="rounded-full shadow-lg" data-ai-hint="calendar schedule" />
            </div>
          </div>
          </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(3, "Please enter a valid ZIP code or city name (min 3 characters)."),
});

type ServiceAreaFormData = z.infer<typeof formSchema>;

// Mock list of serviceable ZIP codes/areas (case-insensitive for demo)
const serviceableAreas = ['10001', '90210', '60601', 'anytown', 'springfield', 'new york'];

export default function ServiceAreaForm() {
  const [searchResult, setSearchResult] = useState<{ available: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServiceAreaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
    },
  });

  const onSubmit = (data: ServiceAreaFormData) => {
    setIsLoading(true);
    setSearchResult(null);
    
    // Simulate API call / lookup
    setTimeout(() => {
      const query = data.location.toLowerCase().trim();
      const isAvailable = serviceableAreas.some(area => query.includes(area) || area.includes(query));
      
      if (isAvailable) {
        setSearchResult({ available: true, message: `Great news! We provide service in ${data.location}.` });
      } else {
        setSearchResult({ available: false, message: `Sorry, we currently do not service ${data.location}. Please check back later as we expand!` });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-headline">Check Service Availability</CardTitle>
          <CardDescription className="text-sm sm:text-base">Enter your ZIP code or city to see if we serve your area.</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Your Location (ZIP Code or City)</Label>
              <Input 
                id="location" 
                placeholder="e.g., 90210 or Anytown" 
                {...form.register('location')} 
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full text-sm sm:text-base">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
              Check Availability
            </Button>
          </CardFooter>
        </form>
      </Card>

      {searchResult && (
        <Card className={`w-full max-w-lg mx-auto shadow-lg ${searchResult.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="p-4 sm:p-6 flex items-center">
            {searchResult.available ? (
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 text-green-600 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 text-red-600 shrink-0" />
            )}
            <p className={`font-medium text-sm sm:text-base ${searchResult.available ? 'text-green-700' : 'text-red-700'}`}>
              {searchResult.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
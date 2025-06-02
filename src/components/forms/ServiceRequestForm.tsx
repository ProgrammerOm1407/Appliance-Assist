
"use client";

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { submitServiceRequestAction, ServiceRequestFormState } from '@/lib/actions';
import { applianceTypes, ApplianceType, ServiceRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addOrder as addOrderToStore } from '@/lib/orderStore';
import { Loader2, Send, Smile, Frown } from 'lucide-react';

const formSchema = z.object({
  applianceType: z.custom<ApplianceType>((val) => applianceTypes.includes(val as ApplianceType), {
    message: "Please select a valid appliance type.",
  }),
  issueDescription: z.string().min(10, "Issue description must be at least 10 characters."),
  contactName: z.string().min(2, "Name is required."),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),
});

type ServiceRequestFormData = z.infer<typeof formSchema>;

const initialState: ServiceRequestFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto text-sm sm:text-base">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Submit Request
    </Button>
  );
}

export default function ServiceRequestForm() {
  const [state, formAction] = useActionState(submitServiceRequestAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applianceType: undefined,
      issueDescription: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <Smile className="text-green-500" /> : <Frown className="text-red-500" />,
      });
      if (state.success && state.fields) {
        const newOrderData = state.fields as unknown as Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
        addOrderToStore(newOrderData);
        form.reset(); 
      }
    }
    if (state.issues) {
       state.issues.forEach(issue => {
         const [path, message] = issue.split(': ');
         form.setError(path as keyof ServiceRequestFormData, { type: 'manual', message });
       });
    }
  }, [state, toast, form]);

  const onValidRHFSubmit = (data: ServiceRequestFormData) => {
     if (formRef.current) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formAction(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-headline">Request Appliance Service</CardTitle>
        <CardDescription className="text-sm sm:text-base">Fill out the form below, and we'll get back to you shortly.</CardDescription>
      </CardHeader>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onValidRHFSubmit)}
      >
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="applianceType">Appliance Type</Label>
              <Select 
                name="applianceType" 
                onValueChange={(value) => form.setValue('applianceType', value as ApplianceType, { shouldValidate: true })}
                value={form.watch('applianceType')}
                >
                <SelectTrigger id="applianceType">
                  <SelectValue placeholder="Select appliance" />
                </SelectTrigger>
                <SelectContent>
                  {applianceTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.applianceType && <p className="text-sm text-destructive mt-1">{form.formState.errors.applianceType.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="issueDescription">Issue Description</Label>
            <Textarea
              id="issueDescription"
              placeholder="Describe the problem in detail..."
              {...form.register('issueDescription')}
              rows={4}
            />
            {form.formState.errors.issueDescription && <p className="text-sm text-destructive mt-1">{form.formState.errors.issueDescription.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="contactName">Full Name</Label>
              <Input id="contactName" placeholder="John Doe" {...form.register('contactName')} />
              {form.formState.errors.contactName && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactName.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input id="contactEmail" type="email" placeholder="you@example.com" {...form.register('contactEmail')} />
              {form.formState.errors.contactEmail && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactEmail.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input id="contactPhone" type="tel" placeholder=" (555) 123-4567" {...form.register('contactPhone')} />
              {form.formState.errors.contactPhone && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactPhone.message}</p>}
            </div>
             <div>
              <Label htmlFor="address">Service Address</Label>
              <Input id="address" placeholder="123 Main St, City, State, ZIP" {...form.register('address')} />
              {form.formState.errors.address && <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

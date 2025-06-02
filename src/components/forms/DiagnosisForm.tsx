
"use client";

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { diagnoseIssueAction, DiagnosisFormState } from '@/lib/actions';
import { applianceTypes, ApplianceType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  applianceType: z.custom<ApplianceType>((val) => applianceTypes.includes(val as ApplianceType), {
    message: "Please select a valid appliance type.",
  }),
  issueDescription: z.string().min(10, "Issue description must be at least 10 characters."),
});

type DiagnosisFormData = z.infer<typeof formSchema>;

const initialState: DiagnosisFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto text-sm sm:text-base">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
      Get Diagnosis
    </Button>
  );
}

export default function DiagnosisForm() {
  const [state, formAction] = useActionState(diagnoseIssueAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<DiagnosisFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applianceType: undefined,
      issueDescription: '',
    },
  });

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        title: state.success ? "Diagnosis Ready" : "Info",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
     if (state.issues) {
       state.issues.forEach(issue => {
         const [path, message] = issue.split(': ');
         form.setError(path as keyof DiagnosisFormData, { type: 'manual', message });
       });
    }
  }, [state, toast, form]);

  const onValidRHFSubmit = (data: DiagnosisFormData) => {
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
    <div className="space-y-6 md:space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-headline">AI-Powered Issue Diagnosis</CardTitle>
          <CardDescription className="text-sm sm:text-base">Describe your appliance issue, and our AI will suggest possible causes. This is not a substitute for professional technician advice.</CardDescription>
        </CardHeader>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onValidRHFSubmit)}
        >
          <CardContent className="space-y-4 sm:space-y-6">
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

            <div>
              <Label htmlFor="issueDescription">Issue Description</Label>
              <Textarea
                id="issueDescription"
                placeholder="E.g., 'My fridge is not cooling and makes a loud humming sound.'"
                {...form.register('issueDescription')}
                rows={5}
              />
              {form.formState.errors.issueDescription && <p className="text-sm text-destructive mt-1">{form.formState.errors.issueDescription.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <SubmitButton />
             <div className="flex items-start sm:items-center text-xs text-muted-foreground p-3 bg-muted rounded-md">
                <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3 text-amber-500 shrink-0" />
                <span><strong>Disclaimer:</strong> The AI diagnosis provides potential causes based on common issues. Always consult a qualified technician for accurate diagnosis and repair. Appliance Assist is not liable for actions taken based solely on this AI tool.</span>
            </div>
          </CardFooter>
        </form>
      </Card>

      {state.success && state.diagnosis && (
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-headline text-green-700 flex items-center"><Lightbulb className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> AI Diagnosis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold text-md sm:text-lg text-green-600">Possible Causes:</h3>
              {state.diagnosis.possibleCauses.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-green-700 font-body">
                  {state.diagnosis.possibleCauses.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base text-green-700 font-body">No specific causes identified based on the description.</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-md sm:text-lg text-green-600">Confidence Level:</h3>
              <p className="text-sm sm:text-base text-green-700 font-body capitalize flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> {state.diagnosis.confidenceLevel}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

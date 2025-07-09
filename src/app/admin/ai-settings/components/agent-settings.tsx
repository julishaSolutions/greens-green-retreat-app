
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { type AgentConfig } from '@/services/systemService';
import { saveAgentConfig, type FormState } from '../actions';
import { useToast } from '@/hooks/use-toast';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: FormState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton({ agentName }: { agentName: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="font-sans mt-4">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save {agentName}
        </>
      )}
    </Button>
  );
}

function AgentConfigForm({ agent }: { agent: AgentConfig }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveAgentConfig, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
     <form action={formAction} className="space-y-4 pt-2">
      <input type="hidden" name="id" value={agent.id} />
      
      <div className="space-y-2">
        <Label htmlFor={`description-${agent.id}`} className="font-medium">Agent Description</Label>
        <p className="text-sm text-muted-foreground">
          This tells the main Supervisor AI what this agent is responsible for.
        </p>
        <Textarea
          id={`description-${agent.id}`}
          name="description"
          defaultValue={agent.description}
          rows={3}
          className="font-sans text-base"
          required
        />
        {state?.errors?.description && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`systemPrompt-${agent.id}`} className="font-medium">System Prompt (Instructions)</Label>
         <p className="text-sm text-muted-foreground">
          These are the core instructions for this specific agent.
        </p>
        <Textarea
          id={`systemPrompt-${agent.id}`}
          name="systemPrompt"
          defaultValue={agent.systemPrompt}
          rows={5}
          className="font-sans text-base"
          required
        />
         {state?.errors?.systemPrompt && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.systemPrompt[0]}
          </p>
        )}
      </div>

      <SubmitButton agentName={agent.name} />
    </form>
  )
}


export function AgentSettings({ agentConfigs }: { agentConfigs: AgentConfig[] }) {
  return (
    <div className="space-y-6">
       <Alert>
          <Wand2 className="h-4 w-4" />
          <AlertTitle>How this works</AlertTitle>
          <AlertDescription>
            Your AI assistant is a "Supervisor" that delegates tasks to the specialist "Agents" below. You can fine-tune each agent's instructions here. The Supervisor reads each agent's description to decide which one to use for a user's query.
          </AlertDescription>
      </Alert>
      <Accordion type="single" collapsible className="w-full" defaultValue={agentConfigs[0]?.id}>
        {agentConfigs.map((agent) => (
          <AccordionItem key={agent.id} value={agent.id}>
            <AccordionTrigger className="text-lg font-medium hover:no-underline">
              {agent.name}
            </AccordionTrigger>
            <AccordionContent>
              <AgentConfigForm agent={agent} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

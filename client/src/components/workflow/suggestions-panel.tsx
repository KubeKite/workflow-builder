import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SuggestionsPanelProps {
  workflowId?: string;
}

interface Suggestion {
  type: 'performance' | 'reliability' | 'security' | 'design';
  suggestion: string;
  rationale: string;
}

const typeIcons = {
  performance: "⚡",
  reliability: "🔒",
  security: "🛡️",
  design: "🎨",
};

async function fetchSuggestions(workflowId: string): Promise<Suggestion[]> {
  const response = await fetch(`/api/workflows/${workflowId}/suggestions`, {
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load suggestions");
  }
  return response.json();
}

export default function SuggestionsPanel({ workflowId }: SuggestionsPanelProps) {
  const { data: suggestions, isLoading, error } = useQuery<Suggestion[]>({
    queryKey: [`/api/workflows/${workflowId}/suggestions`],
    queryFn: () => (workflowId ? fetchSuggestions(workflowId) : Promise.resolve([])),
    enabled: !!workflowId,
    retry: false,
  });

  return (
    <div className="absolute top-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full bg-background shadow-md hover:shadow-lg transition-shadow"
          >
            <Lightbulb className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>AI Suggestions</SheetTitle>
            <SheetDescription>
              Optimization suggestions for your workflow
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to load suggestions. Please try again later."}
                </AlertDescription>
              </Alert>
            ) : !workflowId ? (
              <Alert>
                <AlertTitle>No Workflow Selected</AlertTitle>
                <AlertDescription>
                  Save your workflow first to get AI-powered suggestions
                </AlertDescription>
              </Alert>
            ) : suggestions?.length === 0 ? (
              <Alert>
                <AlertTitle>No Suggestions</AlertTitle>
                <AlertDescription>
                  Your workflow looks good! No optimization suggestions at this time.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {suggestions?.map((suggestion, index) => (
                  <Alert key={index}>
                    <AlertTitle className="flex items-center gap-2">
                      <span>{typeIcons[suggestion.type]}</span>
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Suggestion
                    </AlertTitle>
                    <AlertDescription className="mt-2 space-y-2">
                      <p>{suggestion.suggestion}</p>
                      <p className="text-sm text-muted-foreground border-t pt-2 mt-2">
                        {suggestion.rationale}
                      </p>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
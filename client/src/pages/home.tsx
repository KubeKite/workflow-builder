import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, PlayCircle, Settings, Loader2 } from "lucide-react";
import type { Workflow } from "@db/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function fetchWorkflows(): Promise<Workflow[]> {
  const response = await fetch("/api/workflows", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch workflows");
  }
  return response.json();
}

export default function Home() {
  const { data: workflows, isLoading, error } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
    queryFn: fetchWorkflows,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load workflows</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your automation workflows
          </p>
        </div>
        <Button asChild>
          <Link href="/builder">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Link>
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        {workflows?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <p className="text-muted-foreground mb-4">No workflows yet</p>
            <Button asChild>
              <Link href="/builder">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Workflow
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows?.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {workflow.name}
                    <div className="space-x-2">
                      <Button size="icon" variant="ghost">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" asChild>
                        <Link href={`/builder/${workflow.id}`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created:{" "}
                    {new Date(workflow.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
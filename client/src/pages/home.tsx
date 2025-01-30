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
import { Plus, PlayCircle, Settings } from "lucide-react";
import type { Workflow } from "@db/schema";

export default function Home() {
  const { data: workflows } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
  });

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
                <div className="text-sm">
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
      </ScrollArea>
    </div>
  );
}

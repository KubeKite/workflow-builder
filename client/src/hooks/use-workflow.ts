import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Workflow, NewWorkflow } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

export function useWorkflow(id?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: workflow } = useQuery<Workflow>({
    queryKey: [`/api/workflows/${id}`],
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: NewWorkflow) => {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Success",
        description: "Workflow created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Workflow>) => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workflows/${id}`] });
      toast({
        title: "Success",
        description: "Workflow updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    workflow,
    createWorkflow: createMutation.mutateAsync,
    updateWorkflow: updateMutation.mutateAsync,
  };
}

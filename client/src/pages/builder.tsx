import { useCallback, useState } from "react";
import { useParams } from "wouter";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWorkflow } from "@/hooks/use-workflow";
import { TriggerNode, ActionNode, LogicNode } from "@/components/workflow/node-types";
import { WorkflowEdge } from "@/components/workflow/edge-types";
import WorkflowControls from "@/components/workflow/controls";
import SuggestionsPanel from "@/components/workflow/suggestions-panel";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  logic: LogicNode,
};

const edgeTypes = {
  workflow: WorkflowEdge,
};

export default function Builder() {
  const { id } = useParams();
  const { workflow, createWorkflow, updateWorkflow } = useWorkflow(id);
  const { toast } = useToast();
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [nodes, setNodes] = useState<any[]>(workflow?.definition?.nodes || []);
  const [edges, setEdges] = useState<any[]>(workflow?.definition?.edges || []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        return;
      }
      setEdges((eds) => addEdge({ ...params, type: "workflow" }, eds));
    },
    [setEdges]
  );

  const saveWorkflow = async () => {
    try {
      // Only validate when saving
      if (!name.trim()) {
        toast({
          title: "Error",
          description: "Please provide a workflow name",
          variant: "destructive",
        });
        return;
      }

      const data = {
        name,
        description,
        definition: { nodes, edges },
      };

      if (id) {
        await updateWorkflow(data);
      } else {
        await createWorkflow(data);
      }

      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Workflow Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={saveWorkflow}>Save Workflow</Button>
        </div>
      </Card>

      <Card className="relative h-[calc(100vh-16rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
          <div className="absolute left-4 top-4 z-[100]">
            <WorkflowControls
              onAddNode={(type, data) => {
                const centerX = window.innerWidth / 3;
                const centerY = window.innerHeight / 3;
                const position = {
                  x: centerX + Math.random() * 100,
                  y: centerY + Math.random() * 100,
                };
                const newNode = {
                  id: `${type}-${Date.now()}`,
                  type,
                  position,
                  data: {
                    ...data,
                    label: data.label,
                    description: data.description,
                    config: data.config,
                  },
                };
                setNodes((nds) => [...nds, newNode]);
              }}
            />
          </div>
          <SuggestionsPanel workflowId={id} />
        </ReactFlow>
      </Card>
    </div>
  );
}
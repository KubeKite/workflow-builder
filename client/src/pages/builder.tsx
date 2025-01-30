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
  const [nodes, setNodes] = useState(workflow?.definition.nodes || []);
  const [edges, setEdges] = useState(workflow?.definition.edges || []);

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
      // Prevent connecting to the same node
      if (params.source === params.target) {
        return;
      }

      // Add the edge with type
      setEdges((eds) => addEdge({ ...params, type: "workflow" }, eds));
    },
    [setEdges]
  );

  const validateWorkflow = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive",
      });
      return false;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one node to the workflow",
        variant: "destructive",
      });
      return false;
    }

    const triggerNodes = nodes.filter((node) => node.type === "trigger");
    if (triggerNodes.length === 0) {
      toast({
        title: "Error",
        description: "Workflow must have at least one trigger node",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const saveWorkflow = async () => {
    try {
      if (!validateWorkflow()) {
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

      <Card className="h-[calc(100vh-16rem)]">
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
          <WorkflowControls
            onAddNode={(type, data) => {
              const position = {
                x: Math.random() * 500,
                y: Math.random() * 500,
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
        </ReactFlow>
      </Card>
    </div>
  );
}
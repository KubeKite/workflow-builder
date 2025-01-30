import { Handle, Position, type NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Database,
  FileText,
  GitBranch,
  Globe,
  Clock,
  ArrowRightLeft,
} from "lucide-react";

const icons: { [key: string]: any } = {
  Mail,
  Database,
  FileText,
  GitBranch,
  Globe,
  Clock,
  ArrowRightLeft,
};

function NodeCard({ title, description, type, children }: any) {
  return (
    <Card className="min-w-[250px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge variant={type === "trigger" ? "secondary" : "default"}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
}

export function TriggerNode({ data }: NodeProps) {
  const Icon = icons[data.icon] || Clock;
  return (
    <NodeCard title={data.label} description={data.description} type="trigger">
      <div className="text-xs space-y-1">
        {data.config && Object.entries(data.config).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium">{key}:</span>
            <span className="text-muted-foreground">{value as string}</span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Right} />
    </NodeCard>
  );
}

export function ActionNode({ data }: NodeProps) {
  const Icon = icons[data.icon] || Database;
  return (
    <NodeCard title={data.label} description={data.description} type="action">
      <div className="text-xs space-y-1">
        {data.config && Object.entries(data.config).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium">{key}:</span>
            <span className="text-muted-foreground">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeCard>
  );
}

export function LogicNode({ data }: NodeProps) {
  const Icon = icons[data.icon] || GitBranch;
  return (
    <NodeCard title={data.label} description={data.description} type="logic">
      <div className="text-xs space-y-1">
        {data.config && Object.entries(data.config).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium">{key}:</span>
            <span className="text-muted-foreground">{value as string}</span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {data.label === "Condition" && (
        <Handle type="source" position={Position.Bottom} id="false" />
      )}
    </NodeCard>
  );
}
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
import { Plus, Mail, Database, FileText, GitBranch } from "lucide-react";

const nodeTemplates = [
  {
    type: "trigger",
    category: "Triggers",
    items: [
      {
        label: "Schedule",
        description: "Trigger workflow on a schedule",
        icon: "Clock",
        config: {
          schedule: "0 * * * *", // Default to hourly
        },
      },
      {
        label: "Webhook",
        description: "Trigger workflow via HTTP webhook",
        icon: "Webhook",
        config: {
          method: "POST",
          path: "/webhook",
        },
      },
      {
        label: "File Watch",
        description: "Monitor file changes",
        icon: FileText,
        config: {
          path: "/",
          pattern: "*.*",
        },
      },
    ],
  },
  {
    type: "action",
    category: "Actions",
    items: [
      {
        label: "Send Email",
        description: "Send email notifications",
        icon: Mail,
        config: {
          to: "",
          subject: "",
          body: "",
        },
      },
      {
        label: "Database Query",
        description: "Execute a database query",
        icon: Database,
        config: {
          query: "",
          parameters: [],
        },
      },
      {
        label: "File Operation",
        description: "Read or write files",
        icon: FileText,
        config: {
          operation: "read",
          path: "",
        },
      },
      {
        label: "HTTP Request",
        description: "Make an HTTP request",
        icon: "Globe",
        config: {
          method: "GET",
          url: "",
          headers: {},
        },
      },
    ],
  },
  {
    type: "logic",
    category: "Logic",
    items: [
      {
        label: "Condition",
        description: "Add conditional logic",
        icon: GitBranch,
        config: {
          condition: "",
        },
      },
      {
        label: "Transform",
        description: "Transform data between steps",
        icon: "ArrowRightLeft",
        config: {
          transform: "",
        },
      },
      {
        label: "Delay",
        description: "Add delay between steps",
        icon: "Clock",
        config: {
          duration: 1000,
        },
      },
    ],
  },
];

interface WorkflowControlsProps {
  onAddNode: (type: string, data: any) => void;
}

export default function WorkflowControls({ onAddNode }: WorkflowControlsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="h-8 w-8 rounded-full bg-background shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose a node type to add to your workflow
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-6 pr-4">
            {nodeTemplates.map((template) => (
              <div key={template.type}>
                <h3 className="font-semibold mb-2">{template.category}</h3>
                <div className="space-y-2">
                  {template.items.map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        onAddNode(template.type, {
                          ...item,
                          config: item.config,
                        })
                      }
                    >
                      {typeof item.icon === "string" ? (
                        <div className="mr-2 h-4 w-4" />
                      ) : (
                        <item.icon className="mr-2 h-4 w-4" />
                      )}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
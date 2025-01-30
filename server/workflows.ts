import type { Express } from "express";
import { db } from "@db";
import { workflows, workflowRuns } from "@db/schema";
import { eq } from "drizzle-orm";
import { analyzeWorkflow } from "./services/ai-suggestions";

export function setupWorkflows(app: Express) {
  // Get all workflows for the current user
  app.get("/api/workflows", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const userWorkflows = await db.query.workflows.findMany({
      where: eq(workflows.userId, req.user.id),
      orderBy: (workflows, { desc }) => [desc(workflows.updatedAt)],
    });

    res.json(userWorkflows);
  });

  // Get a specific workflow
  app.get("/api/workflows/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const workflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, parseInt(req.params.id)),
    });

    if (!workflow) {
      return res.status(404).send("Workflow not found");
    }

    if (workflow.userId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    res.json(workflow);
  });

  // Create a new workflow
  app.post("/api/workflows", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const { name, description, definition } = req.body;

    const [workflow] = await db
      .insert(workflows)
      .values({
        name,
        description,
        definition,
        userId: req.user.id,
      })
      .returning();

    res.json(workflow);
  });

  // Update a workflow
  app.patch("/api/workflows/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const { name, description, definition, isActive } = req.body;

    const [workflow] = await db
      .update(workflows)
      .set({
        name,
        description,
        definition,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, parseInt(req.params.id)))
      .returning();

    res.json(workflow);
  });

  // Execute a workflow
  app.post("/api/workflows/:id/execute", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const workflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, parseInt(req.params.id)),
    });

    if (!workflow) {
      return res.status(404).send("Workflow not found");
    }

    if (workflow.userId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    const [run] = await db
      .insert(workflowRuns)
      .values({
        workflowId: workflow.id,
        status: "running",
      })
      .returning();

    // Simulate workflow execution
    setTimeout(async () => {
      await db
        .update(workflowRuns)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(workflowRuns.id, run.id));
    }, 5000);

    res.json(run);
  });

  // New route for getting workflow suggestions
  app.get("/api/workflows/:id/suggestions", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const workflow = await db.query.workflows.findFirst({
        where: eq(workflows.id, parseInt(req.params.id)),
      });

      if (!workflow) {
        return res.status(404).send("Workflow not found");
      }

      if (workflow.userId !== req.user.id) {
        return res.status(403).send("Not authorized");
      }

      const suggestions = await analyzeWorkflow(workflow);
      res.json(suggestions);
    } catch (error) {
      console.error('Error getting workflow suggestions:', error);
      res.status(500).send("Failed to generate suggestions");
    }
  });
}
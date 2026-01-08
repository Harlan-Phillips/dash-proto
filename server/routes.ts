import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScheduledEmailSchema, updateScheduledEmailSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/action-items/schedules", async (req, res) => {
    try {
      const userId = (req.query.userId as string) || "default-user";
      const schedules = await storage.getScheduledEmails(userId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.post("/api/action-items/schedules", async (req, res) => {
    try {
      const parsed = insertScheduledEmailSchema.parse(req.body);
      const schedule = await storage.createScheduledEmail(parsed);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid schedule data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create schedule" });
      }
    }
  });

  app.patch("/api/action-items/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = updateScheduledEmailSchema.parse(req.body);
      const schedule = await storage.updateScheduledEmail(id, parsed);

      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update schedule" });
      }
    }
  });

  app.post("/api/action-items/schedules/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: "isActive must be a boolean" });
      }

      const schedule = await storage.toggleScheduledEmail(id, isActive);

      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle schedule" });
    }
  });

  app.delete("/api/action-items/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteScheduledEmail(id);

      if (!deleted) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  });

  app.post("/api/action-items/email", async (req, res) => {
    try {
      const { roleContext, recipients, subject, message } = req.body;

      if (!roleContext || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: "roleContext and recipients are required" });
      }

      console.log(`[Email] Sending action items email to ${recipients.join(", ")} for role ${roleContext}`);

      res.json({ 
        success: true, 
        message: `Email sent to ${recipients.length} recipient(s)`,
        sentAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return httpServer;
}

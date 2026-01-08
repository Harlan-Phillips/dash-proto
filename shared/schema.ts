import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, smallint, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const roleContextEnum = z.enum(["owner", "gm", "chef"]);
export type RoleContext = z.infer<typeof roleContextEnum>;

export const frequencyEnum = z.enum(["daily", "weekly", "monthly"]);
export type Frequency = z.infer<typeof frequencyEnum>;

export const scheduledActionItemEmails = pgTable("scheduled_action_item_emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  roleContext: text("role_context").notNull().$type<RoleContext>(),
  frequency: text("frequency").notNull().$type<Frequency>(),
  dayOfWeek: smallint("day_of_week"),
  dayOfMonth: smallint("day_of_month"),
  sendTime: text("send_time").notNull(),
  timezone: text("timezone").notNull(),
  subject: text("subject").notNull(),
  message: text("message"),
  recipients: jsonb("recipients").notNull().$type<string[]>(),
  isActive: boolean("is_active").notNull().default(true),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertScheduledEmailSchema = createInsertSchema(scheduledActionItemEmails).omit({
  id: true,
  lastRun: true,
  nextRun: true,
  createdAt: true,
  updatedAt: true,
});

export const updateScheduledEmailSchema = insertScheduledEmailSchema.partial();

export type InsertScheduledEmail = z.infer<typeof insertScheduledEmailSchema>;
export type UpdateScheduledEmail = z.infer<typeof updateScheduledEmailSchema>;
export type ScheduledEmail = typeof scheduledActionItemEmails.$inferSelect;

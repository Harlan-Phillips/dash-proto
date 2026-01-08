import { type User, type InsertUser, type ScheduledEmail, type InsertScheduledEmail, type UpdateScheduledEmail, type RoleContext, type Frequency } from "@shared/schema";
import { randomUUID } from "crypto";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { addDays, addMonths } from "date-fns";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getScheduledEmails(userId: string): Promise<ScheduledEmail[]>;
  getScheduledEmailById(id: string): Promise<ScheduledEmail | undefined>;
  createScheduledEmail(schedule: InsertScheduledEmail): Promise<ScheduledEmail>;
  updateScheduledEmail(id: string, updates: UpdateScheduledEmail): Promise<ScheduledEmail | undefined>;
  deleteScheduledEmail(id: string): Promise<boolean>;
  toggleScheduledEmail(id: string, isActive: boolean): Promise<ScheduledEmail | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scheduledEmails: Map<string, ScheduledEmail>;

  constructor() {
    this.users = new Map();
    this.scheduledEmails = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getScheduledEmails(userId: string): Promise<ScheduledEmail[]> {
    return Array.from(this.scheduledEmails.values()).filter(
      (schedule) => schedule.userId === userId
    );
  }

  async getScheduledEmailById(id: string): Promise<ScheduledEmail | undefined> {
    return this.scheduledEmails.get(id);
  }

  async createScheduledEmail(schedule: InsertScheduledEmail): Promise<ScheduledEmail> {
    const id = randomUUID();
    const now = new Date();
    const newSchedule: ScheduledEmail = {
      id,
      userId: schedule.userId,
      roleContext: schedule.roleContext as RoleContext,
      frequency: schedule.frequency as Frequency,
      dayOfWeek: schedule.dayOfWeek ?? null,
      dayOfMonth: schedule.dayOfMonth ?? null,
      sendTime: schedule.sendTime,
      timezone: schedule.timezone,
      subject: schedule.subject,
      message: schedule.message ?? null,
      recipients: schedule.recipients as string[],
      isActive: schedule.isActive ?? true,
      lastRun: null,
      nextRun: this.calculateNextRun(
        schedule.frequency as Frequency,
        schedule.dayOfWeek ?? null,
        schedule.dayOfMonth ?? null,
        schedule.sendTime,
        schedule.timezone,
      ),
      createdAt: now,
      updatedAt: now,
    };
    this.scheduledEmails.set(id, newSchedule);
    return newSchedule;
  }

  async updateScheduledEmail(id: string, updates: UpdateScheduledEmail): Promise<ScheduledEmail | undefined> {
    const existing = this.scheduledEmails.get(id);
    if (!existing) return undefined;

    const updated: ScheduledEmail = {
      id: existing.id,
      userId: updates.userId ?? existing.userId,
      roleContext: (updates.roleContext ?? existing.roleContext) as RoleContext,
      frequency: (updates.frequency ?? existing.frequency) as Frequency,
      dayOfWeek: updates.dayOfWeek !== undefined ? updates.dayOfWeek : existing.dayOfWeek,
      dayOfMonth: updates.dayOfMonth !== undefined ? updates.dayOfMonth : existing.dayOfMonth,
      sendTime: updates.sendTime ?? existing.sendTime,
      timezone: updates.timezone ?? existing.timezone,
      subject: updates.subject ?? existing.subject,
      message: updates.message !== undefined ? updates.message : existing.message,
      recipients: updates.recipients !== undefined ? (updates.recipients as string[]) : existing.recipients,
      isActive: updates.isActive !== undefined ? updates.isActive : existing.isActive,
      lastRun: existing.lastRun,
      nextRun: this.calculateNextRun(
        (updates.frequency ?? existing.frequency) as Frequency,
        updates.dayOfWeek !== undefined ? updates.dayOfWeek : existing.dayOfWeek,
        updates.dayOfMonth !== undefined ? updates.dayOfMonth : existing.dayOfMonth,
        updates.sendTime ?? existing.sendTime,
        updates.timezone ?? existing.timezone,
      ),
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    this.scheduledEmails.set(id, updated);
    return updated;
  }

  async deleteScheduledEmail(id: string): Promise<boolean> {
    return this.scheduledEmails.delete(id);
  }

  async toggleScheduledEmail(id: string, isActive: boolean): Promise<ScheduledEmail | undefined> {
    const existing = this.scheduledEmails.get(id);
    if (!existing) return undefined;

    const updated: ScheduledEmail = {
      ...existing,
      isActive,
      updatedAt: new Date(),
    };
    this.scheduledEmails.set(id, updated);
    return updated;
  }

  private calculateNextRun(
    frequency: Frequency,
    dayOfWeek: number | null,
    dayOfMonth: number | null,
    sendTime: string,
    timezone: string
  ): Date {
    const [hour, minute] = sendTime.split(':').map(Number);
    const nowUtc = new Date();
    const nowLocal = toZonedTime(nowUtc, timezone);

    const baseLocalUtc = new Date(Date.UTC(
      nowLocal.getFullYear(),
      nowLocal.getMonth(),
      nowLocal.getDate()
    ));

    const hasPassedToday = nowLocal.getHours() > hour ||
      (nowLocal.getHours() === hour && nowLocal.getMinutes() >= minute);

    let targetDateUtc = new Date(baseLocalUtc);

    if (frequency === 'daily') {
      if (hasPassedToday) {
        targetDateUtc = addDays(targetDateUtc, 1);
      }
    } else if (frequency === 'weekly' && dayOfWeek !== null) {
      const localDow = nowLocal.getDay();
      let delta = (dayOfWeek - localDow + 7) % 7;
      if (delta === 0 && hasPassedToday) delta = 7;
      targetDateUtc = addDays(targetDateUtc, delta);
    } else if (frequency === 'monthly' && dayOfMonth !== null) {
      const daysInThisMonth = new Date(Date.UTC(
        targetDateUtc.getUTCFullYear(),
        targetDateUtc.getUTCMonth() + 1,
        0
      )).getUTCDate();
      const targetDay = Math.min(dayOfMonth, daysInThisMonth);
      const originalDate = targetDateUtc.getUTCDate();
      targetDateUtc.setUTCDate(targetDay);

      if (originalDate > targetDay || (originalDate === targetDay && hasPassedToday)) {
        targetDateUtc = addMonths(new Date(Date.UTC(
          baseLocalUtc.getUTCFullYear(),
          baseLocalUtc.getUTCMonth(),
          1
        )), 1);
        const daysInNextMonth = new Date(Date.UTC(
          targetDateUtc.getUTCFullYear(),
          targetDateUtc.getUTCMonth() + 1,
          0
        )).getUTCDate();
        targetDateUtc.setUTCDate(Math.min(dayOfMonth, daysInNextMonth));
      }
    }

    const year = targetDateUtc.getUTCFullYear();
    const month = String(targetDateUtc.getUTCMonth() + 1).padStart(2, '0');
    const day = String(targetDateUtc.getUTCDate()).padStart(2, '0');
    const hourStr = String(hour).padStart(2, '0');
    const minStr = String(minute).padStart(2, '0');

    return fromZonedTime(`${year}-${month}-${day}T${hourStr}:${minStr}:00`, timezone);
  }
}

export const storage = new MemStorage();

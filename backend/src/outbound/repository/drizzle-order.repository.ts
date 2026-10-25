import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { orders } from '../../db/schema/orders.schema';
import type { IOrderRepository, OrderRecord } from '../order-repository.port';

export class DrizzleOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<OrderRecord | null> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderRecord | null> {
    const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findByUserId(userId: string): Promise<OrderRecord[]> {
    const results = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
    return results.map((r) => this.mapToRecord(r));
  }

  async create(data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord> {
    const [created] = await db
      .insert(orders)
      .values({
        orderNumber: data.orderNumber,
        userId: data.userId,
        amount: data.amount,
        status: data.status,
        paymentType: data.paymentType,
        snapToken: data.snapToken,
        metadata: data.metadata,
      })
      .returning();
    return this.mapToRecord(created);
  }

  async updateStatus(orderNumber: string, status: string, paymentType?: string): Promise<OrderRecord> {
    const [updated] = await db
      .update(orders)
      .set({
        status,
        ...(paymentType ? { paymentType } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orders.orderNumber, orderNumber))
      .returning();
    return this.mapToRecord(updated);
  }

  private mapToRecord(row: typeof orders.$inferSelect): OrderRecord {
    return {
      id: row.id,
      orderNumber: row.orderNumber,
      userId: row.userId,
      amount: row.amount,
      status: row.status,
      paymentType: row.paymentType,
      snapToken: row.snapToken,
      metadata: row.metadata as Record<string, unknown> | null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  amount: number;
  status: string;
  paymentType: string | null;
  snapToken: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderRepository {
  findById(id: string): Promise<OrderRecord | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderRecord | null>;
  findByUserId(userId: string): Promise<OrderRecord[]>;
  create(data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord>;
  updateStatus(orderNumber: string, status: string, paymentType?: string): Promise<OrderRecord>;
}

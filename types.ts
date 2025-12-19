
export interface Spool {
  id: string;
  type: string;
  color: string;
  colorHex: string;
  brand: string;
  initialWeight: number; // In grams
  currentWeight: number; // In grams
  purchaseDate: string;
  status: 'active' | 'empty' | 'archived';
}

export interface PrintLog {
  id: string;
  spoolId: string;
  printName: string;
  weightUsed: number; // In grams
  timestamp: string;
}

export type AppView = 'dashboard' | 'inventory' | 'usage';

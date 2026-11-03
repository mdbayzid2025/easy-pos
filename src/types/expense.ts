export interface ExpenseCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface BuildingRef {
  _id: string;
  name: string;
  address?: string;
  phoneNo?: string;
}

export interface ExpenseCategoryRef {
  _id: string;
  name: string;
}

export interface Expense {
  _id: string;
  building?: BuildingRef | null;
  isGeneralExpense?: boolean;
  dateString: string;
  month?: number;
  year?: number;
  category: ExpenseCategoryRef;
  type?: "OfficeCost" | "OwnerCost" | string;
  images: string[];
  description: string;
  amount: number;
  receiptNo?: string;
  createdAt?: string;
}

export const initialExpenseCategories: ExpenseCategory[] = [];

export const initialExpenses: Expense[] = [];

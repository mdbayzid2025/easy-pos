export interface Utility {
  _id?: string;
  id?: string;
  electricityBill: number;
  waterBill: number;
  gasBill: number;
  liftBill: number;
  garageBill: number;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UtilityPaginationPayload {
  pagination?: {
    pageSize?: number;
    currentPage?: number;
  };
  filter?: {
    isDelete?: boolean;
  } | null;
  sort?: Record<string, number>;
  select?: any;
}

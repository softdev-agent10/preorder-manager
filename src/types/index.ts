// src/types/index.ts
export interface Preorder {
  id: string;
  name: string;
  productCount: number;
  preorderWhen: Date;
  startAt: Date;
  endAt: Date;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface PreorderInput {
  name: string;
  productCount: number;
  preorderWhen: Date;
  startAt: Date;
  endAt: Date;
  status: "active" | "inactive";
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
  filter: "all" | "active" | "inactive";
}

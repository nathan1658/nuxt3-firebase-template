import type { Person } from "~/server/schemas/person.schema";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PersonStats {
  total: number;
  active: number;
  inactive: number;
  averageAge: number;
}

export type PersonResponse = ApiResponse<Person>;
export type PersonListResponse = PaginatedResponse<Person>;
export type PersonStatsResponse = ApiResponse<PersonStats>;

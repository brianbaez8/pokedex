export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface FilterQuery {
  limit?: number;
  offset?: number;
  page?: number;
  type?: string;
  location?: string;
  weight?: number;
  height?: number;
}

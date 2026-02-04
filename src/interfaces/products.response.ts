import type { Product } from "./product.interface";
import type { User } from "./user.interface";

export interface ProductsResponse {
  count: number;
  pages: number;
  products: Product[];
}

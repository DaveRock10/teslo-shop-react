import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";
import type { ProductsResponse } from "@/interfaces/products.response";

interface Options {
  limit?: number | string;
  offset: number | string;
  gender: string;
  sizes: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const getProductsAction = async (
  option: Options
): Promise<ProductsResponse> => {
  const { limit, offset, gender, sizes, minPrice, maxPrice, query } = option;
  const { data } = await tesloApi.get<ProductsResponse>("/products", {
    params: {
      limit,
      offset,
      gender,
      sizes,
      minPrice,
      maxPrice,
      q: query,
    },
  });

  const productsWithImageUrl: Product[] = data.products.map((product) => ({
    ...product,
    images: product.images.map((image) => `${API_URL}/files/product/${image}`),
  }));

  return { ...data, products: productsWithImageUrl };
};

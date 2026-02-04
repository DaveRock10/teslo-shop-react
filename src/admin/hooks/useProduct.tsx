import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById } from "../actions/get-product-by-id.action";
import type { Product } from "@/interfaces/product.interface";
import { createUpdateProductAction } from "../actions/create-update-product.action";

export const useProduct = (id: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getProductById(id),
    retry: false,
    staleTime: 1000 * 5 * 60,
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {
      // Inavlidar cache
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Actualizar query data
      queryClient.setQueryData(["product", { id: product.id }], product);
    },
  });

  // const handleSubmit = async (productLike: Partial<Product>) => {
  //   console.log({ productLike });
  // };

  return {
    ...query,
    mutation,
  };
};

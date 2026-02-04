import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomJumbotron } from "@/shop/components/CustomJumbotron";
import { ProductGrid } from "@/shop/components/ProductGrid";
import { useProducts } from "@/shop/hooks/useProducts";
import { useParams } from "react-router";

export const GenderPage = () => {
  const { gender } = useParams();

  const { data } = useProducts();

  const genderLabel =
    gender === "men"
      ? "Hombres"
      : gender === "women"
      ? "Mujeres"
      : gender === "kid"
      ? "Niños"
      : "";

  return (
    <>
      <CustomJumbotron title={`Todos los productos para ${genderLabel}`} />

      <ProductGrid products={data?.products || []} />

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  );
};

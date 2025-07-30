// useGetProductsByCategory.ts
import { axios } from 'app/config/axios';
import useSWR from 'swr';



export const useGetProductsSubCategory = (catId: string | null, vendorId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    catId && vendorId ? [ catId, vendorId] : null,
    async () => {
      const response = await axios({
        url: `market/getSubCatByCat/${vendorId}`,
        method: 'POST',
        data: { catId }
      });
      return response ;
    }
  );

  return {
    subcategories: data?.subcategories || [],
    data,
    isLoading,
    isError: !!error,
    refresh: () => mutate()
  };
};

// types.ts
interface Product {
  id: string;
  title: string;
  images: string[];
  price: number;
  quantity: number;
  discount: number;
  category: {
    _id: string;
    title: string;
  };
  subcategory: {
    _id: string;
    title: string;
  };
}

interface ProductsResponse {
  ProductCount: number;
  Products: Product[];
}



export const useGetProductsBySubCategory = (
  vendorId: string | null,
  catId: string | null,
  subCatId: string | null
) => {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    vendorId && catId && subCatId ? ['products', vendorId, catId, subCatId] : null,
    async () => {
      const response = await axios({
        url: `market/getProductBySubCat`,
        method: 'POST',
        data: { vendorId, catId, subCatId }
      });
      
      return response ;
    }
  );

  return {
    products: data?.Products || [],
    totalCount: data?.ProductCount || 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate()
  };
};
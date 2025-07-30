
import { axios } from 'app/config/axios';
import useSWRInfinite from 'swr/infinite';

// Define the API endpoint
const GET_VENDOR_PRODUCTS_ENDPOINT = 'market/getProductById';

// Define types for the API response based on the provided structure
interface Product {
  title: string;
  images: string[];
  category: any;
  quantity: number;
  tags: string[];
  discount: number;
  description: string;
  price: number;
  slug: string;
  productId: string;
  subcategory: any;
  weight: string;
}

interface VendorResponse {
  id: string;
  companyName: string;
  address: string;
  description: string;
  rating: number;
  phoneNumber: string;
  coverPhoto: string;
  profileImage?: string;
  availableCategoryCount: number;
  availableCategories: Array<{
    title: any;
    image?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  Product: Product[];
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<VendorResponse> => {
  try {
    const response = await axios({
      url,
      method: 'GET',
    });

    const data = response;

    if (!data) {
      throw new Error('No data returned from API');
    }

    if (!data.Product || !Array.isArray(data.Product)) {
      throw new Error('Invalid API response: Product array is missing or not an array');
    }

    return data as VendorResponse;
  } catch (error) {
    console.error('Fetcher Error:', error);
    throw error; // Let SWR handle the error
  }
};

export const useGetVendorProducts = (storeId: string | null, limit = 20) => {
  // Define the key function for pagination
  const getKey = (pageIndex: number, previousPageData: VendorResponse | null) => {
    if (!storeId) return null; // Don't fetch if storeId is null
    if (previousPageData && (!previousPageData.Product || previousPageData.Product.length === 0)) {
      return null; // Stop fetching if the previous page has no products
    }
    return `${GET_VENDOR_PRODUCTS_ENDPOINT}/${storeId}?page=${pageIndex + 1}&limit=${limit}`;
  };

  const { data, error, isLoading, mutate, size, setSize, isValidating } = useSWRInfinite<
    VendorResponse
  >(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false, // Avoid revalidating the first page unnecessarily
      onError: (err) => {
        console.error('SWRInfinite Error:', err);
      },
    }
  );


  // Flatten the products from all pages
  const products: Product[] = data
    ? [].concat(...data.map((page) => (page && page.Product ? page.Product : [])))
    : [];

  // Determine loading states
  const isLoadingMore = size > 1 && isValidating;
  const isEmpty = data?.[0]?.Product?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.Product?.length < limit);

  return {
    vendorData: data?.[0] || null, // First page contains vendor info
    products, // Flattened product list
    isLoadingVendorData: isLoading,
    isLoadingMore,
    vendorError: error,
    refresh: mutate,
    loadMore: () => setSize(size + 1),
    isReachingEnd,
  };
};
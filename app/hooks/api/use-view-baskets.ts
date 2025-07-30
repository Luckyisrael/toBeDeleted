import useSWR from "swr";
import { axios } from "app/config/axios";

const VIEW_USER_BASKETS = "user/viewBasket";

const fetchCart = async (url: string) => {
  return axios({
    url,
    method: "GET",
  });
};

export const useViewUserCart = () => {
  const { data, error, isLoading, mutate } = useSWR(
    VIEW_USER_BASKETS,
    fetchCart
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate,
  };
};
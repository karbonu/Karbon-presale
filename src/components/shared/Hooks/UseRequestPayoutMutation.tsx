import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse, AxiosError } from 'axios';

type requestPayout = {
  referralId: string;
};

export const useRequestPayoutMitate = (auth: string): UseMutationResult<AxiosResponse<any>, AxiosError, requestPayout> => {
  return useMutation<AxiosResponse<any>, AxiosError, requestPayout>({
    mutationFn: (data: requestPayout) => {
      console.log("Access token", auth)
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}referrals/claim-bonus`, data, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
    },
  });
};
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';


type requestPayout = {
    referralId: string;
  };
  
  export const useRequestPayoutMitate = (auth : string): UseMutationResult<AxiosResponse<any>, Error, requestPayout> => {
    return useMutation<AxiosResponse<any>, Error, requestPayout>({
      mutationFn: (data: requestPayout) => {
        return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}referrals/claim-bonus`, data,  {
          headers: {
            'Authorization': `Bearer ${auth}`,
          },
        });
      },
    });
  };
  
  
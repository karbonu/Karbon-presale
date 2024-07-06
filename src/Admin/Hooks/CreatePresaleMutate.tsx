import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type createMutate = {
  name: string;
  token: {
    address: string;
  };
  coin: string;
  rate: number;
  hardCap: number;
  minBuy: number;
  maxBuy: number;
  startDate: string; 
  endDate: string; 
  presaleAddress: string;
  paymentChannel: string;
  networks: string;
  usdtAddress: string;
  totalContribution: number;
  vesting: {
    [index : number] : [
      percentage: number,
      releaseDate: string 
    ]
  };
};
  export const useCreatePresaleMutate = (): UseMutationResult<AxiosResponse<any>, Error, createMutate> => {
    return useMutation<AxiosResponse<any>, Error, createMutate>({
      mutationFn: (data: createMutate) => {
        return axios.post('https://karbon.plana.ng/admin/create', data);
      },
    });
  };
  
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type RegisterData = {
  email: string;
  walletAddress: string;
  referrerId: string;
  password: string;
};

export const useRegisterMutation = (): UseMutationResult<AxiosResponse<any>, Error, RegisterData> => {
  return useMutation<AxiosResponse<any>, Error, RegisterData>({
    mutationFn: (data: RegisterData) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}auth/register`, data);
    },
  });
};

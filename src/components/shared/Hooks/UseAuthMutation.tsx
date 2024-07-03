import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type InitialNonceData = {
  email: string;
};

type InitialNonceResponse = {
  nonce: string;
};

export const useInitialNonceMutation = (): UseMutationResult<AxiosResponse<InitialNonceResponse>, Error, InitialNonceData> => {
  return useMutation<AxiosResponse<InitialNonceResponse>, Error, InitialNonceData>({
    mutationFn: (data: InitialNonceData) => {
      return axios.post('https://karbon.plana.ng/auth/initial', data);
    },
  });
};

type LoginData = {
  email: string;
  password: string;
  nonce: string;
};

export const useLoginMutation = (): UseMutationResult<AxiosResponse<any>, Error, LoginData> => {
  return useMutation<AxiosResponse<any>, Error, LoginData>({
    mutationFn: (data: LoginData) => {
      return axios.post('https://karbon.plana.ng/auth/login', data);
    },
  });
};

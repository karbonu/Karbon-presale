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

type verifyEmailData = {
  email: string;
  otp : number;
};


export const useVerifyEmailMutation = (): UseMutationResult<AxiosResponse<any>, Error, verifyEmailData> => {
  return useMutation<AxiosResponse<any>, Error, verifyEmailData>({
    mutationFn: (data: verifyEmailData) => {
      return axios.post('https://karbon.plana.ng/auth/verifyOtp', data);
    },
  });
};

type SocialAuthData = {
  token: string;
  unique_id: string;
  email: string;
  phone: string;
  medium: string;
  id_token: string;
  ref_code: string;
};

export const useSocialAuthMutation = (): UseMutationResult<AxiosResponse<any>, Error, SocialAuthData> => {
  return useMutation<AxiosResponse<any>, Error, SocialAuthData>({
    mutationFn: (data: SocialAuthData) => {
      console.log(data)
      return axios.post('https://karbon.plana.ng/auth/social-register', data);
    },
  });
};


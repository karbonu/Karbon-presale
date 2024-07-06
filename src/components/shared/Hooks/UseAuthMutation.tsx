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
      return axios.post( `${import.meta.env.VITE_BACKEND_API_URL}auth/initial`, data);
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
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}auth/login`, data);
    },
  });
};

type verifyEmailData = {
  email: string;
  otp : string;
};


export const useVerifyEmailMutation = (): UseMutationResult<AxiosResponse<any>, Error, verifyEmailData> => {
  return useMutation<AxiosResponse<any>, Error, verifyEmailData>({
    mutationFn: (data: verifyEmailData) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}auth/verifyOtp`, data);
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
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}auth/social-register`, data);
    },
  });
};

type passwordUpdate = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export const usePasswoedUpdateMutate = (): UseMutationResult<AxiosResponse<any>, Error, passwordUpdate> => {
  return useMutation<AxiosResponse<any>, Error, passwordUpdate>({
    mutationFn: (data: passwordUpdate) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}users/password/update`, data);
    },
  });
};


type passwordOTP = {
  email: string;
  newPassword: string;
};

export const usePasswordOTPMutate = (): UseMutationResult<AxiosResponse<any>, Error, passwordOTP> => {
  return useMutation<AxiosResponse<any>, Error, passwordOTP>({
    mutationFn: (data: passwordOTP) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}users/password/change`, data);
    },
  });
};



type passwordReset = {
  email: string;
};

export const usePasswordResetMutate = (): UseMutationResult<AxiosResponse<any>, Error, passwordReset> => {
  return useMutation<AxiosResponse<any>, Error, passwordReset>({
    mutationFn: (data: passwordReset) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}users/password/reset`, data);
    },
  });
};


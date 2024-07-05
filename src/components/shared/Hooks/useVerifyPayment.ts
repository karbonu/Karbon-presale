// src/hooks/useVerifyPayment.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type VerifyPaymentData = {
  orderID: string;
  userID: string;
  amount: string;
};

type VerifyPaymentResponse = {
  success: boolean;
};

const verifyPayment = (data: VerifyPaymentData): Promise<AxiosResponse<VerifyPaymentResponse>> => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}/payment/verify-payment`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const useVerifyPaymentMutation = (): UseMutationResult<
  AxiosResponse<VerifyPaymentResponse>,
  Error,
  VerifyPaymentData
> => {
  return useMutation<AxiosResponse<VerifyPaymentResponse>, Error, VerifyPaymentData>({
    mutationFn: verifyPayment,
  });
};

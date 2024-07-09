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

const verifyPayment = (data: VerifyPaymentData, auth: string): Promise<AxiosResponse<VerifyPaymentResponse>> => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}payment/verify-payment`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      },
    }
  );
};


export const useVerifyPaymentMutation = (auth: string): UseMutationResult<
  AxiosResponse<VerifyPaymentResponse>,
  Error,
  VerifyPaymentData
> => {
  return useMutation<AxiosResponse<VerifyPaymentResponse>, Error, VerifyPaymentData>({
    mutationFn: (data: VerifyPaymentData) => verifyPayment(data, auth),
  });
};

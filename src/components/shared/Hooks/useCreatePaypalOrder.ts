// src/hooks/useCreatePaypalOrder.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type CreateOrderResponse = {
  id: string;
};

type CreateOrderData = {
  amount: string;
};

const createPaypalOrder = (data: CreateOrderData): Promise<AxiosResponse<CreateOrderResponse>> => {
  return axios.post(
    `https://api.sandbox.paypal.com/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: data.amount,
          },
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`AWx-Zj8mauxUq9N3wPUq-eE0VsqeoKVF9aBWK33fjk4wYpHDd02X50HBwwdLgP3Y8QE6DheVGNFonzsS:EClqHPcMrUf7wpktqVMRl1AddFw9A8gBXmd_IRw_nzQWy1YFFPVzI96Uey3WiBHTT5Vx95bnifaLL2t7`)}`,
      },
    }
  );
};

export const useCreatePaypalOrderMutation = (): UseMutationResult<AxiosResponse<CreateOrderResponse>, Error, CreateOrderData> => {
  return useMutation<AxiosResponse<CreateOrderResponse>, Error, CreateOrderData>({
    mutationFn: createPaypalOrder,
  });
};

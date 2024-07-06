// // src/hooks/useCreatePaypalOrder.ts
// import { useMutation, UseMutationResult } from '@tanstack/react-query';
// import axios, { AxiosResponse } from 'axios';

// type CreateOrderResponse = {
//   id: string;
// };

// type CreateOrderData = {
//   amount: string;
// };

// const createPaypalOrder = (data: CreateOrderData): Promise<AxiosResponse<CreateOrderResponse>> => {
//   return axios.post(
//     `${import.meta.env.VITE_PAYPAL_BASE_URL}/v2/checkout/orders`,
//     {
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: 'USD',
//             value: data.amount,
//           },
//         },
//       ],
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${btoa(`${import.meta.env.VITE_PAYPAL_CLIENT_ID}:${import.meta.env.VITE_PAYPAL_CLIENT_SECRET}`)}`,
//       },
//     }
//   );
// };

// export const useCreatePaypalOrderMutation = (): UseMutationResult<AxiosResponse<CreateOrderResponse>, Error, CreateOrderData> => {
//   return useMutation<AxiosResponse<CreateOrderResponse>, Error, CreateOrderData>({
//     mutationFn: createPaypalOrder,
//   });
// };

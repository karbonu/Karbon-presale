import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type completeData = {
    referralId: string,
    txHash: string
};
export const useCompletePayoutMutate = (auth: string): UseMutationResult<AxiosResponse<any>, Error, completeData> => {
    return useMutation<AxiosResponse<any>, Error, completeData>({
        mutationFn: (data: completeData) => {
            return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}admin/settle-bonus`, data, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                },
            });
        },
    });
};

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getPresaleID = async (auth: string): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}presale/`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        });
        return response;
    } catch (error) {
        console.log(error);
        return 'Failed';
    }
}

export const getTotalUSDSpent = async (UserID: string, auth: string): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment/${UserID}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        return response;
    } catch (error) {
        console.log(error);
        return 'Failed';
    }
}

export const getUserReferrals = async (UserID: string, auth: string): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}referrals/${UserID}`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        console.log("user id");
        console.log(UserID);
        return response;
    } catch (error) {
        console.log(error);
        return 'Failed';
    }
}

export const getTotalContribution = async (auth: string): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}presale/cly9asr6e0000tbafsf3w764u/total-contribution`, {
            headers: {
                'Authorization': `Bearer ${auth}`,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        return response;
    } catch (error) {
        console.log(error);
        return 'Failed';
    }
};

type passwordReset = {
    email: string;
};

export const usePasswordResetMutate = (auth: string): UseMutationResult<AxiosResponse<any>, Error, passwordReset> => {
    return useMutation<AxiosResponse<any>, Error, passwordReset>({
        mutationFn: (data: passwordReset) => {
            return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}users/password/reset`, data, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                }
            });
        },
    });
};
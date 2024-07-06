import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getProgress = async (): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_BACKEND_API_URL}presale/progress`);
      return response;
    } catch (error) {
      return 'Failed';
    }
  };


export const getTotalUSDTSpent = async (address : string) : Promise<AxiosResponse<any> | 'Failed' > => {

    try {
        const response = await axios.get( `${import.meta.env.VITE_BACKEND_API_URL}presale/usdtTransfer?address=${address}`)
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  

export const getTotalUSDSpent = async (UserID : string) : Promise<AxiosResponse<any> | 'Failed' > => {
    

    try {
        const response = await axios.get( `${import.meta.env.VITE_BACKEND_API_URL}presale/investment/${UserID}` )
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  


export const getUserReferrals = async (UserID : string) : Promise<AxiosResponse<any> | 'Failed' > => {
    
    
    try {
        const response = await axios.get( `${import.meta.env.VITE_BACKEND_API_URL}referrals/${UserID}`)
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  

export const getTotalContribution = async (): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}resale/"cly9atqwm0001tbafzumww6dz"/total-contribution`);
      return response;
    } catch (error) {
      return 'Failed';
    }
  };
  

type passwordReset = {
    email: string;
  };
  
  export const usePasswordResetMutate = (): UseMutationResult<AxiosResponse<any>, Error, passwordReset> => {
    return useMutation<AxiosResponse<any>, Error, passwordReset>({
      mutationFn: (data: passwordReset) => {
        return axios.post( `${import.meta.env.VITE_BACKEND_API_URL}users/password/reset`, data);
      },
    });
  };
  
  
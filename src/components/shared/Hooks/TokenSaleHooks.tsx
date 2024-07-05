import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getProgress = async (): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get('https://karbon.plana.ng/presale/progress');
      return response;
    } catch (error) {
      return 'Failed';
    }
  };


export const getTotalUSDTSpent = async (address : string) : Promise<AxiosResponse<any> | 'Failed' > => {

    try {
        const response = await axios.get('https://karbon.plana.ng/presale/usdtTransfer?address=' + (address))
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  

export const getTotalUSDSpent = async (UserID : string) : Promise<AxiosResponse<any> | 'Failed' > => {
    

    try {
        const response = await axios.get('https://karbon.plana.ng/presale/investment/' + (UserID))
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  


export const getUserReferrals = async (UserID : string) : Promise<AxiosResponse<any> | 'Failed' > => {
    
    
    try {
        const response = await axios.get('https://karbon.plana.ng/referrals/' + (UserID))
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  

export const getTotalContribution = async (): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get('https://karbon.plana.ng/presale/1/total-contribution');
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
        return axios.post('https://karbon.plana.ng//users/password/reset', data);
      },
    });
  };
  
  
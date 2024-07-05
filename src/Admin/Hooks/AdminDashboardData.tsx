import axios, { AxiosResponse } from "axios"

export const getDashboardData = async (): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get('https://karbon.plana.ng/admin/dashboard');
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
  

import axios, { AxiosResponse } from "axios"

export const getDashboardData = async (auth: string): Promise<AxiosResponse<any> | 'Failed'> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });;
      return response;
    } catch (error) {
      return 'Failed';
    }
  };


export const getTotalUSDTSpent = async (address : string, auth : string) : Promise<AxiosResponse<any> | 'Failed' > => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}presale/usdtTransfer?address=${address}` , {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            Authorization: `Bearer ${auth}`,
          }
        });
        return response;
    } catch (error) {
        return 'Failed';
    }
}
  

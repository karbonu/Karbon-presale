import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';


type SocialAuthData = {
    token: string;
    unique_id: string;
    email: string;
    phone: string;
    medium: string;
    id_token: string;
    ref_code: string;
  };
  
  export const useSocialAuthMutation = (): UseMutationResult<AxiosResponse<any>, Error, SocialAuthData> => {
    return useMutation<AxiosResponse<any>, Error, SocialAuthData>({
      mutationFn: (data: SocialAuthData) => {
        return axios.post(import.meta.env.VITE_BACKEND_API_URL +'auth/social-register', data);
      },
    });
  };
  
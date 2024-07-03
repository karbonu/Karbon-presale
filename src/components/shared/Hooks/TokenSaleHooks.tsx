import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Fetch presale progress
const fetchPresaleProgress = async () => {
  try {
    const response = await axios.get('https://karbon.plana.ng/presale/progress');
    return response.data;
  } catch (error) {
    return { progress: 50 }; // Set progress to 50 if there's an error
  }
};

// Fetch user investment data
const fetchUserInvestment = async (userID: string) => {
  try {
    const response = await axios.get(`https://karbon.plana.ng/presale/investment/${userID}`);
    return response.data;
  } catch (error) {
    return { amountSpent: 0 }; // Default value if there's an error
  }
};

// Fetch USDT transfer data
const fetchUSDTTransfer = async (address: string) => {
  try {
    const response = await axios.get(`https://karbon.plana.ng/presale/usdtTransfer?address=${address}`);
    return response.data;
  } catch (error) {
    return { amountSpent: 0 }; // Default value if there's an error
  }
};

// Fetch referrals data
const fetchReferrals = async (userID: string) => {
  try {
    const response = await axios.get(`https://karbon.plana.ng/referrals/${userID}`);
    return response.data;
  } catch (error) {
    return { totalReferrals: 0 }; // Default value if there's an error
  }
};

// Custom hooks using TanStack Query
export const usePresaleProgress = () => {
  return useQuery({
    queryKey: ['presaleProgress'],
    queryFn: fetchPresaleProgress
  });
};

export const useUserInvestment = (userID: string) => {
  return useQuery({
    queryKey: ['userInvestment', userID],
    queryFn: () => fetchUserInvestment(userID)
  });
};

export const useUSDTTransfer = (address: string) => {
  return useQuery({
    queryKey: ['usdtTransfer', address],
    queryFn: () => fetchUSDTTransfer(address)
  });
};

export const useReferrals = (userID: string) => {
  return useQuery({
    queryKey: ['referrals', userID],
    queryFn: () => fetchReferrals(userID)
  });
};

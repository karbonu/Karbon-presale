// src/components/BuyWithCreditCard.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/components/shared/Contexts/AuthContext.tsx';
import BackArrow from '@/components/Icons/BackArrow.tsx';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CreditCardlogo from '@/components/Icons/CreditCardlogo';

interface VerifyPaymentData {
  orderID: string;
  userID: string;
  amount: string;
}

type ContributeData = {
  amount: number;
  walletAddress: string;
  userId: string;
  txHash: string;
  presaleId: string;
  paymentMethod: string;
};

type InvestmentData = {
  userId: string;
  amount: number;
  txHash: string;
  paymentMethod: string;
};

const useContributeMutation = (): UseMutationResult<AxiosResponse<any>, Error, ContributeData> => {
  return useMutation<AxiosResponse<any>, Error, ContributeData>({
    mutationFn: (data: ContributeData) => {
      console.log(data);
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/contribute`, data);
    },
  });
};

const useCreateInvestment = (): UseMutationResult<AxiosResponse<any>, Error, InvestmentData> => {
  return useMutation<AxiosResponse<any>, Error, InvestmentData>({
    mutationFn: (data: InvestmentData) => {
      console.log(data);
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment`, data);
    },
  });
};

const Button = React.memo(({  onOrderCreate, onOrderApprove }: { 
  amount: any, 
  onOrderCreate: (data: any, actions: any) => Promise<string>,
  onOrderApprove: (data: any, actions: any) => Promise<void>
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = useMemo(() => ({
    style: { layout: "vertical" },
    createOrder: onOrderCreate,
    onApprove: onOrderApprove
  }), [onOrderCreate, onOrderApprove]);

  return (
    <>
      {isPending ? <h2>Load Smart Payment Button...</h2> : null}
      <PayPalButtons fundingSource={"card"} {...paypalbuttonTransactionProps} />
    </>
  );
});

const BuyWithCreditCard = (props: any) => {
  const [amount, setAmount] = useState<string>('');
  const { UserID } = useAuth();
  const { address } = useAccount();

  const paypalScriptOptions: ReactPayPalScriptOptions = {
    "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD"
  };

  const verifyPayment = async (data: VerifyPaymentData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}payment/verify-payment`, data);
    return response.data;
  };

  const contributeMutation = useContributeMutation();
  const investmentMutate = useCreateInvestment();

  const mutationOptions = {
    mutationFn: verifyPayment,
    onSuccess: (data: any) => {
      console.log(data);
      
      contributeMutation.mutate(
        { 
          amount: Number(amount),
          walletAddress: address as string,
          userId: UserID,
          txHash: "",
          presaleId: 'cly9asr6e0000tbafsf3w764u',
          paymentMethod: 'Card', 
        },
        {
          onSuccess: (response: any) => {
            console.log(response);
            
            investmentMutate.mutate(
              { 
                amount: Number(amount),
                userId: UserID,
                txHash: "",
                paymentMethod: 'Card', 
              },
              {
                onSuccess: (response: any) => {
                  console.log(response);
                  console.log("SUCCESS");
                },
                onError: (error) => {
                  console.log(error);
                  console.log("ERROR");
                }
              }
            );
          },
          onError: (error) => {
            console.log(error);
            console.log("ERROR");
          }
        }
      );
      alert("Payment verified successfully: " + JSON.stringify(data));
    },
    onError: (error: any) => {
      console.log(error);
      alert("Payment verification failed: " + error.message);
    }
  };
  
  const mutation = useMutation(mutationOptions);

  const createOrder = useCallback((data: any, actions: any) => {
    console.log("Creating order with amount:", amount);
    console.log(data)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount
          }
        }
      ]
    });
  }, [amount]);

  const onApprove = useCallback((data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log("Order captured:", details);
      const orderID = data.orderID;
      mutation.mutate({ orderID, userID: UserID, amount });
    });
  }, [UserID, amount, mutation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <div className="w-full flex items-center px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
        <div className="flex flex-row items-center justify-between">
          <div onClick={() => props.setSelectedMethod(0)} className="flex cursor-pointer flex-row items-center justify-center space-x-1">
            <BackArrow />
            <p className="text-white text-[12px]">Back</p>
          </div>
          <div className="flex flex-row pl-5 items-center space-x-2">
            <CreditCardlogo/>
            <p className="text-white text-[14px]">Buy with Credit Card</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-5 items-center justify-center space-y-5">
        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
          <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">You Buy</p>
            <div className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
              <input
                id="buyInput"
                type="text"
                value={amount}
                onChange={handleInputChange}
                className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none"
              />
              <p className="text-white text-[12px] opacity-70">USD</p>
            </div>
          </label>
        </div>
        <Dialog>
          <DialogTrigger>
            <button className='py-2 px-5 bg-transparent border-[1px] border-white text-white rounded-md text-[14px] hover:text-[#08E04A] hover:border-[#08E04A] transition ease-in-out'>Pay with Credit Card</button>
          </DialogTrigger>
          <DialogContent className='flex items-center justify-center bg-white w-[70%] py-20'>
            <Button 
              amount={amount} 
              onOrderCreate={createOrder} 
              onOrderApprove={onApprove} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </PayPalScriptProvider>
  );
};

export default BuyWithCreditCard;

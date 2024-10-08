// src/components/BuyWithPaypal.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/shared/Contexts/AuthContext.tsx';
import BackArrow from '@/components/Icons/BackArrow.tsx';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import PaypalLogo from '@/components/Icons/PaypalLogo.tsx';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { BarLoader } from 'react-spinners';
import { Separator } from '@/components/ui/separator';
import UpArrow from '@/components/Icons/UpArrow';
import DialogClose from '@/components/Icons/DialogClose';
import USDTIconRounded from '@/components/Icons/USDTIconRounded';
import ForwardGreen from '@/components/Icons/ForwardGreen';
import KarbonIcon from '@/components/Icons/KarbonIcon';
import { useTranslation } from 'react-i18next';

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

export const useContributeMutation = (auth: string): UseMutationResult<AxiosResponse<any>, Error, ContributeData> => {
  return useMutation<AxiosResponse<any>, Error, ContributeData>({
    mutationFn: (data: ContributeData) => {
      // console.log("Here is the data");
      // console.log(data);
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/contribute`, data, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        }
      });
    },
  });
};

export const useCreateInvestment = (auth: string): UseMutationResult<AxiosResponse<any>, Error, InvestmentData> => {
  return useMutation<AxiosResponse<any>, Error, InvestmentData>({
    mutationFn: (data: InvestmentData) => {
      // console.log("Investment Data ", data);
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment`, data, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        }
      });
    },
  });
};
const generateSimpleHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16); // Convert to hexadecimal
};

const Button = React.memo(({ onOrderCreate, onOrderApprove, onOrderCancel }: {
  amount: any,
  onOrderCreate: (data: any, actions: any) => Promise<string>,
  onOrderApprove: (data: any, actions: any) => Promise<void>,
  onOrderCancel: () => void,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();


  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = useMemo(() => ({
    style: { layout: "vertical" },
    createOrder: onOrderCreate,
    onApprove: onOrderApprove,
    onCancel: onOrderCancel,
  }), [onOrderCreate, onOrderApprove, onOrderCancel]);

  return (
    <>
      {isPending ? <h2 className='text-white'>Load Smart Payment Button...</h2> : null}
      <PayPalButtons fundingSource={"paypal"} {...paypalbuttonTransactionProps} />
    </>
  );
});

const BuyWithPaypal = (props: any) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const { UserID, presaleID, accessToken } = useAuth();
  const { address } = useAccount();
  const [contributionLoading, setContributionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [recievingValue, setRecievingValue] = useState(0);
  const [orderCreated, setOrderCreated] = useState(false);

  const paypalScriptOptions: ReactPayPalScriptOptions = {
    "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD"
  };

  const verifyPayment = async (data: VerifyPaymentData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}payment/verify-payment`, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    return response.data;
  };

  const contributeMutation = useContributeMutation(accessToken);
  const investmentMutate = useCreateInvestment(accessToken);

  const mutationOptions = {
    mutationFn: verifyPayment,
    onSuccess: (data: any) => {
      console.log(data);
    },
    onError: (error: any) => {
      console.log(error);
    }
  };

  const mutation = useMutation(mutationOptions);

  const createOrder = useCallback((data: any, actions: any) => {

    setOrderCreated(true);
    // console.log("Creating order with amount:", amount);
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
    setContributionLoading(true);
    return actions.order.capture().then((details: any) => {
      // console.log("Order captured:", details);
      const orderID = data.orderID;

      // Generate a simple hash based on order details
      const hashInput = `${orderID}${details.payer.email_address}${details.purchase_units[0].amount.value}${Date.now()}`;
      const txHash = generateSimpleHash(hashInput);

      console.log("Generated txHash:", txHash);

      mutation.mutate({ orderID, userID: UserID, amount });

      contributeMutation.mutate(
        {
          amount: Number(amount),
          walletAddress: address as string || "",
          userId: UserID as string || "",
          txHash: txHash,
          presaleId: presaleID as string || "",
          paymentMethod: 'PayPal',
        },
        {
          onSuccess: () => {
            // console.log(response.data);
            setAmount('');
            setIsModalOpen(false);
            setRecievingValue(0);
            investmentMutate.mutate(
              {
                amount: Number(amount),
                userId: UserID as string || "",
                txHash: txHash,
                paymentMethod: 'PayPal',
              },
              {
                onSuccess: () => {
                  setOrderCreated(false);
                  // console.log(response.data);
                  setContributionLoading(false);
                  setAmount('');
                  setRecievingValue(0);
                  setIsModalOpen(false);
                  toast({
                    variant: "success",
                    title: t('success'),
                    description: t('contributionSuccess'),
                  });
                },
                onError: () => {
                  // console.log(error);
                  // console.log("ERROR");
                  setContributionLoading(false);
                  setAmount('');
                  setRecievingValue(0);
                  setIsModalOpen(false);
                  toast({
                    variant: "failure",
                    title: t('error'),
                    description: t('contributionFailed'),
                  });
                }
              }
            );
          },
          onError: () => {
            // console.log(error);
            setContributionLoading(false);
            // console.log("ERROR");
            setAmount('');
            setRecievingValue(0);
            setIsModalOpen(false);
            toast({
              variant: "failure",
              title: t('error'),
              description: t('contributionFailed'),
            });
          }
        }
      );
    });
  }, [UserID, amount, mutation, contributeMutation, investmentMutate, address, presaleID]);

  const onCancel = useCallback(() => {
    // console.log("Order was cancelled.");
    setContributionLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setRecievingValue(Number(e.target.value) * rate);
    // console.log(recievingValue);
  };

  const handlePay = () => {
    if (Number(amount) === 0) {
      toast({
        variant: "failure",
        title: t('error'),
        description: t('enterAmount'),
      });
    } else {
      setContributionLoading(true);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('salerate');
    if (storedValue != null) {
      const rate_ = parseInt(storedValue, 10);
      setRate(rate_);
      // console.log(rate_);
    }
  }, []);


  useEffect(() => {
    if (!isModalOpen && !orderCreated) {
      setContributionLoading(false);
    }
  }, [isModalOpen, orderCreated]);



  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <div className="w-full flex items-center max-sm:mt-[-1rem] px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
        <div className="flex flex-row items-center justify-between w-[213px] ">
          <div onClick={() => props.setSelectedMethod(0)} className="flex cursor-pointer flex-row items-center justify-center space-x-1">
            <BackArrow />
            <p className="text-white text-[12px]">{t('back')}</p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <PaypalLogo />
            <p className="text-white text-[14px]">{t('buyWithPaypal')}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-5 items-center justify-center space-y-5">
        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
          <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">{t('youBuy')}</p>
            <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
              <input
                id="buyInput"
                type="number"
                value={amount}
                onChange={handleInputChange}
                className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none"
              />
              <p className="text-white text-[12px] opacity-70">USD</p>
            </div>
          </label>
        </div>

        <div className="flex rotate-[180deg] w-full items-center justify-center">
          <UpArrow />
        </div>

        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
          <label htmlFor="getOutput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">{t('youGet')}</p>
            <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
              <p className='h-full text-white w-[75%]'>{recievingValue === 0 ? '' : recievingValue}</p>
              <p className="text-white text-[12px] opacity-70">KARBON</p>
            </div>
          </label>
        </div>


        <button disabled={contributionLoading} onClick={() => handlePay()} className='flex items-center font-bold text-[14px] justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer'>
          {contributionLoading ? (
            <BarLoader color='black' />
          ) : (
            t('payWithPaypal')
          )}
        </button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>

          <DialogContent className='flex items-center justify-center w-[412px] bg-[#121212] border-[1px] border-[#282828] max-sm:w-[95%] p-10 max-sm:py-7 max-sm:px-5 flex-col space-y-10'>
            <div className='flex flex-row w-full justify-between items-center'>
              <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">{t('confirmContribution')}</p>
              <div onClick={() => setIsModalOpen(false)} className=' cursor-pointer'>
                <DialogClose />
              </div>
            </div>

            <div className='bg-black rounded-[8px] flex flex-col w-full'>
              <div className='flex flex-row items-center p-5 justify-between w-full'>
                <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">{amount}</p>
                <div className='flex flex-row items-center space-x-2'>
                  <p className="text-white font-thin text-[16px] max-sm:text-[14px]">USDT</p>
                  <USDTIconRounded />
                </div>
              </div>

              <div className='flex px-5 space-x-5 flex-row w-full items-center justify-center'>
                <Separator className='bg-[#282828] flex-1 flex h-[1px]' />
                <div className=' rotate-90'>
                  <ForwardGreen />
                </div>
                <Separator className='bg-[#282828] flex-1 flex h-[1px]' />
              </div>

              <div className='flex flex-row items-center p-5 justify-between w-full'>
                <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">{recievingValue}</p>
                <div className='flex flex-row items-center space-x-2'>
                  <p className="text-white font-thin text-[16px] max-sm:text-[14px]">KARBON</p>
                  <KarbonIcon />
                </div>
              </div>
            </div>

            <div className='w-full flex items-center justify-center'>
              <p className='text-center text-white text-[12px] max-sm:text-[10px] w-[248px]'>{t('outputEstimated')}</p>
            </div>


            <div className='bg-black rounded-[8px] border-[#484848] border-[0.5px] flex flex-col w-full'>
              <div className='flex flex-row items-center p-5 justify-between w-full'>
                <p className="text-white font-semibold text-[12px] max-sm:text-[10px]">{t('price')}</p>
                <div className='flex flex-row items-center space-x-2'>
                  <p className="text-white  text-[12px] max-sm:text-[10px]">{rate} KARBON/USDT</p>
                </div>
              </div>
            </div>


            <Button
              amount={amount}
              onOrderCreate={createOrder}
              onOrderApprove={onApprove}
              onOrderCancel={onCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PayPalScriptProvider>
  );
};

export default BuyWithPaypal;

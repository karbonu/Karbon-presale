// src/components/BuyWithCreditCard.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/shared/Contexts/AuthContext.tsx';
import BackArrow from '@/components/Icons/BackArrow.tsx';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields } from "@paypal/react-paypal-js";
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
import CreditCardlogo from '@/components/Icons/CreditCardlogo';

// interface VerifyPaymentData {
//   orderID: string;
//   userID: string;
//   amount: string;
// }

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


const BuyWithCreditCard = (props: any) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const { UserID, presaleID, accessToken } = useAuth();
  const { address } = useAccount();
  const [contributionLoading, setContributionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [recievingValue, setRecievingValue] = useState(0);
  const [clientToken, setClientToken] = useState<string | null>(null);

  const paypalScriptOptions = {
    "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    components: "hosted-fields"
  };

  const contributeMutation = useContributeMutation(accessToken);
  const investmentMutate = useCreateInvestment(accessToken);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setRecievingValue(Number(value) * rate);
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
    }

    const fetchClientToken = async () => {
      try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/identity/generate-token`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_PAYPAL_CLIENT_SECRET}`,
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        setClientToken(data.client_token);
      } catch (error) {
        console.error("Failed to fetch client token:", error);
      }
    };

    fetchClientToken();
  }, []);

  const createOrder = useCallback(() => {
    return fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_PAYPAL_CLIENT_SECRET}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      }),
    })
      .then(res => res.json())
      .then(order => order.id);
  }, [amount]);

  const onApprove = useCallback((data: any) => {
    setContributionLoading(true);
    return fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_PAYPAL_CLIENT_SECRET}`
      },
    })
      .then(res => res.json())
      .then(details => {
        const txHash = generateSimpleHash(`${data.orderID}${details.payer.email_address}${amount}${Date.now()}`);

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
              investmentMutate.mutate(
                {
                  amount: Number(amount),
                  userId: UserID as string || "",
                  txHash: txHash,
                  paymentMethod: 'PayPal',
                },
                {
                  onSuccess: () => {
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
      });
  }, [amount, UserID, presaleID, address, contributeMutation, investmentMutate]);

  const SubmitPayment = () => {
    const { cardFields } = usePayPalHostedFields();
    const cardHolderName = React.useRef<HTMLInputElement>(null);

    const submitHandler = () => {
      if (typeof cardFields?.submit !== "function") return;
      cardFields
        .submit({
          cardholderName: cardHolderName?.current?.value,
        })
        .then(data => onApprove(data))
        .catch((error) => {
          console.log(error);
          toast({
            variant: "failure",
            title: t('error'),
            description: t('paymentFailed'),
          });
        });
    };

    return (
      <button onClick={submitHandler} className="py-2 px-5 bg-transparent border-[1px] border-white text-white rounded-md text-[14px] hover:text-[#08E04A] hover:border-[#08E04A] transition ease-in-out">
        {t('payWithCard')}
      </button>
    );
  };

  return (
    <PayPalScriptProvider options={{ ...paypalScriptOptions, "data-client-token": clientToken }}>
      <div className="w-full flex items-center max-sm:mt-[-1rem] px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
        <div className="flex flex-row items-center justify-between md:w-[223px] max-sm:w-full">
          <div onClick={() => props.setSelectedMethod(0)} className="flex cursor-pointer max-sm:hidden flex-row items-center justify-center space-x-1">
            <BackArrow />
            <p className="text-white text-[12px]">{t('back')}</p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <CreditCardlogo />
            <p className="text-white text-[14px]">{t('buyWithCreditCard')}</p>
          </div>

          <div className=' md:hidden rotate-[270deg]'>
            <BackArrow />
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

        <button disabled={contributionLoading} onClick={() => handlePay()} className='py-2 px-5 bg-transparent border-[1px] border-white text-white rounded-md text-[14px] hover:text-[#08E04A] hover:border-[#08E04A] transition ease-in-out'>
          {contributionLoading ? (
            <BarLoader color='white' />
          ) : (
            t('payWithPaypal')
          )}
        </button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>

          <DialogContent className='flex items-center justify-center w-[412px] bg-[#121212] max-sm:w-[70%] p-10 max-sm:py-7 max-sm:px-5 flex-col space-y-10'>
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

            {clientToken && (
              <PayPalHostedFieldsProvider
                createOrder={createOrder}
              //clientToken={clientToken}
              >
                <div style={{ marginTop: "4px", marginBottom: "4px" }}>
                  <PayPalHostedField
                    id="card-number"
                    hostedFieldType="number"
                    options={{
                      selector: "#card-number",
                      placeholder: "Card Number",
                    }}
                    className="w-full bg-black border-[0.5px] border-[#484848] h-[48px] text-white p-2"
                  />
                  <div className="flex justify-between mt-2">
                    <PayPalHostedField
                      id="expiration-date"
                      hostedFieldType="expirationDate"
                      options={{
                        selector: "#expiration-date",
                        placeholder: "Expiration Date",
                      }}
                      className="w-[48%] bg-black border-[0.5px] border-[#484848] h-[48px] text-white p-2"
                    />
                    <PayPalHostedField
                      id="cvv"
                      hostedFieldType="cvv"
                      options={{
                        selector: "#cvv",
                        placeholder: "CVV",
                      }}
                      className="w-[48%] bg-black border-[0.5px] border-[#484848] h-[48px] text-white p-2"
                    />
                  </div>
                  <input
                    id="card-holder"
                    type="text"
                    placeholder="Name on Card"
                    className="w-full mt-2 bg-black border-[0.5px] border-[#484848] h-[48px] text-white p-2"
                  />
                  <SubmitPayment />
                </div>
              </PayPalHostedFieldsProvider>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PayPalScriptProvider>
  );
};

export default BuyWithCreditCard;

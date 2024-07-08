import { useEffect, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { BarLoader } from 'react-spinners';
import BoughtTokensSuccess from '@/components/shared/BoughtTokensSuccess';
import { USDTABI } from '@/components/shared/Constants/TokenABI';
import { BuyAddress, USDTAddress } from '@/components/shared/Constants/Addresses.ts';
import { BUYABI } from '@/components/shared/Constants/BuyABI.ts';
import ForwardGreen from '@/components/Icons/ForwardGreen';
import DialogClose from '@/components/Icons/DialogClose';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BackArrow from '@/components/Icons/BackArrow';
import USDTIcon from '@/components/Icons/USDTIcon';
import UpArrow from '@/components/Icons/UpArrow';
import BoughtTokensFailed from '@/components/shared/BoughtTokensFailed';
import { useAuth } from '@/components/shared/Contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type ContributeData = {
    amount: number;
    walletAddress: string;
    userId: string;
    txHash: string;
    presaleId: string;
    paymentMethod: string;
};

const useContributeMutation = (): UseMutationResult<AxiosResponse<any>, Error, ContributeData> => {
    return useMutation<AxiosResponse<any>, Error, ContributeData>({
        mutationFn: (data: ContributeData) => {
            return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/contribute`, data);
        },
    });
};

type investmentData = {
    userId: string;
    amount: number;
    txHash: string;
    paymentMethod: string;
  };
  

const useCreateInvestment = (): UseMutationResult<AxiosResponse<any>, Error, investmentData> => {
    return useMutation<AxiosResponse<any>, Error, investmentData>({
      mutationFn: (data: investmentData) => {
        console.log(data)
        return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment`, data);
      },
    });
  };
  

const BuyWithUSDT = (props: any) => {
    const { toast } = useToast();
    const [tokenAmount, setTokenAmount] = useState(0);
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const [isApproved, setIsApproved] = useState(false);
    const { UserID, presaleID } = useAuth();
    const { data: hash, error, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isFailed } = useWaitForTransactionReceipt({ hash });
    const { data: balance } = useReadContract({
        abi: USDTABI,
        address: USDTAddress,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
    });
    const [isBuySuccessModalOpen, setIsBuySuccessModalOpen] = useState(false);
    const [isBuyFailedModalOpen, setIsBuyFailedModalOpen] = useState(false);
    const contributeMutation = useContributeMutation();
    const investmentMutate = useCreateInvestment();
    const [fullTransaction, setFulltransaction] = useState(false)

    async function handleBuy() {
        if (!isConnected) {
            open();
        } else {
            writeContract({
                address: BuyAddress,
                abi: BUYABI,
                functionName: 'buyTokens',
                args: [BigInt(tokenAmount * 10 ** 18)],
            });
            setFulltransaction(true);
            // if (isApproved) {
            
            // } else {
            //     writeContract({
            //         address: USDTAddress,
            //         abi: USDTABI,
            //         functionName: 'approve',
            //         args: [BuyAddress, BigInt(tokenAmount * 10 ** 18)],
            //     });
                
            // }
        }
    }

    useEffect(() => {
        if (isConfirmed && fullTransaction) {
            setIsBuySuccessModalOpen(true);
            setIsApproved(false);

            contributeMutation.mutate(
                {
                    amount: tokenAmount,
                    walletAddress: address as string || "",
                    userId: UserID as string || "",
                    txHash: hash as string ||"",
                    presaleId: presaleID as string || "",
                    paymentMethod: 'USDT',
                },
                {
                    onSuccess: (response: any) => {
                        console.log(response);
                        investmentMutate.mutate(
                            { 
                              amount: tokenAmount,
                              userId: UserID as string || "",
                              txHash: hash as string || "",
                              paymentMethod: 'USDT', 
                             },
                            {
                                onSuccess: (response: any) => {
                                  console.log(response)
                                  toast({
                                    title: "Success!",
                                    description: "Your contribution was successfull",
                                  })
                                  console.log("SUCCESS")
                                },
                                onError: (error) => {
                                    console.log(error);
                                    console.log("ERROR")
                                }
                            }
                          );
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                }
            );

            setFulltransaction(false);
        } else if (isFailed && fullTransaction) {
            setIsBuyFailedModalOpen(true);
            console.log(error);
        }

        if(isConfirmed && !fullTransaction){
            setIsApproved(true);
        }

    }, [isConfirmed, fullTransaction, isFailed]);

    return (
        <div className='w-full space-y-5 flex flex-col'>
            <Dialog open={props.isDialogOpen} onOpenChange={props.setIsDialogOpen}>
                <DialogContent className='bg-[#101010] border-[#282828] pb-5 py-10 px-10 flex flex-col w-[412px] max-sm:w-[90%] items-center justify-center rounded-[16px] outline-none'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p className="text-white font-semibold text-[20px]">Disclaimer</p>
                        <div onClick={() => props.setIsDialogOpen(false)} className='cursor-pointer '>
                            <DialogClose />
                        </div>
                    </div>

                    <div className="w-full py-5 flex flex-col space-y-5 items-center justify-center">
                        <div className="opacity-70 flex flex-col space-y-5">
                            <p className="text-[14px] text-white">By participating in the Karbon token seed sale, you acknowledge that tokens are sold at a discounted price, 50% of the launch price</p>
                            <p className="text-[14px] text-white">Additionally, there is a 6-month vesting period before seed investors can start claiming tokens. Please be aware of the risks involved in cryptocurrency investments, including market volatility and regulatory uncertainties</p>
                            <p className="text-[14px] text-white">Karbon Finance does not guarantee any returns or profits from token purchases. We recommend conducting thorough research and seeking advice from financial professionals before investing. Karbon Finance reserves the right to amend or cancel the token sale at any time without prior notice</p>
                        </div>

                        <div onClick={() => props.setIsDialogOpen(false)} className="bg-black w-full h-[64px] flex flex-row items-center justify-center cursor-pointer border-[#08E04A] transition ease-in-out text-[#08E04A] text-[14px] font-bold hover:text-[#08E04A] rounded-[4px] border-r-[1px] ">
                            <div className='pr-4'>
                                <ForwardGreen />
                            </div>
                            Continue to Buy
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="w-full flex items-center px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
                <div className="flex flex-row items-center justify-between w-[213px]">
                    <div onClick={() => props.setSelectedMethod(0)} className="flex cursor-pointer flex-row items-center justify-center space-x-1">
                        <BackArrow />
                        <p className="text-white text-[12px]">Back</p>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <USDTIcon />
                        <p className="text-white text-[14px]">Buy with USDT</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row w-full items-center justify-between">
                <p className="text-white text-[12px]">Amount</p>
                <div className="flex flex-row items-center space-x-1">
                    <p className="text-white text-[12px] opacity-70">Wallet Balance</p>
                    <p className="text-white text-[12px]">{Number(balance)?.toFixed(2)}</p>
                </div>
            </div>

            <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
                <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
                    <p className="text-white text-[12px]">You Buy</p>
                    <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                    <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                        <input id="buyInput" type="number" onChange={(e) => setTokenAmount(Number(e.target.value))} className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none" />
                        <p className="text-white text-[12px] opacity-70">USDT</p>
                    </div>
                </label>
            </div>

            <div className="flex rotate-[180deg] w-full items-center justify-center">
                <UpArrow />
            </div>

            <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
                <label htmlFor="getOutput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
                    <p className="text-white text-[12px]">You Get</p>
                    <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                    <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                        <p className='h-full w-[75%]'></p>
                        <p className="text-white text-[12px] opacity-70">KARBON</p>
                    </div>
                </label>
            </div>

            <button disabled={isPending || isConfirming} onClick={handleBuy} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                <p className="font-bold text-[14px] shadow-sm">
                    {isConnected ? (
                        <>
                            {(isPending || isConfirming) ? (
                                <BarLoader />
                            ) : (
                                <>
                                    {!isApproved ? (
                                        "Approve"
                                    ) : (
                                        "Buy"
                                    )}
                                </>
                            )}
                        </>
                    ) : "Connect Wallet"}
                </p>
            </button>

            <BoughtTokensSuccess
                isDialogOpen={isBuySuccessModalOpen}
                setIsDialogOpen={setIsBuySuccessModalOpen}
                boughtAmount={tokenAmount}
            />

            <BoughtTokensFailed
                isDialogOpen={isBuyFailedModalOpen}
                setIsDialogOpen={setIsBuyFailedModalOpen}
            />
        </div>
    );
};

export default BuyWithUSDT;

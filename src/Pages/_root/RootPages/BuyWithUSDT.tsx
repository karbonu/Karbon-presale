"use-client"
import { useEffect, useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
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
import { parseUnits } from 'viem';
import KarbonIcon from '@/components/Icons/KarbonIcon';
import USDTIconRounded from '@/components/Icons/USDTIconRounded';
import USDTIconBig from '@/components/Icons/USDTIconBig';
import ConfirmSwapIcon from '@/components/Icons/ConfirmSwapIcon';
import RingLoader from '@/components/Icons/RingLoader';

type ContributeData = {
    amount: number;
    walletAddress: string;
    userId: string;
    txHash: string;
    presaleId: string;
    paymentMethod: string;
};

type investmentData = {
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

export const useCreateInvestment = (auth: string): UseMutationResult<AxiosResponse<any>, Error, investmentData> => {
    return useMutation<AxiosResponse<any>, Error, investmentData>({
        mutationFn: (data: investmentData) => {
            // console.log("Investment Data ", data);
            return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment`, data, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                }
            });
        },
    });
};

const BuyWithUSDT = (props: any) => {
    const { toast } = useToast();
    const [tokenAmount, setTokenAmount] = useState(0);
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const { UserID, presaleID, accessToken } = useAuth();
    const { data: hash, writeContractAsync } = useWriteContract();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [deflector, setDeflector] = useState(0);

    const { isSuccess: isConfirmed, isError: isFailed } = useWaitForTransactionReceipt({ hash });
    const { data: balance } = useReadContract({
        abi: USDTABI,
        address: USDTAddress,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
    });
    const [isBuySuccessModalOpen, setIsBuySuccessModalOpen] = useState(false);
    const [isBuyFailedModalOpen, setIsBuyFailedModalOpen] = useState(false);
    const contributeMutation = useContributeMutation(accessToken);
    const investmentMutate = useCreateInvestment(accessToken);
    const [rate, setRate] = useState(0);
    const [isApproving, setIsApproving] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const handleApprove = async () => {
        setIsApproving(true);
        setStep(2);
        try {
            const amountInWei = parseUnits(tokenAmount.toString(), 18);
            await writeContractAsync({
                address: USDTAddress,
                abi: USDTABI,
                functionName: 'approve',
                args: [BuyAddress, amountInWei],
            });
        } catch (error) {
            // console.error("Approval error:", error);
            setIsApproving(false);
            setIsDialogOpen(false)
            setStep(1)
            toast({
                title: "Approval Failed",
                description: "There was an error during the approval process.",
                variant: "failure",
            });
        }
    };

    const handleBuy = async () => {
        setIsBuying(true);
        try {
            const amountInWei = parseUnits(tokenAmount.toString(), 18);
            await writeContractAsync({
                address: BuyAddress,
                abi: BUYABI,
                functionName: 'buyTokens',
                args: [amountInWei],
            });
        } catch (error) {
            // console.error("Buy error:", error);
            setIsBuying(false);
            setIsDialogOpen(false)
            setStep(1)
            toast({
                title: "Buy Failed",
                description: "There was an error during the buy process.",
                variant: "failure",
            });
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            if (isApproving) {

                setIsApproving(false);
                toast({
                    title: "Approval Successful",
                    description: "Purchasing Now.",
                    variant: "success",
                });
                setStep(3);
                handleBuy();
            } else if (isBuying) {
                setDeflector(tokenAmount * rate)
                setIsBuying(false);
                contributeMutation.mutate(
                    {
                        amount: tokenAmount,
                        walletAddress: address as string || "",
                        userId: UserID as string || "",
                        txHash: hash as string || "",
                        presaleId: presaleID as string || "",
                        paymentMethod: 'USDT',
                    },
                    {
                        onSuccess: () => {
                            // console.log(response);
                            investmentMutate.mutate(
                                {
                                    amount: tokenAmount,
                                    userId: UserID as string || "",
                                    txHash: hash as string || "",
                                    paymentMethod: 'USDT',
                                },
                                {
                                    onSuccess: () => {
                                        // console.log(response);

                                        setTokenAmount(0);
                                        setIsDialogOpen(false);
                                        setIsBuySuccessModalOpen(true);
                                        setStep(1);
                                        toast({
                                            title: "Success!",
                                            description: "Your contribution was successful",
                                            variant: "success",
                                        });
                                        console.log("SUCCESS");
                                    },
                                    onError: () => {
                                        // console.log(error);
                                        setTokenAmount(0);
                                        setIsDialogOpen(false);
                                        setStep(1);
                                        // console.log("ERROR");
                                    }
                                }
                            );
                        },
                        onError: (error) => {
                            console.log(error);
                        },
                    }
                );
            }
        } else if (isFailed) {
            setIsBuyFailedModalOpen(true);
            setIsApproving(false);
            setIsBuying(false);
            // console.log(error);
            toast({
                title: "Transaction Failed",
                description: "The transaction failed. Please try again.",
                variant: "failure",
            });
        }
    }, [isConfirmed, isFailed]);

    useEffect(() => {
        const storedValue = localStorage.getItem('salerate');
        if (storedValue != null) {
            const rate_ = parseInt(storedValue, 10);
            setRate(rate_);
            // console.log(rate_)
        }
    }, []);

    const handleProceed = () => {
        if (isConnected) {
            setIsDialogOpen(true)
        } else {
            open();
        }
    }

    const handleDialogClose = () => {

    }

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

                        <div onClick={() => setStep(2)} className="bg-black w-full h-[64px] flex flex-row items-center justify-center cursor-pointer border-[#08E04A] transition ease-in-out text-[#08E04A] text-[14px] font-bold hover:text-[#08E04A] rounded-[4px] border-r-[1px] ">
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
                    <p className="text-white text-[12px]">{(Number(balance) / (10 ** 18))?.toFixed(2)}</p>
                </div>
            </div>

            <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
                <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
                    <p className="text-white text-[12px]">You Buy</p>
                    <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                    <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                        <input
                            id="buyInput"
                            type="number"
                            value={tokenAmount === 0 ? '' : tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none"
                        />
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
                        <p className='h-full text-white w-[75%]'>{(tokenAmount * rate) === 0 ? '' : (tokenAmount * rate)}</p>
                        <p className="text-white text-[12px] opacity-70">KARBON</p>
                    </div>
                </label>
            </div>

            <button onClick={handleProceed} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                <p className="font-bold text-[14px] shadow-sm">
                    {isConnected ? (
                        "Proceed"
                    ) : "Connect Wallet"}
                </p>
            </button>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className='flex items-center justify-center w-[412px] bg-[#121212] max-sm:w-[80%] p-7 max-sm:py-7 max-sm:px-5 flex-col space-y-5'>
                    {step === 1 && (
                        <>
                            <div className='flex flex-row w-full justify-between items-center'>
                                <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">Confirm Contribution</p>
                                <div onClick={() => { setIsDialogOpen(false); setStep(1); }} className=' cursor-pointer'>
                                    <DialogClose />
                                </div>
                            </div>

                            <div className='bg-black rounded-[8px] flex flex-col w-full'>
                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-bold text-[16px] max-sm:text-[14px]">{tokenAmount}</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white font-thin text-[16px] max-sm:text-[14px]">USDT</p>
                                        <USDTIconRounded />
                                    </div>
                                </div>

                                <div className='flex px-5 space-x-5 flex-row w-full items-center justify-between'>
                                    <Separator className='bg-[#282828] w-full flex-1 flex h-[1px]' />
                                    <div className=' rotate-90'>
                                        <ForwardGreen />
                                    </div>
                                    <Separator className='bg-[#282828] w-full flex-1 flex h-[1px]' />
                                </div>

                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">{tokenAmount * rate}</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white font-thin text-[16px] max-sm:text-[14px]">KARBON</p>
                                        <KarbonIcon />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-center'>
                                <p className='text-center text-white text-[12px] max-sm:text-[10px] w-[248px]'>Output is estimated, you will receive your token with a transaction fee taken.</p>
                            </div>

                            <div className='bg-black rounded-[8px] border-[#484848] border-[0.5px] flex flex-col w-full'>
                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-semibold text-[12px] max-sm:text-[10px]">Price</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white  text-[12px] max-sm:text-[10px]">{rate} KARBON/USDT</p>
                                    </div>
                                </div>

                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-semibold text-[12px] max-sm:text-[10px]">Fee</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white  text-[12px] max-sm:text-[10px]">0.018 ETH</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleApprove} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                <p className="font-bold text-[14px] shadow-sm">
                                    {isConnected ? (
                                        "Confirm Contribution"
                                    ) : "Connect Wallet"}
                                </p>
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className='flex flex-row w-full justify-end items-end'>
                                <div onClick={() => { setIsDialogOpen(false); setStep(1); }} className=' cursor-pointer'>
                                    <DialogClose />
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-center flex-col space-y-2'>
                                <USDTIconBig />
                                <p className="text-white font-semibold text-[20px] max-sm:text-[14px]">Approve USDT</p>
                            </div>

                            <div className='w-full flex items-center justify-center'>
                                <p className='text-white text-[12px] max-sm:text-[10px]'>Swapping through <span className='font-bold'>{address?.slice(0, 15)}...</span></p>
                            </div>

                            <div className='ringImage'>
                                <RingLoader />
                            </div>

                            <p className='text-white text-[12px] font-bold'>Proceed in your wallet</p>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className='flex flex-row w-full justify-end items-end'>
                                <div onClick={() => { setIsDialogOpen(false); setStep(1); }} className=' cursor-pointer'>
                                    <DialogClose />
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-center flex-col space-y-2'>
                                <ConfirmSwapIcon />
                                <p className="text-white font-semibold text-[20px] max-sm:text-[14px]">Confirm Swap</p>
                            </div>

                            <div className='w-full flex flex-col items-center space-y-2  justify-center '>
                                <div>
                                    <p className='text-white font-normal text-[12px]'>{tokenAmount} USDT</p>
                                </div>
                                <div className=' rotate-90'>
                                    <ForwardGreen />
                                </div>
                                <div>
                                    <p className='text-white font-bold text-[12px]'>{tokenAmount * rate} KARBON</p>
                                </div>
                            </div>
                            <div className='ringImage'>
                                <RingLoader />
                            </div>

                            <p className='text-white text-[12px] font-bold'>Proceed in your wallet</p>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <BoughtTokensSuccess
                isDialogOpen={isBuySuccessModalOpen}
                setIsDialogOpen={setIsBuySuccessModalOpen}
                boughtAmount={deflector}
            />

            <BoughtTokensFailed
                isDialogOpen={isBuyFailedModalOpen}
                setIsDialogOpen={setIsBuyFailedModalOpen}
            />
        </div>
    );
};

export default BuyWithUSDT;


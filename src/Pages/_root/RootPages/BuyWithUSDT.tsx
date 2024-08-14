"use-client"
import { useEffect, useState, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';


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
            return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}presale/investment`, data, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                }
            });
        },
    });
};

const BuyWithUSDT = (props: any) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const { UserID, presaleID, accessToken, hasDisplayedDisclaimet, setHasDisplayedDisclaimet } = useAuth();
    const { data: hash, writeContractAsync } = useWriteContract();
    const [step, setStep] = useState(1);
    const [deflector, setDeflector] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { isSuccess: isConfirmed, isError: isFailed } = useWaitForTransactionReceipt({ hash });
    const { data: balance } = useReadContract({
        abi: USDTABI,
        address: USDTAddress,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
    });

    const { data: minimumBuy } = useReadContract({
        abi: BUYABI,
        address: BuyAddress,
        functionName: 'minimumBuy',
    });

    const { data: maximumBuy } = useReadContract({
        abi: BUYABI,
        address: BuyAddress,
        functionName: 'maximumBuy',
    });

    const { data: spentUSDT } = useReadContract({
        abi: BUYABI,
        address: BuyAddress,
        functionName: 'spentUSDT',
        args: [address as `0x${string}`],
    });

    const [isBuySuccessModalOpen, setIsBuySuccessModalOpen] = useState(false);
    const [isBuyFailedModalOpen, setIsBuyFailedModalOpen] = useState(false);
    const contributeMutation = useContributeMutation(accessToken);
    const investmentMutate = useCreateInvestment(accessToken);
    const [rate, setRate] = useState<number>(0);
    const [isApproving, setIsApproving] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const handleWheel = (event: WheelEvent) => {
                event.preventDefault();
            };
            input.addEventListener('wheel', handleWheel);

            return () => {
                input.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);

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
            setIsApproving(false);
            setIsDialogOpen(false)
            setStep(1)
            toast({
                title: t('approvalFailed'),
                description: t('approvalError'),
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
            setIsBuying(false);
            setIsDialogOpen(false)
            setStep(1)
            toast({
                title: t('buyFailed'),
                description: t('buyError'),
                variant: "failure",
            });
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            if (isApproving) {
                setIsApproving(false);
                toast({
                    title: t('approvalSuccessful'),
                    description: t('purchasingNow'),
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
                            investmentMutate.mutate(
                                {
                                    amount: tokenAmount,
                                    userId: UserID as string || "",
                                    txHash: hash as string || "",
                                    paymentMethod: 'USDT',
                                },
                                {
                                    onSuccess: () => {
                                        setTokenAmount(0);
                                        setIsDialogOpen(false);
                                        setIsBuySuccessModalOpen(true);
                                        setStep(1);
                                        toast({
                                            title: t('success'),
                                            description: t('contributionSuccess'),
                                            variant: "success",
                                        });
                                    },
                                    onError: () => {
                                        setTokenAmount(0);
                                        setIsDialogOpen(false);
                                        setStep(1);
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
            toast({
                title: t('transactionFailedTitle'),
                description: t('transactionFailed'),
                variant: "failure",
            });
        }
    }, [isConfirmed, isFailed]);

    useEffect(() => {
        const storedValue = localStorage.getItem('salerate');
        if (storedValue != null) {
            const rate_ = parseInt(storedValue, 10);
            setRate(rate_);
        }
    }, []);

    useEffect(() => {
        const minBuy = minimumBuy ? Number(minimumBuy) / (10 ** 18) : 0;
        const maxBuy = maximumBuy ? Number(maximumBuy) / (10 ** 18) : 0;
        const spent = spentUSDT ? Number(spentUSDT) / (10 ** 18) : 0;

        let error = null;

        if (tokenAmount > maxBuy) {
            error = t('amountHigherThanMaximum', { maxBuy });
        } else if (spent + tokenAmount > maxBuy) {
            error = t('amountExceedsMaxAvailable');
        } else if (tokenAmount < minBuy && tokenAmount > 0) {
            error = t('amountLowerThanMinimum', { minBuy });
        } else if (maxBuy - spent === 0) {
            error = t('noAvailableTokens');
        }

        setErrorMessage(error);

    }, [tokenAmount, minimumBuy, maximumBuy, spentUSDT, t]);

    const handleProceed = () => {
        if (!isConnected) {
            open();
            return;
        }

        setIsDialogOpen(true);
    }

    const handleDialogClose = () => { }

    return (
        <div className='w-full space-y-5 flex flex-col'>
            <Dialog open={hasDisplayedDisclaimet} onOpenChange={setHasDisplayedDisclaimet}>
                <DialogContent className='bg-[#101010] border-[#282828] pb-5 py-10 max-sm:py-5 px-10 max-sm:px-5 flex flex-col w-[412px] max-sm:w-[95%] items-center justify-center rounded-[16px] outline-none'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p className="text-white font-semibold text-[20px]">{t('disclaimer')}</p>
                        <div onClick={() => setHasDisplayedDisclaimet(false)} className='cursor-pointer '>
                            <DialogClose />
                        </div>
                    </div>

                    <div className="w-full py-5 flex flex-col space-y-5 items-center justify-center">
                        <div className="opacity-70 flex flex-col space-y-5">
                            <p className="text-[14px] text-white">{t('participateAcknowledgement')}</p>
                            <p className="text-[14px] text-white">{t('vestingPeriodNotice')}</p>
                            <p className="text-[14px] text-white">{t('noGuaranteeNotice')}</p>
                        </div>

                        <div onClick={() => setHasDisplayedDisclaimet(false)} className="bg-black w-full h-[64px] flex flex-row items-center justify-center cursor-pointer border-[#08E04A] transition ease-in-out text-[#08E04A] text-[14px] font-bold hover:text-[#08E04A] rounded-[4px] border-r-[1px] ">
                            <div className='pr-4'>
                                <ForwardGreen />
                            </div>
                            {t('continueToBuy')}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="w-full flex items-center px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
                <div className="flex flex-row items-center justify-between max-sm:w-full ">
                    <div onClick={() => props.setSelectedMethod(0)} className="flex  max-sm:hidden cursor-pointer flex-row items-center justify-center space-x-1">
                        <BackArrow />
                        <p className="text-white text-[12px]">{t('back')}</p>
                    </div>
                    <div className="flex flex-row items-center md:px-5 space-x-2">
                        <USDTIcon />
                        <p className="text-white text-[14px]">{t('buyWithUsdt')}</p>
                    </div>
                    <div className=' md:hidden rotate-[270deg]'>
                        <BackArrow />
                    </div>
                </div>
            </div>
            <div className='flex flex-col space-y-2 items-center justify-center w-full'>
                <div className="flex flex-row w-full items-center justify-between">
                    <p className="text-white font-light text-[12px]">{t('walletBalance')}</p>
                    {isNaN(Number(balance)) ? (
                        <p className="text-white text-[12px] opacity-70">{t('connectWallet')}</p>
                    ) : (
                        <div className="flex flex-row items-center space-x-1">
                            <p className="text-white text-[12px]">{(Number(balance) / (10 ** 18))?.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
                <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
                    <p className="text-white text-[12px]">{t('youBuy')}</p>
                    <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                    <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                        <input
                            id="buyInput"
                            type="number"
                            ref={inputRef}
                            value={tokenAmount === 0 ? '' : tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none"
                        />
                        <button disabled={!isConnected} className="text-[#08E04A] text-[12px] opacity-70 cursor-pointer" onClick={() => setTokenAmount(maximumBuy ? Number(maximumBuy) / (10 ** 18) - Number(spentUSDT) / (10 ** 18) : 0)}>
                            {t('Max')}
                        </button>
                    </div>
                    <div className='flex flex-row items-center h-full space-x-3'>
                        <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                        <p className="text-white text-[12px] opacity-70">USDT</p>
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
                        <p className='h-full text-white w-[75%]'>{(tokenAmount * rate) === 0 ? '' : (tokenAmount * rate)}</p>
                    </div>
                    <div className='flex flex-row items-center h-full space-x-3'>
                        <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
                        <p className="text-white text-[12px] opacity-70">KARBON</p>
                    </div>
                </label>
            </div>

            <div className='flex flex-col items-center justify-center space-y-2'>
                <button
                    onClick={handleProceed}
                    className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer"
                    disabled={(errorMessage !== null && isConnected) || (tokenAmount === 0 && isConnected)}
                >
                    <p className=" font-semibold text-[14px] shadow-sm">
                        {isConnected ? t('proceed') : t('connectWallet')}
                    </p>
                </button>

                {errorMessage && (
                    <p className="text-red-500 text-[12px] mt-2">{errorMessage}</p>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className='flex items-center justify-center w-[412px] max-h-[517px] bg-[#121212] border-[1px] border-[#282828] max-sm:w-[80%] p-7 max-sm:py-7 max-sm:px-5 flex-col space-y-5'>
                    {step === 1 && (
                        <>
                            <div className='flex flex-row w-full justify-between items-center'>
                                <p className="text-white font-semibold text-[16px] max-sm:text-[14px]">{t('confirmContribution')}</p>
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
                                <p className='text-center text-white opacity-50 text-[12px] max-sm:text-[10px] w-[248px]'>{t('outputEstimated')}.</p>
                            </div>

                            <div className='bg-black rounded-[8px] border-[#484848] border-[0.5px] flex flex-col w-full'>
                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-semibold text-[12px] max-sm:text-[10px]">{t('price')}</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white  text-[12px] max-sm:text-[10px]">{rate} KARBON/USDT</p>
                                    </div>
                                </div>

                                <div className='flex flex-row items-center p-5 justify-between w-full'>
                                    <p className="text-white font-semibold text-[12px] max-sm:text-[10px]">{t('fee')}</p>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <p className="text-white  text-[12px] max-sm:text-[10px]">0.018 ETH</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleApprove} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                <p className="font-bold text-[14px] shadow-sm">
                                    {isConnected ? (
                                        t('confirmContribution')
                                    ) : t('connectWallet')}
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
                                <p className="text-white font-semibold text-[20px] max-sm:text-[14px]">{t('approveUsdt')}</p>
                            </div>

                            <div className='w-full flex items-center justify-center'>
                                <p className='text-white text-[12px] max-sm:text-[10px]'>{t('swappingThrough')} <span className='font-bold'>{address?.slice(0, 15)}...</span></p>
                            </div>

                            <div className='ringImage'>
                                <RingLoader />
                            </div>

                            <p className='text-white text-[12px] font-bold'>{t('proceedInWallet')}</p>
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
                                <p className="text-white font-semibold text-[20px] max-sm:text-[14px]">{t('confirmSwap')}</p>
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

                            <p className='text-white text-[12px] font-bold'>{t('proceedInWallet')}</p>
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

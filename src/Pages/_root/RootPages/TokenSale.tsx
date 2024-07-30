import CopyIcon from "@/components/Icons/CopyIcon.tsx";
import CreditCardlogo from "@/components/Icons/CreditCardlogo.tsx";
import DiscordLogo from "@/components/Icons/DiscordLogo.tsx";
import Dot from "@/components/Icons/Dot.tsx";
import ForwardIcon from "@/components/Icons/ForwardIcon.tsx";
import PaypalLogo from "@/components/Icons/PaypalLogo.tsx";
import TelegramLogo from "@/components/Icons/TelegramLogo.tsx";
import USDTLogoBig from "@/components/Icons/USDTLogoBig.tsx";
import UpArrow from "@/components/Icons/UpArrow.tsx";
import WhatsappLogo from "@/components/Icons/WhatsappLogo.tsx";
import XLogo from "@/components/Icons/XLogo.tsx";
import MetaTags from "@/components/shared/MetaTags.tsx"
import { useEffect, useState } from "react"
import { BarLoader, ClimbingBoxLoader } from "react-spinners";
import BuyWithUSDT from "./BuyWithUSDT.tsx";
import BuyWithCreditCard from "./BuyWithCreditCard.tsx";
import BuyWithPaypal from "./BuyWithPaypal.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import PayoutModalSuccess from "@/components/shared/PayoutModalSuccess.tsx";
import PayoutModalFaliure from "@/components/shared/PayoutModalFaliure.tsx";
import ConnectWalletIconBlack from "@/components/Icons/ConnectWalletIconBlack.tsx";
import DialogClose from "@/components/Icons/DialogClose.tsx";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog.tsx"
import ForwardShortGreen from '@/components/Icons/ForwardShortGreen.tsx'
import TermsAndCond from "@/components/shared/TermsAndCond.tsx";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from "wagmi";
import CheckMark from "@/components/Icons/CheckMark.tsx";
import { getTotalContribution, getTotalUSDSpent, getPresaleID, getUserReferrals } from "@/components/shared/Hooks/TokenSaleHooks.tsx";
import { useAuth } from "@/components/shared/Contexts/AuthContext.tsx";
import { useRequestPayoutMitate } from "@/components/shared/Hooks/UseRequestPayoutMutation.tsx";
import { isNaN } from "lodash";
import useCountUp from "@/components/shared/Hooks/UseCountUp.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import axios from "axios";
import useSocketIO from "@/components/shared/Constants/UseSocket.ts";
import { useTranslation } from "react-i18next";
import ForwardIconBlack from "@/components/Icons/ForwardIconBlack.tsx";
import BackIconGreen from "@/components/Icons/BackIconGreen.tsx";
import { useMediaQuery } from "@/components/shared/Hooks/UseMediaQuery.tsx";
import { Sheet, SheetContent } from "@/components/ui/sheet.tsx";


const TokenSale = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const [loading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [tempAmount, setTempAmount] = useState(0);
  const [payoutSuccessOpen, setPayoutSuccessOpen] = useState(false);
  const [payoutFaliure, setPayoutFaliure] = useState(false);
  const [isTermsAndCondOpen, setIsTermsAndCondOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [decimalTotalAmount, setDecimalTotalAmount] = useState(0);
  const [tokensBought, setTokensBought] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [fullTransaction, setFulltransaction] = useState(false);
  const { UserID, setHasDisplayedConnectModal, hasDisplayedConnectModal, setPresaleID, presaleID, accessToken } = useAuth();
  const [bonusAmount, setBonusAmount] = useState(0);
  const [bonusAmountRounded, setBonusAmountRounded] = useState(0);
  const payoutMitate = useRequestPayoutMitate(accessToken);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(!isConnected && !hasDisplayedConnectModal);
  const { open } = useWeb3Modal();
  const [referralID, setReferralID] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  // const [endDate, setEndDate] = useState('');
  // const [startDate, setStartDate] = useState('');
  const [target, setTarger] = useState(0);
  const [totalContribution, setTotalContribution] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [saleStatus, setSaleStatus] = useState(t('saleStartsIn'));
  const [saleRate, setSaleRate] = useState(0);
  const [totalBonusPending, setTotalBonusPending] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState(0);
  const [recievedAmountRounded, setRecievedAmountRounded] = useState(0);
  const [previousContribution, setPreviousContribution] = useState(0);
  const animatedContribution = useCountUp(totalContribution, 1000, previousContribution);
  const [previousTotalAmount, setPreviousTotalAmount] = useState(0);
  const [previousTotalAmountDecimal, setPreviousTotalAmountDecimal] = useState(0);
  const [previousTokensBought, setPreviousTokensBought] = useState(0)
  const animatedTokensBought = useCountUp(tokensBought, 1000, previousTokensBought);
  const animatedTotalAmount = useCountUp(totalAmount, 1000, previousTotalAmount);
  const animatedTotalAmountDecimal = useCountUp(decimalTotalAmount, 1000, previousTotalAmountDecimal);
  const [requested, setRequested] = useState(false);
  const [saleEnded, setSaleEnded] = useState(false);
  const [saleStarted, setSaleStarted] = useState(false);
  const [showContributeMobile, setShowContributeMobile] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)")

  const SOCKET_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;
  const { lastMessage } = useSocketIO(SOCKET_URL);


  const handleMobileContributeChange = () => {
    if (selectedMethod === 0) {
      setShowContributeMobile(false);
    } else {
      setSelectedMethod(0);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        //console.log("Fetching data...");

        // Fetch total contribution
        const contributionResponse = await getTotalContribution(accessToken as string, presaleID);

        //console.log("Contribution response:", contributionResponse);
        if (contributionResponse !== 'Failed' && isMounted) {
          const contribute = Number(contributionResponse.data._sum.amount);
          const contributionValue = isNaN(contribute) ? 0 : contribute;

          setPreviousContribution(totalContribution);
          setTotalContribution(contributionValue);
        }

        const dollarResponse = await getTotalUSDSpent(UserID as string, accessToken);
        if (dollarResponse !== 'Failed' && isMounted) {
          const totalAmount_ = dollarResponse.data.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
          const amount = Math.trunc(totalAmount_);
          const dollarAmount = isNaN(amount) ? 0 : amount;

          const decimal = Math.abs(totalAmount_ % 1).toFixed(2).slice(2);

          setPreviousTotalAmountDecimal(decimalTotalAmount);
          setDecimalTotalAmount(Number(decimal));

          setPreviousTotalAmount(totalAmount);
          setTotalAmount(dollarAmount);

          const newTokensBought = dollarAmount * saleRate;
          setPreviousTokensBought(tokensBought);
          setTokensBought(newTokensBought);
        }

        if (isMounted) {
          const progressAmount = Math.round((totalContribution / target) * 100);
          //console.log("Setting progress:", progressAmount);
          setProgress(progressAmount);
        }

      } catch (error) {
        //console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [lastMessage]);




  useEffect(() => {
    const fetchReferralCount = async () => {
      const response = await getUserReferrals(UserID, accessToken);
      if (response !== 'Failed') {
        // console.log("Response is : ", response)
        const referrerID = response.data.data.id;
        const newCount = Number(response.data.totalReferrals);
        const newBalanceRaw = Number(response.data.data.paidRequestbonusAmount);
        const processingRaw = Number(response.data.data.pendingRequestbonusAmount);
        const totalAmountRaw = Number(response.data.totalBonusEarned);

        setReferralID(referrerID)

        // Integer part (without decimals)
        const newBalance = Math.trunc(newBalanceRaw);
        const totalAmount = Math.trunc(totalAmountRaw);

        // Rounded to two decimal places
        const newBalanceRounded = parseFloat(newBalanceRaw.toFixed(2));
        const totalAmountRounded = parseFloat(totalAmountRaw.toFixed(2));


        const newBalanceDecimal = Math.abs(newBalanceRounded % 1).toFixed(2).slice(2);
        const totalAmountDecimal = Math.abs(totalAmountRounded % 1).toFixed(2).slice(2);

        const processingRounded = parseFloat(processingRaw.toFixed(2));

        setRecievedAmount(isNaN(newBalance) ? 0 : newBalance)
        setRecievedAmountRounded(isNaN(Number(newBalanceDecimal)) ? 0 : Number(newBalanceDecimal))

        setTotalBonusPending(isNaN(processingRounded) ? 0 : processingRounded)

        setReferralCount(isNaN(newCount) ? 0 : newCount);

        setBonusAmount(isNaN(totalAmount) ? 0 : totalAmount);
        setBonusAmountRounded(isNaN(Number(totalAmountDecimal)) ? 0 : Number(totalAmountDecimal));

      }
      //  else {
      // console.log(response);
      // }
    };

    const fetchPresaleData = async () => {
      const response = await getPresaleID(accessToken);
      if (response !== 'Failed') {
        const presale = response.data.id;
        const enddate = response.data.endDate;
        const startdate = response.data.startDate;
        const target = response.data.hardCap;
        const rate = Number(response.data.rate);
        setSaleRate(isNaN(rate) ? 0 : rate);
        localStorage.setItem('salerate', JSON.stringify(response.data.rate));
        // console.log(startDate)
        // console.log(endDate)
        setTarger(target);

        setPresaleID(presale);


        setTarger(1000000)

        // console.log("Target is ", target)

        initializeCountdown(new Date(startdate), new Date(enddate));
      }
      //  else {
      //   console.log(response);
      // }
    };

    const initializeCountdown = (start: Date, end: Date) => {
      const updateCountdown = () => {
        const now = new Date();
        let distance = start.getTime() - now.getTime();

        if (distance > 0) {
          setSaleStatus(t('saleStartsIn'));
        } else {
          distance = end.getTime() - now.getTime();
          if (distance <= 0) {
            setSaleStatus('SALE ENDED');
            setSaleEnded(true);
            setSaleStarted(false);
          } else {
            setSaleStatus('SALE ENDS IN');
            setSaleStarted(true);
            setSaleEnded(false);
          }
          setSaleStarted(true);
          setSaleEnded(false);
        }
        // setSaleStarted(true)
        if (distance < 0) {
          clearInterval(intervalId);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);
      return () => clearInterval(intervalId);
    };

    fetchPresaleData();
    fetchReferralCount();
  }, [lastMessage]);



  const handleFullTransaction = (status: any) => {
    setFulltransaction(status)
  }




  const ReferralLink = `${window.location.origin}/signup?referralCode=${UserID}`


  const discordShareUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(`Join the Karbon Sale using my referral link: ${ReferralLink}`)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(ReferralLink)}&text=${encodeURIComponent('Join the Karbon Sale using my referral link!')}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`Join the Karbon Sale using my referral link: ${ReferralLink}`)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(ReferralLink)}&text=${encodeURIComponent('Join the Karbon Sale using my referral link!')}`;

  const handleCopy = () => {
    const link = ReferralLink ?? "";
    navigator.clipboard.writeText((link)).then(() => {
      // console.log(ReferralLink)
      setCopied(true);

      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }

      const newTimeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeoutRef(newTimeout);
    });
  };




  const handlePayoutModal = () => {
    if (isConnected) {
      setRequested(!requested)
      setIsRequesting(true);
      if (bonusAmount > 0) {
        setTempAmount(bonusAmount);
        payoutMitate.mutate(
          { referralId: referralID },
          {
            onSuccess: () => {
              // console.log(response)
              setPayoutSuccessOpen(true);
              setIsRequesting(false);
              setRequested(!requested);
              toast({
                variant: "success",
                title: t('success'),
                description: t('payoutRequestSuccess'),
              })
            },
            onError: (error: unknown) => {
              let errorMessage = "Payout Request Failed, Try Again";
              if (axios.isAxiosError(error) && error.response) {
                // If it's an Axios error with a response, we can access the response data
                errorMessage = error.response.data?.message || errorMessage;
              } else if (error instanceof Error) {
                // If it's a standard Error object, we can access the message property
                errorMessage = error.message || errorMessage;
              }
              toast({
                variant: "failure",
                title: "Error!",
                description: errorMessage,
              })
              setIsRequesting(false);
            }
          }
        );
      } else {
        setIsRequesting(false);
        setRequested(!requested)
        setPayoutFaliure(true);
      }
    } else {
      setIsRequesting(false);
      open();
    }
    setIsRequesting(false);
  }




  if (loading) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return (
      <div
        className={`items-center justify-center flex w-full min-h-[88vh] bg-black bg-opacity-20 ${loading ? "fade-in" : "fade-out"
          }`}
      >
        <ClimbingBoxLoader color="#08E04A" />
      </div>
    );
  }



  const handleCloseConnectModal = () => {
    setHasDisplayedConnectModal(true);
    localStorage.setItem('displayedModalConnect', 'true');
    setIsConnectModalOpen(false);
  };




  return (
    <div className="w-full h-full">
      <MetaTags
        title="Karbon Sale | Token Sale Dapp"
        description="Buy Karbon token and participate in the referral"
      />

      {!isMobile ? (
        <Dialog open={isConnectModalOpen} onOpenChange={handleCloseConnectModal}>
          <DialogContent className='bg-[#101010] border-[1px] border-[#282828] flex flex-col w-[380px] max-sm:w-[290px] items-center justify-center outline-none'>
            <div className='w-full'>
              <img
                src='/assets/connectWalletImage.svg'
              />
              <div onClick={handleCloseConnectModal} className='absolute cursor-pointer  top-4 right-4'>
                <DialogClose />
              </div>
            </div>

            <div className='pt-8 pb-5 px-8 flex flex-col space-y-3'>
              <p className='text-white font-bold text-[20px] max-sm:text-[16px]'>Connect a wallet</p>
              <p className='text-[14px] text-white max-sm:text-[10px]'>{t('connectWeb3Wallet')}</p>

              <p className='text-white text-[12px] opacity-50'>{t('supportedNetwork')}</p>

              <div>
                <div onClick={() => open()} className="flex flex-row space-x-2 items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                  <ConnectWalletIconBlack />
                  <p className="font-bold text-[12px] shadow-sm">
                    {t('connectWallet')}
                  </p>
                </div>
              </div>

              <div className='flex pt-2 flex-row space-x-2 items-center justify-center'>
                <p className='text-white text-[14px] max-sm:text-[12px]  font-light opacity-70'>{t('noWallet')}</p>
                <div onClick={handleCloseConnectModal} className='flex flex-row cursor-pointer items-center space-x-1'>
                  <p className='text-[#08E04A] text-[14px] max-sm:text-[12px]'>{t('skip')}</p>
                  <ForwardShortGreen />

                </div>

              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isConnectModalOpen} onOpenChange={handleCloseConnectModal}>
          <SheetContent side={"bottom"} className='bg-[#101010] border-[1px] border-[#282828] flex flex-col w-full rounded-t-[24px] items-center justify-center outline-none'>
            <div className='w-full'>
              <img
                src='/assets/WalletImageMobile.svg'
                className="rounded-t-[24px]"
              />
              <div onClick={handleCloseConnectModal} className='absolute cursor-pointer  top-4 right-4'>
                <DialogClose />
              </div>
            </div>

            <div className='pt-8 pb-5 px-8 flex flex-col space-y-3'>
              <p className='text-white font-bold text-[20px] max-sm:text-[16px]'>Connect a wallet</p>
              <p className='text-[14px] text-white max-sm:text-[10px]'>{t('connectWeb3Wallet')}</p>

              <p className='text-white text-[12px] opacity-50'>{t('supportedNetwork')}</p>

              <div>
                <div onClick={() => open()} className="flex flex-row space-x-2 items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                  <ConnectWalletIconBlack />
                  <p className="font-bold text-[12px] shadow-sm">
                    {t('connectWallet')}
                  </p>
                </div>
              </div>

              <div className='flex pt-2 pb-5 flex-row space-x-2 items-center justify-center'>
                <p className='text-white text-[14px] max-sm:text-[12px]  font-light opacity-70'>{t('noWallet')}</p>
                <div onClick={handleCloseConnectModal} className='flex flex-row cursor-pointer items-center space-x-1'>
                  <p className='text-[#08E04A] text-[14px] max-sm:text-[12px]'>{t('skip')}</p>
                  <ForwardShortGreen />

                </div>

              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}


      <div className=" flex pb-10 max-lg:hidden">
        <div className="flex flex-row  w-full justify-between space-x-5">
          <div className="flex flex-col w-[795px] ">
            <div className="flex items-center w-[795px] min-h-[367px] justify-between flex-col ">

              <div className="flex flex-col space-y-7 h-[230px] w-[795px] border-[1px] border-[#282828] bg-[#121212] p-5 rounded-t-[16px]">
                <p className="text-white text-[20px] font-bold">{t('referrals')}</p>

                <div className="flex flex-row w-full justify-between pr-10 pb-10">

                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-[12px] opacity-70">{t('unclaimedBonus')}</p>
                    <div className="flex flex-row ">
                      <p className="text-white text-[28px]">${bonusAmount}</p>
                      <p className="text-white text-[18px]">.{bonusAmountRounded}</p>
                    </div>
                    <div onClick={handlePayoutModal} className="bg-transparent py-2 px-4 flex items-center justify-center cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                      {isConnected ? (
                        <>
                          {isRequesting ? (
                            <BarLoader color="#FFFFFF" />
                          ) : (
                            t('requestPayout')
                          )}
                        </>
                      ) : (
                        t('connectWallet')
                      )}
                    </div>

                    <PayoutModalSuccess
                      isDialogOpen={payoutSuccessOpen}
                      setIsDialogOpen={setPayoutSuccessOpen}
                      tokenAmount={tempAmount}
                    />

                    <PayoutModalFaliure
                      isDialogOpen={payoutFaliure}
                      setIsDialogOpen={setPayoutFaliure}
                    />



                  </div>

                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-[12px] opacity-70">{t('claimedBonus')}</p>
                    <div className="flex flex-row ">
                      <p className="text-white text-[28px]">${recievedAmount}</p>
                      <p className="text-white text-[18px]">.{recievedAmountRounded}</p>
                    </div>
                    {totalBonusPending > 0 && (
                      <p className="text-[#FFCC00] text-[14px]">${totalBonusPending} in process...</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-[12px] opacity-70">{t('totalReferrals')}</p>
                    <div className="flex flex-row ">
                      <p className="text-white text-[28px]">{referralCount}</p>

                    </div>
                  </div>

                </div>

              </div>

              <div className="flex flex-col space-y-3 w-[795px] min-h-[135px] border-[1px] border-t-0 border-[#282828] bg-[#121212] p-5 rounded-b-[16px]">
                <p className="text-[16px] text-white font-semibold">{t('startEarning')}!</p>
                <p className="text-white opacity-70 text-[12px]">{t('copyReferral')}</p>

                <div className="flex flex-row space-x-5 items-center">
                  <div className="flex flex-row items-center py-2 pl-4 bg-black space-x-10">
                    <div>
                      <p className="text-white text-[12px]">{ReferralLink.slice(0, 30)}...</p>
                    </div>
                    <div
                      onClick={handleCopy}
                      className="flex flex-row mr-4 items-center space-x-1 cursor-pointer"
                      style={{ width: '60px' }} // Adjust the width as needed
                    >
                      {copied ? <CheckMark /> : <CopyIcon />}
                      <p className="text-[#08E04A] text-[10px]">
                        {copied ? t('copied') : t('copy')}
                      </p>
                    </div>
                  </div>


                  <div className="flex flex-row items-center space-x-3">
                    <p className="text-[12px] text-white opacity-70 ">{t('shareOn')}</p>

                    <a href={discordShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <DiscordLogo />
                    </a>
                    <a href={telegramShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <TelegramLogo />
                    </a>
                    <a href={whatsappShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <WhatsappLogo />
                    </a>
                    <a href={xShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <XLogo />
                    </a>
                  </div>

                </div>

              </div>

            </div>

            <div className="flex flex-col pt-5 space-y-3">
              <p className="text-white font-bold text-[20px]">{t('transactions')}</p>
              <div className="flex flex-row items-center justify-between">

                <div className="w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                  <p className="text-[12px] opacity-70 text-white">{t('amountSpent')}</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">{animatedTotalAmount}</p>
                    <p className="text-white text-[16px]">.{animatedTotalAmountDecimal}</p>
                    <p className="text-white font-extralight text-[24px]">USDT</p>
                  </div>
                </div>

                <div className="min-w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                  <p className="text-[12px] opacity-70 text-white">{t('tokensBought')}</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">{animatedTokensBought}</p>
                    <p className="text-white font-extralight text-[24px]">KARBON</p>
                  </div>
                </div>

                <div className="w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                  <p className="text-[12px] opacity-70 text-white">{t('tokenValue')}</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">{saleRate}</p>
                    <p className="text-white text-[16px]">.00</p>
                    <p className="text-white font-extralight text-[24px]">USDT</p>
                    <div className="flex flex-row items-center mt-3">
                      <UpArrow />
                      <p className="text-[#08E04A] text-[10px]">100%</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className=" bg-[#121212] border-[1px] border-[#282828] rounded-b-[8px]">
                <div className="flex items-center justify-center flex-col space-y-5 py-5">
                  <p className="text-[12px] text-white opacity-70">{t('estimatedClaimTime')}</p>
                  <div className={`flex flex-row space-x-2 items-center justify-center `}>
                    <p className="text-white text-[20px]">{countdown.days}d</p>
                    <p className="text-white text-[20px]">{countdown.hours}h</p>
                    <p className="text-white text-[20px]">{countdown.minutes}m</p>
                    <p className="text-white text-[20px]">{countdown.seconds}s</p>
                  </div>
                </div>
              </div>

            </div>

          </div>


          <div className="flex flex-col space-y-1  mb-10 min-h-[660px] w-[341px] border-[1px] rounded-[8px] border-[#282828] ">
            <div className="flex flex-col w-[341px] border-[#282828] p-5  rounded-t-[8px] bg-[#121212] ">
              <div className="flex flex-col space-y-7">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-white text-[14px] font-medium">{t('presaleProgress')}</p>
                  <div className="flex flex-row items-center space-x-4">
                    <p className="text-white opacity-70 text-[14px]">${animatedContribution}</p>
                    <Dot />
                    <p className="text-[#08E04A] text-[14px]">{progress}%</p>
                  </div>
                </div>
                <div>
                  <Progress value={progress} />
                </div>
                <div className="flex flex-col w-full items-center justify-center space-y-3">
                  <p className="text-white opacity-70 text-[10px]">{saleStatus}</p>
                  <div className={`flex flex-row space-x-2 items-center justify-center ${saleEnded || !saleStarted ? 'opacity-40' : ''}`}>
                    <p className="text-white text-[20px]">{countdown.days}d</p>
                    <p className="text-white text-[20px]">{countdown.hours}h</p>
                    <p className="text-white text-[20px]">{countdown.minutes}m</p>
                    <p className="text-white text-[20px]">{countdown.seconds}s</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-b-[8px] bg-[#121212]">
              <div className="flex flex-col space-y-5">
                <p className="text-white px-5 pt-5  font-bold text-[20px]">{t('contribute')}</p>
                <div className="px-5">
                  <div
                    className="fade-transition"
                    style={{ opacity: selectedMethod === 0 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 0 */}
                    {saleEnded ? (
                      <>
                        <div className="flex py-6 space-y-4 flex-col items-center justify-center">
                          <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <p className="text-white font-light text-[20px]">{t('saleEnded')}</p>
                        </div>
                      </>
                    ) : saleStarted ? (
                      <>
                        {selectedMethod === 0 && (
                          <div className="flex flex-col space-y-2 items-center justify-center">
                            <div onClick={() => setSelectedMethod(1)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <CreditCardlogo />
                                <p className="text-white text-[14px]">{t('buyWithCreditCard')}</p>
                                <ForwardIcon />
                              </div>
                            </div>

                            <div onClick={() => { setSelectedMethod(2) }} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <USDTLogoBig />
                                <p className={`text-white text-[14px] `}>{t('buyWithUsdt')}</p>
                                <ForwardIcon />
                              </div>
                            </div>

                            <div onClick={() => setSelectedMethod(3)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <PaypalLogo />
                                <p className="text-white text-[14px]">{t('buyWithPaypal2')}</p>
                                <ForwardIcon />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex py-6 space-y-4 flex-col items-center justify-center">
                          <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <p className="text-white font-light text-[20px]">{t('saleNotStarted')}</p>
                        </div>
                      </>
                    )}

                  </div>
                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 1 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 1 */}
                    {selectedMethod === 1 && <BuyWithCreditCard setSelectedMethod={setSelectedMethod} />}
                  </div>

                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 2 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 2 */}
                    {selectedMethod === 2 && (
                      <BuyWithUSDT
                        setSelectedMethod={setSelectedMethod}
                        fullTransaction={fullTransaction}
                        handleFullTransaction={handleFullTransaction}

                      />
                    )}
                  </div>

                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 3 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 3 */}
                    {selectedMethod === 3 && <BuyWithPaypal setSelectedMethod={setSelectedMethod} />}
                  </div>

                </div>


                <div>
                  <p className="text-white px-5 text-[12px]">{t('byContributing')} <span onClick={() => setIsTermsAndCondOpen(true)} className=" cursor-pointer underline underline-offset-2">{t('termsConditions')}</span>.</p>
                </div>

                <TermsAndCond
                  isDialogOpen={isTermsAndCondOpen}
                  setIsDialogOpen={setIsTermsAndCondOpen}
                />

                <div className="flex w-[341px] border-[#282828] h-[67px] items-center justify-between flex-row border-t-[1px] border-b-[1px]">
                  <div className="w-[70%] bg-black h-full items-center pl-5 flex">
                    <p className="text-white opacity-50 w-[183px] text-[12px]">{t('chanceBuy')}.</p>
                  </div>
                  <div className="w-[30%] bg-green-500 h-full"></div>
                  <div className="absolute right-[4.00rem]">
                    <img
                      src="/assets/chanceImage.svg"
                    />
                  </div>
                </div>

                <div className="w-full pb-5 px-5  flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-white text-[8px] opacity-50">{t('copyrightText')}</p>
                    <p className="text-white text-[8px] opacity-50">{t('allRightsReserved')}</p>
                  </div>
                  <p className="text-white text-[8px] opacity-50">Gaziantep, Türkiye</p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {showContributeMobile ? (
        <div className="flex flex-col space-y-2">
          <div onClick={handleMobileContributeChange} className="flex cursor-pointer flex-row items-center space-x-2">
            <BackIconGreen />
            <p className="text-[#08E04A] text-[14px]">{t('back')}</p>
          </div>

          <p className="text-white text-[20px] font-bold">{t('contribute')}</p>
          <div
            className="fade-transition"
            style={{ opacity: selectedMethod === 0 ? 1 : 0 }}
          >
            {/* Content for selectedMethod === 0 */}
            {saleEnded ? (
              <div className="flex py-5 space-y-2 flex-col items-center justify-center">
                <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p className="text-white font-light text-[20px]">{t('saleEnded')}</p>
              </div>
            ) : saleStarted ? (
              <>
                {selectedMethod === 0 && (
                  <div className="flex flex-col space-y-2 items-center justify-center">
                    <div onClick={() => setSelectedMethod(1)} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                      <div className="flex flex-row w-full items-center justify-between ">
                        <CreditCardlogo />
                        <p className="text-white text-[14px]">{t('buyWithCreditCard')}</p>
                        <ForwardIcon />
                      </div>
                    </div>

                    <div onClick={() => { setSelectedMethod(2) }} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                      <div className="flex flex-row w-full items-center justify-between ">
                        <USDTLogoBig />
                        <p className={`text-white text-[14px] `}>{t('buyWithUsdt')}</p>
                        <ForwardIcon />
                      </div>
                    </div>

                    <div onClick={() => setSelectedMethod(3)} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                      <div className="flex flex-row w-full items-center justify-between ">
                        <PaypalLogo />
                        <p className="text-white text-[14px]">{t('buyWithPaypal2')}</p>
                        <ForwardIcon />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex py-5 space-y-2 flex-col items-center justify-center">
                <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p className="text-white font-light text-[20px]">{t('saleNotStarted')} </p>
              </div>
            )}
          </div>

          <div
            className="fade-transition "
            style={{ opacity: selectedMethod === 1 ? 1 : 0 }}
          >
            {/* Content for selectedMethod === 1 */}
            {selectedMethod === 1 && <BuyWithCreditCard setSelectedMethod={setSelectedMethod} />}
          </div>

          <div
            className="fade-transition "
            style={{ opacity: selectedMethod === 2 ? 1 : 0 }}
          >
            {/* Content for selectedMethod === 2 */}
            {selectedMethod === 2 && (
              <BuyWithUSDT
                setSelectedMethod={setSelectedMethod}
              />
            )}
          </div>

          <div
            className="fade-transition "
            style={{ opacity: selectedMethod === 3 ? 1 : 0 }}
          >
            {/* Content for selectedMethod === 3 */}
            {selectedMethod === 3 && <BuyWithPaypal setSelectedMethod={setSelectedMethod} />}
          </div>
          <div>
            <p className="text-white px-1 text-[12px]">{t('byContributing')} <span onClick={() => setIsTermsAndCondOpen(true)} className=" cursor-pointer underline underline-offset-2">{t('termsConditions')}</span>.</p>
          </div>

          <div className="flex absolute bottom-5 items-center flex-row w-full left-1/2 transform -translate-x-1/2 justify-between px-10">
            <p className="text-[12px] text-white w-[155px] opacity-30">{t('copyright')}</p>
            <p className="text-[12px] text-white opacity-30">Gaziantep, Türkiye</p>
          </div>
        </div>
      ) : (



        <div className="lg:hidden">
          <div className="flex flex-col py-5 space-y-5">
            <p className="text-white text-[20px] font-bold">{t('tokenSaleDApp')}</p>

            <div className="bg-[#121212] rounded-[8ox]">
              <div className="p-3 flex flex-col space-y-5">
                <div className="flex p-3 flex-col rounded-[8px] max-sm:bg-black space-y-7">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-white text-[14px] font-semibold">{t('presaleProgress')}</p>
                    <div className="flex flex-row items-center space-x-4">
                      <p className="text-white opacity-70 text-[14px]">${animatedContribution}</p>

                      <Dot />

                      <p className="text-[#08E04A] text-[14px]">{progress}%</p>

                    </div>
                  </div>
                  <div>
                    <Progress value={progress} />
                  </div>
                  <div className="flex flex-col w-full items-center justify-center space-y-3">
                    <p className="text-white opacity-70 text-[10px]">{saleStatus}</p>
                    <div className={`flex flex-row space-x-2 items-center justify-center ${saleEnded || !saleStarted ? 'opacity-40' : ''}`}>
                      <p className="text-white text-[20px]">{countdown.days}d</p>
                      <p className="text-white text-[20px]">{countdown.hours}h</p>
                      <p className="text-white text-[20px]">{countdown.minutes}m</p>
                      <p className="text-white text-[20px]">{countdown.seconds}s</p>
                    </div>
                  </div>
                </div>

                <p className="text-white  font-bold text-[20px]">{t('contribute')}</p>
                <button onClick={() => setShowContributeMobile(true)} className="flex md:hidden items-center flex-row space-x-2 justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                  <p className="font-bold text-[14px] shadow-sm">
                    {t('contribute')}
                  </p>
                  <ForwardIconBlack />
                </button>

                <div className="max-sm:hidden">
                  <div
                    className="fade-transition"
                    style={{ opacity: selectedMethod === 0 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 0 */}
                    {saleEnded ? (
                      <div className="flex py-5 space-y-2 flex-col items-center justify-center">
                        <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-white font-light text-[20px]">{t('saleEnded')}</p>
                      </div>
                    ) : saleStarted ? (
                      <>
                        {selectedMethod === 0 && (
                          <div className="flex flex-col space-y-2 items-center justify-center">
                            <div onClick={() => setSelectedMethod(1)} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <CreditCardlogo />
                                <p className="text-white text-[14px]">{t('buyWithCreditCard')}</p>
                                <ForwardIcon />
                              </div>
                            </div>

                            <div onClick={() => { setSelectedMethod(2) }} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <USDTLogoBig />
                                <p className={`text-white text-[14px] `}>{t('buyWithUsdt')}</p>
                                <ForwardIcon />
                              </div>
                            </div>

                            <div onClick={() => setSelectedMethod(3)} className="w-full flex min-h-[64px] items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                              <div className="flex flex-row w-full items-center justify-between ">
                                <PaypalLogo />
                                <p className="text-white text-[14px]">{t('buyWithPaypal2')}</p>
                                <ForwardIcon />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex py-5 space-y-2 flex-col items-center justify-center">
                        <svg width="68" height="86" viewBox="0 0 68 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M52.75 36.75V21.125C52.75 10.7697 44.3553 2.375 34 2.375C23.6447 2.375 15.25 10.7697 15.25 21.125V36.75M12.125 83.625H55.875C61.0527 83.625 65.25 79.4277 65.25 74.25V46.125C65.25 40.9473 61.0527 36.75 55.875 36.75H12.125C6.94733 36.75 2.75 40.9473 2.75 46.125V74.25C2.75 79.4277 6.94733 83.625 12.125 83.625Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-white font-light text-[20px]">{t('saleNotStarted')} </p>
                      </div>
                    )}
                  </div>

                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 1 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 1 */}
                    {selectedMethod === 1 && <BuyWithCreditCard setSelectedMethod={setSelectedMethod} />}
                  </div>

                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 2 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 2 */}
                    {selectedMethod === 2 && (
                      <BuyWithUSDT
                        setSelectedMethod={setSelectedMethod}
                      />
                    )}
                  </div>

                  <div
                    className="fade-transition "
                    style={{ opacity: selectedMethod === 3 ? 1 : 0 }}
                  >
                    {/* Content for selectedMethod === 3 */}
                    {selectedMethod === 3 && <BuyWithPaypal setSelectedMethod={setSelectedMethod} />}
                  </div>
                  <div className="py-5">
                    <p className="text-white px-1 text-[12px]">{t('byContributing')} <span onClick={() => setIsTermsAndCondOpen(true)} className=" cursor-pointer underline underline-offset-2">{t('termsConditions')}</span>.</p>
                  </div>
                </div>



              </div>
            </div>

            <div className="fkex flex-col space-y-2">
              <div className="bg-[#121212] rounded-[8ox]">

                <div className="p-5 flex-col space-y-6">
                  <p className="text-white text-[20px] font-bold">{t('referrals')}</p>

                  <div className="flex flex-row  space-x-10">
                    <div className="flex flex-col space-y-2">
                      <p className="text-white text-[12px] opacity-70">{t('unclaimedBonus')}</p>
                      <div className="flex flex-row ">
                        <p className="text-white text-[28px]">${bonusAmount}</p>
                        <p className="text-white text-[18px]">.{bonusAmountRounded}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-white text-[12px] opacity-70">{t('claimedBonus')}</p>
                      <div className="flex flex-row ">
                        <p className="text-white text-[28px]">${recievedAmount}</p>
                        <p className="text-white text-[18px]">.{recievedAmountRounded}</p>
                      </div>
                      {totalBonusPending > 0 && (
                        <p className="text-[#FFCC00] text-[14px]">${totalBonusPending} in process...</p>
                      )}
                    </div>
                  </div>


                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col space-y-2">
                      <p className="text-white text-[12px] opacity-70">{t('totalReferrals')}</p>
                      <div className="flex flex-row ">
                        <p className="text-white text-[28px]">{referralCount}</p>

                      </div>
                    </div>
                    <div onClick={handlePayoutModal} className="bg-transparent py-2 items-center h-max px-4 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                      {isConnected ? (
                        <>
                          {isRequesting ? (
                            <BarLoader color="#FFFFFF" />
                          ) : (
                            t('requestPayout')
                          )}
                        </>
                      ) : (
                        t('connectWallet')
                      )}
                    </div>

                    <PayoutModalSuccess
                      isDialogOpen={payoutSuccessOpen}
                      setIsDialogOpen={setPayoutSuccessOpen}
                      tokenAmount={bonusAmount}
                    />

                    <PayoutModalFaliure
                      isDialogOpen={payoutFaliure}
                      setIsDialogOpen={setPayoutFaliure}
                    />
                  </div>

                </div>
              </div>

              <div className="bg-[#121212] rounded-[8ox]">
                <div className="p-5 flex flex-col opacity-70 space-y-5">
                  <p className="text-[16px] text-white">{t('startEarning')}!</p>
                  <p className="text-white text-[12px]">{t('copyReferral')}</p>

                  <div className="flex flex-row max-w-[339px] items-center py-2 bg-black space-x-10">
                    <div>
                      <p className="text-white pl-2 text-[12px]">{ReferralLink.slice(0, 30)}...</p>
                    </div>
                    <div onClick={handleCopy} className="flex flex-row items-center space-x-1 pr-2 cursor-pointer">
                      {copied ? <CheckMark /> : <CopyIcon />}
                      <p className="text-[#08E04A] text-[10px]">
                        {copied ? t('copied') : t('copy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center space-x-3">
                    <p className="text-[12px] text-white opacity-70e">{t('shareOn')}</p>

                    <a href={discordShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <DiscordLogo />
                    </a>
                    <a href={telegramShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <TelegramLogo />
                    </a>
                    <a href={whatsappShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <WhatsappLogo />
                    </a>
                    <a href={xShareUrl} target="blank" className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                      <XLogo />
                    </a>
                  </div>

                </div>

              </div>
            </div>


            <div className="bg-[#121212] rounded-[8ox]">
              <div className="p-5">
                <p className="text-white font-bold text-[20px]">{t('transactions')}</p>
                <div className="flex flex-col space-y-5 py-5">
                  <div className="space-y-2">
                    <p className="text-[12px] opacity-70 text-white">{t('amountSpent')}</p>
                    <div className="flex flex-row space-x-1">
                      <p className="text-white text-[24px]">{totalAmount}</p>
                      <p className="text-white text-[16px]">.{decimalTotalAmount}</p>
                      <p className="text-white font-extralight text-[24px]">USDT</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] opacity-70 text-white">{t('tokensBought')}</p>
                    <div className="flex flex-row space-x-1">
                      <p className="text-white text-[24px]">{tokensBought}</p>
                      <p className="text-white font-extralight text-[24px]">KARBON</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] opacity-70 text-white">{t('tokenValue')}</p>
                    <div className="flex flex-row space-x-1">
                      <p className="text-white text-[24px]">{saleRate}</p>
                      <p className="text-white text-[16px]">.00</p>
                      <p className="text-white font-extralight text-[24px]">USDT</p>
                      <div className="flex flex-row items-center mt-3">
                        <UpArrow />
                        <p className="text-[#08E04A] text-[10px]">100%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] text-white opacity-70">{t('estimatedClaimTime')}</p>
                    <div className="flex flex-row space-x-2">
                      <p className="text-white text-[20px]">{countdown.days}d</p>
                      <p className="text-white text-[20px]">{countdown.hours}h</p>
                      <p className="text-white text-[20px]">{countdown.minutes}m</p>
                      <p className="text-white text-[20px]">{countdown.seconds}s</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>


          </div>

        </div>
      )}

    </div >
  )
}

export default TokenSale
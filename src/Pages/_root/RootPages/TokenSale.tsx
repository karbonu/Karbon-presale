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
import { getProgress, getTotalContribution, getTotalUSDSpent, getPresaleID, getUserReferrals } from "@/components/shared/Hooks/TokenSaleHooks.tsx";
import { useAuth } from "@/components/shared/Contexts/AuthContext.tsx";
import { useRequestPayoutMitate } from "@/components/shared/Hooks/UseRequestPayoutMutation.tsx";


const TokenSale = () => {
  const {isConnected} = useAccount();
  const [loading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payoutSuccessOpen, setPayoutSuccessOpen] = useState(false);
  const [payoutFaliure, setPayoutFaliure] = useState(false);
  const [isTermsAndCondOpen, setIsTermsAndCondOpen]= useState(false);
  const [copied, setCopied] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const[progress, setProgress] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [decimalTotalAmount, setDecimalTotalAmount] = useState("00");
  const [tokensBought, setTokensBought] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [fullTransaction, setFulltransaction] = useState(false);
  const {UserID, setHasDisplayedConnectModal, hasDisplayedConnectModal, referralCode} = useAuth();
  const [bonusAmount, setBonusAmount] = useState(0);
  const payoutMitate = useRequestPayoutMitate();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(!isConnected && !hasDisplayedConnectModal);
  const { open } = useWeb3Modal();
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saleID, setSaleID] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [target, setTarger] = useState(0);
  const [totalContribution, setTotalContribution] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [saleStatus, setSaleStatus] = useState('SALE STARTS IN');



  useEffect(() => {
    const fetchProgress = async () => {
      const response = await getProgress();
      if (response !== 'Failed') {
        const newProgress = Number(response.data);
        setProgress(isNaN(newProgress) ? 0 : newProgress);
      } else {
        console.log(response);
      }
    };
  
    fetchProgress();
  }, [fullTransaction]);

  
  useEffect(() => {

    const fetchTotalContribution = async() =>{
      const response = await getTotalContribution();
      
      if (response !== 'Failed') {
        console.log(response);
        const Contribute = Number(response.data._sum.amount);
        setTotalContribution(isNaN(Contribute) ? 0 : Contribute);
      } else {
        console.log(response);
      }
    }

    fetchTotalContribution();


    let USDTAmount = 0;
    let DollarAmount = 0;


    const fetchDollar = async () => {
      const response = await getTotalUSDSpent(UserID as string);
      if (response !== 'Failed') {
        console.log(response);
        DollarAmount = (isNaN(Number(response.data)) ? 0 : response.data);
      } else {
        console.log(response);
      }
    };
  
    
    fetchDollar();

    setTotalAmount(USDTAmount + DollarAmount);

    setTokensBought(totalAmount * 10);

    setDecimalTotalAmount('00');




  }, [fullTransaction]);


  
    useEffect(() => {
      const fetchReferralCount = async () => {
        const response = await getUserReferrals(UserID as string);
        if (response !== 'Failed') {
          const newCount = Number(response.data);
          setReferralCount(isNaN(newCount) ? 0 : newCount);
          if (newCount === 0) {
            setBonusAmount(5000);
          }
        } else {
          console.log(response);
        }
      };
  
      const fetchPresaleData = async () => {
        const response = await getPresaleID();
        if (response !== 'Failed') {
          const presale = response.data.id;
          const enddate = response.data.endDate;
          const startdate = response.data.startDate;
          const target = response.data.hardCap;
          console.log(startDate)
          console.log(endDate)
          setTarger(target);
          setEndDate(enddate);
          setSaleID(presale);
          setStartDate(startdate);
          initializeCountdown(new Date(startdate), new Date(enddate));
        } else {
          console.log(response);
        }
      };
  
      const initializeCountdown = (start: Date, end: Date) => {
        const updateCountdown = () => {
          const now = new Date();
          let distance = start.getTime() - now.getTime();
  
          if (distance > 0) {
            setSaleStatus('SALE STARTS IN');
          } else {
            distance = end.getTime() - now.getTime();
            setSaleStatus('SALE ENDS IN');
          }
  
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
    }, []);

  






  const ReferralLink = `${window.location.origin}/signup?referralCode=${referralCode}`

  const handleCopy = () => {
    const link = ReferralLink ?? "";
    navigator.clipboard.writeText((link)).then(() => {
      console.log(ReferralLink)
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
    if (isConnected){
      setIsRequesting(true);
      if(bonusAmount > 500){
        payoutMitate.mutate(
          { referralId : referralCode },
          {
              onSuccess: () => {
                setPayoutSuccessOpen(true);
                setIsRequesting(false);
              },
              onError: (error) => {
                console.log(error)
                  setErrorMessage('Payout Request Failed');
                  setIsRequesting(false);
              }
          }
      );
      }else{
        setIsRequesting(false);
        setPayoutFaliure(true);
      }
    }else{
      setIsRequesting(false);
      open();
    }
    setIsRequesting(false);
  }





  if (loading) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000ms = 2s

    return (
      <div
        className={`items-center justify-center flex w-full min-h-[88vh] bg-black bg-opacity-20 ${
          loading ? "fade-in" : "fade-out"
        }`}
      >
        <ClimbingBoxLoader color="#08E04A" />
      </div>
    );
  }

  // if(isDialogOpen){
  //   return(
  //     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  //         <DialogContent>
  //           <DialogTitle>Dialog Title</DialogTitle>
  //           <DialogDescription>
  //             This is a description of the dialog content.
  //           </DialogDescription>
  //           <button onClick={() => setIsDialogOpen(false)}>Close Dialog</button>
  //         </DialogContent>
  //       </Dialog>
  //   )
  // }




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

        <Dialog open={isConnectModalOpen}  onOpenChange={handleCloseConnectModal}>
            <DialogContent className='bg-[#101010] border-[1px] border-[#282828] flex flex-col w-[380px] max-sm:w-[290px] items-center justify-center outline-none'>
                <div className='w-full'>
                    <img
                    src='/assets/connectWalletImage.svg'
                    />
                    <div onClick={handleCloseConnectModal} className='absolute cursor-pointer  top-4 right-4'>
                        <DialogClose/>
                    </div>
                </div>

                <div className='pt-8 pb-5 px-8 flex flex-col space-y-3'>
                    <p className='text-white font-bold text-[20px] max-sm:text-[16px]'>Connect a wallet</p>
                    <p className='text-[14px] text-white max-sm:text-[10px]'>For maximum payment experience, connect a crypto/web3 wallet to buy with USDT.</p>

                    <p className='text-white text-[12px] opacity-50'>Supported network is Ethereum</p>

                    <div>
                        <div onClick={() => open()} className="flex flex-row space-x-2 items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                            <ConnectWalletIconBlack/>
                            <p className="font-bold text-[12px] shadow-sm">
                                Connect wallet
                            </p>
                        </div>
                    </div>

                    <div className='flex pt-2 flex-row space-x-2 items-center justify-center'>
                        <p className='text-white text-[14px] max-sm:text-[12px]  font-light opacity-70'>Don’t have a wallet?</p>
                        <div onClick={handleCloseConnectModal} className='flex flex-row cursor-pointer items-center space-x-1'>
                            <p className='text-[#08E04A] text-[14px] max-sm:text-[12px]'>Skip</p>
                            <ForwardShortGreen/>

                        </div>

                    </div>
                </div>
            </DialogContent>
          </Dialog>

        
          <div className=" flex pb-10 max-lg:hidden">
            <div className="flex flex-row  w-full justify-between space-x-5">
              <div className="flex flex-col w-[795px] ">
                <div className="flex items-center w-[795px] h-[367px] justify-between flex-col ">
                  
                  <div className="flex flex-col space-y-7 h-[230px] w-[795px] border-[1px] border-[#282828] bg-[#121212] p-5 rounded-t-[16px]">
                    <p className="text-white text-[20px] font-bold">Referrals</p>
                    
                    <div className="flex flex-row w-full justify-between pr-10 pb-10">

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS EARNED</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">${bonusAmount}</p>
                          <p className="text-white text-[18px]">.00</p>
                        </div>
                        <div onClick={handlePayoutModal} className="bg-transparent py-2 px-4 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                          {isConnected ? (
                            <>
                            {isRequesting ? (
                              <BarLoader color="#FFFFFF"/>
                            ) : (
                              "Request Payout"
                            )}
                            </>
                          ): (
                            "Connect Wallet"
                          )}
                        </div>
                        {errorMessage && (
                              <p className="text-[12px] w-full text-center text-red-500 mt-2">{errorMessage}</p>
                          )}
                        <PayoutModalSuccess
                        isDialogOpen = {payoutSuccessOpen}
                        setIsDialogOpen = {setPayoutSuccessOpen}
                        />

                        <PayoutModalFaliure
                        isDialogOpen = {payoutFaliure}
                        setIsDialogOpen = {setPayoutFaliure}
                        />

                        

                      </div>

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS RECIEVED</p>
                        <p className="text-white text-[28px]">$0</p>
                        <p className="text-[#FFCC00] text-[14px]">$340 in process...</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">TOTAL REFERRALS</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">{referralCount}</p>
                          
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="flex flex-col space-y-3 w-[795px] h-[135px] border-[1px] border-t-0 border-[#282828] bg-[#121212] p-5 rounded-b-[16px]">
                    <p className="text-[16px] text-white font-semibold">Start earning extra money!</p>
                    <p className="text-white opacity-70 text-[12px]">Copy your unique referral code and earn 2.5% commissions from every investment made by your referred investors.</p>
                    
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
                          {copied ? <CheckMark/> : <CopyIcon/>}
                          <p className="text-[#08E04A] text-[10px]">
                            {copied ? "Copied" : "Copy"}
                          </p>
                        </div>
                      </div>


                      <div className="flex flex-row items-center space-x-3">
                        <p className="text-[12px] text-white opacity-70 ">Share on</p>

                        <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <DiscordLogo/>
                        </div>
                        <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <TelegramLogo/>
                        </div>
                        <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <WhatsappLogo/>
                        </div>
                        <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <XLogo/>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="flex flex-col pt-5 space-y-3">
                  <p className="text-white font-bold text-[20px]">Transactions</p>
                  <div className="flex flex-row items-center justify-between">
                   
                    <div className="w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">AMOUNT SPENT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">{totalAmount}</p>
                        <p className="text-white text-[16px]">.{decimalTotalAmount}</p>
                        <p className="text-white font-extralight text-[24px]">USDT</p>
                      </div>
                    </div>

                    <div className="w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">TOKENS BOUGHT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">{tokensBought}</p>
                        <p className="text-white font-extralight text-[24px]">KARBON</p>
                      </div>
                    </div>

                    <div className="w-[253px] border-[1px] border-[#282828] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">TOKEN VALUE</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">345</p>
                        <p className="text-white text-[16px]">.45</p>
                        <p className="text-white font-extralight text-[24px]">USDT</p>
                        <div className="flex flex-row items-center mt-3">
                          <UpArrow/>
                          <p className="text-[#08E04A] text-[10px]">100%</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className=" bg-[#121212] border-[1px] border-[#282828] rounded-b-[8px]">
                    <div className="flex items-center justify-center flex-col space-y-5 py-5">
                      <p className="text-[12px] text-white opacity-70">ESTIMATED CLAIM TIME</p>
                      <div className="flex flex-row space-x-2 items-center justify-center">
                        <p className="text-white text-[20px]">{countdown.days}d</p>
                        <p className="text-white text-[20px]">{countdown.hours}h</p>
                        <p className="text-white text-[20px]">{countdown.minutes}m</p>
                        <p className="text-white text-[20px]">{countdown.seconds}s</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>


              <div className="flex flex-col space-y-1  mb-10 max-h-[700px] w-[341px] border-[1px] rounded-[8px] border-[#282828] ">
                <div className="flex flex-col w-[341px] border-[#282828] p-5  rounded-t-[8px] bg-[#121212] ">
                  <div className="flex flex-col space-y-8">
                    <div className="flex flex-row items-center justify-between">
                      <p className="text-white text-[12px] font-medium">Presale Progress</p>
                      <div className="flex flex-row items-center space-x-4">
                        <p className="text-white opacity-70 text-[12px]">${totalContribution}</p>
                        <Dot/>
                        <p className="text-[#08E04A] text-[12px]">{progress}%</p>
                      </div>
                    </div>
                    <div>
                    <Progress value={totalContribution} max={target} />
                    </div>
                    <div className="flex flex-col w-full items-center justify-center space-y-3">
                      <p className="text-white opacity-70 text-[10px]">{saleStatus}</p>
                      <div className="flex flex-row space-x-2 items-center justify-center">
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
                    <p className="text-white px-5 pt-5  font-bold text-[20px]">Contribute</p>
                    <div className="px-5">
                        <div
                          className="fade-transition"
                          style={{ opacity: selectedMethod === 0 ? 1 : 0 }}
                        >
                          {/* Content for selectedMethod === 0 */}
                          {selectedMethod === 0 && (
                            <div className="flex flex-col space-y-2 items-center justify-center">
                              <div onClick={() => setSelectedMethod(1)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                                <div className="flex flex-row w-full items-center justify-between ">
                                  <CreditCardlogo />
                                  <p className="text-white text-[14px]">Buy with Credit Card</p>
                                  <ForwardIcon />
                                </div>
                              </div>

                              <div onClick={() => {setIsDialogOpen(true); setSelectedMethod(2)}} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                                <div className={`flex flex-row w-full items-center ${!isConnected ? 'justify-between' : ''}`}>
                                  <USDTLogoBig />
                                  <p 
                                  className={`text-white text-[14px] ${isConnected ? "text-center w-full" : "pl-10"}`}
                                  >Buy with USDT</p>
                                  {!isConnected && (
                                    <p className="text-[#08E04A] text-[10px]">Connect Wallet</p>
                                  )}
                                </div>
                              </div>

                              <div onClick={() => setSelectedMethod(3)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[56px]">
                                <div className="flex flex-row w-full items-center justify-between ">
                                  <PaypalLogo />
                                  <p className="text-white text-[14px]">Buy with PayPal</p>
                                  <ForwardIcon />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className="fade-transition "
                          style={{ opacity: selectedMethod === 1 ? 1 : 0 }}
                        >
                          {/* Content for selectedMethod === 1 */}
                          {selectedMethod === 1 && <BuyWithCreditCard saleID = {saleID} setSelectedMethod={setSelectedMethod} />}
                        </div>

                        <div
                          className="fade-transition "
                          style={{ opacity: selectedMethod === 2 ? 1 : 0 }}
                        >
                          {/* Content for selectedMethod === 2 */}
                          {selectedMethod === 2 && (
                            <BuyWithUSDT
                              setSelectedMethod={setSelectedMethod}
                              isDialogOpen={isDialogOpen}
                              setIsDialogOpen={setIsDialogOpen}
                              fullTransaction = {fullTransaction}
                              setFulltransaction = {setFulltransaction}
                              saleID = {saleID}
                            />
                          )}
                        </div>

                        <div
                          className="fade-transition "
                          style={{ opacity: selectedMethod === 3 ? 1 : 0 }}
                        >
                          {/* Content for selectedMethod === 3 */}
                          {selectedMethod === 3 && <BuyWithPaypal saleID = {saleID} setSelectedMethod={setSelectedMethod} />}
                        </div>
                      
                    </div>

      
                    <div>
                      <p className="text-white px-5 text-[12px]">By contributing to the presale you acknowledge and accept these <span onClick={() => setIsTermsAndCondOpen(true)} className=" cursor-pointer underline underline-offset-2">terms and conditions</span>.</p>
                    </div>

                    <TermsAndCond
                    isDialogOpen ={isTermsAndCondOpen}
                    setIsDialogOpen = {setIsTermsAndCondOpen}
                    />

                    <div className="flex w-[341px] border-[#282828] h-[67px] items-center justify-between flex-row border-t-[1px] border-b-[1px]">
                      <div className="w-[70%] bg-black h-full items-center pl-5 flex">
                        <p className="text-white opacity-50 w-[183px] text-[12px]">A chance to buy Karbon tokens at half of the launch price.</p>
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
                        <p className="text-white text-[8px] opacity-50">Copyright © 2024 Karbon</p>
                        <p className="text-white text-[8px] opacity-50">All rights reserved</p>
                      </div>
                      <p className="text-white text-[8px] opacity-50">Gaziantep, Türkiye</p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div className="lg:hidden">
            <div className="flex flex-col py-5 space-y-5">
              <p className="text-white text-[20px] font-bold">Token Sale DApp</p>
              
              <div className="bg-[#121212] rounded-[8ox]">
                <div className="p-5 flex flex-col space-y-5">
                  <div className="flex flex-col space-y-8">
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-white text-[12px] font-semibold">Presale Progress</p>
                        <div className="flex flex-row items-center space-x-4">
                          <p className="text-white opacity-70 text-[12px]">${totalContribution}</p>
                          
                          <Dot/>

                          <p className="text-[#08E04A] text-[12px]">{progress}%</p>

                        </div>
                      </div>
                      <div>
                      <Progress value={totalContribution} max={target} />
                      </div>
                      <div className="flex flex-col w-full items-center justify-center space-y-3">
                      <p className="text-white opacity-70 text-[10px]">{saleStatus}</p>
                      <div className="flex flex-row space-x-2 items-center justify-center">
                        <p className="text-white text-[20px]">{countdown.days}d</p>
                        <p className="text-white text-[20px]">{countdown.hours}h</p>
                        <p className="text-white text-[20px]">{countdown.minutes}m</p>
                        <p className="text-white text-[20px]">{countdown.seconds}s</p>
                      </div>
                    </div>
                    </div>

                    <p className="text-white  font-bold text-[20px]">Contribute</p>
                    <div className="">
                        <div
                          className="fade-transition"
                          style={{ opacity: selectedMethod === 0 ? 1 : 0 }}
                        >
                          {/* Content for selectedMethod === 0 */}
                          {selectedMethod === 0 && (
                            <div className="flex flex-col space-y-2 items-center justify-center">
                              <div onClick={() => setSelectedMethod(1)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                                <div className="flex flex-row w-full items-center justify-between ">
                                  <CreditCardlogo />
                                  <p className="text-white text-[14px]">Buy with Credit Card</p>
                                  <ForwardIcon />
                                </div>
                              </div>

                              <div onClick={() => {setIsDialogOpen(true); setSelectedMethod(2)}} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                                <div className={`flex flex-row w-full items-center ${!isConnected ? 'justify-between' : ''}`}>
                                  <USDTLogoBig />
                                  <p 
                                  className={`text-white text-[14px] ${isConnected ? "text-center w-full" : "pl-10"}`}
                                  >Buy with USDT</p>
                                  {!isConnected && (
                                    <p className="text-[#08E04A] text-[10px]">Connect Wallet</p>
                                  )}
                                </div>
                              </div>

                              <div onClick={() => setSelectedMethod(3)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                                <div className="flex flex-row w-full items-center justify-between ">
                                  <PaypalLogo />
                                  <p className="text-white text-[14px]">Buy with PayPal</p>
                                  <ForwardIcon />
                                </div>
                              </div>
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
                              isDialogOpen={isDialogOpen}
                              setIsDialogOpen={setIsDialogOpen}
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
                      <p className="text-white px-1 text-[12px]">By contributing to the presale you acknowledge and accept these <span onClick={() => setIsTermsAndCondOpen(true)} className=" cursor-pointer underline underline-offset-2">terms and conditions</span>.</p>
                    </div>
                </div>
              </div>

              <div className="fkex flex-col space-y-2">
                <div className="bg-[#121212] rounded-[8ox]">

                  <div className="p-5 flex-col space-y-6">
                    <p className="text-white text-[20px] font-bold">Referrals</p>

                    <div className="flex flex-row  space-x-10">
                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS EARNED</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">${bonusAmount}</p>
                          <p className="text-white text-[18px]">.00</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS RECIEVED</p>
                        <p className="text-white text-[28px]">$0</p>
                        <p className="text-[#FFCC00] text-[14px]">$340 in process...</p>
                      </div>
                    </div>


                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">TOTAL REFERRALS</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">{referralCount}</p>
                          
                        </div>
                      </div>
                      <div onClick={handlePayoutModal} className="bg-transparent py-2 items-center h-max px-4 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                        {isConnected ? (
                            <>
                            {isRequesting ? (
                              <BarLoader color="#FFFFFF"/>
                            ) : (
                              "Request Payout"
                            )}
                            </>
                          ): (
                            "Connect Wallet"
                          )}
                      </div>
                          {errorMessage && (
                                  <p className="text-[12px] w-full text-center text-red-500 mt-2">{errorMessage}</p>
                              )}
                          <PayoutModalSuccess
                          isDialogOpen = {payoutSuccessOpen}
                          setIsDialogOpen = {setPayoutSuccessOpen}
                          />

                          <PayoutModalFaliure
                          isDialogOpen = {payoutFaliure}
                          setIsDialogOpen = {setPayoutFaliure}
                          />
                    </div>

                  </div>
                </div>

                <div className="bg-[#121212] rounded-[8ox]">
                  <div className="p-5 flex flex-col opacity-70 space-y-5">
                    <p className="text-[16px] text-white">Start earning extra money!</p>
                    <p className="text-white text-[12px]">Copy your unique referral code and earn 2.5% commissions from every investment made by your referred investors.</p>
                    
                    <div className="flex flex-row max-w-[339px] items-center py-2 bg-black space-x-10">
                      <div>
                        <p className="text-white pl-2 text-[12px]">{ReferralLink.slice(0, 30)}...</p>
                      </div>
                      <div onClick={handleCopy} className="flex flex-row items-center space-x-1 pr-2 cursor-pointer">
                        {copied ? <CheckMark/> : <CopyIcon/>}
                          <p className="text-[#08E04A] text-[10px]">
                              {copied ? "Copied" : "Copy"}
                          </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center space-x-3">
                      <p className="text-[12px] text-white opacity-70e">Share on</p>

                      <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                        <DiscordLogo/>
                      </div>
                      <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                        <TelegramLogo/>
                      </div>
                      <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                        <WhatsappLogo/>
                      </div>
                      <div className=" opacity-85 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                        <XLogo/>
                      </div>
                    </div>

                  </div>

                </div>
              </div>


              <div className="bg-[#121212] rounded-[8ox]">
                <div className="p-5">
                  <p className="text-white font-bold text-[20px]">Transactions</p>
                  <div className="flex flex-col space-y-5 py-5">
                    <div className="space-y-2">
                      <p className="text-[12px] opacity-70 text-white">AMOUNT SPENT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">{totalAmount}</p>
                        <p className="text-white text-[16px]">.{decimalTotalAmount}</p>
                        <p className="text-white font-extralight text-[24px]">USDT</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[12px] opacity-70 text-white">TOKENS BOUGHT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">{tokensBought}</p>
                        <p className="text-white font-extralight text-[24px]">KARBON</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[12px] opacity-70 text-white">TOKEN VALUE</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">345</p>
                        <p className="text-white text-[16px]">.45</p>
                        <p className="text-white font-extralight text-[24px]">USDT</p>
                        <div className="flex flex-row items-center mt-3">
                          <UpArrow/>
                          <p className="text-[#08E04A] text-[10px]">100%</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[12px] text-white opacity-70">ESTIMATED CLAIM TIME</p>
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
        <div>
      </div>
   </div>
  )
}

export default TokenSale
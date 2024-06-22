import CopyIcon from "@/components/Icons/CopyIcon";
import CreditCardlogo from "@/components/Icons/CreditCardlogo";
import DiscordLogo from "@/components/Icons/DiscordLogo";
import Dot from "@/components/Icons/Dot";
import ForwardIcon from "@/components/Icons/ForwardIcon";
import PaypalLogo from "@/components/Icons/PaypalLogo";
import TelegramLogo from "@/components/Icons/TelegramLogo";
import USDTLogoBig from "@/components/Icons/USDTLogoBig";
import UpArrow from "@/components/Icons/UpArrow";
import WhatsappLogo from "@/components/Icons/WhatsappLogo";
import XLogo from "@/components/Icons/XLogo";
import MetaTags from "@/components/shared/MetaTags"
import { useState } from "react"
import { ClimbingBoxLoader } from "react-spinners";
import BuyWithUSDT from "./BuyWithUSDT";
import BuyWithCreditCard from "./BuyWithCreditCard";
import BuyWithPaypal from "./BuyWithPaypal";
import { Progress } from "@/components/ui/progress";


const TokenSale = () => {
  const [loading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(0);

  if (loading) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000ms = 2s

    return (
      <div
        className={`items-center justify-center flex w-full h-full bg-black bg-opacity-20 ${
          loading ? "fade-in" : "fade-out"
        }`}
      >
        <ClimbingBoxLoader color="#08E04A" />
      </div>
    );
  }

  return (
   <div className="w-full">
      <MetaTags
        title="Karbon Sale | Token Sale Dapp"
        description="Buy Karbon token and participate in the referral"
        />
        
          <div className="flex w-full justify-center">
            <div className="flex flex-row w-full justify-between space-x-5">
              <div className="flex flex-col w-[795px]  justify-center">
                <div className="flex items-center w-[795px] justify-center flex-col space-y-1">
                  <div className="flex flex-col space-y-10 w-[795px] bg-[#121212] p-5 rounded-t-[16px]">
                    <p className="text-white text-[20px] font-bold">Referrals</p>
                    
                    <div className="flex flex-row w-full justify-between pr-10 pb-10">

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS EARNED</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">$345</p>
                          <p className="text-white text-[18px]">.45</p>
                        </div>
                        <div className="bg-transparent py-2 px-4 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                          Request Payout
                        </div>

                      </div>

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">BONUS RECIEVED</p>
                        <p className="text-white text-[28px]">$0</p>
                        <p className="text-[#FFCC00] text-[14px]">$340 in process...</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <p className="text-white text-[12px] opacity-70">TOTAL REFERRALS</p>
                        <div className="flex flex-row ">
                          <p className="text-white text-[28px]">345</p>
                          
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="flex flex-col space-y-3 w-[795px] bg-[#121212] p-5 rounded-b-[16px]">
                    <p className="text-[16px] text-white">Start earning extra money!</p>
                    <p className="text-white text-[12px]">Copy your unique referral code and earn 2.5% commissions from every investment made by your referred investors.</p>
                    
                    <div className="flex flex-row space-x-5 items-center">
                      <div className="flex fle-row items-center py-2 px-4 bg-black space-x-10">
                        <div>
                          <p className="text-white text-[12px]">https://karbon.com/78236-tube...</p>
                        </div>
                        <div className="flex flex-row items-center space-x-1 cursor-pointer">
                          <CopyIcon/>
                          <p className="text-[#08E04A] text-[10px]">Copy</p>

                        </div>
                      </div>

                      <div className="flex flex-row items-center space-x-3">
                        <p className="text-[12px] text-white">Share on</p>

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

                <div className="flex flex-col py-14 space-y-5">
                  <p className="text-white font-bold text-[20px]">Transactions</p>
                  <div className="flex flex-row items-center justify-between">
                   
                    <div className="w-[253px] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">AMOUNT SPENT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">21,325</p>
                        <p className="text-white text-[16px]">.45</p>
                        <p className="text-white text-[24px]">USDT</p>
                      </div>
                    </div>

                    <div className="w-[253px] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">TOKENS BOUGHT</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">0.00345</p>
                        <p className="text-white text-[24px]">KARBON</p>
                      </div>
                    </div>

                    <div className="w-[253px] bg-[#121212] rounded-[8px] flex flex-col p-5 space-y-5">
                      <p className="text-[12px] opacity-70 text-white">TOKEN VALUE</p>
                      <div className="flex flex-row space-x-1">
                        <p className="text-white text-[24px]">345</p>
                        <p className="text-white text-[16px]">.45</p>
                        <p className="text-white text-[24px]">USDT</p>
                        <div className="flex flex-row items-center mt-3">
                          <UpArrow/>
                          <p className="text-[#08E04A] text-[10px]">100%</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className=" bg-[#121212] rounded-b-[8px]">
                    <div className="flex items-center justify-center flex-col space-y-5 py-5">
                      <p className="text-[12px] text-white opacity-70">ESTIMATED CLAIM TIME</p>
                      <p className="text-white text-[24px]">1d 22h 45m 34s</p>
                    </div>
                  </div>

                </div>

              </div>


              <div className="flex flex-col space-y-1 w-[341px] ">
                <div className="flex flex-col w-[341px] p-5  rounded-t-[8px] bg-[#121212] ">
                  <div className="flex flex-col space-y-8">
                    <div className="flex flex-row items-center justify-between">
                      <p className="text-white text-[12px] font-semibold">Presale Progress</p>
                      <div className="flex flex-row items-center space-x-4">
                        <p className="text-white text-[12px]">$5,784,043.78</p>
                        
                        <Dot/>

                        <p className="text-[#08E04A] text-[12px]">80%</p>

                      </div>
                    </div>
                    <div>
                    <Progress value={33} />
                    </div>
                    <div className="flex flex-col w-full items-center justify-center space-y-3">
                      <p className="text-white opacity-70 text-[10px]">SALE ENDS IN</p>
                      <div className="flex flex-row space-x-2 items-center justify-center">
                        <p className="text-white text-[20px]">1d</p>
                        <p className="text-white text-[20px]">22h</p>
                        <p className="text-white text-[20px]">50m</p>
                        <p className="text-white text-[20px]">45s</p>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-b-[8px] bg-[#121212]">
                  <div className="flex flex-col space-y-8">
                    <p className="text-white  px-5 pt-5 font-bold text-[20px]">Contribute</p>

                    <div className=" px-5">
                      {selectedMethod === 0 && (
                        <div className="flex flex-col space-y-2 items-center justify-center">
                          <div onClick={() => setSelectedMethod(1)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                            <div className="flex flex-row w-full items-center justify-between ">
                              <CreditCardlogo />
                              <p className="text-white text-[14px]">Buy with Credit Card</p>
                              <ForwardIcon />
                            </div>
                          </div>

                          <div onClick={() => setSelectedMethod(2)} className="w-full flex items-center px-3 cursor-pointer hover:border-[#08E04A] border-[1px] border-transparent transition ease-in-out rounded-[4px] bg-[#1C1C1C] h-[40px]">
                            <div className="flex flex-row w-full items-center justify-between ">
                              <USDTLogoBig />
                              <p className="text-white pl-10 text-[14px]">Buy with USDT</p>
                              <p className="text-[#08E04A] text-[10px]">Connect Wallet</p>
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

                      {selectedMethod === 1 && <BuyWithCreditCard
                      setSelectedMethod={setSelectedMethod} />}
                      {selectedMethod === 2 && <BuyWithUSDT 
                      setSelectedMethod={setSelectedMethod}
                       />}
                      {selectedMethod === 3 && <BuyWithPaypal
                      setSelectedMethod={setSelectedMethod} />}
                    </div>

      
                    <div>
                      <p className="text-white px-5 text-[12px]">By contributing to the presale you acknowledge and accept these <span className=" cursor-pointer underline underline-offset-2">terms and conditions</span>.</p>
                    </div>

                    <div className="flex w-[341px] border-[#282828] h-[67px] items-center justify-between flex-row border-t-[1px] border-b-[1px]">
                      <div className="w-[70%] bg-black h-full items-center pl-5 flex">
                        <p className="text-white w-[173px] text-[12px]">A chance to buy Karbon tokens at half of the launch price.</p>
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
        

        <div>

        </div>
   </div>
  )
}

export default TokenSale
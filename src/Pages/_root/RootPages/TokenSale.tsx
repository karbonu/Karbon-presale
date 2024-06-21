import CopyIcon from "@/components/Icons/CopyIcon";
import DiscordLogo from "@/components/Icons/DiscordLogo";
import TelegramLogo from "@/components/Icons/TelegramLogo";
import WhatsappLogo from "@/components/Icons/WhatsappLogo";
import XLogo from "@/components/Icons/XLogo";
import MetaTags from "@/components/shared/MetaTags"
import { useState } from "react"
import { ClimbingBoxLoader } from "react-spinners";


const TokenSale = () => {
  const [loading, setIsLoading] = useState(true);

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
   <div className="w-full h-full">
      <MetaTags
        title="Karbon Sale | Token Sale Dapp"
        description="Buy Karbon token and participate in the referral"
        />
        
          <div className="p-10">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-col w-[795px] items-center justify-center">
                <div className="flex items-center w-[795px] justify-center flex-col space-y-1">
                  <div className="flex flex-col space-y-10 w-[795px] bg-[#121212] p-5 rounded-t-[16px]">
                    <p className="text-white text-[20px] font-semibold">Referrals</p>
                    
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

              </div>

            </div>

          </div>
        

        <div>

        </div>
   </div>
  )
}

export default TokenSale
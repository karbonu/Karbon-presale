import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog.tsx"
import DialogClose from "../Icons/DialogClose.tsx"
import { Separator } from "../ui/separator.tsx"
import CopyIcon from "../Icons/CopyIcon.tsx"
import DiscordLogo from "../Icons/DiscordLogo.tsx"
import TelegramLogo from "../Icons/TelegramLogo.tsx"
import WhatsappLogo from "../Icons/WhatsappLogo.tsx"
import XLogo from "../Icons/XLogo.tsx"
import { useState } from "react"
import CheckMark from "../Icons/CheckMark.tsx"
import { useAuth } from "./Contexts/AuthContext.tsx"


const PayoutModalFaliure = (props : any) => {

  const [copied, setCopied] = useState(false);
  const {referralCode} = useAuth();
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const ReferralLink = `${window.location.origin}/signup?referralCode=${referralCode}`

  const handleCopy = () => {
    const link = ReferralLink ?? "";
    navigator.clipboard.writeText((link)).then(() => {
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
  return (
    <div>
        <Dialog open={props.isDialogOpen} onOpenChange={props.setIsDialogOpen}>
            <DialogContent className='bg-[#101010] border-[1px] border-[#282828] py-10  flex flex-col w-[412px] max-sm:w-[300px] items-center justify-center rounded-[16px] outline-none'>
                <div className='w-full flex px-8 flex-row items-center justify-between'>
                    <p className="text-white font-semibold text-[16px]">You’re not there yet!</p>
                    <div onClick={() => props.setIsDialogOpen(false)} className='cursor-pointer '>
                        <DialogClose/>
                    </div>
                </div>      
                <div className="w-full py-5 flex flex-col space-y-6">
                    <p className=" text-white px-8 text-[14px]">You need to purchase a minimum of <span className="font-bold">5000 USDT</span> before you are eligible to request payouts.</p>
                    <div className="w-full">
                        <Separator className="w-full bg-black h-[2px] "/>
                    </div>

                    <p className=" text-white px-8 text-[14px]">Copy your unique referral code and earn 2.5% commissions from every investment made by your referred investors.</p>

                    <div className="flex flex-col space-y-2 px-8 max-sm:px-5">
                      <div className="flex fle-row w-max items-center py-2 px-4 max-sm:px-2 bg-black space-x-10 max-sm:space-x-2">
                        <div>
                          <p className="text-white text-[12px]">{ReferralLink.slice(0, 30)}...</p>
                        </div>
                        <div onClick={handleCopy} className="flex flex-row items-center space-x-1 cursor-pointer">
                          {copied ? <CheckMark/> : <CopyIcon/>}
                          <p className="text-[#08E04A] text-[10px]">
                              {copied ? "Copied" : "Copy"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-center space-x-5">
                        <p className="text-[12px] opacity-50 text-white">Share on</p>

                        <div className=" opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <DiscordLogo/>
                        </div>
                        <div className=" opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <TelegramLogo/>
                        </div>
                        <div className=" opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <WhatsappLogo/>
                        </div>
                        <div className=" opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                          <XLogo/>
                        </div>
                      </div>

                    </div>
                    
                </div>
            </DialogContent>
          </Dialog>
    </div>
  )
}

export default PayoutModalFaliure
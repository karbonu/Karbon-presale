import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog.tsx";
import DialogClose from "../Icons/DialogClose.tsx";
import { Separator } from "../ui/separator.tsx";
import CopyIcon from "../Icons/CopyIcon.tsx";
import DiscordLogo from "../Icons/DiscordLogo.tsx";
import TelegramLogo from "../Icons/TelegramLogo.tsx";
import WhatsappLogo from "../Icons/WhatsappLogo.tsx";
import XLogo from "../Icons/XLogo.tsx";
import { useState } from "react";
import CheckMark from "../Icons/CheckMark.tsx";
import { useAuth } from "./Contexts/AuthContext.tsx";
import { useTranslation } from "react-i18next";

const PayoutModalFailure = (props: any) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { UserID } = useAuth();
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const ReferralLink = `${window.location.origin}/signup?referralCode=${UserID}`;

  const discordShareUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(`Join the Karbon Sale using my referral link: ${ReferralLink}`)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(ReferralLink)}&text=${encodeURIComponent('Join the Karbon Sale using my referral link!')}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`Join the Karbon Sale using my referral link: ${ReferralLink}`)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(ReferralLink)}&text=${encodeURIComponent('Join the Karbon Sale using my referral link!')}`;

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
        <DialogContent className='bg-[#101010] border-[1px] border-[#282828] py-10 flex flex-col w-[412px] max-sm:w-[95%] items-center justify-center rounded-[16px] outline-none'>
          <div className='w-full flex px-8 flex-row items-center justify-between'>
            <p className="text-white font-semibold max-sm:text-[14px] text-[16px]">{t('notThereYet')}</p>
            <div onClick={() => props.setIsDialogOpen(false)} className='cursor-pointer '>
              <DialogClose />
            </div>
          </div>
          <div className="w-full py-5 flex flex-col space-y-6">
            <p className="text-white px-8 text-[14px] max-sm:text-[12px]">{t('purchaseMin')} <span className="font-bold">5000 USDT</span> {t('eligiblePayout')}</p>
            <div className="w-full">
              <Separator className="w-full bg-black h-[2px]" />
            </div>
            <p className="text-white px-8 text-[14px] max-sm:text-[12px]">{t('copyReferral')}</p>
            <div className="flex flex-col space-y-2 px-8 max-sm:px-5">
              <div className="flex flex-row w-max items-center py-2 px-4 max-sm:px-2 bg-black space-x-10 max-sm:space-x-2">
                <div>
                  <p className="text-white text-[12px] max-sm:text-[10px]">{ReferralLink.slice(0, 30)}...</p>
                </div>
                <div onClick={handleCopy} className="flex flex-row items-center space-x-1 cursor-pointer">
                  {copied ? <CheckMark /> : <CopyIcon />}
                  <p className="text-[#08E04A] text-[10px]">
                    {copied ? t('copied') : t('copy')}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <p className="text-[12px] max-sm:text-[10px] opacity-50 text-white">{t('shareOn')}</p>
                <a onClick={() => props.setIsDialogOpen(false)} href={discordShareUrl} target="blank" className="opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                  <DiscordLogo />
                </a>
                <a onClick={() => props.setIsDialogOpen(false)} href={telegramShareUrl} target="blank" className="opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                  <TelegramLogo />
                </a>
                <a onClick={() => props.setIsDialogOpen(false)} href={whatsappShareUrl} target="blank" className="opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                  <WhatsappLogo />
                </a>
                <a onClick={() => props.setIsDialogOpen(false)} href={xShareUrl} target="blank" className="opacity-50 hover:opacity-100 cursor-pointer hover:scale-110 transition ease-in-out">
                  <XLogo />
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayoutModalFailure;

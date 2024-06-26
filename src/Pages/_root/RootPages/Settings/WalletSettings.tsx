import CopyIcon from "@/components/Icons/CopyIcon";
import KeyIcon from "@/components/Icons/KeyIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import { useDisconnect, useAccount } from 'wagmi'
import MetaTags from "@/components/shared/MetaTags"
import DisconnectIcon from "@/components/Icons/DisconnectIcon";
import { useState } from "react";
import CheckMark from "@/components/Icons/CheckMark";


const WalletSettings = () => {

const {address} = useAccount();
  const { disconnect } = useDisconnect()

  const [copied, setCopied] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    const stringAddress = address ?? "";
    navigator.clipboard.writeText((stringAddress)).then(() => {
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
    <div className="flex flex-col max-lg:w-full max-sm:max-w-[100%] pt-10 space-y-4 justify-between">
        <MetaTags
        title="Karbon Sale | Waallet Settings"
        />
         
        <div className="border-[1px] border-[#282828] max-w-[740px] max-lg:w-full max-sm:h-full h-[95px] bg-black rounded-[8px]">
            <div className="p-3 flex-col space-y-3 h-full justify-between">
                <div className="flex flex-row rounded-[2px] justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[110px]">
                <WalletIcon/>
                <p className="text-white text-[10px] opacity-70">WALLET ADDRESS</p>
                </div>
                <div className="flex flex-row max-sm:flex-col max-sm:space-y-2  md:items-center md:space-x-5">
                <p className="text-white text-[16px] max-sm:font-normal max-sm:text-[10px] font-semibold">
                    {!address ? (
                        "Connect Your Wallet"
                    ): (
                        <>
                            {address}
                        </>
                    )}
                </p>
                {address && (
                    <div onClick={handleCopy} className="flex flex-row space-x-2 cursor-pointer">
                        {copied ? <CheckMark/> : <CopyIcon/>}
                        <p className="text-[#08E04A] text-[10px]">
                            {copied ? "Copied" : "Copy Address"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>

    <div className="border-[1px] border-[#282828] max-w-[740px] max-lg:w-full max-sm:h-full h-[95px] bg-black rounded-[8px]">
    <div className="p-3 flex-col space-y-3 h-full justify-between">
        <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[73px]">
        <KeyIcon/>
        <p className="text-white text-[10px] opacity-70">Network</p>
        </div>
        <p className="text-white text-[16px] max-sm:font-normal max-sm:text-[10px] font-semibold">Ethereum</p>
    </div>
    </div>

    <div className="flex flex-row max-lg:flex-col pt-10 justify-between items-center max-lg:space-y-2">
        <div className="flex flex-row lg:space-x-40 max-lg:w-full max-lg:justify-between max-sm:px-5">
        <p className="text-[8px] text-white opacity-30">Copyright © 2024 Karbon. All rights reserved.</p>
        <p className="text-[8px] text-white opacity-30">Gaziantep, Türkiye</p>
        </div>

        
        {address && (
            <div className="bg-black cursor-pointer hover:scale-95 transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
            <div onClick={() => disconnect()} className="flex flex-row space-x-1 items-center px-4 py-2">
                <DisconnectIcon/>
                <p className="text-[#FF3636] text-[16px]">Disconnect Wallet</p>
            </div>
            </div>
        )}
    </div>

</div>
  )
}

export default WalletSettings
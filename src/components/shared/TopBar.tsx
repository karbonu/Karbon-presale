import DownIcon from "../Icons/DownIcon"
import EthIcon from "../Icons/EthIcon"
import { Separator } from "../ui/separator"
import {  useLocation } from 'react-router-dom';
import ConnectIconGreen from "../Icons/ConnectIconGreen";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

const TopBar = () => {
    let title;

    const location = useLocation();

    const currentPath = location.pathname;

    if (currentPath === '/dashboard/tokensale') {
      title = 'Token Sale DApp';
    } else if (currentPath === '/dashboard/claimtokens') {
      title = 'Claim Token';
    } else if (currentPath === '/dashboard/settings') {
      title = 'Settings';
    } else if(currentPath === '/dashboard'){
      title = 'Token Sale DApp';
    }else{
      title = 'Invalid Path';
    }



    
    const email = "you@gmail.com";

    
    const { open } = useWeb3Modal()

    const { address } = useAccount()

  return (
    <div className=" w-full">
        <div className="flex items-center justify-between">
            <p className="text-white font-semibold text-[20px]">{title}</p>

            {!address ? (
              <div className="flex flex-row space-x-2">
                <div onClick={() => open()} className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer">
                  <ConnectIconGreen/>
                  <p className="text-white text-[12px]">Connect Wallet</p>
                </div>

                <div className="flex flex-row bg-[#101010] py-2 px-3 rounded-[4px] cursor-pointer items-center space-x-2">
                    <p className="text-[12px] text-white">{email}</p>
                    <DownIcon/>
                </div>
              </div>
            ): (
              <div className="bg-[#101010] border-[1px] border-[#282828] rounded-[4px]">
                <div className="px-2 py-2">
                    <div className="flex flex-row space-x-4">
                        <div onClick={() => open()} className="flex flex-row cursor-pointer space-x-2">
                            <EthIcon/>
                            <p className="text-white text-[12px]">{address}</p>
                        </div>
                        <div>
                            <Separator className="bg-[#484848]" orientation="vertical"/>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <p className="text-[12px] text-white">{email}</p>
                            <DownIcon/>
                        </div>
                    </div>
                </div>
              </div>
            )}
        </div>
    </div>
  )
}

export default TopBar
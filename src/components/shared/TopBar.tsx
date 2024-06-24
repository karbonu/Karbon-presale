import DownIcon from "../Icons/DownIcon"
import EthIcon from "../Icons/EthIcon"
import { Separator } from "../ui/separator"
import {  useLocation } from 'react-router-dom';
import ConnectIconGreen from "../Icons/ConnectIconGreen";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { useState } from "react";
import ForwardIcon from "../Icons/ForwardIcon";

const TopBar = () => {
    let title;

    const location = useLocation();

    const currentPath = location.pathname;

    if (currentPath === '/dashboard/tokensale') {
      title = 'Token Sale DApp';
    } else if (currentPath === '/dashboard/claimtokens') {
      title = 'Claim Token';
    } else if (currentPath === '/dashboard/settings' || currentPath === '/dashboard/settings/profilesettings' || currentPath === '/dashboard/settings/walletsettings') {
      title = 'Settings';
    } else if(currentPath === '/dashboard'){
      title = 'Token Sale DApp';
    }else{
      title = 'Invalid Path';
    }

    const [showDropdown, setShowDropdown] = useState(false);



    
    const email = "you@gmail.com";

    
    const { open } = useWeb3Modal();

    const { address } = useAccount();

    const handleDropdown = () => {
      setShowDropdown(!showDropdown);
    }

  return (
    <div className=" w-full">
        <div className="flex items-center justify-between max-md:hidden">
            <p className="text-white font-semibold text-[20px]">{title}</p>

            {!address ? (
              <div className="flex flex-col">
                <div className="flex flex-row space-x-2">
                  <div onClick={() => open()} className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer">
                    <ConnectIconGreen/>
                    <p className="text-white text-[12px]">Connect Wallet</p>
                  </div>

                  <div onClick={handleDropdown} className="flex flex-row bg-[#101010] py-2 px-3 rounded-[4px] cursor-pointer items-center space-x-2">
                      <p className="text-[12px] text-white">{email}</p>
                      <div className={showDropdown ? 'rotate-[180deg] transition ease-in-out' : 'transition ease-in-out'}>
                        <DownIcon/>
                      </div>
                  </div>
                </div>
                {showDropdown && (
                  <div onMouseLeave={handleDropdown}   className={`bg-[#121212] transition-all duration-300 overflow-hidden w-[291px] fade-transition z-50 absolute my-10 ${
                    showDropdown ? "max-h-screen ease-in" : "max-h-0 ease-out"
                  }`}>
                    <div className="flex flex-col">
                      <div className="p-5 flex flex-col w-full space-y-3">
                        
                        <a href="/dashboard/settings/profilesettings" onClick={handleDropdown} className="bg-[#0C0C0C] cursor-pointer rounded-[4px]">
                          <div className="flex flex-row items-center justify-between p-3">
                            <p className="text-[12px] text-white">Profile</p>
                            <ForwardIcon/>
                          </div>
                        </a>

                        <a href="/dashboard/settings/walletsettings" onClick={handleDropdown} className="bg-[#0C0C0C] cursor-pointer rounded-[4px]">
                          <div className="flex flex-row items-center justify-between p-3">
                            <p className="text-[12px] text-white">Wallet Settings</p>
                            <ForwardIcon/>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="w-full cursor-pointer bg-[#0C0C0C]">
                      <div className="p-3 flex items-center justify-center">
                        <p className="text-[#FF3636] text-[12px]">Sign Out</p>

                      </div>

                    </div>
                  </div>
                )}
              </div>
        
            ): (
              <div className="flex flex-col">
                <div className="bg-[#101010] border-[1px] border-[#282828] rounded-[4px]">
                  <div className="px-2 py-2">
                      <div className="flex flex-row space-x-4">
                          <div onClick={() => open()} className="flex flex-row cursor-pointer space-x-2">
                              <EthIcon/>
                              <p className="text-white text-[12px]">  {`${address.slice(0, 11)}...`}</p>
                          </div>
                          <div>
                              <Separator className="bg-[#484848]" orientation="vertical"/>
                          </div>
                          <div onClick={handleDropdown} className="flex cursor-pointer flex-row items-center space-x-2">
                              <p className="text-[12px] text-white">{email}</p>
                              <div className={showDropdown ? 'rotate-[180deg] transition ease-in-out' : 'transition ease-in-out'}>
                                <DownIcon/>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
                {showDropdown && (
                  <div onMouseLeave={handleDropdown}   className={`bg-[#121212] transition-all duration-300 overflow-hidden w-[291px] fade-transition z-50 absolute my-10 ${
                    showDropdown ? "max-h-screen ease-in" : "max-h-0 ease-out"
                  }`}>
                    <div className="flex flex-col">
                      <div className="p-5 flex flex-col w-full space-y-3">
                        
                        <a href="/dashboard/settings/profilesettings" onClick={handleDropdown} className="bg-[#0C0C0C] cursor-pointer rounded-[4px]">
                          <div className="flex flex-row items-center justify-between p-3">
                            <p className="text-[12px] text-white">Profile</p>
                            <ForwardIcon/>
                          </div>
                        </a>

                        <a href="/dashboard/settings/walletsettings" onClick={handleDropdown} className="bg-[#0C0C0C] cursor-pointer rounded-[4px]">
                          <div className="flex flex-row items-center justify-between p-3">
                            <p className="text-[12px] text-white">Wallet Settings</p>
                            <ForwardIcon/>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="w-full cursor-pointer bg-[#0C0C0C]">
                      <div className="p-3 flex items-center justify-center">
                        <p className="text-[#FF3636] text-[12px]">Sign Out</p>

                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
        </div>


    </div>
  )
}

export default TopBar
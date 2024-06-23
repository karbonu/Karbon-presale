import CopyIcon from "@/components/Icons/CopyIcon";
import DisconnectIcon from "@/components/Icons/DisconnectIcon";
import KeyIcon from "@/components/Icons/KeyIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import MetaTags from "@/components/shared/MetaTags"
import { useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";



const Settings = () => {
  const [loading, setIsLoading] = useState(true);

  const [tab, selectedTab] = useState(1);

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


  return (
    <div className="w-full">
        <MetaTags
        title="Karbon Sale | Settings"
        />
         <div className="w-full flex items-center ">
          <div className="w-[784px] bg-[#121212] min-h-[370px] rounded-[16px]">
            <div className="py-5 px-5 h-full">
              <div className="flex flex-col h-full justify-between">
              <div className="flex flex-row space-x-2">
                <div 
                  onClick={() => selectedTab(1)} 
                  className={`cursor-pointer font-bold text-[14px] px-8 py-2 hover:text-black rounded-full ${tab === 1 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  Wallet
                </div>
                <div 
                  onClick={() => selectedTab(2)} 
                  className={`cursor-pointer px-8 font-bold text-[14px] py-2 hover:text-black rounded-full ${tab === 2 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  Profile Settings
                </div>
              </div>

                <div className="py-5">
                  {tab === 1 &&(
                    <div className="flex flex-col space-y-4 justify-between">
                      <div className="border-[1px] border-[#282828] max-w-[740px] h-[95px] bg-black rounded-[8px]">
                        <div className="p-3 flex-col space-y-3 h-full justify-between">
                          <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[110px]">
                            <WalletIcon/>
                            <p className="text-white text-[10px] opacity-70">WALLET ADDRESS</p>
                          </div>
                          <div className="flex flex-row items-center space-x-5">
                            <p className="text-white text-[16px] font-semibold">Hjew82749274820dsjhhshfkjsuisdbfhj89234hjkadenfbjkwkkuisdbfhj89</p>
                            <div className="flex flex-row space-x-2 cursor-pointer">
                              <CopyIcon/>
                              <p className="text-[#08E04A] text-[10px]">Copy Address</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-[1px] border-[#282828] max-w-[740px] h-[95px] bg-black rounded-[8px]">
                        <div className="p-3 flex-col space-y-3 h-full justify-between">
                          <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[73px]">
                            <KeyIcon/>
                            <p className="text-white text-[10px] opacity-70">Network</p>
                          </div>
                          <p className="text-white text-[16px] font-semibold">Ethereum</p>
                        </div>
                      </div>

                    </div>
                  )}

                  {tab === 2 && (
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-row w-full space-x-2 justify-between">
                        <div className="border-[1px] border-[#282828] h-[95px] min-w-[364px] bg-black rounded-[8px]">
                          <div className="p-3 flex-col space-y-3 h-full justify-between">
                            <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[54px]">
                              <WalletIcon/>
                              <p className="text-white text-[10px] opacity-70">Email</p>
                            </div>
                            <div className="flex flex-row items-center space-x-5">
                              <p className="text-white font-light text-[14px] ">you@gmail.com</p>
                            </div>
                          </div>
                        </div>
                        <div className="border-[1px] border-[#282828] h-[95px] min-w-[364px] bg-black rounded-[8px]">
                          <div className="p-3 flex-col space-y-3 h-full justify-between">
                            <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[97px]">
                              <WalletIcon/>
                              <p className="text-white text-[10px] opacity-70">Referral Link</p>
                            </div>
                            <div className="flex flex-row items-center space-x-5">
                              <p className="text-white font-light text-[14px] ">https://karbon.com/78236-tube...</p>
                              <div className="flex flex-row space-x-2 cursor-pointer">
                                <CopyIcon/>
                                <p className="text-[#08E04A] text-[10px]">Copy</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="flex flex-1">
                        <div className="bg-black border-[1px] border-[#282828] rounded-[8px]">
                          <div className="flex flex-col p-5 space-y-4">
                            <p className="text-white font-medium text-[20px]">Change Password</p>
                            <div className="flex flex-row w-full items-center justify-between space-x-2">
                              <div className="flex flex-col space-y-2">
                                <p className="text-white text-[12px]">New Password</p>
                                <input type="password" className=" outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] h-[40px] text-white"/>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <p className="text-white text-[12px]">Confirm New Password</p>
                                <input type="password" className=" outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] h-[40px] text-white"/>
                              </div>

                            </div>

                            <div>
                              <div className="bg-transparent text-[14px] text-white w-max opacity-70 hover:opacity-100 hover:text-black  hover:bg-white  transition ease-in-out border-[1px] border-white rounded-full cursor-pointer px-8 py-2">
                                Profile Settings
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row space-x-40">
                    <p className="text-[8px] text-white opacity-30">Copyright © 2024 Karbon. All rights reserved.</p>
                    <p className="text-[8px] text-white opacity-30">Gaziantep, Türkiye</p>
                  </div>

                  {tab ===1 && (
                    <div className="bg-black cursor-pointer hover:scale-95 transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
                      <div className="flex flex-row space-x-1 items-center px-4 py-2">
                        <DisconnectIcon/>
                        <p className="text-[#FF3636] text-[16px]">Disconnect Wallet</p>
                      </div>
                    </div>
                  )}

                  {tab === 2 && (
                    <div className="bg-black cursor-pointer hover:scale-95 transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
                      <div className="flex flex-row space-x-1 items-center px-4 py-2">
                        <p className="text-[#FF3636] text-[16px]">Sign Out</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
    </div>
  )
}

export default Settings
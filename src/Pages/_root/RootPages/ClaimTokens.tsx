import MetaTags from "@/components/shared/MetaTags"
import { useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import Dot from "@/components/Icons/Dot";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoTrasactionsLogo from "@/components/Icons/NoTrasactionsLogo";
import DownIcon from "@/components/Icons/DownIcon";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";



const ClaimTokens = () => {

  const [loading, setIsLoading] = useState(true);
  const [showMobileSchedule, setShowMobileSchedule] = useState(false);
  const handleSchedule = () =>{
    setShowMobileSchedule(!showMobileSchedule)
  }

  const tableData = [
    {
      index: "1",
      karbonAmount: "5,462",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "2",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "3",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "4",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "5",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "6",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "7",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "7",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "7",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
    {
      index: "7",
      karbonAmount: "517",
      releaseMonth: "02 FEB",
      releaseTime: "19:23:00",
    },
  ]

  const {isConnected} = useAccount();
  const {open} = useWeb3Modal();

  const handleClaimAction = () =>{
    if(!isConnected){
      open()
    }else{
      console.log("claimed")
    }
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



  return (

    <div className="w-full h-full">
        <MetaTags
        title="Karbon Sale | Claim Token"
        />
        <p className="text-white lg:hidden font-bold text-[20px]">Claim Tokens</p>
        <div className="w-full h-full flex flex-col space-y-5 items-center justify-center">
          <div className="lg:w-[1152px] max-sm:w-full bg-[#101010] rounded-[8px] lg:h-[210px]">
            <div className="flex flex-col p-10 max-md:p-5 space-y-5">
              <div className="flex flex-row max-md:flex-col max-md:space-y-5 lg:items-center justify-between w-full">

                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[12px] opacity-70">TOKENS BOUGHT</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">00.00345</p>
                    <p className="text-white text-[24px] opacity-50">KARBON</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[12px] opacity-70">A064NT SPENT</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">21,325</p>
                    <p className="text-white text-[14px]">.45</p>
                    <p className="text-white text-[24px] opacity-50">USDT</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[12px] opacity-70">TOKEN VALUE</p>
                  <div className="flex flex-row space-x-1">
                    <p className="text-white text-[24px]">21,325</p>
                    <p className="text-white text-[14px]">.45</p>
                    <p className="text-white text-[24px] opacity-50">USDT</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[12px] opacity-70">ESTIMATED CLAIM TIME</p>
                  <p className="text-white text-[24px]">1d 22h 45m 34s</p>
                </div>

              </div>

              <div>
              <div onClick={handleClaimAction} className="flex items-center justify-center bg-[#08E04A] w-[269px] h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                  <p className="font-bold text-[14px] shadow-sm">
                    {isConnected ? (
                      "Claim Tokens"
                    ):(
                      "Connect Wallet"
                    )}
                      
                  </p>
              </div>
              </div>

            </div>

          </div>

          <div className="w-[1152px] bg-[#101010] rounded-[8px] h-[490px] max-sm:hidden">
            <div className="flex w-full flex-col px-2 py-5 space-y-5">
              <p className="text-white px-8 text-[20px] font-semibold">Vesting Schedule</p>
              <div className="w-full">
                <table className="w-full p">
                  <thead className="bg-black h-[32px] hover:bg-black border-b-[#151515]">
                    <tr className="border-b-[#151515] flex items-center justify-between w-full py-3 px-5">
                      <th className="text-white opacity-50 font-normal text-[12px]">VESTING PERIOD</th>
                      <th className="text-white opacity-50 font-normal text-[12px] ">TOKENS RELEASED</th>
                      <th className="text-white opacity-50 font-normal pr-5 text-[12px]">ESTIMATED RELEASE DATE</th>
                    </tr>
                  </thead>
                  <ScrollArea className="w-[100%] h-[22.5rem]">
                    <tbody>
                      {tableData === null ? (
                        <div className="bg-black flex min-h-[42vh] items-center justify-center flex-col space-y-5">
                          <NoTrasactionsLogo/>
                          <div className="flex flex-col space-y-1 items-center justify-center">
                            <p  className="text-white opacity-70 text-[12px]">No Transactions Yet</p>
                            <p  className="text-white opacity-50 text-[12px]">Buy Tokens to get started</p>
                          </div>

                        </div>
                      ): (
                        <>
                          {tableData.map((data) => (
                          <tr className="hover:bg-black border-b-[1px] h-[47px] pl-5 pr-14 w-full flex flex-row items-center justify-between border-b-[#151515] hover:bg-opacity-40 bg-black bg-opacity-40" key={data.index}>
                            <td className="font-bold text-white text-start">{data.index}</td>

                            <td className=" text-white pl-[6rem]">{data.karbonAmount} <span className=" opacity-50">KARBON</span></td>
                            <td className="flex flex-row items-center space-x-2">
                              <p className=" text-white opacity-50">{data.releaseMonth} </p>
                              <Dot/>
                              <p className=" text-white opacity-50">{data.releaseTime} </p>
                            </td>
                          </tr>
                        ))}
                        </>
                      )}
                    </tbody>
                  </ScrollArea>
                </table>

              </div>
            </div>
          </div>

          <div className="bg-[#101010] lg:hidden rounded-[8px]  w-full">
            <div className="p-5 flex flex-col space-y-2">
              <div onClick={handleSchedule} className="flex flex-row space-x-3 items-center">
                <p className="text-white  font-medium text-[20px]">Vesting Schedule</p>
                <div className={showMobileSchedule ? "rotate-[180deg] transition ease-in-out" : "rotate-0 transition  ease-in-out"}>
                  <DownIcon/>
                </div>
              </div>
              {showMobileSchedule && (
                <div className="bg-black w-full">
                  <div className="p-5">
                    
                    <table className="w-full">
                      <tbody>
                        <ScrollArea className="h-[380px] w-full">
                          {tableData === null ? (
                            <div className="bg-black flex min-h-[42vh] items-center justify-center flex-col space-y-5">
                              <NoTrasactionsLogo/>
                              <div className="flex flex-col space-y-1 items-center justify-center">
                                <p  className="text-white opacity-70 text-[12px]">No Transactions Yet</p>
                                <p  className="text-white opacity-50 text-[12px]">Buy Tokens to get started</p>
                              </div>

                            </div>
                          ): (
                            <>
                              {tableData.map((data) => (
                                <tr className=" border-b-[1px] w-full flex flex-row  justify-between border-b-[#151515] hover:bg-opacity-40 bg-black bg-opacity-40" key={data.index}>
                                  <td className="font-bold text-white text-start">{data.index}</td>
                                  <td className="flex flex-col pr-3 items-end justify-end space-y-2">
                                    <p className=" text-white text-[16px]">{data.karbonAmount} <span className=" opacity-50">KARBON</span></p>
                                    <div className="flex flex-row items-center space-x-2">
                                      <p className=" text-white text-[12px] opacity-50">{data.releaseMonth} </p>
                                      <Dot/>
                                      <p className=" text-white text-[12px] opacity-50">{data.releaseTime} </p>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </ScrollArea>
                      </tbody>
                    </table>
                  </div>
                </div>
                                    
              )}

            </div>

          </div>

        </div>
    </div>
  )
}

export default ClaimTokens
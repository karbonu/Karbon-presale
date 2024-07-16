import MetaTags from "@/components/shared/MetaTags.tsx"
import { useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import Dot from "@/components/Icons/Dot.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import NoTrasactionsLogo from "@/components/Icons/NoTrasactionsLogo.tsx";
import DownIcon from "@/components/Icons/DownIcon.tsx";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useTranslation } from "react-i18next";
import useSocketIO from "@/components/shared/Constants/UseSocket";
import { getPresaleID, getTotalUSDSpent } from "@/components/shared/Hooks/TokenSaleHooks";
import { useAuth } from "@/components/shared/Contexts/AuthContext";



const ClaimTokens = () => {
  const { t } = useTranslation()
  const [loading, setIsLoading] = useState(true);
  const [showMobileSchedule, setShowMobileSchedule] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const handleSchedule = () => {
    setShowMobileSchedule(!showMobileSchedule)
  }
  const { UserID, accessToken, setPresaleID } = useAuth();
  const [decimalTotalAmount, setDecimalTotalAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saleRate, setSaleRate] = useState(0);
  const [tokensBought, setTokensBought] = useState(0);

  const tableData = [] as any

  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();


  const SOCKET_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;
  const { lastMessage } = useSocketIO(SOCKET_URL);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {

        const dollarResponse = await getTotalUSDSpent(UserID as string, accessToken);
        if (dollarResponse !== 'Failed' && isMounted) {
          const totalAmount_ = dollarResponse.data.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
          const amount = Math.trunc(totalAmount_);
          const dollarAmount = isNaN(amount) ? 0 : amount;

          const decimal = Math.abs(totalAmount_ % 1).toFixed(2).slice(2);

          setDecimalTotalAmount(Number(decimal));
          setTotalAmount(dollarAmount);

          const newTokensBought = dollarAmount * saleRate;

          setTokensBought(newTokensBought);
        }
      } catch (error) {
        //console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [lastMessage]);




  useEffect(() => {

    const fetchPresaleData = async () => {
      const response = await getPresaleID(accessToken);
      if (response !== 'Failed') {
        const presale = response.data.id;
        // const enddate = response.data.endDate;
        const startdate = response.data.startDate;
        const rate = Number(response.data.rate);
        setSaleRate(isNaN(rate) ? 0 : rate);
        localStorage.setItem('salerate', JSON.stringify(response.data.rate));

        setPresaleID(presale);

        initializeCountdown(new Date(startdate));
      }

    };

    const initializeCountdown = (start: Date) => {
      const updateCountdown = () => {
        const now = new Date();
        let distance = start.getTime() - now.getTime();

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

  }, [lastMessage]);



  const handleClaimAction = () => {
    if (!isConnected) {
      open()
    } else {
      console.log("claimed")
    }
  }


  if (loading) {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000ms = 2s

    return (
      <div
        className={`items-center justify-center flex w-full min-h-[88vh] bg-black bg-opacity-20 ${loading ? "fade-in" : "fade-out"
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
      <p className="text-white lg:hidden font-bold text-[20px]">{t('claimToken')}</p>
      <div className="w-full h-full flex flex-col space-y-5 items-center justify-center">
        <div className="lg:w-[100%] max-lg:w-full border-[1px] border-[#282828] bg-[#101010] rounded-[8px] lg:h-[210px]">
          <div className="flex flex-col max-lg:w-full max:lg:p-[3%] p-10 max-md:p-5 space-y-5">
            <div className="flex flex-row max-lg:w-full max-lg:flex-col max-md:space-y-5 lg:items-center justify-between w-full">

              <div className="flex flex-col space-y-2">
                <p className="text-white text-[80%] opacity-70">{t('tokensBought')}</p>
                <div className="flex flex-row space-x-1">
                  <p className="text-white text-[140%]">{tokensBought}</p>
                  <p className="text-white text-[140%] opacity-50">KARBON</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-white text-[80%] opacity-70">{t('amountSpent')}</p>
                <div className="flex flex-row space-x-1">
                  <p className="text-white text-[140%]">{totalAmount}</p>
                  <p className="text-white text-[14px]">.{decimalTotalAmount}</p>
                  <p className="text-white text-[140%] opacity-50">USDT</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-white text-[80%] opacity-70">{t('tokenValue')}</p>
                <div className="flex flex-row space-x-1">
                  <p className="text-white text-[140%]">{saleRate}</p>
                  <p className="text-white text-[14px]">.00</p>
                  <p className="text-white text-[140%] opacity-50">USDT</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-white text-[80%] opacity-70">{t('estimatedClaimTime')}</p>
                <div className="flex flex-row space-x-2">
                  <p className="text-white text-[20px]">{countdown.days}d</p>
                  <p className="text-white text-[20px]">{countdown.hours}h</p>
                  <p className="text-white text-[20px]">{countdown.minutes}m</p>
                  <p className="text-white text-[20px]">{countdown.seconds}s</p>
                </div>
              </div>

            </div>

            <div>
              <div onClick={handleClaimAction} className="flex items-center justify-center max-sm:w-full bg-[#08E04A] w-[269px] h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                <p className="font-bold text-[14px] shadow-sm">
                  {isConnected ? (
                    t('claimToken')
                  ) : (
                    t('connectWallet')
                  )}

                </p>
              </div>
            </div>

          </div>

        </div>

        <div className="w-[100%] border-[1px] border-[#282828] bg-[#101010] rounded-[8px] h-[490px] max-lg:hidden">
          <div className="flex w-full flex-col px-2 py-5 space-y-5">
            <p className="text-white px-8 text-[20px] font-semibold">{t('vestingSchedule')}</p>
            <div className="w-full">
              <table className="w-full p">
                <thead className="bg-black h-[32px] hover:bg-black border-b-[#151515]">
                  <tr className="border-b-[#151515] flex items-center justify-between w-full py-3 px-5">
                    <th className="text-white opacity-50 font-normal text-[12px]">{t('vestingPeriod')}</th>
                    <th className="text-white opacity-50 font-normal text-[12px] ">{t('tokensReleased')}</th>
                    <th className="text-white opacity-50 font-normal pr-5 text-[12px]">{t('estimatedReleaseDate')}</th>
                  </tr>
                </thead>
                <ScrollArea className="w-[100%] h-[22.5rem]">
                  <tbody>
                    {tableData.length === 0 ? (
                      <div className="bg-black flex min-h-[42vh] items-center justify-center flex-col space-y-5">
                        <NoTrasactionsLogo />
                        <div className="flex flex-col space-y-1 items-center justify-center">
                          <p className="text-white opacity-70 text-[12px]">{t('noTransactionsYet')}</p>
                          <p className="text-white opacity-50 text-[12px]">{t('buyTokensToGetStarted')}</p>
                        </div>

                      </div>
                    ) : (
                      <>
                        {tableData.map((data: any) => (
                          <tr className="hover:bg-black border-b-[1px] h-[47px] pl-5 pr-14 w-full flex flex-row items-center justify-between border-b-[#151515] hover:bg-opacity-40 bg-black bg-opacity-40" key={data.index}>
                            <td className="font-bold text-white text-start">{data.index}</td>

                            <td className=" text-white pl-[6rem]">{data.karbonAmount} <span className=" opacity-50">KARBON</span></td>
                            <td className="flex flex-row items-center space-x-2">
                              <p className=" text-white opacity-50">{data.releaseMonth} </p>
                              <Dot />
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
              <p className="text-white  font-medium text-[20px]">{t('vestingSchedule')}</p>
              <div className={showMobileSchedule ? "rotate-[180deg] transition ease-in-out" : "rotate-0 transition  ease-in-out"}>
                <DownIcon />
              </div>
            </div>
            {showMobileSchedule && (
              <div className="bg-black w-full">
                <div className="p-5">

                  <table className="w-full">
                    <tbody>
                      <ScrollArea className="h-[380px] w-full">
                        {tableData.length === 0 ? (
                          <div className="bg-black flex min-h-[42vh] items-center justify-center flex-col space-y-5">
                            <NoTrasactionsLogo />
                            <div className="flex flex-col space-y-1 items-center justify-center">
                              <p className="text-white opacity-70 text-[12px]">{t('noTransactionsYet')}</p>
                              <p className="text-white opacity-50 text-[12px]">{t('buyTokensToGetStarted')}</p>
                            </div>

                          </div>
                        ) : (
                          <>
                            {tableData.map((data: any) => (
                              <tr className=" border-b-[1px] w-full flex flex-row  justify-between border-b-[#151515] hover:bg-opacity-40 bg-black bg-opacity-40" key={data.index}>
                                <td className="font-bold text-white text-start">{data.index}</td>
                                <td className="flex flex-col pr-3 items-end justify-end space-y-2">
                                  <p className=" text-white text-[16px]">{data.karbonAmount} <span className=" opacity-50">KARBON</span></p>
                                  <div className="flex flex-row items-center space-x-2">
                                    <p className=" text-white text-[12px] opacity-50">{data.releaseMonth} </p>
                                    <Dot />
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
import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import axios, { AxiosResponse } from "axios";

import DownIcon from "../Icons/DownIcon.tsx";
import EthIcon from "../Icons/EthIcon.tsx";
import { Separator } from "../ui/separator.tsx";
import ConnectIconGreen from "../Icons/ConnectIconGreen.tsx";
import ForwardIcon from "../Icons/ForwardIcon.tsx";
import MenuIcon from "../Icons/MenuIcon.tsx";
import KarbonLogo from "../Icons/KarbonLogo.tsx";
import ClaimTokensBig from "../Icons/claimTokensBig.tsx";
import { Sheet, SheetContent } from "@/components/ui/sheet.tsx";
import CLoseXIxon from "../Icons/CLoseXIxon.tsx";
import DiscordLogo from "../Icons/DiscordLogo.tsx";
import TelegramLogo from "../Icons/TelegramLogo.tsx";
import XLogo from "../Icons/XLogo.tsx";
import TokenSaleIconBig from "../Icons/TokenSaleIconBig.tsx";
import TokenSaleWhiteBig from "../Icons/TokenSaleWhiteBig.tsx";
import ClaimTokensWhiteBig from "../Icons/ClaimTokensWhiteBig.tsx";
import SettingsIconBig from "../Icons/SettingsIconBig.tsx";
import SettingsIconWhiteBig from "../Icons/SettingsIconWhiteBig.tsx";
import RedirectIcon from "../Icons/RedirectIcon.tsx";
import { useAuth } from "./Contexts/AuthContext.tsx";
import { Dialog, DialogContent } from "../ui/dialog.tsx";
import DialogClose from "../Icons/DialogClose.tsx";
import WalletAlertIcon from "../Icons/WalletAlertIcon.tsx";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast.ts";
import { useTranslation } from "react-i18next";
import GermanyFlag from "../Icons/GermanyFlag.tsx";
import TurkeyLogo from "../Icons/TurkeyLogo.tsx";
import EnglishFlag from "../Icons/EnglishFlag.tsx";


type walletConnect = {
  email: string;
  walletAddress: string;
  password: string;
};


export const useConnectWallet = (auth: string): UseMutationResult<AxiosResponse<any>, Error, walletConnect> => {
  return useMutation<AxiosResponse<any>, Error, walletConnect>({
    mutationFn: (data: walletConnect) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}users/connect-wallet`, data, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
    },
  });
};



const TopBar = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLangyage] = useState(1);
  const [isLanguageDropActive, setIsLanguageDropActive] = useState(false);
  const { toast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const {
    email,
    password,
    accessToken,
    setPassword,
    setEmail,
    setIsGoogleSignIn,
    walletAddress,
    setWalletAddress,
    setAuthenticated,
    setReferralCOde,
    setUserID,
    setHasDisplayedConnectModal,
    setIsDropDownOpen,
    isDropDownOpen
  } = useAuth();

  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setisModalOpen] = useState(false);
  const connectMutate = useConnectWallet(accessToken);

  const handleSignOut = () => {
    setPassword('');
    setEmail('');
    setUserID('');
    setReferralCOde('');
    setWalletAddress('');
    setHasDisplayedConnectModal(false);
    setAuthenticated(false);
    setIsDropDownOpen(false);
    setIsGoogleSignIn(false);
    disconnect();
  };

  let title;
  const currentPath = location.pathname;

  if (currentPath === "/dashboard/tokensale") {
    title = t('tokenSaleDApp');
  } else if (currentPath === "/dashboard/claimtokens") {
    title = t('claimToken');
  } else if (
    currentPath === "/dashboard/settings" ||
    currentPath === "/dashboard/settings/profilesettings" ||
    currentPath === "/dashboard/settings/walletsettings"
  ) {
    title = t('settings');
  } else if (currentPath === "/dashboard" || currentPath === "/dashboard/") {
    title = t('tokenSaleDApp');
  } else {
    title = t('invalidPath');
  }

  const firstLink = location.pathname === '/dashboard' ? '/dashboard' : '/dashboard/tokensale';

  const activeClassName = "flex bg-black w-[100%] border-l border-l-[4px] border-[#08E04A]";
  const inactiveClassName =
    "flex bg-[#101010] w-[100%] opacity-70 hover:opacity-100 hover:border-l hover:border-l-[4px] hover:border-[#08E04A] transition ease-in-out";

  const handleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleStore = () => {
    connectMutate.mutate(
      {
        email,
        walletAddress: address as string,
        password
      },
      {
        onSuccess: () => {
          setWalletAddress(address as string);
          setisModalOpen(false);

          toast({
            variant: 'success',
            title: t('success'),
            description: t('walletConnected'),
          });
        },
        onError: () => {
          setisModalOpen(false);

          toast({
            variant: 'failure',
            title: t('error'),
            description: t('walletConnectionFailed'),
          });
        }
      }
    );
  };

  const storeWallet = () => {
    if (walletAddress === "" || walletAddress === null || walletAddress === address as string) {
      handleStore();
    } else {
      setisModalOpen(true);
    }
  };

  useEffect(() => {
    if (isConnected) {
      storeWallet();
    }
  }, [isConnected, address]);

  const handleModalClose = () => {
    setisModalOpen(false);
  };


  const { i18n } = useTranslation();
  useEffect(() => {
    console.log(i18n.language)

    if (i18n.language === 'en') {
      setSelectedLangyage(1);
    } else {
      if (i18n.language === 'de') {
        setSelectedLangyage(3);
      } else {
        setSelectedLangyage(2);
      }
    }
    if (i18n.language !== 'en' && i18n.language !== 'tr' && i18n.language !== 'de') {
      setSelectedLangyage(1);
    }
  }, []);



  const changeLanguage = (languageIndex: any) => {
    if (languageIndex === selectedLanguage) {
      console.log("current Index set");
    } else {
      if (languageIndex === 3) {

        i18n.changeLanguage('de');
        setSelectedLangyage(3);
        // setIsDropActive(false);
      } else {
        if (languageIndex === 2) {
          i18n.changeLanguage('tr');
          setSelectedLangyage(2);
        } else {
          i18n.changeLanguage('en');
          setSelectedLangyage(1);
        }
        // setIsDropActive(false);
      }
    }
  }

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>

        <DialogContent className='flex items-center justify-center w-[412px] bg-[#121212] max-sm:w-[70%] p-10 max-sm:py-7 max-sm:px-5 flex-col outline-none space-y-5'>
          <div className='flex flex-row w-full justify-end items-end'>
            <div onClick={() => handleModalClose()} className=' cursor-pointer'>
              <DialogClose />
            </div>
          </div>

          <div className="flex flex-col w-full space-y-2 items-center justify-center">
            <WalletAlertIcon />
            <p className="text-white font-semibold text-[20px] max-sm:text-[16px]">{t('switchWallet')}</p>
            <p className="text-white text-center w-[248px] text-[12px] max-sm:text-[10px]">{t('connectedNewWallet')}</p>
          </div>

          <div className="flex flex-col w-full items-center justify-center space-y-4">
            <div className="flex flex-row w-full items-center justify-between rounded-[8px] bg-black p-5">
              <p className="text-white text-[12px]">{t('previousWallet')}</p>
              <p className="text-white text-[12px]">{walletAddress?.slice(0, 10)}...{walletAddress?.slice(-4)}</p>
            </div>

            <div className="flex flex-row w-full items-center justify-between rounded-[8px] bg-black p-5">
              <p className="text-white text-[12px]">{t('newWallet')}</p>
              <p className="text-white text-[12px]">{address?.slice(0, 10)}...{address?.slice(-4)}</p>
            </div>
          </div>

          <button onClick={handleStore} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] outline-none rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
            <p className="font-bold text-[14px] shadow-sm">{t('switchToNewWallet')}</p>
          </button>


        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold max-lg:hidden text-[20px] max-sm:text-[14px]">{title}</p>
        <a href="/dashboard" className="lg:hidden">
          <KarbonLogo />
        </a>

        <div className="max-lg:hidden items-center flex flex-row relative space-x-2">
          <div className="flex absolute left-[-4rem] flex-col items-center">
            <div onClick={() => setIsLanguageDropActive(!isLanguageDropActive)} className="bg-[#101010] transition ease-in-out flex flex-col items-center space-y-2 px-2 py-2 border-[#282828] border-[1px]   rounded-sm cursor-pointer">
              <div className="transition ease-in-out flex flex-row items-center space-x-2">
                <div>
                  {selectedLanguage === 1 && (
                    <EnglishFlag />
                  )}
                  {selectedLanguage === 2 && (
                    <TurkeyLogo />
                  )}
                  {selectedLanguage === 3 && (
                    <GermanyFlag />
                  )}
                </div>
                <div className={isLanguageDropActive ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                  <DownIcon />
                </div>
              </div>

              {isLanguageDropActive && (
                <div className={` flex flex-col space-y-2 rounded-sm ${isLanguageDropActive ? 'animate-accordion-down' : 'animate-accordion-up'}`}>
                  <div onClick={() => { changeLanguage(1); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 1 ? 'hidden' : 'cursor-pointer pt-1'}`}>
                    <EnglishFlag />
                  </div>
                  <div onClick={() => { changeLanguage(2); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 2 ? 'hidden' : 'cursor-pointer'}`}>
                    <TurkeyLogo />
                  </div>
                  <div onClick={() => { changeLanguage(3); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 3 ? 'hidden' : 'cursor-pointer'}`}>
                    <GermanyFlag />
                  </div>
                </div>
              )}
            </div>
          </div>
          {!address ? (
            <div className="flex flex-col">
              <div className="flex flex-row space-x-2">
                <div
                  onClick={() => open()}
                  className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer"
                >
                  <ConnectIconGreen />
                  <p className="text-white text-[12px]">{t('connectWallet')}</p>
                </div>

                <div
                  onClick={handleDropdown}
                  className="flex flex-row bg-[#101010] py-2 px-3 rounded-[4px] cursor-pointer items-center space-x-2"
                >
                  <p className="text-[12px] text-white">{email}</p>
                  <div className={isDropDownOpen ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                    <DownIcon />
                  </div>
                </div>
              </div>
              {isDropDownOpen && (
                <div
                  onMouseLeave={handleDropdown}
                  className={`bg-[#121212] transition-all duration-300 overflow-hidden w-[291px] fade-transition z-50 absolute my-10 ${isDropDownOpen ? "max-h-screen ease-in" : "max-h-0 ease-out"}`}>
                  <div className="flex flex-col">
                    <div className="p-5 flex flex-col w-full space-y-3">
                      <a
                        href="/dashboard/settings/profilesettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('profile')}</p>
                          <ForwardIcon />
                        </div>
                      </a>

                      <a
                        href="/dashboard/settings/walletsettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('walletSettings')}</p>
                          <ForwardIcon />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div onClick={handleSignOut} className="w-full cursor-pointer bg-[#0C0C0C]">
                    <div className="p-3 flex items-center justify-center">
                      <p className="text-[#FF3636] text-[12px]">{t('signOut')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="bg-[#101010] border-[1px] border-[#282828] rounded-[4px]">
                <div className="px-2 py-2">
                  <div className="flex flex-row space-x-4">
                    <div onClick={() => open()} className="flex flex-row cursor-pointer space-x-2">
                      <EthIcon />
                      <p className="text-white text-[12px]"> {`${address.slice(0, 11)}...`}</p>
                    </div>
                    <div>
                      <Separator className="bg-[#484848]" orientation="vertical" />
                    </div>
                    <div onClick={handleDropdown} className="flex cursor-pointer flex-row items-center space-x-2">
                      <p className="text-[12px] text-white">{email}</p>
                      <div className={isDropDownOpen ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                        <DownIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isDropDownOpen && (
                <div
                  onMouseLeave={handleDropdown}
                  className={`bg-[#121212] border-[1px] border-[#282828] transition-all duration-300 overflow-hidden w-[291px] fade-transition ${isDropDownOpen ? 'animate-in' : 'animate-out'} z-50 absolute my-10 ${isDropDownOpen ? "max-h-screen ease-in" : "max-h-0 ease-out"
                    }`}
                >
                  <div className="flex flex-col">
                    <div className="p-5 flex flex-col w-full space-y-3">
                      <a
                        href="/dashboard/settings/profilesettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('profile')}</p>
                          <ForwardIcon />
                        </div>
                      </a>

                      <a
                        href="/dashboard/settings/walletsettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('walletSettings')}</p>
                          <ForwardIcon />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="w-full cursor-pointer bg-[#0C0C0C]">
                    <div onClick={handleSignOut} className="p-3 flex items-center justify-center">
                      <p className="text-[#FF3636] text-[12px]">{t('signOut')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <div className="flex flex-row items-center space-x-3">
            <div className="flex flex-col items-center justify-center w-full">
              {/* {!address ? (
                <div
                  onClick={() => open()}
                  className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer"
                >
                  <ConnectIconGreen />
                  <p className="text-white text-[12px]">{t('connectWallet')}</p>
                </div>
              ) : (
                <div onClick={() => open()} className="flex flex-row cursor-pointer space-x-2">
                  <EthIcon />
                  <p className="text-white text-[12px]"> {`${address.slice(0, 11)}...`}</p>
                </div>
              )} */}

              <div className="bg-[#101010] border-[1px] border-[#282828] rounded-[4px]">
                <div className="px-2 py-2">
                  <div className="flex flex-row space-x-4">
                    <div onClick={handleDropdown} className="flex cursor-pointer flex-row items-center space-x-2">
                      <p className="text-[12px] text-white">{email.slice(0, 5)}... {email.slice(-10)}</p>
                      <div className={isDropDownOpen ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                        <DownIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isDropDownOpen && (
                <div
                  onMouseLeave={handleDropdown}
                  className={`bg-[#121212] border-[1px] border-[#282828] transition-all duration-300 overflow-hidden w-[291px]  fade-transition ${isDropDownOpen ? ' animate-accordion-down' : ' animate-accordion-up'} z-50 absolute top-[5rem] left-1/2  -translate-x-1/2  ${isDropDownOpen ? "max-h-screen ease-in" : "max-h-0 ease-out"
                    }`}
                >
                  <div className="flex flex-col">
                    <div className="p-5 flex flex-col w-full space-y-3">
                      <a
                        href="/dashboard/settings/profilesettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('profile')}</p>
                          <ForwardIcon />
                        </div>
                      </a>

                      <a
                        href="/dashboard/settings/walletsettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">{t('walletSettings')}</p>
                          <ForwardIcon />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="w-full cursor-pointer bg-[#0C0C0C]">
                    <div onClick={handleSignOut} className="p-3 flex items-center justify-center">
                      <p className="text-[#FF3636] text-[12px]">{t('signOut')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div onClick={() => setShowMobileMenu(true)} className="cursor-pointer">
              <MenuIcon />
            </div>

            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetContent side={"left"} className="bg-[#101010] border-0 outline-none w-[245px]">
                <div className="flex flex-col pt-10 h-full justify-between">
                  <div className="flex flex-col">
                    <div onClick={() => setShowMobileMenu(false)} className="w-full px-5 flex items-end justify-end">
                      <CLoseXIxon />
                    </div>

                    <div className="flex flex-col pt-10 w-full space-y-3">
                      <NavLink
                        onClick={() => setShowMobileMenu(false)}
                        to={firstLink}
                        className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}
                      >
                        {({ isActive }) => (
                          <div className="flex items-center justify-center px-3 py-5 flex-row space-x-2">
                            {isActive ? <TokenSaleIconBig /> : <TokenSaleWhiteBig />}
                            <p className="font-semibold text-[20px] text-white">{t('tokenSale')}</p>
                          </div>
                        )}
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMobileMenu(false)}
                        to="/dashboard/claimtokens"
                        className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}
                      >
                        {({ isActive }) => (
                          <div className="flex items-center justify-center px-3 py-5 flex-row space-x-2">
                            {isActive ? <ClaimTokensBig /> : <ClaimTokensWhiteBig />}
                            <p className="font-semibold text-[20px] text-white">{t('settings')}</p>
                          </div>
                        )}
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMobileMenu(false)}
                        to="/dashboard/settings"
                        className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}
                      >
                        {({ isActive }) => (
                          <div className="flex items-center justify-center px-3 py-5 flex-row space-x-2">
                            {isActive ? <SettingsIconBig /> : <SettingsIconWhiteBig />}
                            <p className="font-semibold text-[20px] text-white">{t('settings')}</p>
                          </div>
                        )}
                      </NavLink>
                    </div>
                  </div>

                  <div className="w-max items-center space-x-2 px-5 py-2  rounded-sm cursor-pointer">
                    <div className="flex flex-col space-y-4">
                      <div onClick={() => { changeLanguage(1); setShowMobileMenu(false) }} className={`flex flex-row p-2 rounded-md space-x-2 w-max ${selectedLanguage === 1 ? 'border-[1px] bg-white bg-opacity-5' : 'bg-transparent'}`}>
                        <EnglishFlag />
                        <p className="text-[12px] text-white">English</p>
                      </div>

                      <div onClick={() => { changeLanguage(2); setShowMobileMenu(false) }} className={`flex flex-row p-2 rounded-md space-x-2 w-max ${selectedLanguage === 2 ? 'border-[1px] bg-white bg-opacity-5' : 'bg-transparent'}`}>
                        <TurkeyLogo />
                        <p className="text-[12px] text-white">Turkish</p>
                      </div>

                      <div onClick={() => { changeLanguage(3); setShowMobileMenu(false) }} className={`flex flex-row space-x-2 p-2 rounded-md w-max ${selectedLanguage === 3 ? 'border-[1px] bg-white bg-opacity-5' : 'bg-transparent'}`}>
                        <GermanyFlag />
                        <p className="text-[12px] text-white">German</p>
                      </div>
                    </div>
                  </div>


                  <div onClick={() => setShowMobileMenu(false)} className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-5 pb-5 pl-5 ">
                      <div className="flex flex-row cursor-pointer items-center space-x-2">
                        <p className="text-white opacity-50 text-[14px]">{t('termsOfService')}</p>
                        <RedirectIcon />
                      </div>
                      <div className="flex flex-row cursor-pointer items-center space-x-2">
                        <p className="text-white opacity-50 text-[14px]">{t('privacyPolicy')}</p>
                        <RedirectIcon />
                      </div>
                    </div>

                    <div onClick={handleSignOut} className="w-full flex cursor-pointer  items-center justify-center bg-[#0C0C0C]">
                      <p className="text-[#FF3636] py-4 text-[16px]">{t('signOut')}</p>
                    </div>

                    <div className="pb-10 pt-2 px-5 flex flex-col space-y-5">
                      <p className="text-white opacity-50 font-bold text-[12px]">{t('connectWithUs')}</p>
                      <div className="flex flex-row space-x-5">
                        <div onClick={() => setShowMobileMenu(false)} className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                          <DiscordLogo />
                        </div>
                        <div onClick={() => setShowMobileMenu(false)} className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                          <TelegramLogo />
                        </div>
                        <div onClick={() => setShowMobileMenu(false)} className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                          <XLogo />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div >
  );
};

export default TopBar;

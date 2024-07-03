import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import axios from "axios";

import DownIcon from "../Icons/DownIcon";
import EthIcon from "../Icons/EthIcon";
import { Separator } from "../ui/separator";
import ConnectIconGreen from "../Icons/ConnectIconGreen";
import ForwardIcon from "../Icons/ForwardIcon";
import MenuIcon from "../Icons/MenuIcon";
import KarbonLogo from "../Icons/KarbonLogo";
import ClaimTokensBig from "../Icons/claimTokensBig";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CLoseXIxon from "../Icons/CLoseXIxon";
import DiscordLogo from "../Icons/DiscordLogo";
import TelegramLogo from "../Icons/TelegramLogo";
import XLogo from "../Icons/XLogo";
import TokenSaleIconBig from "../Icons/TokenSaleIconBig";
import TokenSaleWhiteBig from "../Icons/TokenSaleWhiteBig";
import ClaimTokensWhiteBig from "../Icons/ClaimTokensWhiteBig";
import SettingsIconBig from "../Icons/SettingsIconBig";
import SettingsIconWhiteBig from "../Icons/SettingsIconWhiteBig";
import RedirectIcon from "../Icons/RedirectIcon";
import { useAuth } from "./Contexts/AuthContext";

const TopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const { email, password, setPassword, setEmail, setAuthenticated } = useAuth();
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const handleSignOut =() => {
    setEmail('');
    setPassword('');
    setAuthenticated(false);
  }

  let title;
  const currentPath = location.pathname;

  if (currentPath === "/dashboard/tokensale") {
    title = "Token Sale DApp";
  } else if (currentPath === "/dashboard/claimtokens") {
    title = "Claim Token";
  } else if (
    currentPath === "/dashboard/settings" ||
    currentPath === "/dashboard/settings/profilesettings" ||
    currentPath === "/dashboard/settings/walletsettings"
  ) {
    title = "Settings";
  } else if (currentPath === "/dashboard") {
    title = "Token Sale DApp";
  } else {
    title = "Invalid Path";
  }

  const firstLink = location.pathname === "/dashboard" ? "/dashboard" : "/dashboard/tokensale";

  const activeClassName = "flex bg-black w-[100%] border-l border-l-[4px] border-[#08E04A]";
  const inactiveClassName =
    "flex bg-[#101010] w-[100%] opacity-70 hover:opacity-100 hover:border-l hover:border-l-[4px] hover:border-[#08E04A] transition ease-in-out";

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to store wallet information
  const storeWallet = async () => {
    try {
      await axios.post("https://karbon.plana.ng/users/connect-wallet", {
        email,
        walletAddress: address,
        password: password, 
      });
    } catch (error) {
      console.log("Failed storing wallet to backend");
    }
  };

  // Trigger the wallet store function when the wallet connects
  useEffect(() => {
    if (address) {
      storeWallet();
    }
  }, [address]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold max-lg:hidden text-[20px] max-sm:text-[14px]">{title}</p>
        <a href="/dashboard" className="lg:hidden">
          <KarbonLogo />
        </a>

        <div className="max-lg:hidden">
          {!address ? (
            <div className="flex flex-col">
              <div className="flex flex-row space-x-2">
                <div
                  onClick={() => open()}
                  className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer"
                >
                  <ConnectIconGreen />
                  <p className="text-white text-[12px]">Connect Wallet</p>
                </div>

                <div
                  onClick={handleDropdown}
                  className="flex flex-row bg-[#101010] py-2 px-3 rounded-[4px] cursor-pointer items-center space-x-2"
                >
                  <p className="text-[12px] text-white">{email}</p>
                  <div className={showDropdown ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                    <DownIcon />
                  </div>
                </div>
              </div>
              {showDropdown && (
                <div
                  onMouseLeave={handleDropdown}
                  className={`bg-[#121212] transition-all duration-300 overflow-hidden w-[291px] fade-transition z-50 absolute my-10 ${
                    showDropdown ? "max-h-screen ease-in" : "max-h-0 ease-out"
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
                          <p className="text-[12px] text-white">Profile</p>
                          <ForwardIcon />
                        </div>
                      </a>

                      <a
                        href="/dashboard/settings/walletsettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">Wallet Settings</p>
                          <ForwardIcon />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div onClick={handleSignOut} className="w-full cursor-pointer bg-[#0C0C0C]">
                    <div className="p-3 flex items-center justify-center">
                      <p className="text-[#FF3636] text-[12px]">Sign Out</p>
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
                      <div className={showDropdown ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                        <DownIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showDropdown && (
                <div
                  onMouseLeave={handleDropdown}
                  className={`bg-[#121212] transition-all duration-300 overflow-hidden w-[291px] fade-transition z-50 absolute my-10 ${
                    showDropdown ? "max-h-screen ease-in" : "max-h-0 ease-out"
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
                          <p className="text-[12px] text-white">Profile</p>
                          <ForwardIcon />
                        </div>
                      </a>

                      <a
                        href="/dashboard/settings/walletsettings"
                        onClick={handleDropdown}
                        className="bg-[#0C0C0C] cursor-pointer rounded-[4px]"
                      >
                        <div className="flex flex-row items-center justify-between p-3">
                          <p className="text-[12px] text-white">Wallet Settings</p>
                          <ForwardIcon />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="w-full cursor-pointer bg-[#0C0C0C]">
                    <div onClick={handleSignOut}  className="p-3 flex items-center justify-center">
                      <p className="text-[#FF3636] text-[12px]">Sign Out</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <div className="flex flex-row items-center space-x-3">
            <div>
              {!address ? (
                <div
                  onClick={() => open()}
                  className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer"
                >
                  <ConnectIconGreen />
                  <p className="text-white text-[12px]">Connect Wallet</p>
                </div>
              ) : (
                <div onClick={() => open()} className="flex flex-row cursor-pointer space-x-2">
                  <EthIcon />
                  <p className="text-white text-[12px]"> {`${address.slice(0, 11)}...`}</p>
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
                            <p className="font-semibold text-[20px] text-white">Token Sale</p>
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
                            <p className="font-semibold text-[20px] text-white">Claim Token</p>
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
                            <p className="font-semibold text-[20px] text-white">Settings</p>
                          </div>
                        )}
                      </NavLink>
                    </div>
                  </div>

                  <div onClick={() => setShowMobileMenu(false)} className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-5 pb-5 pl-5 ">
                      <div className="flex flex-row cursor-pointer items-center space-x-2">
                        <p className="text-white opacity-50 text-[14px]">Terms of Service</p>
                        <RedirectIcon />
                      </div>
                      <div className="flex flex-row cursor-pointer items-center space-x-2">
                        <p className="text-white opacity-50 text-[14px]">Privacy Policy</p>
                        <RedirectIcon />
                      </div>
                    </div>

                    <div onClick={handleSignOut}  className="w-full flex cursor-pointer  items-center justify-center bg-[#0C0C0C]">
                      <p className="text-[#FF3636] py-4 text-[16px]">Sign Out</p>
                    </div>

                    <div className="pb-10 pt-2 px-5 flex flex-col space-y-5">
                      <p className="text-white opacity-50 font-bold text-[12px]">Connect with us</p>
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
    </div>
  );
};

export default TopBar;

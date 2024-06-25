import ClaimTokenWhite from "../Icons/ClaimTokenWhite"
import DiscordLogo from "../Icons/DiscordLogo"
import { NavLink, useLocation } from 'react-router-dom';
import KarbonLogoBig from "../Icons/KarbonLogoBig"
import SettingsWhite from "../Icons/SettingsWhite"
import TelegramLogo from "../Icons/TelegramLogo"
import TokenSaleIcon from "../Icons/TokenSaleIcon"
import XLogo from "../Icons/XLogo"
import SettingsIcon from "../Icons/SettingsIcon";
import ClaimTokensLogo from "../Icons/ClaimTokensLogo";
import TokenSaleWhite from "../Icons/TokenSaleWhite";

const Leftbar = () => {

    const location = useLocation();

    const firstLink = location.pathname === '/dashboard' ? '/dashboard' : '/dashboard/tokensale';

    const activeClassName = 'flex bg-black w-[160px] h-[48px] border-l border-[#08E04A] rounded-[4px]';
    const inactiveClassName = 'flex bg-[#101010] w-[160px] h-[48px] opacity-70 hover:opacity-100 hover:border-l hover:border-[#08E04A] transition ease-in-out rounded-[4px]';
  return (
    <div className='h-screen max-lg:hidden z-50 fixed bg-[#151515]'>
        <div className="py-10 flex flex-col w-full">
            <div className="flex items-center justify-center">
                <KarbonLogoBig/>
            </div>

            <div className="flex flex-col pt-10 ml-5 space-y-3">
                <NavLink to={firstLink} className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                    {({ isActive }) => (
                    <div className="flex items-center justify-center px-3 flex-row space-x-2">
                        {isActive ? <TokenSaleIcon /> : <TokenSaleWhite />}
                        <p className="font-semibold text-[12px] text-white">Token Sale</p>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/dashboard/claimtokens" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                    {({ isActive }) => (
                    <div className="flex items-center justify-center px-3 flex-row space-x-2">
                        {isActive ? <ClaimTokensLogo /> : <ClaimTokenWhite />}
                        <p className="font-semibold text-[12px] text-white">Claim Token</p>
                    </div>
                    )}
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                    {({ isActive }) => (
                    <div className="flex items-center justify-center px-3 flex-row space-x-2">
                        {isActive ? <SettingsIcon /> : <SettingsWhite />}
                        <p className="font-semibold text-[12px] text-white">Settings</p>
                    </div>
                    )}
                </NavLink>
            </div>
            <div className="border-t absolute flex items-center justify-center w-[181px] bottom-0 border-black botder-t-[2px]">
                <div className="py-5 flex flex-col space-y-5">
                    <p className="text-white opacity-50 text-[12px]">Connect with us</p>
                    <div className="flex flex-row space-x-5">
                        <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                            <DiscordLogo/>
                        </div>
                        <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                            <TelegramLogo/>
                        </div>
                        <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                            <XLogo/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Leftbar
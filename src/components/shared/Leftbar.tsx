import ClaimTokenWhite from "../Icons/ClaimTokenWhite.tsx";
import DiscordLogo from "../Icons/DiscordLogo.tsx";
import { NavLink, useLocation } from 'react-router-dom';
import KarbonLogoBig from "../Icons/KarbonLogoBig.tsx";
import SettingsWhite from "../Icons/SettingsWhite.tsx";
import TelegramLogo from "../Icons/TelegramLogo.tsx";
import TokenSaleIcon from "../Icons/TokenSaleIcon.tsx";
import XLogo from "../Icons/XLogo.tsx";
import SettingsIcon from "../Icons/SettingsIcon.tsx";
import ClaimTokensLogo from "../Icons/ClaimTokensLogo.tsx";
import TokenSaleWhite from "../Icons/TokenSaleWhite.tsx";
import RedirectIcon from "../Icons/RedirectIcon.tsx";
import { useTranslation } from "react-i18next";

const Leftbar = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const firstLink = location.pathname === '/dashboard' ? '/dashboard' : '/dashboard/tokensale';

    const activeClassName = 'flex bg-black w-[160px] h-[48px] border-l border-[#08E04A] rounded-[4px]';
    const inactiveClassName = 'flex bg-[#101010] w-[160px] h-[48px] opacity-70 hover:opacity-100 hover:border-l hover:border-[#08E04A] transition ease-in-out rounded-[4px]';

    return (
        <div className='h-screen max-lg:hidden flex justify-between flex-col z-50 fixed bg-[#151515]'>
            <div className="py-10 flex flex-col w-full">
                <div className="flex items-center justify-center">
                    <KarbonLogoBig />
                </div>

                <div className="flex flex-col pt-10 ml-5 space-y-3">
                    <NavLink to={firstLink} className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                        {({ isActive }) => (
                            <div className="flex items-center justify-center px-3 flex-row space-x-2">
                                {isActive ? <TokenSaleIcon /> : <TokenSaleWhite />}
                                <p className={isActive ? 'font-semibold text-[12px] text-white' : 'text-[12px] text-white opacity-90'}>{t('tokenSale')}</p>
                            </div>
                        )}
                    </NavLink>
                    <NavLink to="/dashboard/claimtokens" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                        {({ isActive }) => (
                            <div className="flex items-center justify-center px-3 flex-row space-x-2">
                                {isActive ? <ClaimTokensLogo /> : <ClaimTokenWhite />}
                                <p className={isActive ? 'font-semibold text-[12px] text-white' : 'text-[12px] text-white opacity-90'}>{t('claimToken')}</p>
                            </div>
                        )}
                    </NavLink>
                    <NavLink to="/dashboard/settings" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                        {({ isActive }) => (
                            <div className="flex items-center justify-center px-3 flex-row space-x-2">
                                {isActive ? <SettingsIcon /> : <SettingsWhite />}
                                <p className={isActive ? 'font-semibold text-[12px] text-white' : 'text-[12px] text-white opacity-90'}>{t('settings')}</p>
                            </div>
                        )}
                    </NavLink>
                </div>

                <div className="w-full flex flex-col bottom-0 absolute">
                    <div className="flex flex-col space-y-5 pb-5 pl-3">
                        <a href='https://karbon.finance/terms-of-use' target='blank' className="flex flex-row opacity-50 transition ease-in-out hover:opacity-100 cursor-pointer items-center space-x-2">
                            <p className="text-white  text-[10px]">{t('termsOfService')}</p>
                            <RedirectIcon />
                        </a>
                        <a href='https://karbon.finance/privacy-policy' target='blank' className="flex flex-row opacity-50 transition ease-in-out hover:opacity-100 cursor-pointer items-center space-x-2">
                            <p className="text-white  text-[10px]">{t('privacyPolicy')}</p>
                            <RedirectIcon />
                        </a>
                    </div>
                    <div className="border-t flex items-center pl-3  w-[181px]  border-black botder-t-[10px]">
                        <div className="py-5 flex flex-col space-y-5">
                            <p className="text-white opacity-50 font-bold text-[12px]">{t('connectWithUs')}</p>
                            <div className="flex flex-row space-x-5">
                                <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                                    <DiscordLogo />
                                </div>
                                <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                                    <TelegramLogo />
                                </div>
                                <div className="hover:opacity-100 opacity-50 transition ease-in-out cursor-pointer">
                                    <XLogo />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leftbar;

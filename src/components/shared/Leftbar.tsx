import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Menu } from "lucide-react";
import ClaimTokenWhite from "../Icons/ClaimTokenWhite.tsx";
import DiscordLogo from "../Icons/DiscordLogo.tsx";
import KarbonLogoBig from "../Icons/KarbonLogoBig.tsx";
import SettingsWhite from "../Icons/SettingsWhite.tsx";
import TelegramLogo from "../Icons/TelegramLogo.tsx";
import TokenSaleIcon from "../Icons/TokenSaleIcon.tsx";
import XLogo from "../Icons/XLogo.tsx";
import SettingsIcon from "../Icons/SettingsIcon.tsx";
import ClaimTokensLogo from "../Icons/ClaimTokensLogo.tsx";
import TokenSaleWhite from "../Icons/TokenSaleWhite.tsx";
import RedirectIcon from "../Icons/RedirectIcon.tsx";

const Leftbar = ({ onToggle }: { onToggle: (isOpen: boolean) => void }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        onToggle(isOpen);
    }, [isOpen, onToggle]);

    const firstLink = location.pathname === '/dashboard' ? '/dashboard' : '/dashboard/tokensale';

    const navLinkClass = `flex items-center justify-start px-3 h-12 rounded-[4px] transition-all duration-300 ease-in-out`;
    const activeClassName = `${navLinkClass} bg-black border-l border-[#08E04A]`;
    const inactiveClassName = `${navLinkClass} bg-[#101010] opacity-70 hover:opacity-100 hover:border-l hover:border-[#08E04A]`;

    return (
        <div className={`h-screen transition-all fixed  duration-300 ease-in-out ${isOpen ? 'w-[181px]' : 'w-16'}`}>
            <aside className="h-full sticky top-0 flex flex-col justify-between bg-[#151515] overflow-hidden">
                <div className="py-10 flex flex-col w-full">
                    <div className="flex items-center justify-center mb-10">
                        {isOpen ? (
                            <div className="flex flex-col space-y-5 items-center">
                                <ArrowLeft className="ml-2 cursor-pointer text-white" onClick={toggleSidebar} />
                                <KarbonLogoBig />
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-5 items-center">
                                <Menu className="cursor-pointer text-white" onClick={toggleSidebar} />
                                <img src="/assets/karbonSoloLogo.svg" alt="Karbon Logo" />
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-col pt-5 space-y-3 ${isOpen ? 'ml-5' : 'ml-2'}`}>
                        <NavLink to={firstLink} className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                            {({ isActive }) => (
                                <div className="flex items-center w-full">
                                    {isActive ? <TokenSaleIcon /> : <TokenSaleWhite />}
                                    <span className={`ml-2 text-[12px] text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'} ${isActive ? 'font-semibold' : 'opacity-90'}`}>
                                        {t('tokenSale')}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to="/dashboard/claimtokens" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                            {({ isActive }) => (
                                <div className="flex items-center w-full">
                                    {isActive ? <ClaimTokensLogo /> : <ClaimTokenWhite />}
                                    <span className={`ml-2 text-[12px] text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'} ${isActive ? 'font-semibold' : 'opacity-90'}`}>
                                        {t('claimToken')}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to="/dashboard/settings" className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}>
                            {({ isActive }) => (
                                <div className="flex items-center w-full">
                                    {isActive ? <SettingsIcon /> : <SettingsWhite />}
                                    <span className={`ml-2 text-[12px] text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'} ${isActive ? 'font-semibold' : 'opacity-90'}`}>
                                        {t('settings')}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                    </div>
                </div>

                <div className="w-full flex flex-col pb-5">
                    <div className={`flex flex-col space-y-5 pb-5 px-3 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <a href='https://karbon.finance/terms-of-use' target='blank' className="flex flex-row opacity-50 transition ease-in-out hover:opacity-100 cursor-pointer items-center space-x-2">
                            <span className="text-white text-[10px] whitespace-nowrap">{t('termsOfService')}</span>
                            <RedirectIcon />
                        </a>
                        <a href='https://karbon.finance/privacy-policy' target='blank' className="flex flex-row opacity-50 transition ease-in-out hover:opacity-100 cursor-pointer items-center space-x-2">
                            <span className="text-white text-[10px] whitespace-nowrap">{t('privacyPolicy')}</span>
                            <RedirectIcon />
                        </a>
                    </div>
                    <div className={`border-t flex ${isOpen ? 'items-start px-3' : 'items-center justify-center'} w-full border-black border-t-[1px]`}>
                        <div className="py-5 flex flex-col space-y-5">
                            <p className={`text-white opacity-50 font-bold text-[12px] whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'}`}>
                                {t('connectWithUs')}
                            </p>
                            <div className={`flex ${isOpen ? 'flex-row space-x-5' : 'flex-col space-y-8'}`}>
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
            </aside>
        </div>
    );
}

export default Leftbar;
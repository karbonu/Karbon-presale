import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


const SettingsLayout = () => {
  const { t } = useTranslation();

  const [tab, selectedTab] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();




  useEffect(() => {
    if (location.pathname === '/dashboard/settings/profilesettings') {
      selectedTab(2)
    } else {
      selectedTab(1)
    }
  }, [location.pathname]);

  return (
    <div className="w-full">

      <div className="w-full flex items-center ">
        <div className="w-[784px] max-lg:w-full border-[1px] border-[#282828] max-sm:bg-transparent max-sm:border-transparent bg-[#121212] rounded-[16px]">
          <div className="py-5 max-sm:px-2 px-5 h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-row max-sm:w-full max-sm:mt-5 space-x-2 max-md:space-x-4">
                <a
                  onClick={() => { selectedTab(1); navigate('/dashboard/settings/walletsettings') }}
                  className={`cursor-pointer font-bold text-[14px] max-sm:text-[14px] max-sm:px-3 max-sm:py-1 px-8 py-2 hover:text-black rounded-full ${tab === 1 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  {t('wallet')}
                </a>
                <a
                  onClick={() => { selectedTab(2); navigate('/dashboard/settings/profilesettings') }}
                  className={`cursor-pointer px-8 font-bold text-[14px] max-sm:text-[14px] max-sm:px-3 max-sm:py-1 py-2 hover:text-black rounded-full ${tab === 2 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  {t('profileSettings')}
                </a>
              </div>
              <div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout
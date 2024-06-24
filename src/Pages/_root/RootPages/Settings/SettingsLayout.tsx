import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


const SettingsLayout = () => {

    const [tab, selectedTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    


    useEffect(() => {
        if(location.pathname === '/dashboard/settings/profilesettings'){
            selectedTab(2)
        }else{
            selectedTab(1)
        }
      }, [location.pathname]);
  
  return (
    <div className="w-full">

        <div className="w-full flex items-center ">
          <div className="w-[784px] bg-[#121212]  rounded-[16px]">
            <div className="py-5 px-5 h-full">
              <div className="flex flex-col h-full justify-between">
              <div className="flex flex-row space-x-2">
                <a
                  onClick={() => {selectedTab(1); navigate('/dashboard/settings/walletsettings')}} 
                  className={`cursor-pointer font-bold text-[14px] px-8 py-2 hover:text-black rounded-full ${tab === 1 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  Wallet
                </a>
                <a 
                  onClick={() => {selectedTab(2); navigate('/dashboard/settings/profilesettings')}} 
                  className={`cursor-pointer px-8 font-bold text-[14px] py-2 hover:text-black rounded-full ${tab === 2 ? 'bg-white text-black' : 'bg-transparent border-[1px] border-white text-white hover:text-black hover:bg-white transition ease-in-out'}`}
                >
                  Profile Settings
                </a>
              </div>
              <div>
                <Outlet/>
              </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SettingsLayout
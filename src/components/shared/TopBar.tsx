import DownIcon from "../Icons/DownIcon"
import EthIcon from "../Icons/EthIcon"
import { Separator } from "../ui/separator"
import {  useLocation } from 'react-router-dom';

const TopBar = () => {
    let title;

    const location = useLocation();

    const currentPath = location.pathname;

    if (currentPath === '/dashboard/tokensale') {
      title = 'Token Sale DApp';
    } else if (currentPath === '/dashboard/claimtokens') {
      title = 'Claim Token';
    } else if (currentPath === '/dashboard/settings') {
      title = 'Settings';
    } else if(currentPath === '/dashboard'){
      title = 'Token Sale DApp';
    }else{
      title = 'Invalid Path';
    }



    const address = "Ox781883782..."
    const email = "you@gmail.com";
  return (
    <div className="p-10 w-full">
        <div className="flex items-center justify-between">
            <p className="text-white font-semibold text-[20px]">{title}</p>
            
            <div className="bg-[#101010] border-[1px] border-[#282828] rounded-[4px]">
                <div className="px-2 py-2">
                    <div className="flex flex-row space-x-4">
                        <div className="flex flex-row space-x-2">
                            <EthIcon/>
                            <p className="text-white text-[12px]">{address}</p>
                        </div>
                        <div>
                            <Separator className="bg-[#484848]" orientation="vertical"/>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <p className="text-[12px] text-white">{email}</p>
                            <DownIcon/>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
  )
}

export default TopBar
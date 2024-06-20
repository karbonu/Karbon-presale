import DiscordLogo from "../Icons/DiscordLogo"
import KarbonLogoBig from "../Icons/KarbonLogoBig"
import TelegramLogo from "../Icons/TelegramLogo"
import XLogo from "../Icons/XLogo"

const Leftbar = () => {
  return (
    <div className='h-screen w-[181px] bg-[#151515]'>
        <div className="py-10 flex flex-col w-full">
            <div className="flex items-center justify-center">
                <KarbonLogoBig/>
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
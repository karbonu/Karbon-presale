import CopyIcon from "@/components/Icons/CopyIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import MetaTags from "@/components/shared/MetaTags";

const ProfileSettings = () => {
  return (
    <div className="flex flex-col pt-10 space-y-3">
        <MetaTags
        title="Karbon Sale | Profile Settings"
        />
    <div className="flex flex-row max-lg:flex-col max-lg:space-y-2 w-full lg:space-x-2 justify-between">
      <div className="border-[1px] border-[#282828] h-[95px] md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
        <div className="p-3 flex-col space-y-3 h-full justify-between">
          <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[54px]">
            <WalletIcon/>
            <p className="text-white text-[10px] opacity-70">Email</p>
          </div>
          <div className="flex flex-row items-center space-x-5">
            <p className="text-white font-light text-[14px] max-lg:text-[12px] ">you@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="border-[1px] border-[#282828] h-[95px]  md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
        <div className="p-3 flex-col space-y-3 h-full justify-between">
          <div className="flex flex-row rounded-[2px]  justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[97px]">
            <WalletIcon/>
            <p className="text-white text-[10px] opacity-70">Referral Link</p>
          </div>
          <div className="flex flex-row items-center space-x-5">
            <p className="text-white font-light text-[14px] max-lg:text-[12px] ">https://karbon.com/78236-tube...</p>
            <div className="flex flex-row space-x-2 cursor-pointer">
              <CopyIcon/>
              <p className="text-[#08E04A] text-[10px]">Copy</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div className="flex flex-1 max-lg:w-full">
      <div className="bg-black border-[1px] border-[#282828] max-lg:w-full rounded-[8px]">
        <div className="flex flex-col p-5 space-y-4 max-lg:w-full">
          <p className="text-white font-medium text-[20px]">Change Password</p>
          <div className="flex flex-row max-lg:flex-col max-lg:space-y-2 w-full items-center justify-between md:space-x-2">
            <div className="flex flex-col max-lg:w-full space-y-2">
              <p className="text-white text-[12px]">New Password</p>
              <input type="password" className=" outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"/>
            </div>

            <div className="flex flex-col max-lg:w-full space-y-2">
              <p className="text-white text-[12px]">Confirm New Password</p>
              <input type="password" className=" outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"/>
            </div>

          </div>

          <div>
            <div className="bg-transparent text-[14px] text-white w-max opacity-70 hover:opacity-100 hover:text-black  hover:bg-white  transition ease-in-out border-[1px] border-white rounded-full cursor-pointer px-8 py-2">
              Update Password
            </div>
          </div>
        </div>

      </div>

    </div>

    <div className="flex flex-row max-lg:flex-col pt-10 justify-between items-center max-lg:space-y-2">
        <div className="flex flex-row lg:space-x-40 max-lg:w-full max-lg:justify-between max-sm:px-5">
        <p className="text-[8px] text-white opacity-30">Copyright © 2024 Karbon. All rights reserved.</p>
        <p className="text-[8px] text-white opacity-30">Gaziantep, Türkiye</p>
        </div>        
        <div className="bg-black cursor-pointer hover:scale-95 transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
            <div className="flex flex-row space-x-1 items-center px-4 py-2">
            <p className="text-[#FF3636] text-[16px]">Sign Out</p>
            </div>
        </div>
    </div>
  </div>
  )
}

export default ProfileSettings
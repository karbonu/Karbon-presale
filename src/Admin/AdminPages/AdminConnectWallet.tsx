import ConnectIconGreen from "@/components/Icons/ConnectIconGreen"
import KarbonLogo from "@/components/Icons/KarbonLogo"
import { useWeb3Modal } from "@web3modal/wagmi/react"


const AdminConnectWallet = () => {
  const {open} = useWeb3Modal();

    return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-5">
      <KarbonLogo/>
      <p className="text-[40px] text-white font-bold">Admin Sign In</p>
      <div
        onClick={() => open()}
        className="bg-[#101010] hover:border-[#08E04A] border-[1px] border-transparent transition ease-out py-2 px-3 items-center flex flex-row space-x-2 rounded-[4px] cursor-pointer"
      >
        <ConnectIconGreen />
        <p className="text-white text-[12px]">Connect Wallet</p>
      </div>

    </div>
  )
}

export default AdminConnectWallet
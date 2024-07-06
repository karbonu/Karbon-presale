import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import DownIcon from "@/components/Icons/DownIcon.tsx";
import EthIcon from "@/components/Icons/EthIcon.tsx";


const AdminTopbar = () => {
  
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  
  return (
    <div className="w-full flex items-end justify-end">
        <div className="bg-[#101010] rounded-[4px]">
            <div onClick={() => open()} className="p-2 flex cursor-pointer flex-row items-center space-x-2">
                <EthIcon/>
                <div className="flex flex-row items-center space-x-1">
                    <p className="text-white text-[12px]">Wallet Connected: </p>
                    <p className="text-white text-[12px]">{address?.slice(0, 10)}...{address?.slice(-4)}</p>
                </div>
                
                <DownIcon/>
            </div>
        </div>
    </div>
  );
};

export default AdminTopbar;

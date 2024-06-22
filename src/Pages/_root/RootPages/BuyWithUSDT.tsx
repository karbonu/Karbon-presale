import BackArrow from '@/components/Icons/BackArrow'
import USDTIcon from '@/components/Icons/USDTIcon'
import UpArrow from '@/components/Icons/UpArrow'
import { Separator } from '@/components/ui/separator'


const BuyWithUSDT = (props : any) => {
  return (
    <div className='w-full space-y-5 flex flex-col'>
        <div className="w-full flex items-center px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
            <div className="flex flex-row items-center justify-between w-[213px]">
            <div onClick={()=> props.setSelectedMethod(0)} className="flex cursor-pointer flex-row items-center justify-center space-x-1">
                <BackArrow/>
                <p className="text-white text-[12px]">Back</p>
            </div>
            <div className="flex flex-row items-center space-x-2">
                <USDTIcon/>
                <p className="text-white text-[14px]">Buy with USDT</p>
            </div>
            </div>
        </div>

        <div className="flex flex-row w-full items-center justify-between">
            <p className="text-white text-[12px]">Amount</p>
            <div className="flex flex-row items-center space-x-1">
            <p className="text-white text-[12px] opacity-70">Wallet Balance</p>
            <p className="text-white text-[12px]">5,784,043.78</p>
            </div>
        </div>

        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
            <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">You Buy</p>
            <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                <input id="buyInput" type="text" className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none" />
                <p className="text-white text-[12px] opacity-70">USDT</p>
            </div>
            </label>
        </div>
        
        <div className="flex rotate-[180deg] w-full items-center justify-center">
            <UpArrow/>

        </div>

        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
            <label htmlFor="getOutput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">You Get</p>
            <Separator orientation="vertical" className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
                <input id="getOutput" type="text" className="bg-transparent h-full w-[75%] text-[20px] placeholder:text-white text-white focus:outline-none" />
                <p className="text-white text-[12px] opacity-70">KARBON</p>
            </div>
            </label>
        </div>

        <div className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
            <p className="font-bold text-[14px] shadow-sm">
                Buy
            </p>
        </div>
    </div>
  )
}

export default BuyWithUSDT
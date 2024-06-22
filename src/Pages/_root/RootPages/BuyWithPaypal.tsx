import { ClockLoader } from "react-spinners"


const BuyWithPaypal = (props:any) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-5">
        <p className="text-white font-bold text-[20px]">Working on it</p>
        <ClockLoader color="#36d7b7" />
        <p  onClick={()=> props.setSelectedMethod(0)} className="text-[20px] text-white cursor-pointer hover:text-[#36d7b7] transition ease-in-out underline underline-offset-2">Try a different method</p>
    </div>
  )
}

export default BuyWithPaypal
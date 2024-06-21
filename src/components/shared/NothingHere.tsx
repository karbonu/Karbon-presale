import KarbonLogo from "@/components/Icons/KarbonLogo"
import { ClockLoader } from "react-spinners"

const NothingHere = () => {
  return (
    <div className="flex flex-col space-y-5 items-center justify-center py-40">
        <KarbonLogo/>
        <p className="text-white font-bold text-[40px]">Nothing here yet</p>
        <ClockLoader color="#36d7b7" />
        <a href="/sign-in" className="text-[20px] text-white underline">Try signing in..</a>
  </div>
  )
}

export default NothingHere
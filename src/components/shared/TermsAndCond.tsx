import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
import DialogClose from "../Icons/DialogClose"

const TermsAndCond = (props : any) => {
  return (
    <div>
        <Dialog open={props.isDialogOpen} onOpenChange={props.setIsDialogOpen}>
            <DialogContent className='bg-[#101010]  border-[#282828] pb-5 py-10 px-10 flex flex-col w-[412px] max-sm:w-[300px] items-center justify-center rounded-[16px] outline-none'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <p className="text-white font-semibold text-[20px]">Terms and Conditions</p>
                    <div onClick={() => props.setIsDialogOpen(false)} className='cursor-pointer '>
                        <DialogClose/>
                    </div>
                </div>      

                <div className="w-full py-5 flex flex-col space-y-5 items-center justify-center">
                    <p className="text-white opacity-70 text-[14px]">By participating in the Karbon token seed sale, you agree to abide by the following terms.</p>
                    <div className="opacity-70">
                        <div className="flex  flex-row space-x-2">
                            <p className="text-[14px] text-white">1</p>
                            <p className="text-[14px] text-white">Tokens are sdivd at a discounted price, subject to a 6-month vesting period for seed investors</p>
                        </div>
                        <div className="flex flex-row space-x-2">
                            <p className="text-[14px] text-white">2</p>
                            <p className="text-[14px] text-white">The purchase of tokens does not guarantee any returns or profits</p>
                        </div>
                        <div className="flex flex-row space-x-2">
                            <p className="text-[14px] text-white">3</p>
                            <p className="text-[14px] text-white">Karbon Finance reserves the right to amend or cancel the token sale at any time without prior notice</p>
                        </div>
                        <div className="flex flex-row space-x-2">
                            <p className="text-[14px] text-white">4</p>
                            <p className="text-[14px] text-white">Investors must conduct their own research and seek financial advice before investing</p>
                        </div>
                        <div className="flex flex-row space-x-2">
                            <p className="text-[14px] text-white">5</p>
                            <div className="flex flex-col space-y-5">
                                <p className="text-white text-[14px]">Karbon Finance is not liable for any losses incurred as a result of token purchases</p>
                                <p className="text-white text-[14px]">By purchasing tokens, you acknowledge and accept these terms and conditions</p>
                            </div>
                        </div>
                        
                        
                        
                    </div>

                    <div onClick={() => props.setIsDialogOpen(false)} className="bg-transparent py-2 px-10 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                        Close
                    </div>
                </div>
            </DialogContent>
          </Dialog>
    </div>
  )
}

export default TermsAndCond
import { useState } from 'react';
import CopyIcon from "@/components/Icons/CopyIcon";
import CopyIconWhite from "@/components/Icons/CopyIconWhite";
import DialogClose from "@/components/Icons/DialogClose";
import EthIcon from "@/components/Icons/EthIcon";
import MarkAsReadIcon from "@/components/Icons/MarkAsReadIcon";
import PendingLogo from "@/components/Icons/PendingLogo";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import CheckMark from '@/components/Icons/CheckMark';
import { useCompletePayoutMutate } from '../Hooks/AdminCompletePayout';
import { useToast } from '@/components/ui/use-toast';
import { BarLoader } from 'react-spinners';

const AdminPayoutModal = (props: any) => {
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    const [isPaying, setIsPaying] = useState(false)
    const payoutMutate = useCompletePayoutMutate();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };


    const handlePayout = () => {
        console.log(props)
        setIsPaying(true);
        const id = props.referralID
        console.log("ID is ", id)
        const hash = props.txHash
        payoutMutate.mutate(
            {
                referralId: id,
                txHash: hash as string || ""

            },
            {
                onSuccess: (response: any) => {
                    console.log(response.data);
                    toast({
                        variant: 'success',
                        title: "Success!",
                        description: "Payout Successfull",
                    })
                    setIsPaying(false);
                },
                onError: (error) => {
                    console.log(error);
                    toast({
                        variant: 'failure',
                        title: "Error!",
                        description: "Payout Failed",
                    })
                    setIsPaying(false);
                },
            }
        );
    }

    return (
        <Dialog open={props.payoutModalOpen} onOpenChange={props.setPauoutModalOpen}>
            <DialogContent className='flex items-center justify-center w-[412px] h-[433px]'>
                <div className='w-[412px] h-[433px] bg-[#101010] rounded-[16px] outline-none ring-0 border-0 outline-0'>
                    <div className='py-10 space-y-[1.3rem] flex flex-col items-center justify-center'>
                        <div className='flex px-10 flex-row w-full items-center justify-between'>
                            <div className='w-full flex flex-row items-center justify-between'>
                                <p className="text-white font-semibold text-[16px]">Payout Request</p>
                                <div onClick={() => props.setPauoutModalOpen()} className='cursor-pointer '>
                                    <DialogClose />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex flex-row space-x-2">
                                {props.status === "paid" ? (
                                    <>
                                        <p className="text-[#08E04A] font-medium text-[32px]">{props.amount}</p>
                                        <p className="text-[#08E04A] text-[32px] opacity-50">USDT</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#FFCC00] font-medium text-[32px]">{props.amount}</p>
                                        <p className="text-[#FFCC006E] text-[32px]">USDT</p>
                                    </>
                                )}
                            </div>
                            {props.status !== "paid" ? (
                                <div className='flex flex-row space-x-1 items-center'>
                                    <PendingLogo />
                                    <p className="text-[14px] text-white opacity-70">Pending</p>
                                </div>
                            ) : (
                                <div className='flex flex-row space-x-1 items-center'>
                                    <MarkAsReadIcon />
                                    <p className="text-[14px] text-white opacity-70">Paid</p>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-row space-x-2 bg-black items-center px-5 py-1 rounded-[4px]'>
                            <EthIcon />
                            <p className='text-white text-[12px]'>{props.address.slice(0, 31)}...</p>
                            <div
                                style={{ width: '60px' }} // Adjust the width as needed
                                className='flex flex-row items-center space-x-1 cursor-pointer' onClick={() => handleCopy(props.address)}>
                                {isCopied ? <CheckMark /> : <CopyIcon />}
                                <p className={`text-[10px] ${isCopied ? 'text-[#08E04A]' : 'text-[#08E04A]'}`}>{isCopied ? 'Copied' : 'Copy'}</p>
                            </div>
                        </div>
                        <div className='w-full'>
                            <Separator orientation='horizontal' className='bg-black w-full h-[2px]' />
                        </div>
                        <div className='px-10 w-full'>
                            {props.status !== "paid" ? (
                                <div className='border-[#282828] rounded-[4px] w-full border-[1px]'>
                                    <div className='p-5'>
                                        <p className='text-white text-[12px] opacity-50'>Transaction Link</p>
                                        <p className='text-white text-[12px]'>{props.address}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='bg-black rounded-[4px] w-full'>
                                    <div className='p-5 flex flex-row w-full justify-between'>
                                        <div className="flex flex-col">
                                            <p className='text-white text-[12px] opacity-50'>Transaction Link</p>
                                            <p className='text-white text-[12px]'>{props.address.slice(0, 30)}</p>
                                        </div>
                                        <div
                                            style={{ width: '60px' }} // Adjust the width as needed
                                            className="flex flex-row space-x-1 items-center cursor-pointer" onClick={() => handleCopy(props.address)}>
                                            {isCopied ? <CheckMark /> : <CopyIconWhite />}
                                            <p className={`text-[10px] ${isCopied ? 'text-[#08E04A]' : 'text-white'}`}>{isCopied ? 'Copied' : 'Copy'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='w-full px-10 items-center justify-center flex'>
                            {props.status !== "paid" ? (
                                <button onClick={handlePayout} disabled={isPaying} className="bg-black w-full h-[64px] flex flex-row items-center justify-center cursor-pointer border-[#08E04A] transition ease-in-out text-[#08E04A] text-[14px] font-bold hover:text-[#08E04A] rounded-[4px] border-r-[1px]">
                                    {isPaying ? (

                                        <BarLoader color='white' />
                                    ) : (
                                        <>
                                            <div className='pr-4'>
                                                <MarkAsReadIcon />
                                            </div>
                                            Mark as Paid
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-transparent px-6 py-1 flex items-center justify-center w-max cursor-pointer hover:border-[#08E04A] transition ease-in-out hover:text-[#08E04A] text-[14px] font-bold text-white rounded-[58px] border-[1px]" onClick={() => props.setPauoutModalOpen(false)}>
                                    Close
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdminPayoutModal;

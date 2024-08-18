import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog.tsx";
import DialogClose from "../Icons/DialogClose.tsx";
import { useTranslation } from "react-i18next";

const TermsAndCond = (props: any) => {
    const { t } = useTranslation();
    return (
        <div>
            <Dialog open={props.isDialogOpen} onOpenChange={props.setIsDialogOpen}>
                <DialogContent className='bg-[#101010]  border-[#282828] pb-5 py-10 px-10 flex flex-col w-[412px] max-sm:w-[95%] items-center justify-center rounded-[16px] outline-none'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        <p className="text-white font-semibold text-[20px] max-sm:text-[16px]">{t('termsConditions')}</p>
                        <div onClick={() => props.setIsDialogOpen(false)} className='cursor-pointer '>
                            <DialogClose />
                        </div>
                    </div>

                    <div className="w-full py-5 flex flex-col space-y-5 items-center justify-center">
                        <p className="text-white opacity-70 text-[14px] max-sm:text-[12px]">{t('agreeTerms')}</p>
                        <div className="opacity-70">
                            <div className="flex flex-row space-x-2">
                                <p className="text-[14px] max-sm:text-[12px] text-white">1</p>
                                <p className="text-[14px] max-sm:text-[12px] text-white">{t('tokenDiscount')}</p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-[14px] max-sm:text-[12px] text-white">2</p>
                                <p className="text-[14px] max-sm:text-[12px] text-white">{t('noGuarantee')}</p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-[14px] max-sm:text-[12px] text-white">3</p>
                                <p className="text-[14px] max-sm:text-[12px] text-white">{t('amendCancel')}</p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-[14px] max-sm:text-[12px] text-white">4</p>
                                <p className="text-[14px] max-sm:text-[12px] text-white">{t('ownResearch')}</p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-[14px] max-sm:text-[12px] text-white">5</p>
                                <div className="flex flex-col space-y-5">
                                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('notLiable')}</p>
                                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('acceptTerms')}</p>
                                </div>
                            </div>
                        </div>

                        <div onClick={() => props.setIsDialogOpen(false)} className="bg-transparent py-2 px-10 cursor-pointer hover:border-[#08E04A] transition ease-in-out text-white text-[14px] max-sm:text-[12px] hover:text-[#08E04A] rounded-full border-[1px] border-white">
                            {t('close')}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TermsAndCond;

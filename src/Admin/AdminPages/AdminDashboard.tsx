import ForwardGreen from "@/components/Icons/ForwardGreen.tsx"
import PasteIcon from "@/components/Icons/PasteIcon.tsx"
import PendingRequestIcon from "@/components/Icons/PendingRequestIcon.tsx"
import ReferredUsersIcon from "@/components/Icons/ReferredUsersIcon.tsx"
import TotalBonusPaidOutIcon from "@/components/Icons/TotalBonusPaidOutIcon.tsx"
import TotalUsersIcon from "@/components/Icons/TotalUsersIcon.tsx"
import USDTIconRounded from "@/components/Icons/USDTIconRounded.tsx"
import AdminDashboardTable from "./AdminDashboardTable.tsx"
import { useState, useRef, useEffect } from 'react';
import CheckMark from "@/components/Icons/CheckMark.tsx";
import { getDashboardData, useAdminCreateInvestmentMutation } from "../Hooks/AdminDashboardData.tsx"
import { getTotalContribution } from "@/components/shared/Hooks/TokenSaleHooks.tsx"
import { useAuth } from "@/components/shared/Contexts/AuthContext.tsx"
import { useToast } from "@/components/ui/use-toast.ts"
import { BarLoader } from "react-spinners"

const AdminDashboard = () => {
    const { toast } = useToast();
    const [isPasted, setIsPasted] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [totalBonusPaid, setTotalBonusPaid] = useState(0);
    const [totalPendingRequests, setTotalPendingRequests] = useState(0);
    const [pendingRequestAmount, setTotalPendingRequestAmount] = useState(0);
    const [totalClaimed, setTotalClaimed] = useState(0);
    const [totalUnclaimed, setTotalUnclaimed] = useState(0);
    const [totalContribution, setTotalContribution] = useState(0);
    const [decimalContribution, setDecimalContribution] = useState(0);
    const { accessToken, presaleID } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [userID, setUserID] = useState('');
    const [amount, setAmount] = useState('');
    const amountInputRef = useRef<HTMLInputElement>(null);

    const investMutate = useAdminCreateInvestmentMutation(accessToken);

    const handlePasteClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUserID(text);
            setIsPasted(true);
            setTimeout(() => setIsPasted(false), 2000);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    const handleUserIDKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            amountInputRef.current?.focus();
        }
    };

    const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createInvestment();
        }
    };

    useEffect(() => {
        const fetchTotalContribution = async () => {
            const response = await getTotalContribution(accessToken, presaleID);

            if (response !== 'Failed') {
                const Contribute = Number(response.data._sum.amount);
                setTotalContribution(isNaN(Contribute) ? 0 : Contribute);
                if (totalContribution === 0) {
                    const newBalanceDecimal = Math.abs(response.data._sum.amount % 1).toFixed(2).slice(2);
                    setDecimalContribution(Number(newBalanceDecimal))
                }
            } else {
                console.log(response);
            }
        }

        const fetchReferralCount = async () => {
            const response = await getDashboardData(accessToken);
            if (response !== 'Failed') {
                console.log(response.data)
                const totalusers = Number(response.data.totalUsers);
                const totalreferrals = Number(response.data.totalReferrals);
                const paidbonus = Number(response.data.totalBonusPaid);
                const pendingrequest = Number(response.data.pendingBonusRequests);
                setTotalUsers(isNaN(totalusers) ? 0 : totalusers);
                setTotalReferrals(isNaN(totalreferrals) ? 0 : totalreferrals);
                setTotalBonusPaid(isNaN(paidbonus) ? 0 : paidbonus);
                setTotalPendingRequests(isNaN(pendingrequest) ? 0 : pendingrequest);
                setTotalUnclaimed(0);
                setTotalClaimed(0)
                if (totalPendingRequests === 0) {
                    setTotalPendingRequestAmount(0);
                }
            } else {
                console.log(response);
            }
        };

        fetchTotalContribution();
        fetchReferralCount();
    }, []);

    const validateInputs = () => {
        if (!userID.trim()) {
            toast({
                variant: "failure",
                title: "Error!",
                description: "User ID is required",
            });
            return false;
        }
        if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast({
                variant: "failure",
                title: "Error!",
                description: "Please enter a valid amount",
            });
            return false;
        }
        return true;
    };

    const createInvestment = () => {
        if (!validateInputs()) return;

        setIsCreating(true);
        investMutate.mutate(
            {
                userId: userID.trim(),
                amount: Number(amount),
                txHash: ''
            },
            {
                onSuccess: (response: any) => {
                    console.log(response);
                    console.log(response.data);
                    setIsCreating(false);
                    setUserID('');
                    setAmount('');
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: "Investment created successfully",
                    });
                },
                onError: (error: any) => {
                    console.log(error);
                    setIsCreating(false);
                    toast({
                        variant: "failure",
                        title: "Error!",
                        description: "Failed to create investment",
                    });
                },
            }
        );
    };

    return (
        <div className="w-full flex flex-col space-y-5">
            <div className="flex flex-row h-[528px] justify-between w-full space-x-2">
                <div className="flex flex-col justify-between h-[528px]">
                    <div className="bg-[#101010] w-[568px] rounded-t-[8px]">
                        <div className="p-10 flex flex-col space-y-8 w-full">
                            <p className="text-white text-[20px] font-bold">Referrals</p>
                            <div className="flex flex-row w-full items-center justify-between pr-20">
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">TOTAL USERS</p>
                                    <div className="flex flex-row items-center space-x-2">
                                        <TotalUsersIcon />
                                        <p className="text-white text-[24px]">{totalUsers}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">TOTAL USERS REFERRED</p>
                                    <div className="flex flex-row items-center space-x-2">
                                        <ReferredUsersIcon />
                                        <p className="text-white text-[24px]">{totalReferrals}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row w-full items-center justify-between pr-20">
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">TOTAL BONUS PAID OUT</p>
                                    <div className="flex flex-row items-center space-x-2">
                                        <TotalBonusPaidOutIcon />
                                        <div className="flex flex-row space-x-1">
                                            <p className="text-white text-[24px]">{(totalBonusPaid).toFixed(2)}</p>
                                            <p className="text-white font-extralight text-[24px]">USDT</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">PENDING BONUS REQUEST</p>
                                    <div className="flex flex-row items-center space-x-2">
                                        <PendingRequestIcon />
                                        <div className="flex flex-row space-x-1">
                                            <p className="text-white text-[24px]">{(totalPendingRequests).toFixed(2)}</p>
                                            <p className="text-white opacity-70 text-[16px]">${pendingRequestAmount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#101010] w-[568px] rounded-b-[8px]">
                        <div className="p-10 flex flex-col space-y-10 w-full">
                            <p className="text-white text-[20px] font-bold">Token Claims</p>
                            <div className="flex flex-row w-full items-center justify-between pr-20">
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">AMOUNT TO CLAIM</p>
                                    <div className="flex flex-row space-x-1">
                                        <p className="text-white text-[24px]">{totalUnclaimed}</p>
                                        <p className="text-white font-extralight text-[24px]">USDT</p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-[12px] opacity-70">AMOUNT CLAIMED</p>
                                    <div className="flex flex-row space-x-1">
                                        <p className="text-white text-[24px]">{totalClaimed}</p>
                                        <p className="text-white font-extralight text-[24px]">USDT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-[528px] justify-between">
                    <div className="bg-[#101010] w-[568px] h-[208px] rounded-[8px]">
                        <div className="p-10 flex flex-col space-y-5">
                            <p className="text-white text-[20px] font-bold">Investment</p>
                            <div className="flex flex-col space-y-3">
                                <p className="text-white text-[12px] opacity-70">TOTAL RAISED</p>
                                <div className="flex flex-row">
                                    <p className="text-white text-[24px]">{Math.round(totalContribution)}</p>
                                    <p className="text-white text-[16px]">.{decimalContribution}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#101010] w-[568px] h-[304px] rounded-[8px]">
                        <div className="p-2 flex">
                            <div className="bg-black w-full">
                                <div className="p-5 flex flex-col space-y-3">
                                    <p className="text-white text-[20px] font-bold">Create Investment</p>
                                    <div className="flex flex-row w-full h-[56px] border-[#282828] border-[1px] rounded-[1px]">
                                        <input
                                            className="w-[80%] h-full bg-transparent outline-none pl-5 text-[12px] text-white"
                                            placeholder="UserID"
                                            value={userID}
                                            onChange={(e) => setUserID(e.target.value)}
                                            onKeyDown={handleUserIDKeyDown}
                                        />
                                        <div
                                            className="flex flex-1 flex-row items-center justify-end space-x-1 pr-5 cursor-pointer"
                                            onClick={handlePasteClick}
                                            style={{ width: '60px' }}
                                        >
                                            {isPasted ? <CheckMark /> : <PasteIcon />}
                                            <p className="text-[#08E04A] text-[10px]">
                                                {isPasted ? 'Pasted' : 'Paste'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row w-full h-[56px] border-[#282828] border-[1px] rounded-[1px]">
                                        <input
                                            ref={amountInputRef}
                                            className="w-[80%] h-full bg-transparent outline-none pl-5 text-[12px] text-white"
                                            placeholder="Amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            onKeyDown={handleAmountKeyDown}
                                        />
                                        <div className="flex flex-1 flex-row items-center justify-end space-x-1 pr-5 cursor-pointer">
                                            <USDTIconRounded />
                                            <p className="text-white text-[10px]">
                                                USDT
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        disabled={isCreating}
                                        onClick={createInvestment}
                                        className="bg-[#101010] w-[350px] h-[64px] flex flex-row items-center justify-center cursor-pointer border-[#08E04A] transition ease-in-out text-[#08E04A] text-[14px] font-bold hover:text-[#08E04A] rounded-[4px] border-r-[1px] "
                                    >
                                        {isCreating ? (
                                            <BarLoader color="#08E04A" />
                                        ) : (
                                            <>
                                                <div className='pr-4'>
                                                    <ForwardGreen />
                                                </div>
                                                Create Investment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <AdminDashboardTable />

            </div>


        </div>
    )
}

export default AdminDashboard
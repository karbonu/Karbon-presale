import { useState, useEffect } from 'react';
import axios from 'axios';
import PaidBonusIcon from "@/components/Icons/PaidBonusIcon";
import PaidTXIcon from "@/components/Icons/PaidTXIcon";
import PendingPayoutIcon from "@/components/Icons/PendingPayoutIcon";
import UnpaidTXIcon from '@/components/Icons/UnpaidTXIcon';
import AdminPayoutModal from '../Shared/AdminPayoutModal';
import { useAdminAuth } from '../Hooks/AdminAuthContext';
import useSocketIO from '@/components/shared/Constants/UseSocket';

interface Referral {
  id: string;
  userId: string;
  referredUserId: string | null;
  bonusAmount: string;
  paidRequestbonusAmount: string;
  bonus: string | null;
  txHash: string | null;
  bonusStatus: string;
  claimed: boolean;
  createdAt: string;
  updatedAt: string;
  pendingRequestbonusAmount: string;
}

interface User {
  id: string;
  nonce: string | null;
  walletAddress: string | null;
  referralCode: string;
  email: string;
  password: string;
  social_id: string | null;
  referredBy: string | null;
  login_medium: string | null;
  usdtSpent: string;
  is_verified: boolean;
  last_logged_in: string | null;
  createdAt: string;
  purchased: boolean;
  updatedAt: string;
  role: string;
  referrals: Referral[];
}

interface TableRow {
  walletAddress: string;
  totalReferrals: number;
  referralContribution: string;
  bonus: string;
  isPaid: boolean;
  tx: string;
  referralID: string;
  amount: string;
  status: string;
  createdAt: string;
  txHash: string | null;
}

const AdminDashboardTable = () => {
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [payoutModalOpen, setPayoutModalOpen] = useState<boolean>(false);
  const { accessToken } = useAdminAuth();
  const [selectedPayoutData, setSelectedPayoutData] = useState<TableRow | null>(null);
  const SOCKET_URL = "https://karbon.plana.ng";
  const { lastMessage } = useSocketIO(SOCKET_URL);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}admin/users`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      const users: User[] = response.data;
      console.log(response.data);
      const formattedData: TableRow[] = users.flatMap((user: User) => {
        if (user.referrals.length === 0) return [];
        return user.referrals
          .filter((referral: Referral) => {
            // Include referrals that are paid, processing, or have a paidRequestbonusAmount > 0
            return referral.bonusStatus === 'paid' ||
              (referral.bonusStatus === 'pending' && parseFloat(referral.paidRequestbonusAmount) > 0) ||
              referral.bonusStatus === 'processing';
          })
          .map((referral: Referral) => {
            const isPaid = referral.bonusStatus === 'paid' ||
              (referral.bonusStatus === 'pending' && parseFloat(referral.paidRequestbonusAmount) > 0);
            const amount = isPaid ? referral.paidRequestbonusAmount : referral.pendingRequestbonusAmount;

            return {
              walletAddress: user.walletAddress || 'N/A',
              totalReferrals: user.referrals.length,
              referralContribution: `${user.usdtSpent} USDT`,
              bonus: `${amount} USDT`,
              isPaid,
              tx: isPaid ? 'Paid' : 'Pending',
              referralID: referral.id,
              amount,
              status: isPaid ? 'paid' : referral.bonusStatus,
              createdAt: referral.createdAt,
              txHash: referral.txHash,
            };
          });
      });

      // Sort data: unsettled first, then by createdAt
      const sortedData = formattedData.sort((a, b) => {
        if (a.isPaid === b.isPaid) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return a.isPaid ? 1 : -1;
      });

      setTableData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lastMessage]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleRowClick = (data: TableRow) => {
    setSelectedPayoutData(data);
    setPayoutModalOpen(true);
  };

  const handleModalClose = () => {
    setPayoutModalOpen(false);
    fetchData();
  };

  const filteredData = tableData.filter(row => {
    if (selectedTab === 'All') {
      return row.status === 'paid' || row.status === 'processing' || (row.status === 'pending' && parseFloat(row.amount) > 0);
    }
    if (selectedTab === 'Paid') {
      return row.status === 'paid' || (row.status === 'pending' && parseFloat(row.amount) > 0);
    }
    if (selectedTab === 'Pending') {
      return row.status === 'processing';
    }
    return true;
  });


  return (
    <div className="w-full bg-[#101010] rounded-[8px]">
      <div className="p-5 flex flex-col">
        <div className="flex flex-row items-center space-x-5">
          <div
            className={`border-[1px] rounded-full text-white text-[14px] py-1 px-3 cursor-pointer ${selectedTab === 'All' ? 'border-white' : 'bg-white bg-opacity-5 border-transparent hover:bg-opacity-0 border-[1px] hover:border-white'}`}
            onClick={() => handleTabClick('All')}
          >
            All Requests
          </div>
          <div
            className={`flex cursor-pointer items-center rounded-full text-white text-[14px] py-1 px-3 ${selectedTab === 'Pending' ? 'border-white border-[1px]' : 'bg-white bg-opacity-5 border-transparent hover:bg-opacity-0 border-[1px] hover:border-white'}`}
            onClick={() => handleTabClick('Pending')}
          >
            <div className="pr-2">
              <PendingPayoutIcon />
            </div>
            Pending payout
          </div>
          <div
            className={`flex cursor-pointer items-center rounded-full text-white text-[14px] py-1 px-3 ${selectedTab === 'Paid' ? 'border-white border-[1px]' : 'bg-white bg-opacity-5 border-transparent hover:bg-opacity-0 border-[1px] hover:border-white'}`}
            onClick={() => handleTabClick('Paid')}
          >
            <div className="pr-2">
              <PaidBonusIcon />
            </div>
            Paid Bonuses
          </div>
        </div>

        <table className="bg-black w-full mt-5 rounded--[8px]">
          <thead>
            <tr>
              <th className="text-white font-light opacity-70 text-[10px] text-left px-4 py-2">WALLET ADDRESS</th>
              <th className="text-white font-light opacity-70 text-[10px] text-left px-4 py-2">TOTAL REFERRALS</th>
              <th className="text-white font-light opacity-70 text-[10px] text-left px-4 py-2">REFERRAL CONTRIBUTION</th>
              <th className="text-white font-light opacity-70 text-[10px] text-left px-4 py-2">BONUS</th>
              <th className="text-white font-light opacity-70 text-[10px] text-left px-4 py-2">TX</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className={`${!row.isPaid ? 'bg-[#77610917] h-[48px] border-black border-[2px] border-t-[0px]' : 'h-[48px] border-black border-b-[2px]'}`} onClick={() => handleRowClick(row)}>
                <td className={`${!row.isPaid ? 'text-[#FFCC00]' : 'text-white'} text-[14px] px-4 py-2`}>{row.walletAddress}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.totalReferrals}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.referralContribution}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.bonus}</td>
                <td className="text-white cursor-pointer text-[14px] px-4 py-2">
                  {row.isPaid ? (
                    <PaidTXIcon />
                  ) : (
                    <UnpaidTXIcon />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPayoutData && (
        <AdminPayoutModal
          payoutModalOpen={payoutModalOpen}
          setPayoutModalOpen={handleModalClose}
          address={selectedPayoutData.walletAddress}
          amount={selectedPayoutData.amount}
          status={selectedPayoutData.status}
          referralID={selectedPayoutData.referralID}
          txHash={selectedPayoutData.txHash}
        />
      )}
    </div>
  );
};

export default AdminDashboardTable;

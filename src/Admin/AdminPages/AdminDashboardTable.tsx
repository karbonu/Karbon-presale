// src/components/AdminDashboardTable.tsx
import { useState } from 'react';
import PaidBonusIcon from "@/components/Icons/PaidBonusIcon.tsx";
import PaidTXIcon from "@/components/Icons/PaidTXIcon.tsx";
import PendingPayoutIcon from "@/components/Icons/PendingPayoutIcon.tsx";
import UnpaidTXIcon from '@/components/Icons/UnpaidTXIcon.tsx';

interface TableRow {
  walletAddress: string;
  totalReferrals: number;
  referralContribution: string;
  bonus: string;
  isPaid: boolean;
  tx: string;
}

const sampleData: TableRow[] = [
  { walletAddress: "Ox781883782iw83u94038u299g8eB2", totalReferrals: 5462, referralContribution: "5462 USDT", bonus: "5462 USDT", isPaid: true, tx: "Paid" },
  { walletAddress: "Ox781883782iw83u94038u299g8eB3", totalReferrals: 5462, referralContribution: "5462 USDT", bonus: "5462 USDT", isPaid: false, tx: "Pending" },
  { walletAddress: "Ox781883782iw83u94038u299g8eB3", totalReferrals: 5462, referralContribution: "5462 USDT", bonus: "5462 USDT", isPaid: false, tx: "Pending" },
  { walletAddress: "Ox781883782iw83u94038u299g8eB3", totalReferrals: 5462, referralContribution: "5462 USDT", bonus: "5462 USDT", isPaid: false, tx: "Pending" },
  // Add more sample data as needed
];

const AdminDashboardTable = () => {
  const [selectedTab, setSelectedTab] = useState<string>('All');

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const filteredData = sampleData.filter(row => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Paid') return row.isPaid;
    if (selectedTab === 'Pending') return !row.isPaid;
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
            className={`flex cursor-pointer items-center rounded-full text-white text-[14px] py-1 px-3 ${selectedTab === 'Pending' ? 'border-white' : 'bg-white bg-opacity-5 border-transparent hover:bg-opacity-0 border-[1px] hover:border-white'}`}
            onClick={() => handleTabClick('Pending')}
          >
            <div className="pr-2">
              <PendingPayoutIcon/>
            </div>
            Pending payout
          </div>
          <div 
            className={`flex cursor-pointer items-center rounded-full text-white text-[14px] py-1 px-3 ${selectedTab === 'Paid' ? 'border-white' : 'bg-white bg-opacity-5 border-transparent hover:bg-opacity-0 border-[1px] hover:border-white'}`}
            onClick={() => handleTabClick('Paid')}
          >
            <div className="pr-2">
              <PaidBonusIcon/>
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
              <tr key={index} className={`${!row.isPaid ? 'bg-[#77610917]  h-[48px] border-black border-[2px] border-t-[0px] ' : 'h-[48px] border-black border-b-[2px] '}`}>
                <td className={`${!row.isPaid ? 'text-[#FFCC00]' : 'text-white'} text-[14px] px-4 py-2`}>{row.walletAddress}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.totalReferrals}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.referralContribution}</td>
                <td className="text-white text-[14px] px-4 py-2">{row.bonus}</td>
                <td className="text-white cursor-pointer text-[14px] px-4 py-2">
                    {row.isPaid ? (
                        <PaidTXIcon />
                    ): (
                        <UnpaidTXIcon/>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardTable;

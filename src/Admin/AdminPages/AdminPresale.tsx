import React, { useState } from 'react';
import USDTIconRounded from '@/components/Icons/USDTIconRounded'; // Assuming this is the correct path
import ForwardGreen from '@/components/Icons/ForwardGreen'; // Assuming this is the correct path

const AdminPresale = () => {
  const [formValues, setFormValues] = useState({
    tokenAddress: '',
    rate: '',
    softcap: '',
    hardcap: '',
    maxbuy: '',
    minbuy: '',
    startdate: '',
    enddate: '',
    target: '',
    usdtAddress: '',
    projectAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formValues);
    // Add your submit logic here
  };

  return (
    <div className="bg-[#101010] w-full h-auto rounded-[8px] p-8">
      <div className="p-5 flex flex-col space-y-5">
        <p className="text-white text-[24px] font-bold">Create Presale</p>
        
        <div className="flex flex-col space-y-5">
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Token Address</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="tokenAddress"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Token Address"
                  value={formValues.tokenAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Rate</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="rate"
                  type="number"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Rate"
                  value={formValues.rate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Softcap</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="softcap"
                  type="number"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Softcap"
                  value={formValues.softcap}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Hardcap</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="hardcap"
                  type="number"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Hardcap"
                  value={formValues.hardcap}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Max Buy</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="maxbuy"
                  type="number"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Max Buy"
                  value={formValues.maxbuy}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Min Buy</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="minbuy"
                  type="number"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Min Buy"
                  value={formValues.minbuy}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Start Date</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="startdate"
                  type="date"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Start Date"
                  value={formValues.startdate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">End Date</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="enddate"
                  type="date"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="End Date"
                  value={formValues.enddate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <label className="text-white text-[14px] mb-2">Target</label>
            <div className="flex flex-row w-full h-[60px] border-[#282828] focus-within:ring-2 focus-within:ring-[#08E04A] rounded-md transition ease-in-out border-[1px] ">
              <input
                name="target"
                type="number"
                className="w-[80%] h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none"
                placeholder="Target"
                value={formValues.target}
                onChange={handleInputChange}
              />
              <div className="flex flex-1 flex-row items-center justify-end space-x-1 pr-5 cursor-pointer">
                <USDTIconRounded />
                <p className="text-white text-[12px]">USDT</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">USDT Address</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="usdtAddress"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="USDT Address"
                  value={formValues.usdtAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Project Address</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="projectAddress"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Project Address"
                  value={formValues.projectAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div
            onClick={handleSubmit}
            className="bg-[#101010] w-[350px] h-[64px] rounded-full flex flex-row items-center justify-center cursor-pointer border-white hover:border-[#08E04A] transition ease-in-out text-white text-[16px] font-bold hover:text-[#08E04A] border-[1px]"
          >
            <div className="pr-4">
              <ForwardGreen />
            </div>
            Create Investment
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPresale;

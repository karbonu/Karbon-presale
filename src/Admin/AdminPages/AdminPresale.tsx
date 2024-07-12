import React, { useState } from 'react';
import ForwardGreen from '@/components/Icons/ForwardGreen.tsx';
import { useCreatePresaleMutate } from '../Hooks/CreatePresaleMutate.tsx';
import { useAdminAuth } from '../Hooks/AdminAuthContext.tsx';

const AdminPresale = () => {
  const { accessToken } = useAdminAuth();
  const [formValues, setFormValues] = useState({
    name: '',
    rate: '',
    softcap: '',
    hardcap: '',
    maxbuy: '',
    minbuy: '',
    startdate: '',
    enddate: '',
    tokenAddress: '',
    projectAddress: '',
    paymentChannel: 'Paypal',
    networks: 'ETH',
    usdtAddress: '0x427Df1d2c7a6b89B75D06457295DaEEbdf192cC0',
    totalContribution: 0,
  });

  const createMutate = useCreatePresaleMutate(accessToken);

  const [vesting, setVesting] = useState([{ percentage: '', releaseDate: '' }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleVestingChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVesting = vesting.map((v, i) =>
      i === index ? { ...v, [name]: value } : v
    );
    setVesting(updatedVesting);
  };

  const addVestingField = () => {
    setVesting([...vesting, { percentage: '', releaseDate: '' }]);
  };

  const deleteVestingField = (index: number) => {
    const updatedVesting = vesting.filter((_, i) => i !== index);
    setVesting(updatedVesting);
  };

  const handleSubmit = () => {
    const totalPercentage = vesting.reduce((acc, curr) => acc + Number(curr.percentage), 0);
    if (totalPercentage !== 100) {
      alert("The total percentage of vesting fields must add up to 100%");
      return;
    }

    const vestingData: { [index: number]: [number, string] } = vesting.reduce((acc, v, index) => {
      acc[index] = [Number(v.percentage), v.releaseDate];
      return acc;
    }, {} as { [index: number]: [number, string] });

    const data = {
      name: formValues.name,
      token: { address: formValues.tokenAddress },
      coin: 'USDT',
      rate: Number(formValues.rate),
      hardCap: Number(formValues.hardcap),
      minBuy: Number(formValues.minbuy),
      maxBuy: Number(formValues.maxbuy),
      startDate: formValues.startdate,
      endDate: formValues.enddate,
      presaleAddress: formValues.projectAddress,
      paymentChannel: formValues.paymentChannel,
      networks: formValues.networks,
      usdtAddress: formValues.usdtAddress,
      totalContribution: Number(formValues.totalContribution),
      vesting: vestingData
    };

    console.log(data);
    createMutate.mutate(data, {
      onSuccess: (response) => {
        console.log(response)
        console.log('Presale created successfully');
      },
      onError: (error) => {
        console.error('Error creating presale:', error);
      }
    });
  };

  return (
    <div className="bg-[#101010] w-full h-auto rounded-[8px] p-8">
      <div className="p-5 flex flex-col space-y-5">
        <p className="text-white text-[24px] font-bold">Create Presale</p>

        <div className="flex flex-col space-y-5">
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="text-white text-[14px] mb-2">Name</label>
              <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                <input
                  name="name"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="Token Address"
                  value={formValues.name}
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
                  type="datetime-local"
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
                  type="datetime-local"
                  className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                  placeholder="End Date"
                  value={formValues.enddate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

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

          <div className="flex flex-col space-y-4">
            <p className="text-white text-[14px] mb-2">Vesting</p>
            {vesting.map((v, index) => (
              <div key={index} className="flex flex-row space-x-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white text-[14px] mb-2">Percentage</label>
                  <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                    <input
                      name="percentage"
                      type="number"
                      className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                      placeholder="Percentage"
                      value={v.percentage}
                      onChange={(e) => handleVestingChange(index, e)}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white text-[14px] mb-2">Release Date</label>
                  <div className="flex flex-row w-full h-[60px] border-[#282828] border-[1px] rounded-[4px]">
                    <input
                      name="releaseDate"
                      type="datetime-local"
                      className="w-full h-full bg-transparent outline-none pl-5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#08E04A] rounded-md transition ease-in-out"
                      placeholder="Release Date"
                      value={v.releaseDate}
                      onChange={(e) => handleVestingChange(index, e)}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-auto items-center justify-center">
                  <button
                    type="button"
                    onClick={() => deleteVestingField(index)}
                    className="text-white bg-red-500 hover:bg-red-700 rounded-full w-[30px] h-[30px] flex items-center justify-center"
                  >
                    <div className='w-full h-full flex items-center justify-center'>
                      &times;
                    </div>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVestingField}
              className="hover:border-[#08E04A] hover:text-[#08E04A] border-white transition ease-in-out border-[1px] rounded-full w-full h-[40px]  text-white text-[14px] font-bold"
            >
              Add Vesting Field
            </button>
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
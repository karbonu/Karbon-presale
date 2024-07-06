// src/components/BuyWithPaypal.tsx
import  { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCreatePaypalOrderMutation } from '@/components/shared/Hooks/useCreatePaypalOrder';
import { useVerifyPaymentMutation } from '@/components/shared/Hooks/useVerifyPayment';
import { useAuth } from '@/components/shared/Contexts/AuthContext';
import { BarLoader } from 'react-spinners';
import USDTIcon from '@/components/Icons/USDTIcon';
import BackArrow from '@/components/Icons/BackArrow';

const BuyWithPaypal = (props: any) => {
  const [amount, setAmount] = useState<string>('');
  const { UserID } = useAuth();
  const createOrderMutation = useCreatePaypalOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();

  const handleCreateOrder = async () => {
    const result = await createOrderMutation.mutateAsync({ amount });
    return result.data.id;
  };

  const handleApprove = async (data: any, actions: any) => {
    await actions.order.capture();
    verifyPaymentMutation.mutate({
      orderID: data.orderID,
      userID: UserID,
      amount: amount,
    });
  };

  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <div className="w-full flex items-center px-3 rounded-[4px] bg-[#1C1C1C] h-[40px]">
          <div className="flex flex-row items-center justify-between w-[213px]">
            <div onClick={() => props.setSelectedMethod(0)} className="flex cursor-pointer flex-row items-center justify-center space-x-1">
              <BackArrow />
              <p className="text-white text-[12px]">Back</p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <USDTIcon />
              <p className="text-white text-[14px]">Buy with Paypal</p>
            </div>
          </div>
        </div>
      <div className="flex flex-col py-5 items-center justify-center space-y-5">
        <div className="w-full flex bg-black border-[0.5px] border-[#484848] h-[48px]">
          <label htmlFor="buyInput" className="flex flex-row items-center space-x-5 justify-between px-4 w-full">
            <p className="text-white text-[12px]">You Buy</p>
            <div className="bg-[#484848] w-[0.5px]" />
            <div className="flex flex-row items-center justify-center space-x-2 flex-1">
              <input
                id="buyInput"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent h-full w-[80%] text-[20px] placeholder:text-white text-white focus:outline-none"
              />
              <p className="text-white text-[12px] opacity-70">USDT</p>
            </div>
          </label>
        </div>
        <PayPalButtons
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />
        {verifyPaymentMutation.isPending  && <BarLoader />}
      </div>
    </PayPalScriptProvider>
  );
};

export default BuyWithPaypal;


// src/components/BuyWithPaypal.tsx
import  { useState } from 'react';
import { useAuth } from '@/components/shared/Contexts/AuthContext';
import USDTIcon from '@/components/Icons/USDTIcon';
import BackArrow from '@/components/Icons/BackArrow';

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps
} from "@paypal/react-paypal-js";
import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';


const BuyWithPaypal = (props: any) => {
  const [amount, setAmount] = useState<string>('');
  const { UserID } = useAuth();
  
  const paypalScriptOptions: ReactPayPalScriptOptions = {
    "clientId":import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD"
  };
  function Button() {
    console.log(UserID)
    /**
     * usePayPalScriptReducer use within PayPalScriptProvider
     * isPending: not finished loading(default state)
     * isResolved: successfully loaded
     * isRejected: failed to load
     */
    const [{ isPending }] = usePayPalScriptReducer();
    const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
      style: { layout: "vertical" },
      createOrder(data: any, actions: any) {
        console.log(data)
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: "0.01"
              }
            }
          ]
        });
      },
      onApprove(data: any, actions: any) {
        /**
         * data: {
         *   orderID: string;
         *   payerID: string;
         *   paymentID: string | null;
         *   billingToken: string | null;
         *   facilitatorAccesstoken: string;
         * }
         */
        return actions.order.capture({}).then((details: any) => {
          alert(
            "Transaction completed by" +
              (details?.payer.name.given_name ?? "No details")
          );
  
          alert("Data details: " + JSON.stringify(data, null, 2));
        });
      }
    };
    return (
      <>
        {isPending ? <h2>Load Smart Payment Button...</h2> : null}
        <PayPalButtons {...paypalbuttonTransactionProps} />
      </>
    );
  }

  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
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
        <Button />

      </div>
    </PayPalScriptProvider>
  );
};

export default BuyWithPaypal;


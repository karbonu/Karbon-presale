import BackArrow from "@/components/Icons/BackArrow";
import KarbonLogo from "@/components/Icons/KarbonLogo";
import PasswordLogo from "@/components/Icons/PasswordLogo";
import SucccessIconSmall from "@/components/Icons/SucccessIconSmall";
import PasswordIconComp from "@/components/shared/PasswordIconComp";
import { useState } from "react";


const PasswordReset = () => {
    const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revealConfirmError, setRevealConfirmError] = useState(false);
  const [validation, setValidation] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password : any) => {
    const minLength = password.length >= 10;
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setValidation({
      minLength,
      upperCase,
      lowerCase,
      number,
      specialChar,
    });
  };

  const handlePasswordChange = (event : any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (event : any) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword !== password) {
      setRevealConfirmError(true);
    } else {
      setRevealConfirmError(false);
    }
  };

  return (
    <div className="p-[60px] max-sm:p-5 max-sm:pt-10">
    <div className="max-sm:flex max-sm:items-center max-sm:justify-center">
      <KarbonLogo />
    </div>

    <div className="flex items-center justify-center w-full flex-col">

      {step === 1 && (
        <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
          <div className="w-[450px] max-sm:w-[100%] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
            <div className="py-5 px-8 flex flex-col justify-between h-full">
              <div className="flex flex-row space-x-2 items-center pb-5">
                <PasswordLogo />
                <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Create a new password</p>
              </div>

              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[14px] max-sm:text-[12px]">Password</p>
                  <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.minLength} />
                    <p className={!validation.minLength ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>Must contain at least 10 characters</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.upperCase} />
                    <p className={!validation.upperCase ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>Upper case character</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.lowerCase} />
                    <p className={!validation.lowerCase ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>Lower case character</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.number} />
                    <p className={!validation.number ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>Number</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.specialChar} />
                    <p className={!validation.specialChar ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>Special Character</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[14px] max-sm:text-[12px]">Confirm Password</p>
                  <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                  {revealConfirmError && (
                    <p className="text-[10px] text-red-500">Password does not match</p>
                  )}
                </div>
                <div>
                  <div onClick={() => setStep(2)} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                    <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">Reset Password</p>
                  </div>
                </div>

                <a href="/sign-in" className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                    <div className="flex items-center justify-center">
                        <BackArrow />
                    </div>
                    <p className="text-white text-[14px]">Back to Login</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    {step ===2 && (
        <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
            <div className="w-[450px] py-5 max-sm:w-[100%] items-center justify-center bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                <div className="py-5 px-8 flex flex-col space-y-5 justify-between h-full">
                    <div className="flex flex-row space-x-2 items-center justify-center">
                        <SucccessIconSmall/>
                    </div>
                    <p className="text-white font-bold text-center text-[20px]">Password Reset Successful</p>
                    <a href="/sign-in" className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                        <div className="flex items-center justify-center">
                            <BackArrow />
                        </div>
                        <p className="text-white text-[14px]">Back to Login</p>
                    </a>
                </div>
            </div>
        </div>  
        )}
    </div>

    <div className="lg:absolute lg:bottom h-full-10 flex items-center justify-center pt-10 lg:left-[43.5%]">
          <p className="text-white text-[10px] opacity-50">Copyright © 2024 Karbon. All rights reserved.</p>
      </div>
  </div>
  )
}

export default PasswordReset
import AppleLogo from "@/components/Icons/AppleLogo";
import CloseIcon from "@/components/Icons/CloseIcon";
import GoogleLogo from "@/components/Icons/GoogleLogo";
import KarbonLogo from "@/components/Icons/KarbonLogo";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import VerifyEmailIcon from "@/components/Icons/VerifyEmailIcon";
import PasswordLogo from "@/components/Icons/PasswordLogo";
import BackArrow from "@/components/Icons/BackArrow";
import PasswordIconComp from "@/components/shared/PasswordIconComp";
import { useRegisterMutation } from "@/components/shared/Hooks/UseRegisterMutation";
import { useAccount } from "wagmi";
import { BarLoader } from "react-spinners";


const SignUp = () => {
  const [chanceInfo, setChanceInfo] = useState(true);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [revealConfirmError, setRevealConfirmError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [validation, setValidation] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const validatePassword = (password: string) => {
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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setRegistrationError('');
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.target.value;
    setRegistrationError('');
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword !== password) {
      setRevealConfirmError(true);
    } else {
      setRevealConfirmError(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setRegistrationError('');
  };

  const {address} = useAccount();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setRevealConfirmError(true);
      return;
    }
    setIsRegistering(true);
    registerMutation.mutate(
      {
        email,
        walletAddress: address || "",
        referrerId: "",
        password,
      },
      {
        onSuccess: () => {
          setIsRegistering(false);
          navigate("/sign-in");
        },
        onError: () => {
          setRegistrationError("Registration failed");
          setIsRegistering(false);
        },
      }
    );
  };

  return (
    <div className="p-[60px] max-sm:p-5 max-sm:pt-10">
      <div className="max-sm:flex max-sm:items-center max-sm:justify-center">
        <KarbonLogo />
      </div>

      <div className="flex items-center justify-center w-full flex-col">
        {chanceInfo && (
          <div className="flex absolute top-20 max-sm:top-18 max-sm:w-[80%] flex-row space-x-3 items-center justify-between pl-5 rounded-[8px] border-[1px] border-[#282828] w-[421px] h-[52px] bg-black">
            <div onClick={() => setChanceInfo(false)}>
              <CloseIcon />
            </div>
            <div>
              <p className="text-white text-[10px]">A chance to buy Karbon tokens at half of the launch price.</p>
            </div>
            <div>
              <img src="./assets/halfPriceNotification.svg" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center justify-center pt-[6rem]">
            <div className="w-[437px] max-sm:w-[100%] h-[495px] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
              <div className="py-5 flex flex-col justify-between h-full">
                <p className="text-white px-8 text-[20px] max-sm:text-[16px] font-semibold">Create an account</p>

                <div className="flex flex-col px-5 items-center justify-center space-y-2">
                  <div className="flex flex-row w-[389px] max-sm:w-[100%] h-[56px] bg-[#1C1C1C]">
                    <div className="px-5 absolute py-3 flex items-center">
                      <GoogleLogo />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white text-[14px] max-sm:text-[12px]">Sign up with Google</p>
                    </div>
                  </div>

                  <div className="flex flex-row w-[389px] max-sm:w-[100%] h-[56px] bg-[#1C1C1C]">
                    <div className="px-7 absolute py-5 flex items-center">
                      <AppleLogo />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white text-[14px] max-sm:text-[12px]">Sign up with Apple ID</p>
                    </div>
                  </div>
                </div>

                <div className="flex px-8 flex-row space-x-4 w-full items-center justify-center max-sm:justify-between">
                  <Separator orientation="horizontal" className="max-w-[27%] max-sm:max-w-[20%]" />
                  <p className="text-white text-[14px] max-sm:text-[12px]">or sign up with email</p>
                  <Separator orientation="horizontal" className="max-w-[27%] max-sm:max-w-[20%]" />
                </div>

                <div className="flex px-8 flex-row space-x-3 items-center">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-white opacity-50 text-[14px] max-sm:text-[12px]">
                    By creating an account, I agree to Karbon's <a href='https://karbon-website.vercel.app/terms-of-use' target='blank' className="underline underline-offset-2">Terms of Service</a> and <a href='https://karbon-website.vercel.app/privacy-policy' target='blank' className="underline underline-offset-2">Privacy Policy</a>
                  </Label>
                </div>

                <div className="flex px-8 flex-col space-y-5">
                  <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="email" placeholder="Enter Email" value={email} onChange={handleEmailChange} />
                  <div>
                    <div onClick={() => setStep(2)} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                      <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">Proceed</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row space-x-2 items-center justify-center">
                  <p className="text-white text-[14px] max-sm:text-[12px]">Already have an account?</p>
                  <a href="/sign-in" className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold">Sign In</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
            <div className="w-[450px] max-sm:w-[100%] h-[366px] bg-[#101010] border-[#2D2D2D] py-5 border-[1px] rounded-[8px]">
              <div className="px-8 flex flex-col justify-between h-full">
                <div className="flex flex-row space-x-2 items-center">
                  <VerifyEmailIcon />
                  <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Verify Email</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-white text-[14px] max-sm:text-[12px] opacity-70">A six-digit verification code was sent to</p>
                  <p className="text-white text-[14px] max-sm:text-[12px]">{email}</p>
                  <div className="flex flex-row space-x-2">
                    <p className="text-white opacity-70 text-[14px] max-sm:text-[12px]">Not your email?</p>
                    <p onClick={() => setStep(1)} className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold cursor-pointer">change email</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-[14px] max-sm:text-[12px]">Enter Verification Code</p>
                    <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="text" />
                  </div>
                  <div>
                    <div onClick={() => setStep(3)} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                      <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">Proceed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
            <div className="w-[450px] max-sm:w-[100%] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
              <div className="py-5 px-8 flex flex-col justify-between h-full">
                <div className="flex flex-row space-x-2 items-center pb-5">
                  <PasswordLogo />
                  <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Create a password</p>
                </div>
                <div className="flex flex-row space-x-1 items-center">
                  <p className="text-white opacity-80 text-[14px] max-sm:text-[12px]">Welcome</p>
                  <p className="text-white text-[14px] max-sm:text-[12px]">{email}</p>
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
                    <button disabled={isRegistering} onClick={handleRegister} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                      {isRegistering ? (
                        <BarLoader/>
                      ): (
                        <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">Proceed</p>
                      )}
                    </button>
                  </div>

                  {registrationError && (
                      <p className="text-[10px] text-red-500 mt-2">{registrationError}</p>
                    )}

                  <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                    <div className="flex items-center justify-center">
                      <BackArrow />
                    </div>
                    <p className="text-white text-[14px] max-sm:text-[12px]">Back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:absolute lg:bottom-10 flex items-center justify-center pt-10 lg:left-[43.5%]">
        <p className="text-white text-[10px] opacity-50">Copyright © 2024 Karbon. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignUp;

// src/components/BuyWithPaypal.tsx
import { useState } from 'react';
import BackArrow from '@/components/Icons/BackArrow.tsx';
import PasswordLogo from '@/components/Icons/PasswordLogo.tsx';
import SucccessIconSmall from '@/components/Icons/SucccessIconSmall.tsx';
import { usePasswordOTPMutate, useVerifyEmailMutation } from '@/components/shared/Hooks/UseAuthMutation.tsx';
import PasswordIconComp from '@/components/shared/PasswordIconComp.tsx';
import { BarLoader } from 'react-spinners';
import EyeIcon from '@/components/Icons/EyeIcon.tsx';
import EyeIcongreen from '@/components/Icons/EyeIcongreen.tsx';
import { useToast } from '@/components/ui/use-toast';

import { useTranslation } from 'react-i18next';

const PasswordReset = (props: any) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [OTP, setOTP] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revealConfirmError, setRevealConfirmError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const passwordOtpMutate = usePasswordOTPMutate();
  const verifyMutate = useVerifyEmailMutation();

  const [validation, setValidation] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password: any) => {
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

  const handlePasswordChange = (event: any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.target.value;
    setVerificationError('');
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword !== password) {
      setRevealConfirmError(true);
    } else {
      setRevealConfirmError(false);
    }
  };

  const handleVerify = () => {
    if (Number(OTP) === 0) {
      toast({
        variant: 'failure',
        title: t('enterOTP'),
        description: t('invalidOTP'),
      })
      return;
    }
    setIsVerifying(true);
    let email = props.email;

    verifyMutate.mutate(
      {
        email,
        otp: Number(OTP),
      },
      {
        onSuccess: () => {
          // console.log(response.data);
          toast({
            variant: 'success',
            title: t('success'),
            description: t('otpSuccess'),
          })
          setStep(2);
          setIsVerifying(false);
        },
        onError: () => {
          // console.log(error);
          toast({
            variant: 'failure',
            title: t('error'),
            description: t('otpFailed'),
          })
          setIsVerifying(false);
        },
      }
    );
  };

  const handleReset = () => {
    setIsVerifying(true);

    let email = props.email;
    passwordOtpMutate.mutate(
      {
        email,
        newPassword: password
      },
      {
        onSuccess: () => {
          setIsVerifying(false);
          window.location.reload();
          toast({
            variant: 'success',
            title: t('success'),
            description: t('passwordResetSuccess'),
          })
        },
        onError: () => {
          // console.log(error);
          setIsVerifying(false);
          toast({
            variant: 'failure',
            title: t('error'),
            description: t('passwordResetFailed'),
          })
        }
      }
    );
  };

  const handleOTPKeydown = (event: any) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };

  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(event.target.value);
    setVerificationError('');
  };

  return (
    <div className="flex items-center justify-center w-full flex-col">
      {step === 1 && (
        <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
          <div className="w-[450px] max-sm:w-[100%] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] py-5 border-[1px] rounded-[8px]">
            <div className="py-5 md:px-8 max-sm:px-5 flex space-y-5 flex-col justify-between h-full">
              <div className="flex flex-row space-x-2 items-center">
                <PasswordLogo />
                <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('resetPassword')}</p>
              </div>
              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-2">
                  <p className="text-white text-[14px] max-sm:text-[12px]">{t('enterOtp')}</p>
                  <input
                    onChange={handleOTPChange}
                    onKeyDown={handleOTPKeydown}
                    className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4"
                    type="text"
                  />
                </div>
                <div>
                  <button
                    onClick={handleVerify}
                    className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer"
                  >
                    {isVerifying ? (
                      <BarLoader />
                    ) : (
                      <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">{t('proceed')}</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
          <div className="w-[450px] max-sm:w-[100%] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
            <div className=" py-5 md:px-8 max-sm:px-5 flex flex-col justify-between h-full">
              <div className="flex flex-row space-x-2 items-center pb-5">
                <PasswordLogo />
                <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('createNewPassword')}</p>
              </div>

              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-2 relative">
                  <p className="text-white text-[14px] max-sm:text-[12px]">{t('password')}</p>
                  <input
                    className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <div
                    className="absolute right-4 top-10 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcongreen />
                    ) : (
                      <EyeIcon />
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.minLength} />
                    <p className={!validation.minLength ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>{t('minCharacters')}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.upperCase} />
                    <p className={!validation.upperCase ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>{t('upperCase')}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.lowerCase} />
                    <p className={!validation.lowerCase ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>{t('lowerCase')}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.number} />
                    <p className={!validation.number ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>{t('number')}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <PasswordIconComp condition={validation.specialChar} />
                    <p className={!validation.specialChar ? 'text-[14px] max-sm:text-[12px] text-white opacity-55' : 'text-[14px] max-sm:text-[12px] text-[#08E04A]'}>{t('specialCharacter')}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 relative">
                  <p className="text-white text-[14px] max-sm:text-[12px]">{t('confirmPassword')}</p>
                  <input
                    className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <div
                    className="absolute right-4 top-10 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcongreen />
                    ) : (
                      <EyeIcon />
                    )}
                  </div>
                  {revealConfirmError && (
                    <p className="text-[10px] text-red-500">{t('passwordMismatch')}</p>
                  )}
                </div>
                <div>
                  <div
                    onClick={handleReset}
                    className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer"
                  >
                    {isVerifying ? (
                      <BarLoader />
                    ) : (
                      <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">{t('resetPassword')}</p>
                    )}
                  </div>
                  {verificationError && (
                    <p className="text-[10px] w-full text-center text-red-500 mt-2">{verificationError}</p>
                  )}
                </div>

                <a onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                  <div className="flex items-center justify-center">
                    <BackArrow />
                  </div>
                  <p className="text-white text-[14px]">{t('back')}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
          <div className="w-[450px] py-5 max-sm:w-[100%] items-center justify-center max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
            <div className=" py-5 md:px-8 max-sm:px-5 flex flex-col space-y-5 justify-between h-full">
              <div className="flex flex-row space-x-2 items-center justify-center">
                <SucccessIconSmall />
              </div>
              <p className="text-white font-bold text-center text-[20px]">{t('passwordResetSuccess')}</p>
              <a href="/sign-in" className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                <div className="flex items-center justify-center">
                  <BackArrow />
                </div>
                <p className="text-white text-[14px]">{t('backToLogin')}</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;

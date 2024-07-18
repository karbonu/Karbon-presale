import AppleLogo from "@/components/Icons/AppleLogo.tsx";
import CloseIcon from "@/components/Icons/CloseIcon.tsx";
import GoogleLogo from "@/components/Icons/GoogleLogo.tsx";
import KarbonLogo from "@/components/Icons/KarbonLogo.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useState } from "react";

import VerifyEmailIcon from "@/components/Icons/VerifyEmailIcon.tsx";
import PasswordLogo from "@/components/Icons/PasswordLogo.tsx";
import BackArrow from "@/components/Icons/BackArrow.tsx";
import PasswordIconComp from "@/components/shared/PasswordIconComp.tsx";
import { useRegisterMutation } from "@/components/shared/Hooks/UseRegisterMutation.tsx";
import { BarLoader } from "react-spinners";

import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useInitialNonceMutation, useLoginMutation, useSocialAuthMutation, useVerifyEmailMutation } from "@/components/shared/Hooks/UseAuthMutation.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/shared/Contexts/AuthContext.tsx";
import EyeIcongreen from "@/components/Icons/EyeIcongreen.tsx";
import EyeIcon from "@/components/Icons/EyeIcon.tsx";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [chanceInfo, setChanceInfo] = useState(true);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [revealConfirmError, setRevealConfirmError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [otp, setOtp] = useState("");
  const { setUserID,
    setReferralCOde,
    setEmail: setAuthEmail,
    isAuthenticated,
    setPassword: setAuthPassword,
    setAuthenticated,
    referralCode,
    setAccessTToken,
    setIsGoogleSignIn,
    setLastSignInTime
  } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const navigate = useNavigate();
  const [validation, setValidation] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const registerMutation = useRegisterMutation();
  const verifyMutat = useVerifyEmailMutation();
  const initialNonceMutation = useInitialNonceMutation();
  const loginMutation = useLoginMutation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifying, setISVerifying] = useState(false);
  const [verificationError, setverificationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



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

  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp((event.target.value));
    setverificationError('');
  };



  const handleRegister = () => {
    if (password === "") {
      toast({
        title: t('invalidPassword'),
        description: t('enterValidPassword'),
      })
      return;
    } else {
      if (confirmPassword === "") {
        toast({
          title: t('invalidConfirmPassword'),
          description: t('enterValidPassword'),
        })
        return;
      }
    }


    if (password !== confirmPassword) {
      setRevealConfirmError(true);
      return;
    }
    setIsRegistering(true);

    registerMutation.mutate(
      {
        email,
        walletAddress: "",
        referrerId: referralCode as string,
        password,
      },
      {
        onSuccess: () => {
          setIsRegistering(false);
          toast({
            variant: "success",
            title: t('success'),
            description: t('registrationSuccess'),
          })
          setStep(3);
        },
        onError: () => {
          // console.log(error);
          toast({
            variant: "failure",
            title: t('error'),
            description: t('registrationFailed'),
          })
          setIsRegistering(false);
        },
      }
    );
  };

  const handleVerify = () => {

    if (otp == "") {
      toast({
        variant: "failure",
        title: t('enterOTP'),
        description: t('invalidOTP'),
      })
      return;
    }
    setISVerifying(true);
    let nonce = '';
    verifyMutat.mutate(
      {
        email,
        otp: Number(otp),
      },
      {
        onSuccess: () => {


          initialNonceMutation.mutate(
            { email },
            {
              onSuccess: (response: any) => {
                nonce = response.data.nonce;


                loginMutation.mutate(
                  { email, password, nonce },
                  {
                    onSuccess: (response: any) => {
                      if (response.data.user.is_verified === false) {
                        setStep(5)
                        return;
                      }
                      // console.log(response.data)
                      setAccessTToken(response.data.access_token);
                      setUserID(response.data.user.id);
                      setReferralCOde(response.data.user.referralCode);
                      setLastSignInTime(Date.now());
                      setAuthEmail(email);
                      setAuthPassword(password);
                      setAuthenticated(true);
                      toast({
                        variant: "success",
                        title: t('success'),
                        description: t('loginSuccess'),
                      })
                      navigate('/dashboard');
                      setIsLoggingIn(false);
                      setISVerifying(false);
                    },
                    onError: () => {
                      toast({
                        variant: "failure",
                        title: t('error'),
                        description: t('invalidLogin'),
                      })
                      setISVerifying(false);
                      setIsLoggingIn(false);
                    }
                  }
                );

              },
              onError: () => {
                toast({
                  variant: "failure",
                  title: t('error'),
                  description: t('accountNotExist'),
                })
              }
            }
          );



        },
        onError: () => {
          toast({
            variant: "failure",
            title: t('error'),
            description: t('invalidExpiredOTP'),
          })
          setISVerifying(false);
        }
      }
    );
  };



  const handleemailKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      if (email === "") {
        toast({
          variant: "failure",
          title: t('invalidEmail'),
          description: t('enterValidEmail'),
        })
      } else {
        setStep(2)
      }
    }
  };



  const handleVerificationKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };



  const socialSignIn = useSocialAuthMutation();

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      setRegistrationError('');
      const token = res.access_token;
      setIsRegistering(true);
      setIsLoggingIn(true);
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { email, sub: userID } = userInfo.data;
        setIsRegistering(true);
        socialSignIn.mutate(
          {
            token: token,
            unique_id: userID,
            email: email,
            phone: "",
            medium: 'google',
            id_token: userID,
            ref_code: referralCode
          },

          {
            onSuccess: (response) => {
              localStorage.removeItem('referralCode');
              setAccessTToken(response.data.access_token);
              setUserID(response.data.user.id);
              setReferralCOde(response.data.user.referralCode);
              setAuthEmail(response.data.user.email);
              setLastSignInTime(Date.now());
              setIsGoogleSignIn(true)
              setAuthPassword('');
              setAuthenticated(true);
              navigate('/dashboard');
              setIsLoggingIn(false);
              toast({
                variant: "success",
                title: t('success'),
                description: t('loginSuccess'),
              })
            },
            onError: () => {
              toast({
                variant: "failure",
                title: t('error'),
                description: t('invalidLogin'),
              })
              setIsLoggingIn(false);
            }
          }
        );



      } catch (error) {
        toast({
          variant: "failure",
          title: t('error'),
          description: t('loginFailed'),
        })
        setIsLoggingIn(false);
        setIsRegistering(false);
      }
    },
    onError: () => {
      toast({
        variant: "failure",
        title: t('error'),
        description: t('loginFailed'),
      })
    },
  });

  const handleStepOne = () => {
    if (email === "") {
      toast({
        title: t('invalidEmail'),
        description: t('enterValidEmail'),
      })
    } else {
      setStep(2)
    }
  }

  return (
    <div className="p-[60px] max-sm:p-2 ">
      <div className="max-sm:flex max-sm:items-start max-sm:justify-start max-sm:pt-10 max-sm:pl-5">
        <KarbonLogo />
      </div>

      <div className="flex items-center justify-center w-full flex-col">
        {chanceInfo && (
          <div className="flex absolute top-20 max-sm:hidden max-sm:w-[80%] flex-row space-x-3 items-center justify-between pl-5 rounded-[8px] border-[1px] border-[#282828] w-[421px] h-[52px] bg-black">
            <div onClick={() => setChanceInfo(false)}>
              <CloseIcon />
            </div>
            <div>
              <p className="text-white text-[10px]">{t('chanceToBuy')}.</p>
            </div>
            <div>
              <img src="./assets/halfPriceNotification.svg" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center justify-center md:pt-[7rem] max-sm:pt-[4rem]">
            <div className="w-[437px] max-sm:w-[100%] h-[495px] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
              <div className="py-5 flex flex-col justify-between h-full">
                <p className="text-white px-5 text-[20px] max-sm:text-[16px] font-semibold">{t('createAccount')}</p>

                <div className="flex flex-col px-5 items-center justify-center space-y-2">
                  <div onClick={() => login()} className="flex cursor-pointer flex-row w-[389px] max-sm:w-[100%] h-[56px] bg-[#1C1C1C]">
                    <div className="px-5 absolute py-3 flex items-center">
                      <GoogleLogo />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white text-[14px] max-sm:text-[12px]">{t('signUpGoogle')}</p>
                    </div>
                  </div>

                  <div className="flex flex-row w-[389px] max-sm:w-[100%] h-[56px] bg-[#1C1C1C]">
                    <div className="px-7 absolute py-5 flex items-center">
                      <AppleLogo />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white text-[14px] max-sm:text-[12px]">{t('signUpApple')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex px-8 max-sm:px-5 flex-row space-x-4 w-full items-center justify-between max-sm:justify-between">
                  <Separator orientation="horizontal" className="max-w-[20%] max-sm:max-w-[20%]" />
                  <p className="text-white text-[14px] max-sm:text-[12px]">{t('signUpEmail')}</p>
                  <Separator orientation="horizontal" className="max-w-[20%] max-sm:max-w-[20%]" />
                </div>

                <div className="flex px-8 max-sm:px-5 flex-col space-y-5">
                  <input onKeyDown={handleemailKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="email" placeholder={t('enterEmail')} value={email} onChange={handleEmailChange} />
                  <div className="  items-center opacity-70 text-white font-normal font-inter text-[12px]">
                    {t('agreeToTerms')} <a href='https://karbon-website.vercel.app/terms-of-use' target='blank' className="underline underline-offset-2">{t('termsOfService')}</a> and <a href='https://karbon-website.vercel.app/privacy-policy' target='blank' className="underline underline-offset-2">{t('privacyPolicy')}</a>
                  </div>
                  <div>
                    <button disabled={isLoggingIn} onClick={handleStepOne} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                      {isLoggingIn ? (
                        <BarLoader />
                      ) : (
                        <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">{t('proceed')}</p>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-row space-x-2 items-center justify-center">
                  <p className="text-white text-[14px] max-sm:text-[12px]">{t('alreadyHaveAccount')}</p>
                  <a href="/sign-in" className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold">{t('signIn')}</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[4rem]">
            <div className="w-[450px] max-sm:w-[100%] h-[366px] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] py-5 border-[1px] rounded-[8px]">
              <div className="px-8 max-sm:px-5 flex flex-col justify-between h-full">
                <div className="flex flex-row space-x-2 items-center">
                  <VerifyEmailIcon />
                  <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('verifyEmail')}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-white text-[14px] max-sm:text-[12px] opacity-70">{t('otpSentTo')}</p>
                  <p className="text-white text-[14px] max-sm:text-[12px]">{email}</p>
                  <div className="flex flex-row space-x-2">
                    <p className="text-white opacity-70 text-[14px] max-sm:text-[12px]">{t('notYourEmail')}</p>
                    <p onClick={() => setStep(1)} className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold cursor-pointer">{t('changeEmail')}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('enterVerificationCodeTitle')}</p>
                    <input onChange={handleOTPChange} onKeyDown={handleVerificationKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="text" />
                  </div>
                  {verificationError && (
                    <p className="text-[10px] w-full text-center text-red-500 mt-2">{verificationError}</p>
                  )}

                  <div>
                    <button disabled={isVerifying} onClick={() => handleVerify()} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
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
          <div className="flex flex-col w-full items-center justify-center pt-[5rem] max-sm:pt-[3rem]">
            <div className="w-[450px] max-sm:w-[100%] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
              <div className="py-5 px-8 max-sm:px-5 flex flex-col justify-between h-full">
                <div className="flex flex-row space-x-2 items-center pb-5">
                  <PasswordLogo />
                  <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('createPassword')}</p>
                </div>
                <div className="flex flex-row space-x-1 items-center">
                  <p className="text-white opacity-80 text-[14px] max-sm:text-[12px]">{t('welcome')}</p>
                  <p className="text-white text-[14px] max-sm:text-[12px]">{email}</p>
                </div>

                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
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
                    <button disabled={isRegistering} onClick={handleRegister} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                      {isRegistering ? (
                        <BarLoader />
                      ) : (
                        <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">{t('proceed')}</p>
                      )}
                    </button>
                  </div>

                  {registrationError && (
                    <p className="text-[10px] w-full text-center text-red-500 mt-2">{registrationError}</p>
                  )}

                  <div onClick={() => setStep(1)} className="flex flex-row w-full space-x-2 items-center justify-center cursor-pointer">
                    <div className="flex items-center justify-center">
                      <BackArrow />
                    </div>
                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('back')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <p className="text-white text-[10px] opacity-50">{t('copyright')}</p>
      </div>
    </div>
  );
};

export default SignUp;

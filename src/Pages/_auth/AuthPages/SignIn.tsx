// src/components/SignIn.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInitialNonceMutation, useLoginMutation } from "@/components/shared/Hooks/UseAuthMutation";
import AppleLogo from "@/components/Icons/AppleLogo";
import BackArrow from "@/components/Icons/BackArrow";
import CloseIcon from "@/components/Icons/CloseIcon";
import GoogleLogo from "@/components/Icons/GoogleLogo";
import KarbonLogo from "@/components/Icons/KarbonLogo";
import PasswordLogo from "@/components/Icons/PasswordLogo";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/components/shared/Contexts/AuthContext';
import { BarLoader } from 'react-spinners';

const SignIn = () => {
    const [chanceInfo, setChanceInfo] = useState(true);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nonce, setNonce] = useState('');
    const [isLoadingNonce, setIsLoadingNonce] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const initialNonceMutation = useInitialNonceMutation();
    const loginMutation = useLoginMutation();
    const { setEmail: setAuthEmail, setPassword : setAuthPassword, setAuthenticated, setUserID, setReferralCOde} = useAuth();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setErrorMessage('');
    };

    const handleInitialNonceRequest = () => {
        setIsLoadingNonce(true);
        initialNonceMutation.mutate(
            { email },
            {
                onSuccess: (response : any) => {
                    setNonce(response.data.nonce);
                    setStep(2);
                    setErrorMessage('');
                    setIsLoadingNonce(false);
                },
                onError: () => {
                    setErrorMessage('Invalid email');
                    setIsLoadingNonce(false);
                }
            }
        );
    };

    const handleEmailKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleInitialNonceRequest();
        }
      };

    const handleLoginRequest = () => {
        setIsLoggingIn(true);
        loginMutation.mutate(
            { email, password, nonce },
            {
                onSuccess: (response: any) => {
                    setUserID(response.data.user.id)
                    setReferralCOde(response.data.user.referralCode)
                    setAuthEmail(email);
                    setAuthPassword(password);
                    setAuthenticated(true);
                    navigate('/dashboard');
                    setIsLoggingIn(false);
                },
                onError: () => {
                    setErrorMessage('Login failed, Try Again');
                    setIsLoggingIn(false);
                }
            }
        );
    };

    const handleSignInKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleLoginRequest();
        }
      };


    return (
        <div className="p-[60px] max-sm:p-5">
            <div className="max-sm:flex max-sm:items-center max-sm:justify-center">
                <KarbonLogo />
            </div>

            <div className="flex items-center justify-center w-full flex-col">
                {chanceInfo && (
                    <div className="flex absolute top-20 max-sm:top-24 flex-row space-x-3 items-center justify-between pl-5 rounded-[8px] border-[1px] border-[#282828] max-sm:w-[80%] w-[421px] h-[52px] bg-black">
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
                    <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
                        <div className="w-[450px] max-sm:w-[100%] h-[456px] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 px-8 flex flex-col justify-between h-full">
                                <p className="text-white text-[20px] max-sm:text-[90%] font-semibold">Sign In</p>

                                <div className="flex flex-col space-y-2">
                                    <div className="flex flex-row w-[389px] max-sm:w-[100%] max-sm:h-[48px] h-[56px] bg-[#1C1C1C]">
                                        <div className="px-5 absolute max-sm:py-[0.7rem] py-3 flex items-center">
                                            <GoogleLogo />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-white text-[14px] max-sm:text-[10px]">Sign in with Google</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row w-[389px] max-sm:w-[100%] max-sm:h-[48px] h-[56px] bg-[#1C1C1C]">
                                        <div className="px-7 absolute max-sm:py-[0.7rem] py-5 flex items-center">
                                            <AppleLogo />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-white text-[14px] max-sm:text-[10px]">Sign in with Apple ID</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-4 w-full items-center justify-center max-sm:justify-between">
                                    <Separator orientation="horizontal" className="max-w-[27%] max-sm:max-w-[20%]" />
                                    <p className="text-white text-[14px] max-sm:text-[12px]">or sign in with email</p>
                                    <Separator orientation="horizontal" className="max-w-[27%] max-sm:max-w-[20%]" />
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <input onKeyDown={handleEmailKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="email" placeholder="Enter Email" value={email} onChange={handleEmailChange} />
                                    <div>
                                        <button disabled={isLoadingNonce} onClick={handleInitialNonceRequest} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isLoadingNonce ? (
                                                <BarLoader/>
                                            ) : (
                                                <p className="font-bold text-[14px] shadow-sm">
                                                    Sign In
                                                </p>
                                            )}
                                        </button>
                                        {errorMessage && (
                                            <p className="text-[12px] w-full text-center text-red-500 mt-2">{errorMessage}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-2 items-center justify-center">
                                    <p className="text-white text-[14px] max-sm:text-[12px]">Don't have an account?</p>
                                    <a href="/sign-up" className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold">Sign Up</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
                        <div className="w-[450px] max-sm:w-[100%] h-[346px] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 px-8 flex flex-col justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center">
                                    <PasswordLogo />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Enter Password</p>
                                </div>
                                <div className="flex flex-row space-x-1 items-center">
                                    <p className="text-white opacity-80 text-[14px]">Welcome</p>
                                    <p className="text-white text-[14px]">{email}</p>
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-white text-[14px]">Password</p>
                                        <input onKeyDown={handleSignInKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="password" value={password} onChange={handlePasswordChange} />
                                    </div>
                                    <p onClick={() => setStep(3)} className="text-[14px] max-sm:text-[12px] cursor-pointer text-[#08E04A] font-semibold">Forgot Password?</p>
                                    <div>
                                        <div onClick={handleLoginRequest} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isLoggingIn ? (
                                                <BarLoader/>
                                            ): (
                                                <p className="font-bold text-[14px] shadow-sm">
                                                    Proceed
                                                </p>
                                            )}
                                        </div>
                                        {errorMessage && (
                                            <p className=" text-[12px] w-full text-center text-red-500 mt-2">{errorMessage}</p>
                                        )}
                                    </div>
                                </div>

                                <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                                    <div className="flex items-center justify-center">
                                        <BackArrow />
                                    </div>
                                    <p className="text-white text-[14px]">Back</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
                    <div className="w-[450px] py-5 max-sm:w-[100%] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                        <div className="py-5 px-8 flex flex-col space-y-5 justify-between h-full">
                            <div className="flex flex-row space-x-2 items-center">
                                <PasswordLogo />
                                <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Reset Password</p>
                            </div>

                            <div className="flex flex-col space-y-5">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-white text-[14px]">Enter Email</p>
                                    <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[12px] rounded-[4px] h-[56px] px-4" type="email" />
                                </div>
                                <div>
                                    <div onClick={() => setStep(4)} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                        <p className="font-bold text-[14px] shadow-sm">
                                            Reset Password
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <BackArrow />
                                </div>
                                <p className="text-white text-[14px]">Back to Login</p>
                            </div>
                        </div>
                    </div>
                </div>  
                )}
                
                {step === 4 && (
                      <div className="flex flex-col w-full items-center justify-center pt-[7rem]">
                        <div className="w-[450px] py-5 max-sm:w-[100%] items-center justify-center bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 px-8 flex flex-col space-y-5 justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center justify-center">
                                    <PasswordLogo />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">Reset Password</p>
                                </div>
                                
                                <div className="flex flex-row max-sm:flex-col max-sm:space-y-2 md:space-x-1 items-center">
                                    <p className="text-white opacity-80 text-[14px]">A password reset link has been sent to</p>
                                    <p className="text-white text-[14px]">{email}</p>
                                </div>

                                <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                                    <div className="flex items-center justify-center">
                                        <BackArrow />
                                    </div>
                                    <p className="text-white text-[14px]">Back to Login</p>
                                </div>
                            </div>
                        </div>
                    </div>  
                )}
            </div>
            <div className="lg:absolute lg:bottom-10 flex items-center justify-center py-10 lg:left-[43.5%]">
                <p className="text-white text-[10px] opacity-50">Copyright © 2024 Karbon. All rights reserved.</p>
            </div>
        </div>
    );
}

export default SignIn;

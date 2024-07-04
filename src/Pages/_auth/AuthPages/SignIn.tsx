// src/components/SignIn.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInitialNonceMutation, useLoginMutation, useSocialAuthMutation, useVerifyEmailMutation } from "@/components/shared/Hooks/UseAuthMutation";
import AppleLogo from "@/components/Icons/AppleLogo";
import BackArrow from "@/components/Icons/BackArrow";
import CloseIcon from "@/components/Icons/CloseIcon";
import GoogleLogo from "@/components/Icons/GoogleLogo";
import KarbonLogo from "@/components/Icons/KarbonLogo";
import PasswordLogo from "@/components/Icons/PasswordLogo";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/components/shared/Contexts/AuthContext';
import { BarLoader } from 'react-spinners';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import VerifyEmailIcon from '@/components/Icons/VerifyEmailIcon';



const SignIn = () => {
    const [chanceInfo, setChanceInfo] = useState(true);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nonce, setNonce] = useState('');
    const [isLoadingNonce, setIsLoadingNonce] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setISVerifying] = useState(false);
    const [otp, setOtp] = useState(0);
    const verifyMutat = useVerifyEmailMutation();
    const[verificationError, setverificationError] = useState('');

    const navigate = useNavigate();
    
    const initialNonceMutation = useInitialNonceMutation();
    const loginMutation = useLoginMutation();
    const { setEmail: setAuthEmail, setPassword: setAuthPassword, setAuthenticated, setUserID, setReferralCOde } = useAuth();

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
                onSuccess: (response: any) => {
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
                    // if(response.data.user.isVerified === false){
                    //     setStep(6)
                    //     return;
                    // }
                    setUserID(response.data.user.id);
                    setReferralCOde(response.data.user.referralCode);
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

    const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(Number(event.target.value));
        setverificationError('');
      };
      const handleVerify = () => {

        if (otp === 0) {
          setverificationError("OTP Required");
          return;
        }
        setISVerifying(true);
        verifyMutat.mutate(
          {
            email,
            otp,
          },
          {
            onSuccess: (response: any) => {
              console.log(response)
              console.log(response.data)
              setISVerifying(false);
              navigate('/sign-in')
            },
            onError: (response) => {
            //   setverificationError("Expired OTP");
            if(response.message =='The otp provided has expired'){
                setISVerifying(false);
                navigate('/dashboard');
            }
              setISVerifying(false);
            },
          }
        );
      };

      
    const handleVerificationKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleVerify();
        }
    };
    
        

    const handleSignInKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleLoginRequest();
        }
    };

    const socialSignIn = useSocialAuthMutation();

    const login = useGoogleLogin({
        onSuccess: async (res) => {
            const token = res.access_token;
            setErrorMessage('');
            console.log(token)
            console.log(res)
            setIsLoggingIn(true);
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { email, sub: userID } = userInfo.data;
                console.log(userInfo.data)
                console.log(email, userID);

                socialSignIn.mutate(
                    { 
                        token : token, 
                        unique_id : userID,
                        email : email, 
                        phone : "",
                        medium : 'google', 
                        id_token : userID,
                        ref_code : ""
                    },

                    {
                        onSuccess: () => {
                            setUserID(userID);
                            setReferralCOde('');
                            setAuthEmail(email);
                            setAuthPassword('');
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


            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
    });


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
                                    <div onClick={() => {login()}} className="flex cursor-pointer flex-row w-[389px] max-sm:w-[100%] max-sm:h-[48px] h-[56px] bg-[#1C1C1C]">
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
                                    <input onKeyDown={handleEmailKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="email" placeholder="Enter Email" value={email} onChange={handleEmailChange} />
                                    <div>
                                        <button disabled={isLoadingNonce || isLoggingIn} onClick={handleInitialNonceRequest} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isLoadingNonce || isLoggingIn ? (
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
                                        <input onKeyDown={handleSignInKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="password" value={password} onChange={handlePasswordChange} />
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
                                    <input className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="email" />
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

                {step === 5 &&(
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
                            <input onChange={handleOTPChange} onKeyDown={handleVerificationKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="text" />
                          </div>
                          {verificationError && (
                              <p className="text-[10px] w-full text-center text-red-500 mt-2">{verificationError}</p>
                            )}
        
                          <div>
                            <button disabled={isVerifying} onClick={() => handleVerify} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                              {isVerifying ? (
                                <BarLoader/>
                              ): (
                                <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">Proceed</p>
                              )}
                            </button>
                          </div>
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

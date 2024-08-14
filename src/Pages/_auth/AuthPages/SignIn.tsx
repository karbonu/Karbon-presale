// src/components/SignIn.tsx
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useInitialNonceMutation, useLoginMutation, usePasswordResetMutate, useSocialAuthMutation, useVerifyEmailMutation } from "@/components/shared/Hooks/UseAuthMutation.tsx";
import AppleLogo from "@/components/Icons/AppleLogo.tsx";
import BackArrow from "@/components/Icons/BackArrow.tsx";
import CloseIcon from "@/components/Icons/CloseIcon.tsx";
import GoogleLogo from "@/components/Icons/GoogleLogo.tsx";
import KarbonLogo from "@/components/Icons/KarbonLogo.tsx";
import PasswordLogo from "@/components/Icons/PasswordLogo.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useAuth } from '@/components/shared/Contexts/AuthContext.tsx';
import { BarLoader } from 'react-spinners';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import VerifyEmailIcon from '@/components/Icons/VerifyEmailIcon.tsx';
import PasswordReset from './PasswordReset.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useTranslation } from 'react-i18next';
import EnglishFlag from '@/components/Icons/EnglishFlag.tsx';
import TurkeyLogo from '@/components/Icons/TurkeyLogo.tsx';
import GermanyFlag from '@/components/Icons/GermanyFlag.tsx';
import DownIcon from '@/components/Icons/DownIcon.tsx';



const SignIn = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [chanceInfo, setChanceInfo] = useState(true);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nonce, setNonce] = useState('');
    const [isLoadingNonce, setIsLoadingNonce] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setISVerifying] = useState(false);
    const [otp, setOtp] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const verifyMutat = useVerifyEmailMutation();
    const [verificationError, setverificationError] = useState('');

    const navigate = useNavigate();

    const initialNonceMutation = useInitialNonceMutation();
    const loginMutation = useLoginMutation();
    const reserMutation = usePasswordResetMutate();
    const { setEmail: setAuthEmail,
        setPassword: setAuthPassword,
        isAuthenticated,
        setAuthenticated,
        setUserID,
        setReferralCOde,
        setWalletAddress,
        setAccessTToken,
        setIsGoogleSignIn,
        setLastSignInTime
    } = useAuth();


    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    const handlePasswordReset = () => {
        setIsResetting(true);

        reserMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    setStep(4)
                },
                onError: () => {
                    toast({
                        variant: "failure",
                        title: t('error'),
                        description: t('passwordResetFailed'),
                    })
                    setIsResetting(false);
                }
            }
        );
    };


    const handleResetKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handlePasswordReset();
        }
    };

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
                    toast({
                        variant: "failure",
                        title: t('error'),
                        description: t('accountNotExist'),
                    })
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
                    if (response.data.user.is_verified === false) {
                        setStep(5)
                        return;
                    }
                    setAccessTToken(response.data.access_token);
                    setWalletAddress(response.data.user.walletAddress)
                    setLastSignInTime(Date.now());
                    // console.log(response.data)
                    setUserID(response.data.user.id);
                    setReferralCOde(response.data.user.referralCode);
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
    };

    const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp((event.target.value));
        setverificationError('');
    };
    const handleVerify = () => {

        if (otp === "") {
            toast({
                variant: "failure",
                title: t('enterOTP'),
                description: t('invalidOTP'),
            })
            return;
        }
        setISVerifying(true);
        verifyMutat.mutate(
            {
                email,
                otp: Number(otp),
            },
            {
                onSuccess: () => {
                    // console.log(response)
                    // console.log(response.data)
                    setISVerifying(false);
                    handleInitialNonceRequest();
                    handleLoginRequest();

                },
                onError: () => {
                    // console.log(error)
                    setISVerifying(false);
                    toast({
                        variant: "failure",
                        title: t('error'),
                        description: t('invalidExpiredOTP'),
                    })
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
            setIsLoggingIn(true);
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { email, sub: userID } = userInfo.data;
                setIsLoggingIn(true);
                socialSignIn.mutate(
                    {
                        token: token as string,
                        unique_id: userID as string,
                        email: email as string,
                        phone: "",
                        medium: 'google',
                        id_token: userID as string,
                        ref_code: ""
                    },

                    {
                        onSuccess: (response) => {
                            // console.log(response.data)
                            localStorage.removeItem('referralCode');
                            setIsGoogleSignIn(true);
                            setLastSignInTime(Date.now());
                            setAccessTToken(response.data.access_token);
                            setUserID(response.data.user.id);
                            setReferralCOde(response.data.user.referralCode);
                            setAuthEmail(response.data.user.email);
                            setAuthPassword('');
                            setAuthenticated(true);
                            toast({
                                variant: "success",
                                title: t('success'),
                                description: t('loginSuccess'),
                            })
                            navigate('/dashboard');
                            setIsLoggingIn(false);
                        },
                        onError: () => {
                            toast({
                                variant: "failure",
                                title: t('error'),
                                description: t('loginFailed'),
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
            }
        },
        onError: () => {
            toast({
                variant: "failure",
                title: t('error'),
                description: t('loginFailed'),
            })
            setIsLoggingIn(false);
        },
    });

    const [selectedLanguage, setSelectedLangyage] = useState(1);
    const [isLanguageDropActive, setIsLanguageDropActive] = useState(false);


    const { i18n } = useTranslation();
    useEffect(() => {
        console.log(i18n.language)

        if (i18n.language === 'en') {
            setSelectedLangyage(1);
        } else {
            if (i18n.language === 'de') {
                setSelectedLangyage(3);
            } else {
                setSelectedLangyage(2);
            }
        }
        if (i18n.language !== 'en' && i18n.language !== 'tr' && i18n.language !== 'de') {
            setSelectedLangyage(1);
        }
    }, []);



    const changeLanguage = (languageIndex: any) => {
        if (languageIndex === selectedLanguage) {
            console.log("current Index set");
        } else {
            if (languageIndex === 3) {

                i18n.changeLanguage('de');
                setSelectedLangyage(3);
                // setIsDropActive(false);
            } else {
                if (languageIndex === 2) {
                    i18n.changeLanguage('tr');
                    setSelectedLangyage(2);
                } else {
                    i18n.changeLanguage('en');
                    setSelectedLangyage(1);
                }
                // setIsDropActive(false);
            }
        }
    }



    return (
        <div className="p-[60px] max-sm:p-2">
            <div className="flex flex-row relative w-full  justify-between max-sm:pt-10 max-sm:px-5">
                <KarbonLogo />
                <div className="flex absolute right-[0rem] flex-col items-center">
                    <div onClick={() => setIsLanguageDropActive(!isLanguageDropActive)} className="bg-[#101010] transition ease-in-out flex flex-col items-center space-y-2 px-2 py-2 border-[#282828] border-[1px]   rounded-sm cursor-pointer">
                        <div className="transition ease-in-out flex flex-row items-center space-x-2">
                            <div>
                                {selectedLanguage === 1 && (
                                    <EnglishFlag />
                                )}
                                {selectedLanguage === 2 && (
                                    <TurkeyLogo />
                                )}
                                {selectedLanguage === 3 && (
                                    <GermanyFlag />
                                )}
                            </div>
                            <div className={isLanguageDropActive ? "rotate-[180deg] transition ease-in-out" : "transition ease-in-out"}>
                                <DownIcon />
                            </div>
                        </div>

                        {isLanguageDropActive && (
                            <div className={` flex flex-col space-y-2 rounded-sm ${isLanguageDropActive ? 'animate-accordion-down' : 'animate-accordion-up'}`}>
                                <div onClick={() => { changeLanguage(1); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 1 ? 'hidden' : 'cursor-pointer pt-1'}`}>
                                    <EnglishFlag />
                                </div>
                                <div onClick={() => { changeLanguage(2); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 2 ? 'hidden' : 'cursor-pointer'}`}>
                                    <TurkeyLogo />
                                </div>
                                <div onClick={() => { changeLanguage(3); setIsLanguageDropActive(false) }} className={`${selectedLanguage === 3 ? 'hidden' : 'cursor-pointer'}`}>
                                    <GermanyFlag />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center w-full flex-col">
                {chanceInfo && (
                    <div className="flex absolute max-sm:hidden top-20 max-sm:top-24 flex-row space-x-3 items-center justify-between pl-5 rounded-[8px] border-[1px] border-[#282828] max-sm:w-[80%] w-[421px] h-[52px] bg-black">
                        <div onClick={() => setChanceInfo(false)}>
                            <CloseIcon />
                        </div>
                        <div>
                            <p className="text-white text-[10px]">{t('chanceToBuy')}</p>
                        </div>
                        <div>
                            <img src="./assets/halfPriceNotification.svg" />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
                        <div className="w-[450px] max-sm:w-[100%] h-[456px] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 md:px-8 max-sm:px-5 flex flex-col justify-between h-full">
                                <p className="text-white text-[20px] max-sm:text-[20px] font-semibold">{t('signIn')}</p>

                                <div className="flex flex-col space-y-2">
                                    <div onClick={() => { login() }} className="flex cursor-pointer flex-row w-[389px] max-sm:w-[100%] max-sm:h-[56px] h-[56px] bg-[#1C1C1C]">
                                        <div className="px-5 absolute max-sm:py-[0.7rem] py-3 flex items-center">
                                            <GoogleLogo />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-white text-[14px] max-sm:text-[16px]">{t('signInGoogle')}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row w-[389px] max-sm:w-[100%] max-sm:h-[56px] h-[56px] bg-[#1C1C1C]">
                                        <div className="px-7 absolute max-sm:py-[1.0rem] py-5 flex items-center">
                                            <AppleLogo />
                                        </div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-white text-[14px] max-sm:text-[16px]">{t('signInApple')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-4 w-full items-center justify-between max-sm:justify-between">
                                    <Separator orientation="horizontal" className="max-w-[20%] max-sm:max-w-[20%]" />
                                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('signInEmail')}</p>
                                    <Separator orientation="horizontal" className="max-w-[20%] max-sm:max-w-[20%]" />
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <input onKeyDown={handleEmailKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="email" placeholder={t('enterEmail')} value={email} onChange={handleEmailChange} />
                                    <div>
                                        <button disabled={isLoadingNonce || isLoggingIn} onClick={handleInitialNonceRequest} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isLoadingNonce || isLoggingIn ? (
                                                <BarLoader />
                                            ) : (
                                                <p className="font-bold text-[14px] shadow-sm">
                                                    {t('signIn')}
                                                </p>
                                            )}
                                        </button>
                                        {errorMessage && (
                                            <p className="text-[12px] w-full text-center text-red-500 mt-2">{errorMessage}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row space-x-2 items-center justify-center">
                                    <p className="text-white text-[14px] max-sm:text-[12px]">{t('noAccount')}?</p>
                                    <a href="/sign-up" className="text-[14px] max-sm:text-[12px] text-[#08E04A] font-semibold">{t('signUp')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
                        <div className="w-[450px] max-sm:w-[100%] h-[346px] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 md:px-8 max-sm:px-5 flex flex-col justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center">
                                    <PasswordLogo />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('enterPassword')}</p>
                                </div>
                                <div className="flex flex-row space-x-1 items-center">
                                    <p className="text-white opacity-80 text-[14px]">{t('welcome')}</p>
                                    <p className="text-white text-[14px]">{email}</p>
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-white text-[14px]">{t('password')}</p>
                                        <input onKeyDown={handleSignInKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="password" value={password} onChange={handlePasswordChange} />
                                    </div>
                                    <p onClick={() => setStep(3)} className="text-[14px] max-sm:text-[12px] cursor-pointer text-[#08E04A] font-semibold">{t('forgotPassword')}?</p>
                                    <div>
                                        <div onClick={handleLoginRequest} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isLoggingIn ? (
                                                <BarLoader />
                                            ) : (
                                                <p className="font-bold text-[14px] shadow-sm">
                                                    {t('proceed')}
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
                                    <p className="text-white text-[14px]">{t('back')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
                        <div className="w-[450px] py-5 max-sm:w-[100%] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 md:px-8 max-sm:px-5 flex flex-col space-y-5 justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center">
                                    <PasswordLogo />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('resetPassword')}</p>
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-white text-[14px]">{t('enterEmail')}</p>
                                        <input onKeyDown={handleResetKeyDown} className="w-full bg-black border-[0.5px] border-[#FFFFFF] text-white text-[16px] rounded-[4px] h-[56px] px-4" type="email" onChange={handleEmailChange} />
                                    </div>
                                    <div>
                                        <button disabled={isResetting} onClick={handlePasswordReset} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                            {isResetting ? (
                                                <BarLoader />
                                            ) : (
                                                <p className="font-bold text-[14px] shadow-sm">
                                                    {t('resetPassword')}
                                                </p>
                                            )}
                                        </button>
                                        {errorMessage && (
                                            <p className="text-[10px] w-full text-center text-red-500 mt-2">{verificationError}</p>
                                        )}
                                    </div>
                                </div>

                                <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                                    <div className="flex items-center justify-center">
                                        <BackArrow />
                                    </div>
                                    <p className="text-white text-[14px]">{t('backToLogin')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
                        <div className="w-[450px] py-5 max-sm:w-[100%] items-center justify-center max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
                            <div className="py-5 md:px-8 max-sm:px-5 flex flex-col space-y-5 justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center justify-center">
                                    <PasswordLogo />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('resetPassword')}</p>
                                </div>

                                <div className="flex flex-col max-sm:flex-col max-sm:space-y-2 md:space-x-1 items-center">
                                    <p className="text-white opacity-80 text-[14px]">{t('otpSent')} </p>
                                    <p className="text-white text-[14px]">{email}</p>
                                </div>

                                <a onClick={() => setStep(6)} className="flex items-center justify-center bg-[#08E04A] w-full h-[48px] rounded-[4px] hover:bg-[#3aac5c] transition ease-in-out cursor-pointer">
                                    <p className="font-bold text-[14px] max-sm:text-[12px] shadow-sm">{t('proceed')}</p>
                                </a>

                                <div onClick={() => setStep(1)} className="flex flex-row space-x-2 items-center justify-center cursor-pointer">
                                    <div className="flex items-center justify-center">
                                        <BackArrow />
                                    </div>
                                    <p className="text-white text-[14px]">{t('backToLogin')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col w-full items-center justify-center md:pt-[7rem] max-sm:pt-[5rem]">
                        <div className="w-[450px] max-sm:w-[100%] h-[366px] max-sm:bg-transparent max-sm:border-transparent bg-[#101010] border-[#2D2D2D] py-5 border-[1px] rounded-[8px]">
                            <div className="md:px-8 max-sm:px-5 flex flex-col justify-between h-full">
                                <div className="flex flex-row space-x-2 items-center">
                                    <VerifyEmailIcon />
                                    <p className="text-white text-[20px] max-sm:text-[16px] font-semibold">{t('verifyEmail')}</p>
                                </div>
                                <p className="text-white text-[14px] max-sm:text-[12px]">{t('emailNotVerified')}</p>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-white text-[14px] max-sm:text-[12px] opacity-70">{t('enterVerificationCode')}</p>
                                    <p className="text-white text-[14px] max-sm:text-[12px]">{email}</p>
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

                {step === 6 && (
                    <PasswordReset
                        email={email}
                    />
                )}
            </div>
            <div className="absolute max-sm:w-full bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <p className="text-white text-[10px] opacity-50">{t('copyright')}</p>
            </div>

        </div>
    );
}

export default SignIn;


// src/components/SignIn.tsx
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useInitialNonceMutation, useLoginMutation, useSocialAuthMutation } from "@/components/shared/Hooks/UseAuthMutation.tsx";
import AppleLogo from "@/components/Icons/AppleLogo.tsx";
import BackArrow from "@/components/Icons/BackArrow.tsx";
import GoogleLogo from "@/components/Icons/GoogleLogo.tsx";
import PasswordLogo from "@/components/Icons/PasswordLogo.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { BarLoader } from 'react-spinners';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast.ts';
import KarbonLogo from "@/components/Icons/KarbonLogo.tsx";
import { useAdminAuth } from '../Hooks/AdminAuthContext';

const AdminConnectWallet = () => {

  const { toast } = useToast();

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
  const { setIsAdminAuthenticated, isAdminAuthenticated, setAccessTToken, setLastSignInTime } = useAdminAuth();


  if (isAdminAuthenticated) {
    return <Navigate to="/admin" />;
  }

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
            title: "Error!",
            description: "Account with entered email does not exist",
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
          if (response.data.user.role === 'user') {
            navigate('/dashboard');
            toast({
              variant: "failure",
              title: "Error!",
              description: "Invalid Role, Redirecting to dashboad",
            })
            return;
          } else {
            setAccessTToken(response.data.access_token);
            setLastSignInTime(Date.now());
            setIsAdminAuthenticated(true)
            toast({
              variant: "success",
              title: "Success!",
              description: "Login Successfull",
            })
            navigate('/admin');
            setIsLoggingIn(false);
          }
        },
        onError: () => {
          toast({
            variant: "failure",
            title: "Error!",
            description: "Invalid Login Credentials",
          })
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
              if (response.data.user.role === 'user') {
                navigate('/dashboard');
                toast({
                  variant: "failure",
                  title: "Error!",
                  description: "Invalid Role, Redirecting to dashboad",
                })
                return;
              } else {
                setAccessTToken(response.data.access_token);
                setLastSignInTime(Date.now());
                setIsAdminAuthenticated(true)
                toast({
                  variant: "success",
                  title: "Success!",
                  description: "Login Successfull",
                })
                navigate('/admin');
                setIsLoggingIn(false);
              }
            },
            onError: () => {
              toast({
                variant: "failure",
                title: "Error!",
                description: "Login Failed, Try Again",
              })
              setIsLoggingIn(false);
            }
          }
        );


      } catch (error) {
        toast({
          variant: "failure",
          title: "Error!",
          description: "Login Failed, Try Again",
        })
        setIsLoggingIn(false);
      }
    },
    onError: () => {
      toast({
        variant: "failure",
        title: "Error!",
        description: "Login Failed, Try Again",
      })
      setIsLoggingIn(false);
    },
  });

  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-5">
      <KarbonLogo />
      <p className="text-[40px] text-white font-bold">Admin</p>
      <div className="flex items-center justify-center">
        {step === 1 && (
          <div className="flex flex-col w-full items-center justify-center pt-[0.5rem]">
            <div className="w-[450px] max-sm:w-[100%] h-[456px] bg-[#101010] border-[#2D2D2D] border-[1px] rounded-[8px]">
              <div className="py-5 px-8 flex flex-col justify-between h-full">
                <p className="text-white text-[20px] max-sm:text-[90%] font-semibold">Sign In</p>

                <div className="flex flex-col space-y-2">
                  <div onClick={() => { login() }} className="flex cursor-pointer flex-row w-[389px] max-sm:w-[100%] max-sm:h-[48px] h-[56px] bg-[#1C1C1C]">
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
                        <BarLoader />
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
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col w-full items-center justify-center pt-[0.5rem]">
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
                        <BarLoader />
                      ) : (
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

      </div>

    </div>
  );
};

export default AdminConnectWallet;

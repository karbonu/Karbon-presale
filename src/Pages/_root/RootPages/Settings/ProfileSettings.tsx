import CheckMark from "@/components/Icons/CheckMark.tsx";
import CopyIcon from "@/components/Icons/CopyIcon.tsx";
import WalletIcon from "@/components/Icons/WalletIcon.tsx";
import { useAuth } from "@/components/shared/Contexts/AuthContext.tsx";
import MetaTags from "@/components/shared/MetaTags.tsx";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { usePasswoedUpdateMutate } from "@/components/shared/Hooks/UseAuthMutation.tsx";
import EyeIcon from "@/components/Icons/EyeIcon.tsx";
import EyeIcongreen from "@/components/Icons/EyeIcongreen.tsx";
import { useDisconnect } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { email, setPassword, setReferralCOde, setUserID, setIsDropDownOpen, isGoogleSignIn, setIsGoogleSignIn, setEmail, setAuthenticated, accessToken, UserID, password: currentPassword, setHasDisplayedConnectModal } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const passwordUpdateMutate = usePasswoedUpdateMutate(accessToken);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { disconnect } = useDisconnect();

  const ReferralLink = `${window.location.origin}/signup?referralCode=${UserID}`

  const handleCopy = () => {
    const link = ReferralLink ?? "";
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);

      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }

      const newTimeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeoutRef(newTimeout);
    });
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleSignOut = () => {
    setPassword('');
    setEmail('');
    setUserID('');
    setReferralCOde('');
    setHasDisplayedConnectModal(false);
    setAuthenticated(false);
    setIsDropDownOpen(false);
    setIsGoogleSignIn(false)
    disconnect();
  };

  const validatePasswords = () => {
    const numberPattern = /\d/;
    const capitalLetterPattern = /[A-Z]/;
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwordsDoNotMatch'));
      return false;
    } else if (newPassword.length < 10) {
      setPasswordError(t('minLength'));
      return false;
    } else if (!numberPattern.test(newPassword)) {
      setPasswordError(t('mustContainNumber'));
      return false;
    } else if (!capitalLetterPattern.test(newPassword)) {
      setPasswordError(t('mustContainUpper'));
      return false;
    } else if (!specialCharacterPattern.test(newPassword)) {
      setPasswordError(t('mustContainSpecial'));
      return false;
    } else if (newPassword === currentPassword) {
      setPasswordError(t('newPasswordSame'));
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const passwordUpdate = () => {
    passwordUpdateMutate.mutate(
      { email, oldPassword: currentPassword, newPassword: newPassword },
      {
        onSuccess: () => {
          setIsUpdatingPassword(false);
          setPassword(newPassword);
          toast({
            variant: "success",
            title: t('success'),
            description: t('passwordChangeSuccess'),
          })
          setTimeout(() => {
            setPasswordSuccess('');
          }, 2000);
        },
        onError: () => {
          // console.log(error);
          setIsUpdatingPassword(false);
          toast({
            variant: "failure",
            title: t('error'),
            description: t('passwordChangeFailed'),
          })
        }
      }
    );
  };

  const handleChangePassword = () => {
    if (validatePasswords()) {
      setIsUpdatingPassword(true);
      passwordUpdate();
    }
  };

  return (
    <div className="flex flex-col pt-10 space-y-3">
      <MetaTags title="Karbon Sale | Profile Settings" />
      <div className="flex flex-row max-lg:flex-col max-lg:space-y-2 w-full lg:space-x-2 justify-between">
        <div className="border-[1px] border-[#282828] max-sm:bg-[#101010] h-[95px] md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
          <div className="p-3 flex-col space-y-3 h-full justify-between">
            <div className="flex flex-row rounded-[2px] justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[54px]">
              <WalletIcon />
              <p className="text-white text-[10px] opacity-70">{t('email')}</p>
            </div>
            <div className="flex flex-row items-center space-x-5">
              <p className="text-white font-light text-[14px] max-lg:text-[12px] ">{email}</p>
            </div>
          </div>
        </div>
        <div className="border-[1px] border-[#282828] max-sm:bg-[#101010] h-[95px] md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
          <div className="p-3 flex-col space-y-3 h-full justify-between">
            <div className="flex flex-row rounded-[2px] justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[97px]">
              <WalletIcon />
              <p className="text-white text-[10px] opacity-70">{t('referralLink')}</p>
            </div>
            <div className="flex flex-row items-center space-x-5">
              <p className="text-white font-light text-[14px] max-lg:text-[12px] ">{ReferralLink.slice(0, 30)}...</p>
              <div onClick={handleCopy} className="flex flex-row space-x-2 cursor-pointer">
                {copied ? <CheckMark /> : <CopyIcon />}
                <p className="text-[#08E04A] text-[10px]">
                  {copied ? t('copied') : t('copy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isGoogleSignIn && (
        <div className="flex flex-1 max-lg:w-full">
          <div className="bg-black border-[1px] max-sm:bg-[#101010] border-[#282828] max-lg:w-full rounded-[8px]">
            <div className="flex flex-col p-5 space-y-4 max-lg:w-full">
              <p className="text-white font-medium text-[20px]">{t('changePassword')}</p>
              <div className="flex flex-row max-lg:flex-col max-lg:space-y-2 w-full items-center justify-between md:space-x-2">
                <div className="flex flex-col max-lg:w-full space-y-2 relative">
                  <p className="text-white text-[12px]">{t('newPassword')}</p>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="outline-none focus:outline-[1px]  pl-5 focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <div
                    className="absolute right-4 top-[1.8rem] cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeIcongreen />
                    ) : (
                      <EyeIcon />
                    )}
                  </div>
                </div>
                <div className="flex flex-col max-lg:w-full space-y-2 relative">
                  <p className="text-white text-[12px]">{t('confirmNewPassword')}</p>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="outline-none focus:outline-[1px] pl-5 focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                  />
                  <div
                    className="absolute right-4 top-[1.8rem] cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcongreen />
                    ) : (
                      <EyeIcon />
                    )}
                  </div>
                </div>
              </div>
              {passwordError && (
                <p className="text-[10px] text-red-500">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-[10px] text-[#08E04A]">{passwordSuccess}</p>
              )}
              <div>
                <button
                  disabled={passwordError !== '' || isUpdatingPassword || passwordSuccess !== ''}
                  onClick={handleChangePassword}
                  className={`text-[14px] text-black font-bold w-max px-8 py-2 border-[1px] rounded-full cursor-pointer transition ease-in-out ${passwordError || passwordSuccess
                    ? 'bg-red-500 border-red-500 cursor-not-allowed'
                    : ' border-transparent hover:border-white bg-[#08E04A] opacity-70 hover:opacity-100 hover:text-white hover:bg-transparent'
                    }`}
                >
                  {isUpdatingPassword ? <BarLoader color="#FFFFFF" /> : t('updatePassword')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      <div className="flex flex-row max-lg:flex-col md:pt-10 justify-between md:items-center max-lg:space-y-2">
        <div className="flex flex-row max-sm:hidden lg:space-x-40 max-lg:w-full max-lg:justify-between max-sm:px-5">
          <p className="text-[8px] text-white opacity-30">{t('copyright')}</p>
          <p className="text-[8px] text-white opacity-30">Gaziantep, Türkiye</p>
        </div>
        <div className="bg-black cursor-pointer hover:scale-95 w-max transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
          <div onClick={handleSignOut} className="flex flex-row space-x-1 items-center px-4 py-2">
            <p className="text-[#FF3636] text-[16px]">{t('signOut')}</p>
          </div>
        </div>
        <div className="flex md:hidden w-full flex-col pt-10 ">
          <p className="text-[12px] text-white opacity-30">Gaziantep, Türkiye</p>
          <p className="text-[12px] text-white  opacity-30">{t('copyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

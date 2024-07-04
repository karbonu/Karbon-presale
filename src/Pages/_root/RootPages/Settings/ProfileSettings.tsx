import CheckMark from "@/components/Icons/CheckMark";
import CopyIcon from "@/components/Icons/CopyIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import { useAuth } from "@/components/shared/Contexts/AuthContext";
import MetaTags from "@/components/shared/MetaTags";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { usePasswoedUpdateMutate } from "@/components/shared/Hooks/UseAuthMutation";

const ProfileSettings = () => {
  const [copied, setCopied] = useState(false);
  const { email, setPassword, setReferralCOde, setUserID, setEmail, setAuthenticated, password: currentPassword, setHasDisplayedConnectModal } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const passwordUpdateMutate = usePasswoedUpdateMutate();

  const ReferralLink = "https://karbon.com/78236-tube..."

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
  };

  const validatePasswords = () => {
    const numberPattern = /\d/;
    const capitalLetterPattern = /[A-Z]/;
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    } else if (newPassword.length < 10) {
      setPasswordError('Password must be at least 10 characters long');
      return false;
    } else if (!numberPattern.test(newPassword)) {
      setPasswordError('Password must contain at least one number');
      return false;
    } else if (!capitalLetterPattern.test(newPassword)) {
      setPasswordError('Password must contain at least one capital letter');
      return false;
    } else if (!specialCharacterPattern.test(newPassword)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    } else if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as the current password');
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
          setPasswordSuccess('Password updated successfully');
          setTimeout(() => {
            setPasswordSuccess('');
          }, 2000);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdatingPassword(false);
          setPasswordError('Password Change Failed, Try Again');
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
        <div className="border-[1px] border-[#282828] h-[95px] md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
          <div className="p-3 flex-col space-y-3 h-full justify-between">
            <div className="flex flex-row rounded-[2px] justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[54px]">
              <WalletIcon />
              <p className="text-white text-[10px] opacity-70">Email</p>
            </div>
            <div className="flex flex-row items-center space-x-5">
              <p className="text-white font-light text-[14px] max-lg:text-[12px] ">{email}</p>
            </div>
          </div>
        </div>
        <div className="border-[1px] border-[#282828] h-[95px] md:min-w-[364px] max-lg:w-full bg-black rounded-[8px]">
          <div className="p-3 flex-col space-y-3 h-full justify-between">
            <div className="flex flex-row rounded-[2px] justify-center py-1 space-x-1 items-center border-[1px] border-[#282828] max-w-[97px]">
              <WalletIcon />
              <p className="text-white text-[10px] opacity-70">Referral Link</p>
            </div>
            <div className="flex flex-row items-center space-x-5">
              <p className="text-white font-light text-[14px] max-lg:text-[12px] ">{ReferralLink}</p>
              <div onClick={handleCopy} className="flex flex-row space-x-2 cursor-pointer">
                {copied ? <CheckMark /> : <CopyIcon />}
                <p className="text-[#08E04A] text-[10px]">
                  {copied ? "Copied" : "Copy"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 max-lg:w-full">
        <div className="bg-black border-[1px] border-[#282828] max-lg:w-full rounded-[8px]">
          <div className="flex flex-col p-5 space-y-4 max-lg:w-full">
            <p className="text-white font-medium text-[20px]">Change Password</p>
            <div className="flex flex-row max-lg:flex-col max-lg:space-y-2 w-full items-center justify-between md:space-x-2">
              <div className="flex flex-col max-lg:w-full space-y-2">
                <p className="text-white text-[12px]">New Password</p>
                <input
                  type="password"
                  className="outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
              </div>
              <div className="flex flex-col max-lg:w-full space-y-2">
                <p className="text-white text-[12px]">Confirm New Password</p>
                <input
                  type="password"
                  className="outline-none focus:outline-[1px] focus:outline-[#282828] bg-[#181818] w-[347px] max-lg:w-[100%] h-[40px] text-white"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                />
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
                className={`text-[14px] text-white w-max px-8 py-2 border-[1px] rounded-full cursor-pointer transition ease-in-out ${
                  passwordError || passwordSuccess
                    ? 'bg-red-500 border-red-500 cursor-not-allowed'
                    : 'bg-transparent border-white opacity-70 hover:opacity-100 hover:text-black hover:bg-white'
                }`}
              >
                {isUpdatingPassword ? <BarLoader color="#FFFFFF" /> : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row max-lg:flex-col pt-10 justify-between items-center max-lg:space-y-2">
        <div className="flex flex-row lg:space-x-40 max-lg:w-full max-lg:justify-between max-sm:px-5">
          <p className="text-[8px] text-white opacity-30">Copyright © 2024 Karbon. All rights reserved.</p>
          <p className="text-[8px] text-white opacity-30">Gaziantep, Türkiye</p>
        </div>
        <div className="bg-black cursor-pointer hover:scale-95 transition ease-in-out border-[1px] border-[#282828] rounded-[4px]">
          <div onClick={handleSignOut} className="flex flex-row space-x-1 items-center px-4 py-2">
            <p className="text-[#FF3636] text-[16px]">Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

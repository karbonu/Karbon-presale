import { Routes, Route, useNavigate } from "react-router-dom"
import './globals.css'
import AuthLayout from "./Pages/_auth/AuthLayout.tsx"
import PageLayout from "./Pages/_root/PageLayout.tsx"
import { HelmetProvider } from "react-helmet-async"
import SignIn from "./Pages/_auth/AuthPages/SignIn.tsx"
import MetaTags from "./components/shared/MetaTags.tsx"
import TokenSale from "./Pages/_root/RootPages/TokenSale.tsx"
import SignUp from "./Pages/_auth/AuthPages/SignUp.tsx"
// import PageNotFound from "./components/shared/PageNotFound"
import ClaimTokens from "./Pages/_root/RootPages/ClaimTokens.tsx"
import SettingsLayout from "./Pages/_root/RootPages/Settings/SettingsLayout.tsx"
import ProfileSettings from "./Pages/_root/RootPages/Settings/ProfileSettings.tsx"
import WalletSettings from "./Pages/_root/RootPages/Settings/WalletSettings.tsx"
import { AuthProvider, useAuth } from "./components/shared/Contexts/AuthContext.tsx"
import ProtectedRoute from "./components/shared/Hooks/ProtectedRoute.tsx"
import AdminLayout from "./Admin/AdminLayout.tsx"
import AdminConnectWallet from "./Admin/AdminPages/AdminConnectWallet.tsx"
import AdminDashboard from "./Admin/AdminPages/AdminDashboard.tsx"
import AdminPresale from "./Admin/AdminPages/AdminPresale.tsx"
import AdminProtectedRoute from "./Admin/Hooks/AdminProtectedRoutes.tsx"
import { AdminAuthProvider } from "./Admin/Hooks/AdminAuthContext.tsx"
import { useEffect } from "react"


const ReferralRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const {setReferralCOde, referralCode} = useAuth();
  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('referralCode')) {
      const url = new URL(currentUrl);
      const referralCodeURL = url.searchParams.get('referralCode');
      if (referralCodeURL) {
        setReferralCOde(referralCodeURL);
        navigate('/sign-up');
      }
    }
  }, [referralCode]);

  return children;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <main className="bgSettings">
            <MetaTags
              title="Karbon Sale"
              description="Get in early on the karbon token"
              image="././public/assets/karbonSoloLogo.png"
              name=""
            />
            <ReferralRedirect>
              <Routes>
                <Route path="/adminSignin" element={<AdminConnectWallet />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="Investment" element={<AdminDashboard />} />
                  <Route path="presale" element={<AdminPresale />} />
                </Route>
                <Route element={<AuthLayout />}>
                  <Route index element={<SignIn />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  {/* <Route element = { <PageNotFound/> } /> */}
                </Route>

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <PageLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<TokenSale />} />
                  <Route path="tokenSale" element={<TokenSale />} />
                  <Route path="claimtokens" element={<ClaimTokens />} />

                  <Route path="settings" element={<SettingsLayout />}>
                    <Route index element={<WalletSettings />} />
                    <Route path="profilesettings" element={<ProfileSettings />} />
                    <Route path="walletsettings" element={<WalletSettings />} />
                  </Route>
                </Route>
              </Routes>
            </ReferralRedirect>
          </main>
        </AdminAuthProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
import { Routes, Route } from "react-router-dom"
import './globals.css'
import AuthLayout from "./Pages/_auth/AuthLayout"
import PageLayout from "./Pages/_root/PageLayout"
import { HelmetProvider } from "react-helmet-async"
import SignIn from "./Pages/_auth/AuthPages/SignIn"
import MetaTags from "./components/shared/MetaTags"
import TokenSale from "./Pages/_root/RootPages/TokenSale"
import SignUp from "./Pages/_auth/AuthPages/SignUp"
import PageNotFound from "./components/shared/PageNotFound"
import ClaimTokens from "./Pages/_root/RootPages/ClaimTokens"
import SettingsLayout from "./Pages/_root/RootPages/Settings/SettingsLayout"
import ProfileSettings from "./Pages/_root/RootPages/Settings/ProfileSettings"
import WalletSettings from "./Pages/_root/RootPages/Settings/WalletSettings"
import { AuthProvider } from "./components/shared/Contexts/AuthContext"
import ProtectedRoute from "./components/shared/Hooks/ProtectedRoute"
import AdminLayout from "./Admin/AdminLayout"
import AdminConnectWallet from "./Admin/AdminPages/AdminConnectWallet"
import AdminDashboard from "./Admin/AdminPages/AdminDashboard"
import AdminPresale from "./Admin/AdminPages/AdminPresale"
function App() {
  

  return (
    <>
    <HelmetProvider>
      <AuthProvider>

      <main className="bgSettings">
        <MetaTags
        title="Karbon Sale"
        description="Get in early on the karbon token"
        image="././public/assets/karbonSoloLogo.png"
        name=""
        />
        <Routes>
          <Route path= "/adminSignin" element = { <AdminConnectWallet/> } />
          <Route path="/admin" element = {<AdminLayout/>}>
              <Route index element = { <AdminDashboard/> } />
              <Route path= "/Investment" element = { <AdminDashboard/> } />
              <Route path= "/presale" element = { <AdminPresale/> } />
            </Route>

          <Route element = {<AuthLayout/>}>
            
              <Route index element = { <SignIn/> } />
              <Route path= "/sign-in" element = { <SignIn/> } />
              <Route path= "/sign-up" element = { <SignUp/> } />
              <Route path= "*" element = { <PageNotFound/> } />
             
            
            </Route>

            <Route path="/dashboard" element = {
              <ProtectedRoute>
                <PageLayout/>
              </ProtectedRoute>
              }>

                <Route index element = { <TokenSale/> } />
                <Route path="tokenSale" element = { <TokenSale/> }/>
                <Route path='claimtokens' element = { <ClaimTokens/> }/>

                <Route path="settings" element = {<SettingsLayout/>}>
                  <Route index element = { <WalletSettings/> } />
                  <Route path="profilesettings" element = { <ProfileSettings/> }/>
                  <Route path='walletsettings' element = { <WalletSettings/> }/>
                  
                

                </Route>
                
               

              </Route>

          </Routes>
      </main>
      </AuthProvider>
    </HelmetProvider>
    </>
  )
}

export default App

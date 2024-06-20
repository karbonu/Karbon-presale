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
import Settings from "./Pages/_root/RootPages/Settings"
function App() {
  

  return (
    <>
    <HelmetProvider>
      <main className="bgSettings">
        <MetaTags
        title="Karbon Sale"
        description="Get in early on the karbon token"
        image="././public/assets/karbonSoloLogo.png"
        name=""
        />
        <Routes>
          <Route element = {<AuthLayout/>}>
            
              <Route path= "/sign-in" element = { <SignIn/> } />
              <Route path= "/sign-up" element = { <SignUp/> } />
              <Route path= "*" element = { <PageNotFound/> } />
             
            
            </Route>

            <Route element = {<PageLayout/>}>

                
                <Route index element = { <TokenSale/> }/>
                <Route path='/claimtokens' element = { <ClaimTokens/> }/>
                <Route path='/settings' element = { <Settings/> }/>
               

              </Route>

          </Routes>
      </main>
    </HelmetProvider>
    </>
  )
}

export default App

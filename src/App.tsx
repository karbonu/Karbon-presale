import { Routes, Route } from "react-router-dom"
import './globals.css'
import AuthLayout from "./Pages/_auth/AuthLayout"
import PageLayout from "./Pages/_root/PageLayout"
import { HelmetProvider } from "react-helmet-async"
import SignIn from "./Pages/_auth/AuthPages/SignIn"
import MetaTags from "./components/shared/MetaTags"
import TokenSale from "./Pages/_root/RootPages/TokenSale"
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
              
              {/* {/* <Route path= "/sign-in" element = { <Signinform/> } /> */}
              <Route path= "/sign-in" element = { <SignIn/> } />
              {/* <Route path= "/adminSign-in" element = { <AdminSignIn/> } />
              <Route path='/SignedOut' element = { <SignedOut/> }/> */}
            
            </Route>

            <Route element = {<PageLayout/>}>

                
                <Route index element = { <TokenSale/> }/>
                {/* <Route index element = { <Home/> }/>
                
                <Route path='/ManageLecturers' element = { <ManageLecturers/> }/>
                <Route path='/ManageCourses' element = { <ManageCourses/> }/>
                <Route path='/ManageDepartments' element = { <ManageDepartment/> }/>
                <Route path='/ManageLectureHalls' element = { <ManageLectureHalls/> }/>
                <Route path='/ManageClassGroups' element = { <ManageClassGroup/> }/>
                <Route path='/ManagePreferences' element = { <ManagePreferences/> }/>

                <Route path='/AddNewLecturer' element = { <AddNewLecturer/> }/>
                <Route path='/AddNewCourse' element = { <AddNewCourse/> }/>
                <Route path='/AddNewDepartment' element = { <AddNewDepartment/> }/>
                <Route path='/AddNewLectureHalls' element = { <AddNewLectureHall/> }/>
                <Route path='/AddNewClassGroups' element = { <AddNewClassGroup/> }/>
                <Route path='/SetPreferences' element = { <SetPreferences/> }/>
                
                <Route path='/StudentHome' element = { <StudentHome/> }/>
                <Route path='/LecturerHome' element = { <LecturerHome/> }/> */}
                {/* <Route path='/LecturerHome' element = { <LecturerHome/> }/> */}


              </Route>

          </Routes>
      </main>
    </HelmetProvider>
    </>
  )
}

export default App

import { useAuth } from '@/components/shared/Contexts/AuthContext';
import Leftbar from '@/components/shared/Leftbar.tsx';
import TopBar from '@/components/shared/TopBar.tsx';
import { Outlet, useNavigate } from 'react-router-dom'

const PageLayout = () => {
  let authenticated = false;
  const navigate = useNavigate();
  const { isDropDownOpen } = useAuth();

  if (authenticated) {
    navigate('/sign-in')
  }

  return (
    <div className='w-screen h-screen flex flex-row'>
      <div className='lg:w-[181px] lg:h-screen '>
        <Leftbar />
      </div>
      <main className='flex px-[4rem] max-sm:px-5 pt-[2.5rem] space-y-6 max-sm:space-y-2 h-full flex-1 flex-col'>
        <TopBar />
        <div className='flex py-5 w-full'>
          {isDropDownOpen && (
            <div className={`absolute ${isDropDownOpen ? 'animate-in' : 'animate-out'} w-full h-full bg-black bg-opacity-50 transition ease-in-out fade-in-10 fade-out-10`}>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PageLayout
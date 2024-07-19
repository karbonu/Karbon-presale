import { useAuth } from '@/components/shared/Contexts/AuthContext';
import Leftbar from '@/components/shared/Leftbar';
import TopBar from '@/components/shared/TopBar';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const PageLayout = () => {

  let authenticated = false;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isDropDownOpen } = useAuth();

  if (authenticated) {
    navigate('/sign-in')
  }

  const handleSidebarToggle = (isOpen: any) => {
    setIsOpen(isOpen);
  };

  return (
    <div className='w-screen h-screen flex flex-row'>
      <div className={`${isOpen ? 'w-[181px]' : 'w-16 '} transition-all  duration-300 ease-in-out`}>
        <Leftbar onToggle={handleSidebarToggle} />
      </div>
      <main className={`flex px-[4rem] max-sm:px-5 pt-[2.5rem] space-y-6 max-sm:space-y-2 h-full flex-1 flex-col transition-all duration-300 ease-in-out`}>
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

export default PageLayout;
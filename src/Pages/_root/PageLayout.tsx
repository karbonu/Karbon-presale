import Leftbar from '@/components/shared/Leftbar';
import TopBar from '@/components/shared/TopBar';
import { Outlet, useNavigate } from 'react-router-dom'

const PageLayout = () => {
  let authenticated = false;
  const navigate = useNavigate();

  if(authenticated){
    navigate('/sign-in')
  }
  return (
    <div className='w-screen h-screen flex flex-row items-center justify-between'>
      <div className='w-[181px] h-screen top-0'>
        <Leftbar/>
      </div>
      <div className='flex flex-1 h-full flex-col'>
        <TopBar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default PageLayout
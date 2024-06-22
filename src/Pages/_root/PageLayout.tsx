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
    <div className='w-screen flex flex-row'>
      <div className='w-[181px] h-screen '>
        <Leftbar/>
      </div>
      <main className='flex px-[4rem] pt-[2.5rem] space-y-10 flex-1 items-center justify-center flex-col'>
        <TopBar/>
        <div className='flex items-center justify-center w-full'>
          <Outlet/>
        </div>
      </main>
    </div>
  )
}

export default PageLayout
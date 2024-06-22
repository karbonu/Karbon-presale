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
    <div className='w-screen h-screen flex flex-row'>
      <div className='w-[181px] h-screen '>
        <Leftbar/>
      </div>
      <main className='flex px-[4rem] pt-[2.5rem] space-y-6 h-full flex-1 flex-col'>
        <TopBar/>
        <div className='flex py-5  w-full'>
          <Outlet/>
        </div>
      </main>
    </div>
  )
}

export default PageLayout
import Leftbar from '@/components/shared/Leftbar';
import { Outlet, useNavigate } from 'react-router-dom'

const PageLayout = () => {
  let authenticated = false;
  const navigate = useNavigate();

  if(authenticated){
    navigate('/sign-in')
  }
  return (
    <div className='w-screen h-screen flex flex-row items-center justify-between'>
      <Leftbar/>
      <div className='flex flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}

export default PageLayout
import { Outlet } from 'react-router-dom'
import AdminLeftbar from './AdminLeftbar'
import AdminTopbar from './AdminTopbar'

const AdminLayout = () => {
  return (
    <div className='w-screen h-screen flex flex-row'>
        <div className='lg:w-[181px] lg:h-screen '>
        <AdminLeftbar/>
        </div>
    <main className='flex px-[4rem] max-sm:px-5 pt-[2.5rem] space-y-6 max-sm:space-y-2 h-full flex-1 flex-col'>
        <AdminTopbar/>
      <div className='flex py-5 w-full'>
        <Outlet/>
      </div>
    </main>
  </div>
  )
}

export default AdminLayout
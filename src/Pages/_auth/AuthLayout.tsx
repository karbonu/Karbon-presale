import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='bgSettings w-screen h-screen AuthBg'>
        <Outlet/>
    </div>
  )
}

export default AuthLayout
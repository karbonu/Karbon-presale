import { Outlet, useNavigate } from 'react-router-dom'

const PageLayout = () => {
  let authenticated = false;
  const navigate = useNavigate();

  if(authenticated ===  false){
    navigate('/sign-in')
  }
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default PageLayout
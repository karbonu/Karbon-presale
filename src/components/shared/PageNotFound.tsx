import UseAnimations from 'react-useanimations';
import alertTriangle from 'react-useanimations/lib/alertTriangle'
import KarbonLogo from '../Icons/KarbonLogo.tsx';

const PageNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh]'>
        <KarbonLogo/>
        <p className='text-white font-bold text-[40px]'>Whoa!</p>
        <UseAnimations animation={alertTriangle} size={256} color='#ffffff' strokeColor='#ffffff' />

        <div className='flex items-center justify-center flex-col space-y-4'>
            <p className='text-white text-[20px]'>You just tried to access a link that doesn't exist</p>

            <a href='/' className='text-white text-[16px] hover:scale-125 hover:text-[#08E04A] transition ease-in-out'>Back Home</a>
        </div>

    </div>
  )
}

export default PageNotFound
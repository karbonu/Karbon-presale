import UseAnimations from 'react-useanimations';
import alertTriangle from 'react-useanimations/lib/alertTriangle';
import KarbonLogo from '../Icons/KarbonLogo.tsx';
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh]'>
      <KarbonLogo />
      <p className='text-white font-bold text-[40px]'>{t('whoa')}</p>
      <UseAnimations animation={alertTriangle} size={256} color='#ffffff' strokeColor='#ffffff' />

      <div className='flex items-center justify-center flex-col space-y-4'>
        <p className='text-white text-[20px]'>{t('invalidLink')}</p>
        <a href='/' className='text-white text-[16px] hover:scale-125 hover:text-[#08E04A] transition ease-in-out'>{t('backHome')}</a>
      </div>
    </div>
  );
}

export default PageNotFound;

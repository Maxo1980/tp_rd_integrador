import Logo from './logo';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="bg-[#FFDC7F] text-[#333333] font-sans">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0 text-center">
            <Logo />
            <p className='font-normal text-xs pb-[-2]'>Buenos Aires - Argentina</p>
            <p className='font-normal text-xs'>Derechos reservados | 2024</p>
          </div>
          <div className="flex flex-col md:flex-row space-x-8">
            <div>
              <h3 className="text-lg font-semibold font-sans pb-2">Enlaces rápidos</h3>
              <ul>
                <li><Link to='./institucional.jsx' className='font-light hover:text-[#16325B] hover:font-normal'>Institucional</Link></li>
                <li><Link to='/reclamos.jsx' className='font-light hover:text-[#16325B] hover:font-normal'>Reclamos</Link></li>
                <li><Link to='/contacto.jsx' className='font-light hover:text-[#16325B] hover:font-normal'>Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-sans pb-2">Visítanos</h3>
              <ul>
                <li className='font-light'>Instagram</li>
                <li className='font-light'>Facebook</li>
                <li className='font-light'>X</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
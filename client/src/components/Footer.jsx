import Logo from './logo';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="bg-[#FFDC7F] text-[#303030]">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <Logo />
            <p>Buenos Aires - Argentina</p>
            <p>Derechos reservados | 2024</p>
          </div>
          <div className="flex flex-col md:flex-row space-x-8">
            <div>
              <h3 className="text-lg font-bold">Enlaces rápidos</h3>
              <ul>
                <li><Link to='../pages/institucional.jsx'>Institucional</Link></li>
                <li><Link to='../pages/reclamos.jsx'>Reclamos</Link></li>
                <li><Link to='../pages/contacto.jsx'>Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Visítanos</h3>
              <ul>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>X</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
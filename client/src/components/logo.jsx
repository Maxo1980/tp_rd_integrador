import bmwLogo from '../assets/logo/logotipo.png';
import { Link } from 'react-router-dom'; 

function Logo() {
  return (
    <Link to=''><img src={bmwLogo} alt="Logo de BMW" className="w-32" /></Link>
  );
}

export default Logo;
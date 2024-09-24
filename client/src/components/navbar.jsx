import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link to="/institucional" className="text-[#303030]">Institucional</Link></li>
        <li><Link to="/reclamos" className="text-[#303030]">Reclamos</Link></li>
        <li><Link to="/contacto" className="text-[#303030]">Contacto</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
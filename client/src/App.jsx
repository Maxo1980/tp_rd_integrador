import Footer from './components/Footer';
import Header from './components/Header';
import Inicio from './pages/inicio';
import Institucional from './pages/institucional';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reclamos from './pages/reclamos';



function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="./institucional" element={<Institucional />} />
        <Route path="./reclamos" element={<Reclamos />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import Footer from './components/Footer';
import Header from './components/Header';
import Inicio from './pages/inicio';
import Institucional from './Institucional.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Institucional" element={<Institucional />} />
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

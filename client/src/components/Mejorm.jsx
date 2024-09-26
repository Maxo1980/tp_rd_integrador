import img1 from '../assets/mejorm/m1.png';
import img2 from '../assets/mejorm/m2.png';
import img3 from '../assets/mejorm/m3.png';
import img4 from '../assets/mejorm/m4.png';
import img5 from '../assets/mejorm/m5.png';
import React, { useState } from 'react';


function Mejorm() {
  const images = [img1, img2, img3, img4, img5];
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);  
  };

  return (
    <div className="container mx-auto pb-14">
      <h2 className="text-6xl font-light font-sans mb-12">Elegí tu mejor M</h2>
      <div className="galeria max-w-[1000px] h-[530px] grid grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative group ${hoveredIndex === index ? 'col-span-3' : ''} `}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              key={index}
              src={img}
              alt={`Imagen ${index + 1}`}
              className="object-cover h-full min-h-[530px] rounded-md opacity-80 transition-all duration-500 ease-in-out hover:cursor-crosshair hover:opacity-100 hover:contrast-120"
            />
          </div>
        ))}
      </div>
    </div>
  );
}


export default Mejorm;
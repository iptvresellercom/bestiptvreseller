import React from 'react';
import { AppIcons } from './icons/AppIcons';

const ProductGrid: React.FC = () => {
  const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-[#111111] rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative transition-transform duration-300 ease-in-out hover:scale-[1.02] cursor-pointer ${className}`}>
      {children}
    </div>
  );

  return (
    <section className="">
      
    </section>
  );
};

export default ProductGrid;

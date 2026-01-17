
import React from 'react';
import { COLORS } from '../colors';
import { engineOverHeatingString } from '../assets/EngineOverHeating.tsx';
import { lowTirePressureString } from '../assets/LowTirePressure.tsx';

interface VehicleIconProps {
  id: string;
  className?: string;
  color?: string;
}

const VehicleIcon: React.FC<VehicleIconProps> = ({ id, className = "w-full h-full", color = COLORS.icon.default }) => {
  const getIconSource = () => {
    switch (id) {
      case 'engine_temp':
        return engineOverHeatingString;
      case 'tires':
        return lowTirePressureString;
      default:
        return null;
    }
  };

  const src = getIconSource();

  if (!src) return null;

  return (
    <div 
      className={className}
      style={{
        backgroundColor: color,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
};

export default VehicleIcon;

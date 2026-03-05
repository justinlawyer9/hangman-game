import React from 'react';
import stage0 from "./assets/noose.png";
import stage1 from "./assets/upperandlowerbody.png";
import stage2 from "./assets/1arm.png";
import stage3 from "./assets/botharms.png";
import stage4 from "./assets/1leg.png";
import stage5 from "./assets/Dead.png";

const HangmanDisplay = ({ lives }) => {
  const stages = [stage5, stage4, stage3, stage2, stage1, stage0];
  const currentImage = stages[lives];

  return (
    <div className="border-2 border-blue-400 w-64 h-80 relative rounded flex items-center justify-center bg-white overflow-hidden shadow-inner">
      <span className="absolute top-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest z-10">
      </span>
      
      <img 
        src={currentImage} 
        alt={`Hangman stage ${5 - lives}`} 
        className="max-h-full max-w-full object-contain transition-opacity duration-300"
      />
    </div>
  );
};

export default HangmanDisplay;


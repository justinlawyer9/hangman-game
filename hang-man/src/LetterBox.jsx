import React from 'react';

const LetterBox = ({ guessedLetters, onGuess, disabled }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="border-2 border-green-500 p-4 rounded relative bg-white shadow-sm">
      <span className="absolute -left-10 top-1/2 -rotate-90 text-green-600 font-bold text-[10px] uppercase">Letter box</span>
      <div className="grid grid-cols-7 gap-1">
        {alphabet.map(l => (
          <button 
            key={l} 
            onClick={() => onGuess(l)} 
            disabled={disabled || guessedLetters.includes(l)}
            className={`w-10 h-10 border font-bold transition-all ${
              guessedLetters.includes(l) 
              ? 'bg-slate-100 text-slate-300' 
              : 'hover:bg-green-500 hover:text-white border-slate-200 active:scale-90'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LetterBox;

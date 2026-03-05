import React from 'react';

const Result = ({ isWin, secretWord, onReset }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
    <div className={`p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full border-4 ${isWin ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
      <h2 className={`text-5xl font-black mb-4 ${isWin ? 'text-green-600' : 'text-red-600'}`}>
        {isWin ? "VICTORY!" : "GAME OVER"}
      </h2>
      <p className="text-gray-600 mb-2 uppercase text-xs font-bold tracking-widest">The word was</p>
      <p className="text-3xl font-mono font-black mb-8 tracking-widest uppercase">{secretWord}</p>
      <button 
        onClick={onReset}
        className="w-full py-4 bg-black text-white font-bold text-xl hover:bg-gray-800 transition-colors shadow-lg"
      >
        PLAY AGAIN
      </button>
    </div>
  </div>
);

export default Result;
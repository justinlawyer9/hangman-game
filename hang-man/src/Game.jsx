import React, { useState } from "react";
import HangmanDisplay from "./HangmanDisplay";
import LetterBox from "./LetterBox";
import Result from "./Result";

const words = ["MOREHOUSE","TIGERS","MAROON","HBCU","GRAVES","BRAZEAL","FORBES"]
const Game = () => {

    const getRandomWord = () => words[Math.floor(Math.random() * words.length)];
  const [secretWord, setSecretWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(5);

  const isWin = secretWord.split("").every((letter) => guessedLetters.includes(letter));
  const isLoss = lives === 0;

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isWin || isLoss) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!secretWord.includes(letter)) {
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  const resetGame = () => {
    setGuessedLetters([]);
    setLives(5);
    setSecretWord(getRandomWord());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 font-sans">
      <h1 className="text-4xl font-black mb-8 text-purple-800 italic uppercase tracking-tighter">
        Welcome to the Hangman Game!
      </h1>

      
      {(isWin || isLoss) && (
        <Result isWin={isWin} secretWord={secretWord} onReset={resetGame} />
      )}

      <div className="border-4 border-purple-400 p-8 rounded-xl bg-white shadow-2xl flex flex-wrap gap-10 justify-center">
        
        
        <div className="flex flex-col gap-6 items-center">
          <HangmanDisplay lives={lives} />

         
          <div className="border-2 border-yellow-400 p-4 rounded bg-white w-full text-center shadow-sm">
            <span className="text-yellow-600 font-bold text-xs uppercase block mb-1">
              Lives Remaining
            </span>
            <div className="text-3xl tracking-tighter">
              {Array(5)
                .fill(0)
                .map((_, i) => (i < lives ? "❤️" : "x"))}
            </div>
          </div>
          
          
        </div>

       
        <div className="flex flex-col gap-8">
          
          
          <div style={{ border: '2px solidrgb(10, 10, 10)', padding: '20px', borderRadius: '8px', backgroundColor: 'white', textAlign: 'center' }}>
        <span style={{ color: 'black', fontWeight: 'bold', display: 'block', marginBottom: '15px', fontSize: '12px', uppercase: 'true' }}>
        Secret Word
        </span>

    <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'center', alignItems: 'flex-end' }}>
        {secretWord.split("").map((letter, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
        
       
        <span style={{ fontSize: '32px', fontWeight: '900', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {guessedLetters.includes(letter) ? letter : ""}
        </span>
        
        
        <div style={{ width: '100%', height: '4px', backgroundColor: 'black', borderRadius: '2px' }}></div>
        </div>
        ))}
        </div>
    </div>
          <LetterBox 
            guessedLetters={guessedLetters} 
            onGuess={handleGuess} 
            disabled={isWin || isLoss} 
            secretWord={secretWord}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
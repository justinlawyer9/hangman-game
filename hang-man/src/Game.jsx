import React, { useState, useEffect } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import HangmanDisplay from "./HangmanDisplay";
import LetterBox from "./LetterBox";
import Result from "./Result";

const client = new DynamoDBClient({
    region: "local",
    endpoint:"http://localhost:5173/dynamodb",
    credentials: { 
        accessKeyId: "localDev", 
        secretAccessKey: "localDev" 
    },

    maxAttempts: 3
});

const docClient = DynamoDBDocumentClient.from(client);

const words = ["MOREHOUSE","TIGERS","MAROON","HBCU","GRAVES","BRAZEAL","FORBES"];

const Game = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];
  const [secretWord, setSecretWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(5);

  const isWin = secretWord.split("").every((letter) => guessedLetters.includes(letter));
  const isLoss = lives === 0;

  

  

  useEffect(() => {
    if (!user) return;           
    if (!isWin && !isLoss) return; 
  
    const newWins   = isWin  ? (user.wins ?? 0) + 1 : (user.wins ?? 0);
    const newLosses = isLoss ? (user.losses ?? 0) + 1 : (user.losses ?? 0);
    const newTotal  = newWins + newLosses;
  
    const updatedUser = {
      ...user,
      wins:          newWins,
      losses:        newLosses,
      total:         newTotal,
      winPercentage: newTotal === 0 ? 0 : Math.round((newWins / newTotal) * 100)
    };
  
    setUser(updatedUser);
    putUserStats(updatedUser);
  
  }, [isWin, isLoss]);

  const putUserStats = async (updatedUser) => {
      await docClient.send(new PutCommand({
        TableName: "HangmanUsers",
      Item: {
        Username: updatedUser.Username,
        pin: updatedUser.pin,
        wins: updatedUser.wins,
        losses: updatedUser.losses,
        total: updatedUser.total,
        winPercentage: updatedUser.winPercentage
      }
      }));
  };

  
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
    setSecretWord(words[Math.floor(Math.random() * words.length)]);
    
  };

  
  const handleLogin = async () => {
    const id = document.getElementById('idInput').value;
    const pin = document.getElementById('pinInput').value;

    if (!id) return alert("Please enter your username");
    if(!pin) return alert("Please enter pin");

    setLoading(true);
    try {
      const res = await docClient.send(new GetCommand({
        TableName: "HangmanUsers",
        Key: { Username: id }
      }));

      if (res.Item) {
        if(res.Item.pin !== pin) {
          alert("Incorrect Pin");
          setLoading(false);
          return;
        }
        setUser(res.Item);
      }
      else 
      {
        const newItem = { 
            Username: id,
            pin: pin, 
            wins: 0, 
            losses: 0,
            total: 0, 
            winPercentage: 0
        };

        await docClient.send(new PutCommand({ TableName: "HangmanUsers", Item: newItem }));
        setUser(newItem);
      }
    } catch (error) {
      console.error(error);
      alert("Database Connection Failed! Is DynamoDB Local running?");
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div style={{ minHeight: '520px', background: 'linear-gradient(135deg, #26215C 0%, #3C3489 50%, #534AB7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', borderRadius: '12px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem 2rem', width: '100%', maxWidth: '360px', border: '0.5px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
  
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #534AB7, #AFA9EC, #534AB7)' }} />
  
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <svg width="64" height="72" viewBox="0 0 64 72" style={{ display: 'block', margin: '0 auto 8px' }}>
              <line x1="8" y1="68" x2="56" y2="68" stroke="#534AB7" strokeWidth="3" strokeLinecap="round"/>
              <line x1="20" y1="68" x2="20" y2="8" stroke="#534AB7" strokeWidth="3" strokeLinecap="round"/>
              <line x1="20" y1="8" x2="40" y2="8" stroke="#534AB7" strokeWidth="3" strokeLinecap="round"/>
              <line x1="40" y1="8" x2="40" y2="18" stroke="#534AB7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2"/>
              <circle cx="40" cy="25" r="7" stroke="#AFA9EC" strokeWidth="2" fill="none"/>
              <line x1="40" y1="32" x2="40" y2="48" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round"/>
              <line x1="40" y1="37" x2="33" y2="43" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round"/>
              <line x1="40" y1="37" x2="47" y2="43" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round"/>
              <line x1="40" y1="48" x2="34" y2="56" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round"/>
              <line x1="40" y1="48" x2="46" y2="56" stroke="#AFA9EC" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', margin: '0 0 4px' }}>Hangman</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Sign in with your student ID to play</p>
          </div>
  
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enter Username
            </label>
            <input
              id="idInput"
              type="text"
              placeholder="e.g. John"
              style={{ width: '100%', padding: '10px 14px', fontSize: '15px', border: '1.5px solid #d1d5db', borderRadius: '8px', background: '#f9fafb', color: '#1a1a1a', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#534AB7'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            PIN
            </label>
            <input
              id="pinInput"
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              style={{ width: '100%', padding: '10px 14px', fontSize: '15px', border: '1.5px solid #d1d5db', borderRadius: '8px', background: '#f9fafb', color: '#1a1a1a', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#534AB7'; e.target.style.background = 'white'; }}
              onBlur={e =>  { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
            />
          </div>
  
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '11px', background: loading ? '#AFA9EC' : '#534AB7', color: '#EEEDFE', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', transition: 'background 0.15s' }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#3C3489'; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = '#534AB7'; }}
          >
            {loading ? 'Searching...' : 'Start game'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.25rem' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>_ _ _ _ _</span>
            <div style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
          </div>
  
        </div>
      </div>
    );
  }


  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #26215C 0%, #3C3489 50%, #534AB7 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif',
      position: 'relative'
    }}>
    <div style={{
      position: 'absolute',
      top: '24px',
      right: '24px',
      background: 'white',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      minWidth: '180px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      borderTop: '4px solid #534AB7'
    }}>
      <div style={{ fontSize: '11px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
        Player
      </div>
      <div style={{ fontSize: '16px', fontWeight: '600', color: '#3C3489', marginBottom: '16px' }}>
        {user.Username}
      </div>

      <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '12px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Wins</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#3C3489' }}>{user.wins ?? 0}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Losses</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#3C3489' }}>{user.losses ?? 0}</div>
        </div>
      </div>

      <div style={{ height: '1px', background: '#f0f0f0', margin: '12px 0' }} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Win %</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: user.winPercentage >= 50 ? '#0F6E56' : '#993C1D' }}>
          {user.winPercentage ?? 0}%
        </div>
      </div>
    </div>
    
      
      {(isWin || isLoss) && (
        <div style={{ width: '100%', maxWidth: '560px', marginBottom: '16px' , color: '#d1d5db'}}>
          <Result isWin={isWin} secretWord={secretWord} onReset={resetGame} />

        </div>
      )}
    
      
      <div style={{
        background: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '560px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
      }}>
    
        
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #534AB7, #AFA9EC, #534AB7)' }} />
    
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
    
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <HangmanDisplay lives={lives} />
          </div>
    
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Lives Remaining
            </div>
            <div style={{ fontSize: '24px', letterSpacing: '4px' }}>
              {Array(5).fill(0).map((_, i) => (
                <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
              ))}
            </div>
          </div>
    
          
          <div style={{ width: '100%', height: '1px', background: '#f0f0f0' }} />
    
          
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: '11px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Secret Word
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {secretWord.split("").map((letter, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '34px' }}>
                  <span style={{ fontSize: '26px', fontWeight: '700', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3C3489' }}>
                    {guessedLetters.includes(letter) ? letter.toUpperCase() : ''}
                  </span>
                  <div style={{ width: '100%', height: '3px', background: '#534AB7', borderRadius: '2px' }} />
                </div>
              ))}
            </div>
          </div>
    
         
          <div style={{ width: '100%', height: '1px', background: '#f0f0f0' }} />
    
          
          <div style={{ width: '100%' }}>
            <LetterBox
              guessedLetters={guessedLetters}
              onGuess={handleGuess}
              disabled={isWin || isLoss}
              secretWord={secretWord}
            />
          </div>
    
        </div>
      </div>
    
      
      <button
        onClick={() => {
          resetGame();
          setUser(null);
        }}
      >
        Logout
      </button>
    
    </div>
  );
};

export default Game;
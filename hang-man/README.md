## Hangman v2 
A retro-style Hangman game built with React and Vite, now featuring persistent player accounts and win/loss tracking powered by Amazon DynamoDB.

## Local Development
If you want to run the game and UI on your machine without Docker:Bash# Install dependencies
npm install

## Start the dev server
# npm run dev
Then open http://localhost:5173 in your browser.

## Docker Compose 
The project is now fully containerized using Docker Compose. This spins up both the React frontend and a local DynamoDB instance to store your stats.

## Launch the stack:

# docker-compose up -d

Access the game:
Frontend: http://localhost:8080Local 
DynamoDB Admin: http://localhost:8000 (if configured)

## Account & Stats System
Integrated a persistent data layer to track your performance over time.

## Persistent Player Accounts

- Account Creation: Enter a unique username to start tracking your stats.

- Database: Powered by DynamoDB, ensuring your stats survive a refresh or container restart.

## Real-time Statistics
The game automatically calculates your performance metrics using the following logic:
Total Games: Wins + Losses
Win Percentage: (wins / total) * 100

## How to Play

The Goal: Guess the secret word one letter at a time before you run out of lives.

Lives: You start with 5 lives. Each wrong guess evolves the Hangman sprite.

Visuals:Correct Guess: Fills the structural dashes in the secret word.

Incorrect Guess: Keyboards keys are greyed out and a life is lost.

Stats: Your win/loss record and percentage are updated automatically in the database after every game.

Reset: Use the "Play Again" button in the game-over pop-up to fetch a new random word and keep your streak alive.

## Tech Stack

- Frontend: React + Vite

- Backend/Database: Amazon DynamoDB 

- Orchestration: Docker Compose 
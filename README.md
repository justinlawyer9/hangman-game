## Hangman
A retro-style Hangman game built with React and Vite. A dynamic "Secret Word" display with structural dashes, and a color-coded keyboard.

## Quick Start
1. Local Development
If you want to run the game on your machine without Docker:


# Install dependencies
npm install

# Start the dev server
npm run dev
Then open http://localhost:5173 in your browser.

## Docker (Containerized)
Since we just fixed your Dockerfile, you can run the game in a clean, isolated container:

1. Build the image:

docker build -t hang-man .

Run the container: 

docker run -d -p 8080:80 --name hangman-app hang-man
Then open http://localhost:8080 to play!

## How to Play
The Goal: Guess the secret word one letter at a time before you run out of lives.

Lives: You start with 5 lives. Each wrong guess costs a life and evolves the Hangman sprite.

Visuals: Fill in spot in secret word: Correct guess.

Greyed out and not filled in: Incorrect guess.

Reset: Click the "Play Again" via the game-over pop-up to get a new random word.

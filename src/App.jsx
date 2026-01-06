import React, { useEffect, useRef, useState } from "react";
import generateColor from "./utils/generateColor";
import Confetti from "react-confetti";

const letters = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

function App() {
  const [suggestedLetter, setSuggestedLetter] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [color, setColor] = useState(generateColor());

  const resetGame = () => {
    setSuggestedLetter(0);
    setIsGameWon(false);
    setColor(generateColor());
  };

  const isPlayingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPlayingRef.current || isGameWon) return;

      const key = event.key.toLowerCase();
      console.log("Pressed key:", key);

      if (key.length !== 1 || !/[a-z0-9]/.test(key)) return;

      if (key !== letters[suggestedLetter]) return;

      isPlayingRef.current = true;

      const audio = new Audio(`/public/sounds/${key}.mp3`);

      audio.play().catch((error) => {
        console.error(`Error playing sound for ${key}:`, error);
        isPlayingRef.current = false;
      });

      audio.onended = () => {
        isPlayingRef.current = false;
        if (suggestedLetter === letters.length - 1) {
          const audioWin = new Audio(`public/sounds/crowd-cheering.mp3`);
          audioWin.play().catch((error) => {
            console.error(`Error playing winning sound:`, error);
          });

          setIsGameWon(true);
          return;
        }

        setSuggestedLetter((prev) => prev + 1);
        setColor(generateColor());
      };

      audio.onerror = () => {
        isPlayingRef.current = false;
      };
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [suggestedLetter, isGameWon]);

  return (
    <main className="relative h-screen w-full bg-[#222222] text-white flex justify-center items-center bg-[url('/public/kids-bg.jpg')] bg-cover">
      {isGameWon && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="w-full h-full bg-black/20 backdrop-blur-sm flex flex-col gap-4 justify-center items-center">
        {!isGameWon && (
          <span
            className="text-9xl uppercase font-bold"
            style={{
              color,
            }}
          >
            {letters[suggestedLetter]}
          </span>
        )}

        {isGameWon && (
          <button
            onClick={resetGame}
            className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer text-white text-2xl font-bold hover:scale-105 transform"
          >
            Play Again!
          </button>
        )}
      </div>
    </main>
  );
}

export default App;

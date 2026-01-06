import React, { useEffect, useRef, useState } from "react";
import generateColor from "./utils/generateColor";
import Confetti from "react-confetti";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

function App() {
  const [suggestedLetter, setSuggestedLetter] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [color, setColor] = useState(generateColor());

  const isPlayingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPlayingRef.current || isGameWon) return;

      const key = event.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;

      if (key !== letters[suggestedLetter]) return;

      isPlayingRef.current = true;

      const audio = new Audio(`/sounds/${key}.mp3`);

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

      <div className="w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center">
        <span
          className="text-9xl uppercase font-bold"
          style={{
            color,
          }}
        >
          {letters[suggestedLetter]}
        </span>
      </div>
    </main>
  );
}

export default App;

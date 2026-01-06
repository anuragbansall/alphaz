import React, { useEffect, useRef, useState } from "react";
import generateColor from "./utils/generateColor";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

function App() {
  const [suggestedLetter, setSuggestedLetter] = useState(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPlayingRef.current) return;

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
        setSuggestedLetter((prev) => (prev + 1) % letters.length);
      };

      audio.onerror = () => {
        isPlayingRef.current = false;
      };
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [suggestedLetter]);

  return (
    <main className="relative h-screen w-full bg-[#222222] text-white flex justify-center items-center bg-[url('/public/kids-bg.jpg')] bg-cover">
      <div className="w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center">
        <span
          className="text-9xl uppercase font-bold"
          style={{
            color: `${generateColor()}`,
          }}
        >
          {letters[suggestedLetter]}
        </span>
      </div>
    </main>
  );
}

export default App;

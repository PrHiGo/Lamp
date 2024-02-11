import { useState, useRef, useEffect } from "react";
import "./App.css";
import LampIconOn from "./assets/lampOn.svg";
import LampIconOff from "./assets/lampOff.svg";

function App() {
  const [isLampOn, setIsLampOn] = useState(false);
  const cordRef = useRef(null);
  const coreRef = useRef(null); // Lägg till en ref för "core"

  useEffect(() => {
    const body = document.querySelector("body");
    isLampOn
      ? body.classList.add("bg-gray-700")
      : body.classList.remove("bg-gray-700");
  }, [isLampOn]);

  const toggleLamp = () => {
    setIsLampOn(!isLampOn);
  };

  const startDrag = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    cordRef.current.startX = startX;
    cordRef.current.startY = startY;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    const newX = Math.min(0, Math.max(0, e.clientX - cordRef.current.startX));
    const newY = Math.min(
      50,
      Math.max(-50, e.clientY - cordRef.current.startY)
    );

    // Applicera den nya positionen på sladden och core
    cordRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    coreRef.current.style.transform = `translate(${newX * 1}px, ${newY * 1}px)`; // Modifiera detta värde beroende på hur du vill att core ska följa med
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);

    const transformValues = cordRef.current.style.transform
      .replace("translate(", "")
      .replace("px)", "")
      .split(", ");
    const transformY = parseFloat(transformValues[1]);

    if (transformY >= 30) {
      toggleLamp();
    }

    cordRef.current.style.transform = "";
    coreRef.current.style.transform = ""; // Återställ även core position
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={isLampOn ? LampIconOn : LampIconOff}
        className="w-64 h-auto mx-auto z-50"
        alt="Lamp"
      />

      <div
        ref={coreRef}
        id="core"
        className="border-2 border-black border-dotted rounded-full h-40 -mt-20"
      ></div>
      <div
        ref={cordRef}
        onMouseDown={startDrag}
        className="border-2 border-black h-4 w-4 rounded-full mt-px cursor-pointer"
      ></div>
    </div>
  );
}

export default App;

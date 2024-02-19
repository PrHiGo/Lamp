import { useState, useRef, useEffect } from "react";
import "./App.css";
import LampIconOn from "./assets/lampOn.svg";
import LampIconOff from "./assets/lampOff.svg";

function App() {
  const [isLampOn, setIsLampOn] = useState(false);
  const initialCordLength = 120;
  const [cordPosition, setCordPosition] = useState(initialCordLength);
  const cordRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const body = document.body;
    isLampOn
      ? body.classList.add("bg-gray-700")
      : body.classList.remove("bg-gray-700");
  }, [isLampOn]);

  const toggleLamp = () => {
    setIsLampOn((prevState) => !prevState);
  };

  const startDrag = (e) => {
    e.preventDefault();
    cordRef.current.startY = e.clientY;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    const newY = Math.min(
      initialCordLength + 35,
      initialCordLength + (e.clientY - cordRef.current.startY)
    );
    const clampedY = Math.max(newY, initialCordLength);
    setCordPosition(clampedY);
    cordRef.current.style.transform = `translate(0px, ${
      clampedY - initialCordLength
    }px)`;
  };

  const animateCordSway = () => {
    // Funktion för att animera snörets gungning
    let startTime = Date.now();
    let duration = 300;

    const animate = () => {
      let timePassed = Date.now() - startTime;
      let progress = timePassed / duration;
      if (progress > 1) progress = 1;

      let sway = Math.sin(progress * Math.PI) * 30; // Beräknar gungningens förskjutning
      let secondSway = Math.sin(progress * Math.PI) * -30;
      let controlPoint1X = 100 + sway;
      let controlPoint1Y = 120 + initialCordLength * 0.3;
      let controlPoint2X = 100 + secondSway;
      let controlPoint2Y = 120 + initialCordLength * 0.6;
      let endPointY = 120 + initialCordLength;

      if (pathRef.current) {
        pathRef.current.setAttribute(
          // Uppdaterar SVG-path för att visa gungningen
          "d",
          `M100,120 C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} 100,${endPointY}`
        );
      }

      if (progress < 1) {
        requestAnimationFrame(animate); // Fortsätter animationen om den inte är klar
      } else {
        if (pathRef.current) {
          pathRef.current.setAttribute(
            // Återställer path till dess startposition när animationen är klar
            "d",
            `M100,120 C100,${120 + initialCordLength * 0.3} 100,${
              120 + initialCordLength * 0.6
            } 100,${endPointY}`
          );
        }
      }
    };

    requestAnimationFrame(animate); // Startar animationsloopen
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    const transformY = parseFloat(
      cordRef.current.style.transform
        .replace("translate(0px, ", "")
        .replace("px)", "")
    );

    if (transformY >= 1) {
      cordRef.current.classList.add("cord-bounce");
      cordRef.current.style.transform = `translate(0px, ${-transformY}px)`;
      animateCordSway(); // Startar gungningsanimationen

      setTimeout(() => {
        // Återställer snöret till dess startposition efter en viss tid
        setCordPosition(initialCordLength);
        cordRef.current.classList.remove("cord-bounce");
        cordRef.current.style.transform = "";
      }, 500);
    }

    if (transformY >= 25) {
      toggleLamp();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={isLampOn ? LampIconOn : LampIconOff}
        className="w-64 h-auto mx-auto"
        alt="Lamp"
      />
      <svg
        width="200"
        height="200"
        className="absolute left-1/2 transform mt-28 -translate-x-1/2 z-10"
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={`M100,120 Q100,${120 + cordPosition / 2} 100,${
            120 + cordPosition
          }`}
          stroke="black"
          strokeWidth="5"
          fill="none"
          strokeDasharray="1,10"
          strokeLinecap="round"
        />
      </svg>
      <div
        ref={cordRef}
        onMouseDown={startDrag}
        className="border-2 border-black h-4 w-4 rounded-full mt-24 cursor-pointer bg-black z-50"
      ></div>
    </div>
  );
}

export default App;

import { useRef, useState, useEffect } from "react";
import Key from "./components/Key";
import "./App.css";
import Switch from "./components/Switch";

const keys = [
  {
    keyId: "Q",
    padId: "Heater-1",
    altPadId: "Chord-1",
    padUrl: "Heater-1",
    altPadUrl: "Chord_1",
  },
  {
    keyId: "W",
    padId: "Heater-2",
    altPadId: "Chord-2",
    padUrl: "Heater-2",
    altPadUrl: "Chord_2",
  },
  {
    keyId: "E",
    padId: "Heater-3",
    altPadId: "Chord-3",
    padUrl: "Heater-3",
    altPadUrl: "Chord_3",
  },
  {
    keyId: "A",
    padId: "Heater-4",
    altPadId: "Shaker",
    padUrl: "Heater-4_1",
    altPadUrl: "Give_us_a_light",
  },
  {
    keyId: "S",
    padId: "Clap",
    altPadId: "Open-HH",
    padUrl: "Heater-6",
    altPadUrl: "Dry_Ohh",
  },
  {
    keyId: "D",
    padId: "Open-HH",
    altPadId: "Closed-HH",
    padUrl: "Dsc_Oh",
    altPadUrl: "Bld_H1",
  },
  {
    keyId: "Z",
    padId: "Kick-n'-Hat",
    altPadId: "Punchy-Kick",
    padUrl: "Kick_n_Hat",
    altPadUrl: "punchy_kick_1",
  },
  {
    keyId: "X",
    padId: "Kick",
    altPadId: "Side-Stick",
    padUrl: "RP4_KICK_1",
    altPadUrl: "side_stick_1",
  },
  {
    keyId: "C",
    padId: "Closed-HH",
    altPadId: "Snare",
    padUrl: "Cev_H2",
    altPadUrl: "Brk_Snr",
  },
];
// const activeKeys = keys.map((el) => el.keyId);

function App() {
  const displayRef = useRef(null);
  const [isOn, setIsOn] = useState(true);
  const [isBank, setIsBank] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const changeVolumeForAllAudio = (volume) => {
    const mediaElements = document.querySelectorAll("audio, video");
    mediaElements.forEach((element) => {
      element.volume = volume;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = document.getElementById(e.key.toUpperCase());
      if (k) {
        k.parentElement.classList.add("active");
        k.click();
        setTimeout(() => {
          k.parentElement.classList.remove("active");
        }, 100);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    changeVolumeForAllAudio(volume);
    displayRef.current.innerText = `Volume ${Math.round(volume * 100)}`;
    setTimeout(() => {
      displayRef.current.innerText = "";
    }, 1500);
  }, [volume]);

  useEffect(() => {
    const text = !isBank ? "heater kit" : "smooth piano kit";
    displayRef.current.innerText = text.toUpperCase();
  }, [isBank]);

  return (
    <main
      id="drum-machine"
      className="bg-gray w-100 h-screen flex items-center justify-center"
    >
      <section className="bg-lightgray border-orange border-[4px] flex items-center justify-center flex-wrap gap-y-6 w-4/5 sm:w-100 max-w-2xl">
        <div
          id="pad-bank"
          className="keyboard grid grid-cols-3 gap-2 sm:gap-3 w-64 sm:w-96 p-5 sm:p-6"
        >
          {!!keys.length &&
            keys.map((key, index) => (
              <Key
                key={index}
                id={key.keyId}
                padId={!isBank ? key.padId : key.altPadId}
                padUrl={!isBank ? key.padUrl : key.altPadUrl}
                displayRef={displayRef}
                isOn={isOn}
              />
            ))}
        </div>
        <div className="controls flex flex-col items-center gap-5 p-6 w-64">
          <Switch name="Power" setStatus={setIsOn} status={isOn} />
          <p
            id="display"
            ref={displayRef}
            className="bg-darkgray font-bold h-12 w-48 text-center inline-flex items-center justify-center"
          ></p>
          <input
            max="1"
            min="0"
            step="0.01"
            type="range"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          ></input>
          <Switch name="Bank" setStatus={setIsBank} status={isBank} />
        </div>
      </section>
    </main>
  );
}

export default App;

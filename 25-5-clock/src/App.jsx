import { useRef, useState, useEffect } from "react";
import LengthControl from "./LengthControl";
import "./App.css";

const timeOffsetMilisecs = new Date().getTimezoneOffset() * 60000;
const presentTime = (timeMilisecs) => {
  const time = new Date(timeMilisecs + timeOffsetMilisecs);
  const hrs = time.getHours();
  const sec = time.getSeconds();
  const min = hrs * 60 + time.getMinutes();
  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};

function App() {
  const audioRef = useRef(null);
  const [breakMin, setBreakMin] = useState(5);
  const [sessionMin, setSessionMin] = useState(25);
  const [isSession, setIsSession] = useState(true);
  const [isStopped, setIsStopped] = useState(true);
  const [time, setTime] = useState(sessionMin * 60000);

  const reset = () => {
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsStopped(true);
    setSessionMin(25);
    setBreakMin(5);
    !isSession ? setIsSession(true) : setTime(sessionMin * 60000);
  };

  useEffect(() => {
    if (time < 0) {
      audioRef.current.play();
      setIsSession((isSession) => !isSession);
    }
  }, [time]);

  useEffect(() => {
    isSession ? setTime(sessionMin * 60000) : setTime(breakMin * 60000);
  }, [isSession, sessionMin, breakMin]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (!isStopped) setTime((time) => time - 1000);
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [isStopped]);

  return (
    <div className="bg-[#1e555c] w-100 h-screen  flex items-center justify-center text-[white]">
      <section className="w-[600px]  flex gap-5 flex-col justify-center items-center">
        <h1 className="text-5xl font-medium">25 + 5 Clock</h1>
        <div className="md:flex gap-20">
          <LengthControl
            title="Break"
            id="break"
            min={breakMin}
            setMin={setBreakMin}
            isStopped={isStopped}
          />
          <LengthControl
            title="Session"
            id="session"
            min={sessionMin}
            setMin={setSessionMin}
            isStopped={isStopped}
          />
        </div>

        <div className="timer border-[8px] border-[#13353a] rounded-[40px] text-center px-10 py-5">
          <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
          <div id="time-left" className="text-[70px]">
            {time < 0 ? "00:00" : presentTime(time)}
          </div>
        </div>
        <div className="timer-control flex gap-3">
          <button
            id="start_stop"
            onClick={() => setIsStopped((isStopped) => !isStopped)}
          >
            <i className="fa fa-play fa-2x"></i>
            <i className="fa fa-pause fa-2x"></i>
          </button>
          <button id="reset" onClick={() => reset()}>
            <i className="fa fa-refresh fa-2x"></i>
          </button>
        </div>
        <div className="author text-center">
          Coded by <br />
          <span> Abdulmuizz Hamzat </span>
        </div>
        <audio
          id="beep"
          ref={audioRef}
          preload="auto"
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </section>
    </div>
  );
}

export default App;

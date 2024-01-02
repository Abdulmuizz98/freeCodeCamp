import { useRef } from "react";
const url = "https://s3.amazonaws.com/freecodecamp/drums";

const Key = ({ id, padId, padUrl, displayRef, isOn }) => {
  const audioRef = useRef(null);

  return (
    <div
      className={`drum-pad ${
        isOn && "active:bg-orange"
      } w-100 h-12 sm:h-20 bg-darkgray flex items-center justify-center rounded-md`}
      id={padId}
      onClick={() => {
        if (!audioRef.current.paused) {
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play();

        displayRef.current.innerText = padId.toUpperCase().replace(/-/, " ");
      }}
    >
      <audio
        className="clip w-100 h-100 border border-orange border-4"
        id={id}
        ref={audioRef}
        src={!isOn ? "#" : `${url}/${padUrl}.mp3`}
      ></audio>
      {id}
    </div>
  );
};

export default Key;

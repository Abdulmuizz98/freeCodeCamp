const LengthControl = ({ title, id, min, setMin, isStopped }) => {
  const maximum = 60;
  const minimum = 1;
  const handleIncrement = () => {
    if (isStopped) setMin((min) => (min + 1 <= maximum ? min + 1 : min));
  };

  const handleDecrement = () => {
    if (isStopped) setMin((min) => (min - 1 >= minimum ? min - 1 : min));
  };

  return (
    <div className="length-control text-center">
      <div id={`${id}-label`} className="text-[25px]">{`${title} Length`}</div>
      <div className="inline-flex gap-4 items-center text-[15px]">
        <button
          className="btn-level"
          id={`${id}-decrement`}
          onClick={handleDecrement}
        >
          <i className="fa fa-arrow-down fa-2x"></i>
        </button>
        <span id={`${id}-length`} className="text-[25px]">
          {min}
        </span>
        <button
          className="btn-level"
          id={`${id}-increment`}
          onClick={handleIncrement}
        >
          <i className="fa fa-arrow-up fa-2x"></i>
        </button>
      </div>
    </div>
  );
};

export default LengthControl;

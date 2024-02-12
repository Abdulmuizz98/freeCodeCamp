const Switch = ({ name, status, setStatus }) => {
  return (
    // <div className="flex flex-col w-16 border items-center">
    <div className="text-center">
      <p>{name}</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={status}
          onChange={(e) => {
            setStatus(e.target.checked);
          }}
        />
        <span className="slider"></span>
      </label>
    </div>
    // </div>
  );
};

export default Switch;

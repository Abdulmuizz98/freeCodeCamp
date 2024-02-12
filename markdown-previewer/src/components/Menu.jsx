/* eslint-disable react/prop-types */
import { useState } from "react";

const Menu = ({ body, title, classes, myRef, toCollapseRef }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = (toExpandRef, toCollapseRef) => {
    setIsExpanded(!isExpanded);
    toCollapseRef.current.classList.toggle("hidden");

    const menuBody = toExpandRef.current.childNodes[1];
    menuBody.classList.toggle("min-h-screen");
  };

  return (
    <section
      ref={myRef}
      className={`menu border bg-lightgreen border-red-500 flex flex-col mx-auto ${classes}`}
    >
      <header className="px-3 py-2 flex items-center bg-darkgreen">
        <i className="fa fa-free-code-camp" title="no-stack-dub-sack"></i>
        <span className="text-black ml-3">{title}</span>
        <button
          type="button"
          className="ml-auto"
          onClick={() => handleExpand(myRef, toCollapseRef)}
        >
          {isExpanded ? (
            <i className="fa fa-compress"></i>
          ) : (
            <i className="fa fa-arrows-alt"></i>
          )}
        </button>
      </header>
      <>{body}</>
    </section>
  );
};

export default Menu;

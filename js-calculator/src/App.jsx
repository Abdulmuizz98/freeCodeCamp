import { useEffect, useState } from "react";
import "./App.css";

const isOperator = (input) => operators.find((el) => el === input);
const operators = ["/", "⋅", "-", "+"];

function App() {
  const [formula, setFormula] = useState("");
  const [res, setRes] = useState("");
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState("");

  const reset = () => {
    setFormula("");
    setDisplay("0");
    setPrevValue("");
  };

  const calc = () => {
    const res = formula ? eval(formula.replaceAll("⋅", "*")) : NaN;
    setFormula(`${formula}=${res}`);
    setDisplay(res);
    setRes(res);
  };

  const handleBtn = (e) => {
    const btnValue = e.target.value;
    if (formula.includes("=")) {
      if (isOperator(btnValue)) setFormula(res);
      else reset();
    }

    if (btnValue === "AC") reset();
    else if (btnValue === "=") calc();
    else {
      if (prevValue !== "" && Number(prevValue) === 0 && btnValue === "0") {
        setFormula(formula);
        setPrevValue("0");
      } else if (prevValue === "0") {
        setFormula(formula.substring(0, formula.length - 1) + btnValue);
      } else if (btnValue === "." && prevValue.includes(".")) {
        setFormula(formula);
      } else if (isOperator(btnValue)) {
        setDisplay(btnValue);
        setFormula((formula) => formula + btnValue);
      } else {
        isOperator(formula[formula.length - 1])
          ? setDisplay(btnValue)
          : setDisplay((display) =>
              display === "0" ? btnValue : display + btnValue
            );

        setFormula((formula) => formula + btnValue);
      }

      if (isOperator(btnValue)) {
        setPrevValue("");
      } else {
        setPrevValue((prevValue) => prevValue + btnValue);
      }
    }
  };

  useEffect(() => {
    const btns = document.querySelectorAll("button");
    btns.forEach((btn) => btn.addEventListener("click", handleBtn));

    return () => {
      btns.forEach((btn) => btn.removeEventListener("click", handleBtn));
    };
  });

  useEffect(() => {
    let tempFormula = formula;
    let beforeLastIdx = tempFormula.length - 2;
    let lastIdx = tempFormula.length - 1;
    let operatorSet = tempFormula.length !== 2 ? ["/", "⋅", "+"] : operators;

    while (
      operators.find((e) => e === tempFormula[beforeLastIdx]) &&
      operatorSet.find((e) => e === tempFormula[lastIdx])
    ) {
      tempFormula =
        tempFormula.substring(0, beforeLastIdx) + tempFormula[lastIdx];
      beforeLastIdx = tempFormula.length - 2;
      lastIdx = tempFormula.length - 1;
    }

    setFormula(tempFormula);
  }, [formula]);

  return (
    <main className="flex flex-col items-center justify-center w-100 h-screen bg-[#c2c2d6] text-[20px] font-mono">
      <section className="w-[21rem] bg-[rgb(0,0,0)] p-[6px] m-4 ">
        <div
          id="formula"
          className="w-100 h-7 bg-[black] text-[orange] font-digital flex items-center justify-end"
        >
          {formula}
        </div>
        <div
          id="display"
          className="w-100 h-7 bg-[black] text-[white] font-digital text-[29px] flex items-center justify-end pb-2"
        >
          {display}
        </div>
        <div></div>
        <div className="w-100 h-[21rem] grid grid-cols-4 grid-rows-5 gap-[1px]">
          <button className="bg-[#ac3939] col-span-2 " id="clear" value="AC">
            AC
          </button>
          <button id="divide" className="operator" value="/">
            /
          </button>
          <button id="multiply" className="operator" value="⋅">
            x
          </button>
          <button id="seven" value="7">
            7
          </button>
          <button id="eight" value="8">
            8
          </button>
          <button id="nine" value="9">
            9
          </button>
          <button id="subtract" className="operator" value="-">
            -
          </button>
          <button id="four" value="4">
            4
          </button>
          <button id="five" value="5">
            5
          </button>
          <button id="six" value="6">
            6
          </button>
          <button id="add" className="operator" value="+">
            +
          </button>
          <button id="one" value="1">
            1
          </button>
          <button id="two" value="2">
            2
          </button>
          <button id="three" value="3">
            3
          </button>
          <button id="zero" className="col-span-2" value="0">
            0
          </button>
          <button id="decimal" value=".">
            .
          </button>
          <button
            id="equals"
            className="bg-[#046] col-start-4 row-span-2 row-start-4"
            value="="
          >
            =
          </button>
        </div>
      </section>
      <div className="">Coded By Abdulmuizz Hamzat</div>
    </main>
  );
}

export default App;

import { useEffect, useState, useRef } from "react";
import "./App.css";

const colors = [
  "#16a085",
  "#27ae60",
  "#2c3e50",
  "#f39c12",
  "#e74c3c",
  "#9b59b6",
  "#FB6964",
  "#342224",
  "#472E32",
  "#BDBB99",
  "#77B1A9",
  "#73A857",
];

const composeTweetUrl = (text, hashtags, related) => {
  const url = "https://twitter.com/intent/tweet";
  return `${url}?hashtags=${encodeURIComponent(
    hashtags
  )}&related=${encodeURIComponent(related)}&text=${encodeURIComponent(text)}`;
};
const fetchQuotes = () => {
  return new Promise((resolve, reject) => {
    const url =
      "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Successful response
          let { quotes } = JSON.parse(xhr.responseText);
          resolve(quotes);
        } else {
          // Request failed
          reject("Request failed with status: " + xhr.status);
        }
      }
    };
  });
};

function App() {
  const [quotes, setQuotes] = useState([]);
  const [random, setRandom] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [colorRand, setColorRand] = useState(0);
  const tweetLink = useRef(null);
  const nextQuote = () => {
    setRandom(Math.floor(Math.random() * quotes.length));
    setColorRand(Math.floor(Math.random() * colors.length));
    setOpacity(0);
    setTimeout(() => {
      setOpacity(100);
    }, 1000);

    tweetLink.current.href = composeTweetUrl(
      quotes[random].quote,
      "quotes",
      "freecodecamp"
    );
  };
  useEffect(() => {
    fetchQuotes().then((res) => {
      setQuotes(res);
    });
  }, []);

  useEffect(() => {
    if (!!quotes.length) nextQuote();
  }, [quotes]);

  return (
    <>
      <main
        className={`bg-[${colors[colorRand]}] w-full min-h-screen flex justify-center items-center`}
      >
        <div
          id="quote-box"
          className="text-dark w-full max-w-[30rem] border bg-white p-12 rounded-md"
        >
          <div
            className={`quote text-[${colors[colorRand]}] opacity-[${opacity}]`}
          >
            <div id="text" className={`text-center text-3xl font-medium`}>
              <i className="fa fa-quote-left"> </i>
              {` `}
              {!!quotes.length && quotes[random].quote}
            </div>
            <div id="author" className={`text-right mt-5`}>
              -{` `}
              {!!quotes.length && quotes[random].author}
            </div>
          </div>
          <div className="flex gap-x-1 mt-5">
            <a
              href=""
              ref={tweetLink}
              // href="https://twitter.com/compose/tweet?hashtags=quotes&related=freecodecamp&text=%22A%20truly%20rich%20man%20is%20one%20whose%20children%20run%20into%20his%20arms%20when%20his%20hands%20are%20empty.%22%20"
              title="Tweet this quote!"
              target="_top"
              id="tweet-quote"
              className={`bg-[${colors[colorRand]}] text-white rounded-sm flex items-center justify-center w-9 h-9 p-1 `}
            >
              <i className="fa fa-twitter"></i>
            </a>
            <a
              href=""
              type="button"
              id="tumblr-quote"
              title="tumblr this quote!"
              target="_blank"
              className={`bg-[${colors[colorRand]}] text-white rounded-sm flex items-center justify-center w-9 h-9 p-1`}
            >
              <i className="fa fa-tumblr"></i>
            </a>
            <button
              type="button"
              id="new-quote"
              className={`bg-[${colors[colorRand]}] text-white rounded-sm flex items-center px-2 py-1 w-30 ml-auto text-xs`}
              onClick={nextQuote}
            >
              New Quote
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

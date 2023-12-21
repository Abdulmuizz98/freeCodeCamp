import { useState, useRef, useEffect } from "react";
import { placeholder } from "./placeholder";
import { marked } from "marked";
import Prism from "prismjs";
import "./App.css";
import "../node_modules/prismjs/themes/prism-coy.css";
import Menu from "./components/Menu";

function App() {
  const prevRef = useRef(null);
  const previewerRef = useRef(null);
  const editorRef = useRef(null);

  const [content, setContent] = useState(placeholder);
  const [parsed, setParsed] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    setParsed(marked(content, { breaks: true }));
  }, [content]);

  useEffect(() => {
    const prevRefChildren = [...prevRef.current.childNodes];
    const preElements = prevRefChildren.filter(
      (el) => el.tagName && el.tagName.toLowerCase() === "pre"
    );
    preElements.length &&
      preElements.forEach((el) => el.classList.add("language-js"));

    if (window) {
      Prism.highlightAll();
    }
  }, [parsed]);

  return (
    <main className="bg-green min-h-screen py-8 text-base">
      <Menu
        myRef={editorRef}
        body={
          <textarea
            id="editor"
            rows={11}
            value={content}
            onChange={handleContentChange}
            className="meu-body bg-lightgreen p-2"
          ></textarea>
        }
        title="Editor"
        classes="mb-8 w-[80%] max-w-[37rem]"
        toCollapseRef={previewerRef}
      />
      <Menu
        myRef={previewerRef}
        body={
          <article
            id="preview"
            ref={prevRef}
            className="menu-body min-h-40 p-4"
            dangerouslySetInnerHTML={{
              __html: parsed,
            }}
          ></article>
        }
        title="Previewer"
        classes="w-[90%] max-w-[50rem]"
        toCollapseRef={editorRef}
      />
    </main>
  );
}
export default App;

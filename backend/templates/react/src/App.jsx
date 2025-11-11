import { useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const links = [
  {
    label: "React Docs",
    href: "https://react.dev/learn",
  },
  {
    label: "Vite Docs",
    href: "https://vitejs.dev/guide/",
  },
  {
    label: "CodeFiddle Guide",
    href: "https://github.com/Pipluppp/CodeFiddle",
  },
];

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="hero">
        <div className="logos">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo spin" alt="React logo" />
          </a>
        </div>
        <h1>React + Vite</h1>
        <p className="tagline">
          You are running the React template in CodeFiddle. Edit
          <code>src/App.jsx</code> and save to see live updates.
        </p>
        <button className="cta" type="button" onClick={() => setCount((c) => c + 1)}>
          Count is {count}
        </button>
        <p className="hint">
          Tip: Open the terminal panel to watch the dev server logs and install
          additional packages.
        </p>
      </header>
      <section className="links">
        {links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </section>
    </div>
  );
}

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ValetSketch from "./components/ValetSketch";
import TapSketch from "./components/TapSketch";
import TimeLoggerSketch from "./components/TimeLoggerSketch";
import "./style.css";
const tools = [{ name: "Valet", component: ValetSketch }, { name: "Magic mouse tap", component: TapSketch }, { name: "Tidloggaren", component: TimeLoggerSketch }];
function App() {
  const [selected, setSelected] = useState(0);
  return <div className="app"><header><h1>quality of life.</h1><a href="https://github.com/bottarjames/quality-of-life">GitHub ↗</a></header><nav aria-label="Utility sketches">{tools.map((tool,index) => <button type="button" key={tool.name} aria-pressed={index === selected} onClick={() => setSelected(index)}>{tool.name}</button>)}</nav><main>{tools.map((tool,index) => <div key={tool.name} hidden={index !== selected}><tool.component /></div>)}</main><footer>Browser sketches by James Evenlind. The desktop Valet project lives at <a href="https://github.com/bottarjames/Valet">bottarjames/Valet</a>.</footer></div>;
}
createRoot(document.getElementById("root")!).render(<App />);

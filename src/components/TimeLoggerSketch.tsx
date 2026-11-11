import { useEffect, useState } from "react";
import { Play, Square, X } from "lucide-react";
import { elapsedSeconds, formatDuration } from "./elapsed";
type Entry = { name: string; seconds: number };
const storageKey = "tidloggaren-sketch";
const readEntries = (): Entry[] => {
  try {
    const parsed=JSON.parse(sessionStorage.getItem(storageKey)||"[]");
    return Array.isArray(parsed)?parsed.filter(item=>item && typeof item.name==="string" && Number.isFinite(item.seconds) && item.seconds>=0):[];
  } catch { return []; }
};
export default function TimeLoggerSketch() {
  const [name,setName]=useState("");
  const [entries,setEntries]=useState<Entry[]>(readEntries);
  const [startedAt,setStartedAt]=useState<number|null>(null);
  const [now,setNow]=useState(()=>Date.now());
  const [notice,setNotice]=useState("");
  useEffect(()=>{try {sessionStorage.setItem(storageKey,JSON.stringify(entries));} catch { /* Keep the in-memory list usable. */ }},[entries]);
  useEffect(()=>{if(startedAt===null)return;const id=window.setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(id);},[startedAt]);
  const seconds=startedAt===null?0:elapsedSeconds(startedAt,now);
  const start=()=>{if(startedAt!==null)return;const timestamp=Date.now();setStartedAt(timestamp);setNow(timestamp);setNotice("Timing started.");};
  const stop=()=>{if(startedAt===null)return;const duration=seconds;const label=name.trim()||"Untitled block";setEntries(current=>[{name:label,seconds:duration},...current]);setStartedAt(null);setNotice(`${label} saved, ${formatDuration(duration)}.`);};
  return <div className="pg-time-desk">
    <div className="pg-time-face"><span className="pg-micro">{startedAt===null?"Ready when you are":"Recording this block"}</span><p role="timer" className="pg-time-digits"><span className="sr-only">Elapsed </span>{formatDuration(seconds)}</p><label className="pg-time-label"><span className="sr-only">Name this time block</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="What are you working on?" maxLength={120} /></label><div className="pg-time-actions"><button type="button" onClick={startedAt===null?start:stop} className={startedAt===null?"pg-clock-toggle":"pg-clock-toggle is-running"} aria-label={startedAt===null?"Start timing":"Stop and save block"}>{startedAt===null?<Play size={17} fill="currentColor" />:<Square size={14} fill="currentColor" />}</button><span>{startedAt===null?"Start a block":"Stop & save"}</span></div><span className="sr-only" role="status">{notice}</span></div>
    <div className="pg-time-ledger"><div className="pg-time-ledger-heading"><span className="pg-micro">This session</span><span className="pg-micro">{String(entries.length).padStart(2,"0")} blocks</span></div>{entries.length===0?<p className="pg-ledger-empty">Your time,<br />as it happens.</p>:<ol>{entries.map((entry,index)=><li key={`${entry.name}-${index}`}><span>{String(entries.length-index).padStart(2,"0")}</span><span>{entry.name}</span><time>{formatDuration(entry.seconds)}</time></li>)}</ol>}{entries.length>0 && <button type="button" className="pg-clear-time" onClick={()=>{setEntries([]);setNotice("Session list cleared.");}}>Clear this session <X size={12} /></button>}<p className="pg-caption">Saved in this tab.</p></div>
  </div>;
}

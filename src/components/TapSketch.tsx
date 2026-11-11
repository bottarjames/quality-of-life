import { useRef, useState } from "react";
const zones = ["Front", "Middle", "Back"] as const;
type Contact = { zone: string; kind: "tap" | "hold"; id: number };
export default function TapSketch() {
  const [log, setLog] = useState<Contact[]>([]);
  const [pressed, setPressed] = useState<string | null>(null);
  const contact = useRef<{ zone: string; at: number } | null>(null);
  const sequence = useRef(0);
  const record = (zone: string, kind: Contact["kind"]) => setLog(current=>[{zone,kind,id:++sequence.current},...current].slice(0,5));
  return <div className="pg-touch-desk">
    <div className="pg-mouse-object"><div className="pg-mouse-surface">{zones.map((zone,index)=><button key={zone} type="button" className={pressed===zone?"is-pressed":""} aria-label={`${zone} mouse zone: tap or hold`} onPointerDown={e=>{contact.current={zone,at:performance.now()};setPressed(zone);e.currentTarget.setPointerCapture(e.pointerId);}} onPointerUp={()=>{const down=contact.current;if(down?.zone===zone)record(zone,performance.now()-down.at<220?"tap":"hold");contact.current=null;setPressed(null);}} onPointerCancel={()=>{contact.current=null;setPressed(null);}} onClick={e=>{if(e.detail===0)record(zone,"tap");}}><span>0{index+1}</span><i aria-hidden="true" /><span>{zone}</span></button>)}</div><span className="pg-mouse-shadow" /></div>
    <div className="pg-touch-readout"><span className="pg-micro">Contact log</span><div className="pg-touch-latest" aria-live="polite"><span>{log[0]?.zone.toLowerCase() || "touch"}</span><span>{log[0]?.kind || "& hold"}</span></div><ol className="pg-touch-log">{log.slice(1).map(entry=><li key={entry.id}><span>{String(entry.id).padStart(2,"0")}</span><span>{entry.zone}</span><span>{entry.kind}</span></li>)}</ol><p className="pg-caption">Tap a zone, or hold it a little longer.<br />A browser sketch of a physical interaction.</p></div>
  </div>;
}

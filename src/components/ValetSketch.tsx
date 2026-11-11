import { useState } from "react";
import { ArrowDown, ArrowRight, FileText, Folder, Plus } from "lucide-react";

export default function ValetSketch() {
  const [projects, setProjects] = useState(["Writing", "Invoices", "Research"]);
  const [defaultProject, setDefaultProject] = useState("Writing");
  const [groupProject, setGroupProject] = useState("Research");
  const [fromGroup, setFromGroup] = useState(false);
  const [groupName, setGroupName] = useState("Research");
  const destination = fromGroup ? groupProject : defaultProject;
  const setDestination = (folder: string) => fromGroup ? setGroupProject(folder) : setDefaultProject(folder);
  const [file, setFile] = useState("field-notes.pdf");
  const [newFolder, setNewFolder] = useState("");
  const [receipt, setReceipt] = useState("");
  const [delivery, setDelivery] = useState(0);
  const route = () => {
    setReceipt(`${file.trim() || "untitled.pdf"} → ${destination} / ${fromGroup ? groupName.trim() || "Untitled group" : "Default project"}`);
    setDelivery(value => value + 1);
  };
  return <div className="pg-valet-desk">
    <div className="pg-app-bar"><span className="pg-window-dots" aria-hidden="true"><i /><i /><i /></span><span>Valet / download routing sketch</span><span>Local simulation</span></div>
    <div className="pg-route-layout">
      <div className="pg-route-source"><span className="pg-micro">Incoming</span><div className="pg-incoming-file" key={delivery}><FileText size={30} strokeWidth={.8} /><label><span className="sr-only">Download filename</span><input value={file} onChange={e=>setFile(e.target.value)} /></label><span className="pg-micro">{fromGroup ? groupName || "Tab group" : "Chrome download"}</span></div><div className="pg-source-choice" role="group" aria-label="Download source"><button type="button" aria-pressed={!fromGroup} onClick={()=>setFromGroup(false)}>Default</button><button type="button" aria-pressed={fromGroup} onClick={()=>setFromGroup(true)}>Tab group</button></div>{fromGroup && <label className="pg-group-name"><span className="sr-only">Tab group name</span><input value={groupName} onChange={event=>setGroupName(event.target.value)} placeholder="Tab group name" /></label>}<ArrowDown size={18} strokeWidth={1} className="pg-routing-arrow" /></div>
      <div className="pg-route-destination"><span className="pg-micro">Send to a project</span><div className="pg-folder-list" role="group" aria-label="Destination folder">{projects.map((project,index)=><button type="button" key={project} aria-pressed={destination===project} onClick={()=>setDestination(project)}><Folder size={19} strokeWidth={1} /><span>{project}</span><small>0{index+1}</small>{destination===project && <ArrowRight size={15} />}</button>)}</div><details className="pg-folder-settings"><summary><Plus size={12} /> Add a folder</summary><form onSubmit={e=>{e.preventDefault();const name=newFolder.trim();if(name && !projects.includes(name)){setProjects([...projects,name]);setDestination(name);setNewFolder("");}}}><label className="sr-only" htmlFor="pg-new-folder">New folder name</label><input id="pg-new-folder" value={newFolder} onChange={e=>setNewFolder(e.target.value)} placeholder="Project name" maxLength={50} /><button type="submit">Add <Plus size={12} /></button></form></details></div>
    </div>
    <div className="pg-route-bottom"><p role="status">{receipt || "Choose a folder. Try a download."}</p><button className="pg-text-action" type="button" onClick={route}>Route file <ArrowRight size={16} /></button></div>
  </div>;
}

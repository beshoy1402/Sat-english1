"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Hls from "hls.js";
type Lesson={id:string;titleEn:string;videoUrl:string;durationSeconds:number;isFreePreview:boolean;resourcesJson:string};
export default function LessonPlayer({lessons,completedIds,watermark}:{lessons:Lesson[];completedIds:string[];watermark:string}){
 const [currentId,setCurrentId]=useState(lessons[0]?.id??""),[done,setDone]=useState(completedIds),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const videoRef=useRef<HTMLVideoElement>(null);
 const current=useMemo(()=>lessons.find(x=>x.id===currentId)??lessons[0],[lessons,currentId]),url=current?.videoUrl??"";
 const youtube=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
 const embed=url.includes("iframe.mediadelivery.net")||url.includes("player.vimeo.com")?url:youtube?"https://www.youtube-nocookie.com/embed/"+youtube[1]:"";
 useEffect(()=>{const video=videoRef.current;if(!video||!url.endsWith(".m3u8"))return;let hls:Hls|undefined;if(video.canPlayType("application/vnd.apple.mpegurl"))video.src=url;else if(Hls.isSupported()){hls=new Hls({enableWorker:true});hls.loadSource(url);hls.attachMedia(video);}return()=>hls?.destroy();},[url]);
 async function complete(){if(!current)return;setBusy(true);setError("");try{const r=await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lessonId:current.id,completed:true})}),d=await r.json();if(!r.ok)throw Error(d.error||"Unable to save progress.");setDone(old=>old.includes(current.id)?old:[...old,current.id]);const i=lessons.findIndex(x=>x.id===current.id);if(i>=0&&i<lessons.length-1)setCurrentId(lessons[i+1].id);}catch(e){setError(e instanceof Error?e.message:"Could not save progress.");}finally{setBusy(false)}}
 return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,290px),1fr))",gap:18}}>
  <section className="card" style={{padding:18,minWidth:0}}>
   <div style={{aspectRatio:"16/9",background:"#020617",borderRadius:12,overflow:"hidden",position:"relative",display:"grid",placeItems:"center"}}>
    {url.endsWith(".m3u8")||url.endsWith(".mp4")?<video ref={videoRef} key={url.endsWith(".m3u8")?"hls":url} src={url.endsWith(".m3u8")?"":url} controls controlsList="nodownload" playsInline style={{width:"100%",height:"100%"}}/>:embed?<iframe key={embed} src={embed} title={current?.titleEn??"Course video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{width:"100%",height:"100%",border:0}}/>:<div style={{padding:24,textAlign:"center"}}><div className="gold" style={{fontSize:12,letterSpacing:".15em"}}>LESSON MEDIA</div><h2 style={{fontSize:23,margin:"12px 0"}}>Video coming soon</h2><p className="muted" style={{fontSize:13}}>The academy administrator must add the lesson video URL before this lesson can be watched.</p></div>}
    <div className="watermark">{watermark}</div>
   </div>
   <h2 style={{fontSize:22,margin:"20px 0 8px"}}>{current?.titleEn}</h2><p className="muted" style={{fontSize:13}}>Mark this lesson complete when you have finished studying it.</p>
   {error&&<p role="alert" style={{color:"#fca5a5",fontSize:13}}>{error}</p>}
   <button className="btn btn-primary" disabled={busy||!current||done.includes(current.id)} onClick={complete} style={{border:0,cursor:"pointer"}}>{busy?"Saving…":done.includes(current?.id??"")?"Lesson completed ✓":"Mark complete & continue"}</button>
   {current?.resourcesJson&&current.resourcesJson!=="[]"&&<div style={{marginTop:18}}><b>Lesson resources</b><pre className="muted" style={{whiteSpace:"pre-wrap",fontSize:12}}>{current.resourcesJson}</pre></div>}
  </section>
  <aside className="card" style={{padding:16}}><h3 style={{fontSize:18,marginBottom:14}}>Course curriculum</h3>{lessons.map((l,i)=><button key={l.id} onClick={()=>setCurrentId(l.id)} className="btn" style={{display:"flex",width:"100%",textAlign:"left",justifyContent:"space-between",gap:8,marginBottom:7,background:current?.id===l.id?"rgba(245,158,11,.14)":"transparent",border:"1px solid rgba(255,255,255,.08)",color:"#f8fafc",fontSize:13}}><span>{i+1}. {l.titleEn}</span><span className="gold">{done.includes(l.id)?"✓":l.isFreePreview?"Preview":"•"}</span></button>)}<p className="muted" style={{fontSize:12,marginTop:16}}>{done.length} of {lessons.length} lessons completed</p></aside>
 </div>;
}
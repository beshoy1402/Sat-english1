"use client";
import {useEffect,useState} from "react";
type Course={id:string;slug:string;titleEn:string;priceEgp:number;published:boolean;_count:{enrollments:number}};
type Lesson={titleEn:string;titleAr:string;videoUrl:string;durationSeconds:number;isFreePreview:boolean};
type Module={titleEn:string;titleAr:string;lessons:Lesson[]};
const blankLesson=():Lesson=>({titleEn:"New lesson",titleAr:"",videoUrl:"",durationSeconds:600,isFreePreview:false});
export default function AdminCourseManager(){
 const[courses,setCourses]=useState<Course[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const[title,setTitle]=useState(""),[slug,setSlug]=useState(""),[titleAr,setTitleAr]=useState(""),[subtitle,setSubtitle]=useState(""),[subtitleAr,setSubtitleAr]=useState(""),[description,setDescription]=useState(""),[descriptionAr,setDescriptionAr]=useState(""),[thumbnail,setThumbnail]=useState("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"),[price,setPrice]=useState("1500"),[level,setLevel]=useState("All levels"),[category,setCategory]=useState("Course"),[featured,setFeatured]=useState(false),[published,setPublished]=useState(false),[modules,setModules]=useState<Module[]>([{titleEn:"Module 1",titleAr:"",lessons:[{...blankLesson(),titleEn:"Introduction",isFreePreview:true}]}]);
 async function load(){const r=await fetch("/api/admin/courses");const d=await r.json();if(!r.ok)throw Error(d.error||"Unable to load courses");setCourses(d);}
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);
 function changeSlug(v:string){setSlug(v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))}
 function updateModule(i:number,field:"titleEn"|"titleAr",value:string){setModules(a=>a.map((m,j)=>i===j?{...m,[field]:value}:m))}
 function updateLesson(i:number,j:number,field:keyof Lesson,value:string|boolean|number){setModules(a=>a.map((m,k)=>k!==i?m:{...m,lessons:m.lessons.map((l,n)=>n===j?{...l,[field]:value}:l)}))}
 async function create(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");setNotice("");try{const r=await fetch("/api/admin/courses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug,titleEn:title,titleAr,subtitleEn:subtitle,subtitleAr,descriptionEn:description,descriptionAr,thumbnailUrl:thumbnail,priceEgp:Number(price),level,category,isFeatured:featured,published,modules})});const d=await r.json();if(!r.ok)throw Error(d.error||"Course creation failed.");setNotice("Course created: "+d.slug);setTitle("");setSlug("");setTitleAr("");setSubtitle("");setSubtitleAr("");setDescription("");setDescriptionAr("");await load();}catch(e){setError(e instanceof Error?e.message:"Could not create course.");}finally{setBusy(false)}}
 async function publish(c:Course){setError("");try{const r=await fetch("/api/admin/courses/"+c.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published:!c.published})});const d=await r.json();if(!r.ok)throw Error(d.error);await load();}catch(e){setError(e instanceof Error?e.message:"Could not update course.");}}
 const inputStyle={marginTop:6,marginBottom:13};
 return <section style={{display:"grid",gap:18,marginTop:28}}>
  <div className="card" style={{padding:22}}><h2 style={{fontSize:23}}>Course catalog management</h2><p className="muted" style={{fontSize:13}}>Create a course with bilingual copy and a structured module/lesson outline. Add real lesson content and video links before publishing.</p>
   {error&&<p role="alert" style={{color:"#fca5a5"}}>{error}</p>}{notice&&<p role="status" style={{color:"#86efac"}}>{notice}</p>}
   <form onSubmit={create}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
     <label className="muted">Course title (English)<input className="field" style={inputStyle} value={title} onChange={e=>{setTitle(e.target.value);if(!slug||slug===title.toLowerCase().replace(/[^a-z0-9]+/g,"-"))changeSlug(e.target.value)}} required/></label>
     <label className="muted">Course title (Arabic)<input className="field" style={inputStyle} value={titleAr} onChange={e=>setTitleAr(e.target.value)}/></label>
     <label className="muted">URL slug<input className="field" style={inputStyle} value={slug} onChange={e=>changeSlug(e.target.value)} required/></label>
     <label className="muted">Price (EGP)<input className="field" style={inputStyle} type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} required/></label>
     <label className="muted">Subtitle (English)<input className="field" style={inputStyle} value={subtitle} onChange={e=>setSubtitle(e.target.value)}/></label>
     <label className="muted">Subtitle (Arabic)<input className="field" style={inputStyle} value={subtitleAr} onChange={e=>setSubtitleAr(e.target.value)}/></label>
     <label className="muted">Level<input className="field" style={inputStyle} value={level} onChange={e=>setLevel(e.target.value)}/></label>
     <label className="muted">Category<input className="field" style={inputStyle} value={category} onChange={e=>setCategory(e.target.value)}/></label>
    </div>
    <label className="muted">Description (English)<textarea className="field" style={inputStyle} rows={3} value={description} onChange={e=>setDescription(e.target.value)} required/></label>
    <label className="muted">Description (Arabic)<textarea className="field" style={inputStyle} rows={3} value={descriptionAr} onChange={e=>setDescriptionAr(e.target.value)}/></label>
    <label className="muted">Thumbnail image URL<input className="field" style={inputStyle} type="url" value={thumbnail} onChange={e=>setThumbnail(e.target.value)} required/></label>
    <div style={{display:"flex",gap:18,flexWrap:"wrap",margin:"5px 0 20px"}}><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)}/> Featured</label><label><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish immediately</label></div>
    <h3 style={{fontSize:18,marginBottom:12}}>Curriculum</h3>
    {modules.map((m,i)=><div key={i} className="glass" style={{padding:15,borderRadius:12,marginBottom:12}}>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}><label className="muted">Module title<input className="field" style={inputStyle} value={m.titleEn} onChange={e=>updateModule(i,"titleEn",e.target.value)} required/></label><label className="muted">Module title (Arabic)<input className="field" style={inputStyle} value={m.titleAr} onChange={e=>updateModule(i,"titleAr",e.target.value)}/></label></div>
     {m.lessons.map((l,j)=><div key={j} style={{padding:12,borderTop:"1px solid rgba(255,255,255,.08)",marginTop:8}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}><label className="muted">Lesson title<input className="field" style={inputStyle} value={l.titleEn} onChange={e=>updateLesson(i,j,"titleEn",e.target.value)} required/></label><label className="muted">Arabic title<input className="field" style={inputStyle} value={l.titleAr} onChange={e=>updateLesson(i,j,"titleAr",e.target.value)}/></label><label className="muted">Video URL<input className="field" style={inputStyle} type="url" value={l.videoUrl} onChange={e=>updateLesson(i,j,"videoUrl",e.target.value)}/></label><label className="muted">Duration (seconds)<input className="field" style={inputStyle} type="number" min="0" value={l.durationSeconds} onChange={e=>updateLesson(i,j,"durationSeconds",Number(e.target.value))}/></label></div>
      <label style={{fontSize:13}}><input type="checkbox" checked={l.isFreePreview} onChange={e=>updateLesson(i,j,"isFreePreview",e.target.checked)}/> Free preview</label>
      <button type="button" className="muted" style={{display:"block",background:"none",border:0,padding:"7px 0",cursor:"pointer"}} onClick={()=>setModules(a=>a.map((x,k)=>k===i?{...x,lessons:x.lessons.filter((_,n)=>n!==j)}:x))} disabled={m.lessons.length===1}>Remove lesson</button>
     </div>)}
     <button type="button" className="btn btn-secondary" onClick={()=>setModules(a=>a.map((x,k)=>k===i?{...x,lessons:[...x.lessons,blankLesson()]}:x))}>+ Add lesson</button>
     <button type="button" className="muted" style={{marginLeft:12,background:"none",border:0,cursor:"pointer"}} onClick={()=>setModules(a=>a.filter((_,k)=>k!==i))} disabled={modules.length===1}>Remove module</button>
    </div>)}
    <button type="button" className="btn btn-secondary" onClick={()=>setModules(a=>[...a,{titleEn:"New module",titleAr:"",lessons:[blankLesson()]}])}>+ Add module</button>
    <div style={{marginTop:20}}><button className="btn btn-primary" disabled={busy||!modules.length||modules.some(m=>!m.lessons.length)} style={{border:0,cursor:"pointer"}}>{busy?"Creating…":"Create course"}</button></div>
   </form>
  </div>
  <div className="card" style={{padding:22}}><h2 style={{fontSize:22,marginBottom:14}}>Existing courses</h2>{courses.length===0?<p className="muted">No courses yet.</p>:courses.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,padding:"13px 0",borderTop:"1px solid rgba(255,255,255,.08)"}}><div><b>{c.titleEn}</b><div className="muted" style={{fontSize:12,marginTop:4}}>{c.slug} · {c.priceEgp.toLocaleString()} EGP · {c._count.enrollments} enrollments</div></div><button type="button" className="btn btn-secondary" onClick={()=>publish(c)}>{c.published?"Unpublish":"Publish"}</button></div>)}</div>
 </section>;
}
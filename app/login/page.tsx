"use client";
import {FormEvent,useState} from "react";
import {signIn} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Eye,EyeOff,GraduationCap,Leaf,LockKeyhole,Sparkles} from "lucide-react";

export default function Login(){
 const[mode,setMode]=useState<"login"|"register">("login");
 const[error,setError]=useState("");
 const[busy,setBusy]=useState(false);
 const[showPassword,setShowPassword]=useState(false);
 const router=useRouter();
 function ensureDeviceCookie(){
  if(document.cookie.split(";").some(x=>x.trim().startsWith("academy_device_id=")))return;
  const id=crypto.randomUUID();
  document.cookie="academy_device_id="+id+"; Path=/; Max-Age=1209600; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");
 }
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");
  const f=new FormData(e.currentTarget),name=String(f.get("name")||""),email=String(f.get("email")||""),password=String(f.get("password")||""),phone=String(f.get("phone")||"");
  try{
   if(mode==="register"){
    const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password,phone})});
    const d=await r.json();if(!r.ok)throw Error(d.error||"Registration failed.");
   }
   ensureDeviceCookie();
   const result=await signIn("credentials",{email,password,redirect:false});
   if(result?.error)throw Error("Email or password is incorrect, or your account already has two active devices. Sign out elsewhere or revoke an old session.");
   router.push("/dashboard");router.refresh();
  }catch(x){setError(x instanceof Error?x.message:"Something went wrong.");}
  finally{setBusy(false);}
 }
 return <main style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"minmax(0,1.05fr) minmax(420px,.95fr)",background:"#f5faf6"}}>
  <section style={{position:"relative",overflow:"hidden",padding:"34px clamp(24px,6vw,84px)",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"linear-gradient(145deg,#eaf7ee 0%,#f5fbf6 52%,#e1f2e6 100%)"}}>
   <div style={{position:"absolute",width:470,height:470,borderRadius:"50%",border:"1px solid rgba(37,134,83,.12)",right:-180,top:-150}}/>
   <div style={{position:"absolute",width:330,height:330,borderRadius:"50%",border:"1px solid rgba(37,134,83,.12)",right:-110,top:-80}}/>
   <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:11,fontWeight:900,letterSpacing:"-.02em",zIndex:1}}>
    <span style={{width:44,height:44,borderRadius:14,display:"grid",placeItems:"center",background:"#218653",color:"#fff",boxShadow:"0 8px 20px rgba(33,134,83,.2)"}}><GraduationCap size={24}/></span>
    <span style={{lineHeight:1.2}}>MRS. SHAIMAA<br/><small style={{fontSize:10,letterSpacing:".16em",color:"#258653"}}>SAT ENGLISH ACADEMY</small></span>
   </Link>
   <div style={{position:"relative",zIndex:1,maxWidth:570,margin:"70px auto"}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:30,background:"#fff",border:"1px solid #dceee1",color:"#258653",fontSize:11,fontWeight:800,letterSpacing:".12em"}}><Sparkles size={14}/> YOUR SAT JOURNEY STARTS HERE</div>
    <h1 style={{fontSize:"clamp(42px,5.5vw,68px)",lineHeight:1.04,letterSpacing:"-.055em",margin:"25px 0 18px",color:"#173d2c"}}>A clearer path to a <span style={{color:"#258653"}}>stronger score.</span></h1>
    <p style={{fontSize:17,lineHeight:1.85,color:"#668174",maxWidth:480}}>Build confidence in SAT Reading & Writing with focused lessons, structured practice and a learning plan that moves with you.</p>
    <div style={{display:"grid",gap:13,marginTop:34}}>
     {["Structured SAT English lessons","Learn at your own pace","Track your learning progress"].map((item)=><div key={item} style={{display:"flex",alignItems:"center",gap:12,color:"#315d46",fontSize:14,fontWeight:600}}><span style={{width:25,height:25,borderRadius:9,background:"#d7efdf",display:"grid",placeItems:"center",color:"#218653"}}><CheckCircle2 size={15}/></span>{item}</div>)}
    </div>
   </div>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,color:"#7c9988",fontSize:12,zIndex:1}}><span>© {new Date().getFullYear()} SAT English Academy</span><span style={{display:"inline-flex",alignItems:"center",gap:6}}><LockKeyhole size={13}/> Secure student portal</span></div>
  </section>
  <section style={{display:"grid",placeItems:"center",padding:"34px 22px",background:"#fff"}}>
   <div style={{width:"min(100%,430px)"}}>
    <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:7,color:"#789184",fontSize:13,marginBottom:38}}><ArrowLeft size={15}/> Back to academy</Link>
    <div style={{display:"flex",alignItems:"center",gap:9,color:"#258653",fontWeight:800,fontSize:12,letterSpacing:".13em"}}><Leaf size={16}/> STUDENT PORTAL</div>
    <h2 style={{fontSize:36,letterSpacing:"-.04em",color:"#183b2d",margin:"14px 0 8px"}}>{mode==="login"?"Welcome back!":"Create your account"}</h2>
    <p style={{color:"#789184",fontSize:14,lineHeight:1.7,marginBottom:28}}>{mode==="login"?"Sign in to continue learning and pick up where you left off.":"Join the academy and start building your SAT English skills."}</p>
    <form onSubmit={submit}>
     {mode==="register"&&<><label style={labelStyle}>Full name</label><input className="field" name="name" required minLength={2} placeholder="Your full name" style={{margin:"8px 0 17px"}}/><label style={labelStyle}>Phone number <span style={{color:"#9ab0a1",fontWeight:400}}>(optional)</span></label><input className="field" name="phone" placeholder="+20" style={{margin:"8px 0 17px"}}/></>}
     <label style={labelStyle}>Email address</label><input className="field" name="email" type="email" required autoComplete="email" placeholder="name@example.com" style={{margin:"8px 0 18px"}}/>
     <label style={labelStyle}>Password</label>
     <div style={{position:"relative",marginTop:8,marginBottom:18}}><input className="field" name="password" type={showPassword?"text":"password"} required minLength={8} autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Enter your password" style={{paddingRight:48}}/><button type="button" aria-label={showPassword?"Hide password":"Show password"} onClick={()=>setShowPassword(!showPassword)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",border:0,background:"transparent",color:"#789184",cursor:"pointer"}}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
     {error&&<p role="alert" style={{background:"#fff1f0",border:"1px solid #ffd9d5",borderRadius:10,padding:12,color:"#b42318",fontSize:13,lineHeight:1.5,marginBottom:15}}>{error}</p>}
     <button className="btn btn-primary" disabled={busy} style={{width:"100%",border:0,cursor:busy?"wait":"pointer",padding:15,justifyContent:"center"}}>{busy?"Please wait…":mode==="login"?"Sign in to your account":"Create account"} <ArrowRight size={17}/></button>
    </form>
    <div style={{display:"flex",alignItems:"center",gap:14,margin:"25px 0",color:"#9ab0a1",fontSize:12}}><span style={{height:1,background:"#e7f0e9",flex:1}}/>YOUR LEARNING JOURNEY<span style={{height:1,background:"#e7f0e9",flex:1}}/></div>
    <p style={{textAlign:"center",fontSize:14,color:"#789184"}}>{mode==="login"?"New to the academy?":"Already have an account?"} <button type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("")}} style={{background:"none",border:0,color:"#218653",fontWeight:800,cursor:"pointer"}}>{mode==="login"?"Create an account":"Sign in"}</button></p>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:7,color:"#9ab0a1",fontSize:11,marginTop:38}}><BookOpen size={14}/> Lessons • Practice • Progress</div>
   </div>
  </section>
  <style jsx>{`@media(max-width:800px){main{grid-template-columns:1fr!important}main>section:first-child{min-height:430px;padding:26px 24px 30px!important}main>section:first-child>div:nth-of-type(2){margin:46px auto!important}main>section:last-child{padding:28px 22px 42px!important}main>section:last-child>div{max-width:460px}}`}</style>
 </main>;
}
const labelStyle:React.CSSProperties={display:"block",fontSize:13,fontWeight:700,color:"#315d46"};

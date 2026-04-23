import React, { useState, useRef, useCallback } from 'react';
import {
  ChevronRight, ChevronLeft, Download, Sparkles,
  Plus, X, User, FileText, Briefcase, GraduationCap,
  Award, Palette, Star, Trash2, Check, Camera, Save, LayoutTemplate
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/* ── Types ─────────────────────────────────────────────────────────────── */
interface WorkExp { id:string; company:string; role:string; location:string; start:string; end:string; current:boolean; description:string; }
interface Education { id:string; institution:string; degree:string; field:string; start:string; end:string; gpa:string; honors:string; }
interface Cert { id:string; name:string; issuer:string; date:string; }
interface Lang { id:string; name:string; level:string; }
interface CVData { fullName:string; title:string; email:string; phone:string; location:string; linkedin:string; github:string; summary:string; skills:string[]; photo:string; }
type Template = 'classic'|'modern'|'minimal';

const uid = () => Math.random().toString(36).slice(2,9);
const ACCENTS = ['#2563EB','#0D9488','#7C3AED','#DC2626','#D97706','#059669'];
const STEPS = [
  {id:'personal', label:'Personal', icon:User},
  {id:'summary',  label:'Summary',  icon:FileText},
  {id:'skills',   label:'Skills',   icon:Star},
  {id:'work',     label:'Experience',icon:Briefcase},
  {id:'education',label:'Education', icon:GraduationCap},
  {id:'extras',   label:'Extras',    icon:Award},
  {id:'design',   label:'Design',    icon:Palette},
];
const SKILL_SUGGESTIONS = ['Python','JavaScript','TypeScript','React','Node.js','Django','SQL','Git','Docker','AWS','Machine Learning','Data Analysis','Communication','Leadership','Agile','Java','C++','PHP','Vue.js','Figma'];
const LANG_LEVELS = ['Native','Fluent','Advanced','Intermediate','Basic'];

/* ── Helper sub-components ──────────────────────────────────────────────── */
const Label:React.FC<{children:React.ReactNode}> = ({children}) => (
  <label style={{display:'block',fontSize:'0.75rem',fontWeight:600,color:'#CBD5E1',marginBottom:'0.3rem',letterSpacing:'0.01em'}}>{children}</label>
);
const Field:React.FC<React.InputHTMLAttributes<HTMLInputElement>&{label?:string}> = ({label,...props}) => (
  <div>
    {label && <Label>{label}</Label>}
    <input {...props} style={{width:'100%',padding:'0.55rem 0.75rem',background:'#263348',border:'1.5px solid rgba(148,163,184,0.25)',borderRadius:8,fontSize:'0.85rem',color:'#F1F5F9',fontFamily:'inherit',outline:'none',...props.style}}
      onFocus={e=>{e.target.style.borderColor='#60A5FA';e.target.style.boxShadow='0 0 0 3px rgba(96,165,250,0.15)';}}
      onBlur={e=>{e.target.style.borderColor='rgba(148,163,184,0.25)';e.target.style.boxShadow='none';}}/>
  </div>
);
const TextArea:React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>&{label?:string}> = ({label,...props}) => (
  <div>
    {label && <Label>{label}</Label>}
    <textarea {...props} style={{width:'100%',padding:'0.55rem 0.75rem',background:'#263348',border:'1.5px solid rgba(148,163,184,0.25)',borderRadius:8,fontSize:'0.85rem',color:'#F1F5F9',fontFamily:'inherit',outline:'none',resize:'vertical',...props.style}}
      onFocus={e=>{e.target.style.borderColor='#60A5FA';}}
      onBlur={e=>{e.target.style.borderColor='rgba(148,163,184,0.25)';}}/>
  </div>
);
const CardBlock:React.FC<{children:React.ReactNode;style?:React.CSSProperties}> = ({children,style}) => (
  <div style={{background:'#1E293B',border:'1px solid rgba(148,163,184,0.12)',borderRadius:12,padding:'1rem',...style}}>{children}</div>
);
const SectionTitle:React.FC<{children:React.ReactNode}> = ({children}) => (
  <h3 style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#60A5FA',marginBottom:'0.75rem'}}>{children}</h3>
);

/* ── Main CVBuilder Component ───────────────────────────────────────────── */
const CVBuilder:React.FC = () => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  // ── State ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [mobileTab, setMobileTab] = useState<'edit'|'preview'>('edit');
  const [template, setTemplate] = useState<Template>('classic');
  const [accent, setAccent] = useState('#2563EB');
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [cv, setCv] = useState<CVData>({
    fullName: user?.fullName || '', title: '', email: user?.email || '',
    phone: '', location: '', linkedin: '', github: '', website: '',
    summary: '', skills: [], photo: '',
  });
  const [work, setWork] = useState<WorkExp[]>([
    {id:uid(),company:'',role:'',location:'',start:'',end:'',current:false,description:''}
  ]);
  const [edu, setEdu] = useState<Education[]>([
    {id:uid(),institution:'',degree:'',field:'',start:'',end:'',gpa:'',honors:''}
  ]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [langs, setLangs] = useState<Lang[]>([{id:uid(),name:'',level:''}]);

  // ── Auto-save to localStorage ──────────────────────────────────────────
  const save = useCallback(() => {
    localStorage.setItem('gc_cv', JSON.stringify({cv,work,edu,certs,langs,template,accent}));
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  },[cv,work,edu,certs,langs,template,accent]);

  // Load saved data on mount
  React.useEffect(()=>{
    const saved = localStorage.getItem('gc_cv');
    if(saved){
      try{
        const d = JSON.parse(saved);
        if(d.cv) setCv(d.cv);
        if(d.work) setWork(d.work);
        if(d.edu) setEdu(d.edu);
        if(d.certs) setCerts(d.certs);
        if(d.langs) setLangs(d.langs);
        if(d.template) setTemplate(d.template);
        if(d.accent) setAccent(d.accent);
      }catch{}
    }
  },[]);

  // ── CV field helpers ───────────────────────────────────────────────────
  const setCvField = (k:keyof CVData, v:string) => setCv(p=>({...p,[k]:v}));

  const addSkill = (s:string) => {
    const trimmed = s.trim();
    if(trimmed && !cv.skills.includes(trimmed)){
      setCv(p=>({...p,skills:[...p.skills,trimmed]}));
    }
    setSkillInput('');
  };
  const removeSkill = (s:string) => setCv(p=>({...p,skills:p.skills.filter(x=>x!==s)}));

  const handlePhoto = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCvField('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Work helpers ───────────────────────────────────────────────────────
  const addWork = () => setWork(p=>[...p,{id:uid(),company:'',role:'',location:'',start:'',end:'',current:false,description:''}]);
  const removeWork = (id:string) => setWork(p=>p.filter(e=>e.id!==id));
  const setWorkField = (id:string,k:keyof WorkExp,v:any) => setWork(p=>p.map(e=>e.id===id?{...e,[k]:v}:e));

  // ── Education helpers ──────────────────────────────────────────────────
  const addEdu = () => setEdu(p=>[...p,{id:uid(),institution:'',degree:'',field:'',start:'',end:'',gpa:'',honors:''}]);
  const removeEdu = (id:string) => setEdu(p=>p.filter(e=>e.id!==id));
  const setEduField = (id:string,k:keyof Education,v:string) => setEdu(p=>p.map(e=>e.id===id?{...e,[k]:v}:e));

  // ── Cert helpers ───────────────────────────────────────────────────────
  const addCert = () => setCerts(p=>[...p,{id:uid(),name:'',issuer:'',date:'',url:''}]);
  const removeCert = (id:string) => setCerts(p=>p.filter(c=>c.id!==id));
  const setCertField = (id:string,k:keyof Cert,v:string) => setCerts(p=>p.map(c=>c.id===id?{...c,[k]:v}:c));

  // ── Lang helpers ───────────────────────────────────────────────────────
  const addLang = () => setLangs(p=>[...p,{id:uid(),name:'',level:''}]);
  const removeLang = (id:string) => setLangs(p=>p.filter(l=>l.id!==id));
  const setLangField = (id:string,k:keyof Lang,v:string) => setLangs(p=>p.map(l=>l.id===id?{...l,[k]:v}:l));

  // ── AI Summary Generator ───────────────────────────────────────────────
  const generateSummary = () => {
    setGenerating(true);
    setTimeout(()=>{
      const skills = cv.skills.slice(0,4).join(', ') || 'various technical areas';
      const latestEdu = edu.find(e=>e.institution);
      const latestWork = work.find(e=>e.company);
      const summary = `${latestEdu?.degree||'Graduate'} in ${latestEdu?.field||'a relevant field'} from ${latestEdu?.institution||'university'}, with strong expertise in ${skills}. ${latestWork?.role?`Previously served as ${latestWork.role} at ${latestWork.company}, gaining valuable industry experience. `:''}Passionate about delivering high-quality solutions and continuously growing professionally. Seeking opportunities to contribute meaningfully to innovative teams and challenging projects.`;
      setCvField('summary', summary);
      setGenerating(false);
    },1400);
  };

  // ── Export ─────────────────────────────────────────────────────────────
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const captureCanvas = async () => {
    const element = printRef.current;
    if (!element) throw new Error('No element');
    const html2canvas = (await import('html2canvas')).default;
    const orig = { transform: element.style.transform, width: element.style.width };
    element.style.transform = 'none';
    element.style.width = '794px';
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    element.style.transform = orig.transform;
    element.style.width = orig.width;
    return canvas;
  };

  const exportAs = async (format: 'pdf' | 'jpeg' | 'docx') => {
    setShowExportMenu(false);
    setExporting(true);
    const name = cv.fullName || 'CV';
    try {
      if (format === 'jpeg') {
        const canvas = await captureCanvas();
        const link = document.createElement('a');
        link.download = `${name}_Resume.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      } else if (format === 'pdf') {
        const canvas = await captureCanvas();
        const { default: JsPDF } = await import('jspdf');
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const w = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, 'JPEG', 0, 0, w, (canvas.height * w) / canvas.width);
        pdf.save(`${name}_Resume.pdf`);
      } else if (format === 'docx') {
        // HTML-based Word document — opens in MS Word
        const content = printRef.current?.innerHTML || '';
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${name} Resume</title></head><body>${content}</body></html>`;
        const blob = new Blob([html], { type: 'application/msword' });
        const link = document.createElement('a');
        link.download = `${name}_Resume.doc`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // ── Completion percentage ──────────────────────────────────────────────
  const completion = Math.round((
    (cv.fullName?1:0)+(cv.email?1:0)+(cv.phone?1:0)+(cv.summary?1:0)+
    (cv.skills.length>0?1:0)+(work.some(e=>e.company)?1:0)+(edu.some(e=>e.institution)?1:0)
  )/7*100);

  // ── CV Preview renderer ────────────────────────────────────────────────
  const Preview = () => {
    const props = {cv,work,edu,certs,langs,accent};
    if(template==='modern') return <ModernCV {...props}/>;
    if(template==='minimal') return <MinimalCV {...props}/>;
    return <ClassicCV {...props}/>;
  };

  // ── Step form content ──────────────────────────────────────────────────
  const renderStep = () => {
    switch(STEPS[step].id){
      case 'personal': return (
        <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
          <SectionTitle>Personal Information</SectionTitle>
          {/* Photo upload */}
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'#263348',border:'2px dashed rgba(148,163,184,0.3)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
              {cv.photo ? <img src={cv.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <User size={24} style={{color:'#64748B'}}/>}
            </div>
            <label style={{cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.5rem 1rem',background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',borderRadius:8,fontSize:'0.8rem',color:'#60A5FA',fontWeight:600}}>
              <Camera size={14}/> Upload Photo
              <input type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
            </label>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
            <Field label="Full Name *" value={cv.fullName} onChange={e=>setCvField('fullName',e.target.value)} placeholder="Emmanuel Cho Tepi"/>
            <Field label="Professional Title" value={cv.title} onChange={e=>setCvField('title',e.target.value)} placeholder="Software Engineer"/>
            <Field label="Email *" type="email" value={cv.email} onChange={e=>setCvField('email',e.target.value)} placeholder="you@example.com"/>
            <Field label="Phone" value={cv.phone} onChange={e=>setCvField('phone',e.target.value)} placeholder="+237 6XX XXX XXX"/>
            <Field label="Location" value={cv.location} onChange={e=>setCvField('location',e.target.value)} placeholder="Yaoundé, Cameroon"/>
            <Field label="Website" value={cv.website} onChange={e=>setCvField('website',e.target.value)} placeholder="yoursite.com"/>
            <Field label="LinkedIn" value={cv.linkedin} onChange={e=>setCvField('linkedin',e.target.value)} placeholder="linkedin.com/in/you"/>
            <Field label="GitHub" value={cv.github} onChange={e=>setCvField('github',e.target.value)} placeholder="github.com/you"/>
          </div>
        </div>
      );

      case 'summary': return (
        <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <SectionTitle>Professional Summary</SectionTitle>
            <button onClick={generateSummary} disabled={generating} style={{display:'flex',alignItems:'center',gap:'0.375rem',padding:'0.4rem 0.875rem',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:8,color:'#FCD34D',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}>
              <Sparkles size={13}/>{generating?'Generating…':'AI Generate'}
            </button>
          </div>
          <TextArea label="Summary" value={cv.summary} onChange={e=>setCvField('summary',e.target.value)} rows={6} placeholder="Write a compelling 3-4 sentence summary of your professional background, key skills, and career goals…"/>
          <p style={{fontSize:'0.72rem',color:'#64748B'}}>Tip: Keep it to 3–4 sentences. Focus on your top skills and what you bring to employers.</p>
        </div>
      );

      case 'skills': return (
        <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
          <SectionTitle>Skills</SectionTitle>
          {/* Skill input */}
          <div style={{display:'flex',gap:'0.5rem'}}>
            <input value={skillInput} onChange={e=>setSkillInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();addSkill(skillInput);}}}
              placeholder="Type a skill and press Enter…"
              style={{flex:1,padding:'0.55rem 0.75rem',background:'#263348',border:'1.5px solid rgba(148,163,184,0.25)',borderRadius:8,fontSize:'0.85rem',color:'#F1F5F9',fontFamily:'inherit',outline:'none'}}/>
            <button onClick={()=>addSkill(skillInput)} style={{padding:'0.55rem 0.875rem',background:'#2563EB',border:'none',borderRadius:8,color:'#fff',fontWeight:600,cursor:'pointer',fontSize:'0.85rem'}}>Add</button>
          </div>
          {/* Current skills */}
          {cv.skills.length>0 && (
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
              {cv.skills.map(s=>(
                <span key={s} style={{display:'flex',alignItems:'center',gap:'0.35rem',padding:'0.3rem 0.75rem',background:'rgba(37,99,235,0.15)',border:'1px solid rgba(37,99,235,0.3)',borderRadius:99,fontSize:'0.8rem',color:'#93C5FD',fontWeight:600}}>
                  {s}<button onClick={()=>removeSkill(s)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',padding:0,display:'flex',alignItems:'center'}}><X size={12}/></button>
                </span>
              ))}
            </div>
          )}
          {/* Suggestions */}
          <div>
            <p style={{fontSize:'0.72rem',color:'#64748B',marginBottom:'0.5rem'}}>Suggestions — click to add:</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>
              {SKILL_SUGGESTIONS.filter(s=>!cv.skills.includes(s)).map(s=>(
                <button key={s} onClick={()=>addSkill(s)} style={{padding:'0.2rem 0.6rem',background:'#263348',border:'1px solid rgba(148,163,184,0.2)',borderRadius:99,fontSize:'0.75rem',color:'#94A3B8',cursor:'pointer'}}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      );

      case 'work': return (
        <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <SectionTitle>Work Experience</SectionTitle>
            <button onClick={addWork} style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.35rem 0.75rem',background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',borderRadius:8,color:'#60A5FA',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}><Plus size={13}/>Add</button>
          </div>
          {work.map((e,i)=>(
            <CardBlock key={e.id}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.75rem',color:'#64748B',fontWeight:600}}>Position {i+1}</span>
                {work.length>1 && <button onClick={()=>removeWork(e.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',display:'flex',alignItems:'center'}}><Trash2 size={14}/></button>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.625rem'}}>
                <Field label="Job Title" value={e.role} onChange={ev=>setWorkField(e.id,'role',ev.target.value)} placeholder="Software Engineer"/>
                <Field label="Company" value={e.company} onChange={ev=>setWorkField(e.id,'company',ev.target.value)} placeholder="TechCorp"/>
                <Field label="Location" value={e.location} onChange={ev=>setWorkField(e.id,'location',ev.target.value)} placeholder="Yaoundé"/>
                <div/>
                <Field label="Start Date" type="month" value={e.start} onChange={ev=>setWorkField(e.id,'start',ev.target.value)}/>
                <Field label="End Date" type="month" value={e.end} onChange={ev=>setWorkField(e.id,'end',ev.target.value)} disabled={e.current}/>
              </div>
              <label style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem',fontSize:'0.78rem',color:'#BAC8D3',cursor:'pointer'}}>
                <input type="checkbox" checked={e.current} onChange={ev=>setWorkField(e.id,'current',ev.target.checked)} style={{accentColor:'#60A5FA'}}/>
                Currently working here
              </label>
              <div style={{marginTop:'0.625rem'}}>
                <TextArea label="Key Responsibilities & Achievements" value={e.description} onChange={ev=>setWorkField(e.id,'description',ev.target.value)} rows={3} placeholder="• Led development of…&#10;• Increased performance by…&#10;• Collaborated with…"/>
              </div>
            </CardBlock>
          ))}
        </div>
      );

      case 'education': return (
        <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <SectionTitle>Education</SectionTitle>
            <button onClick={addEdu} style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.35rem 0.75rem',background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',borderRadius:8,color:'#60A5FA',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}><Plus size={13}/>Add</button>
          </div>
          {edu.map((e,i)=>(
            <CardBlock key={e.id}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.75rem',color:'#64748B',fontWeight:600}}>Education {i+1}</span>
                {edu.length>1 && <button onClick={()=>removeEdu(e.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',display:'flex',alignItems:'center'}}><Trash2 size={14}/></button>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.625rem'}}>
                <Field label="Institution" value={e.institution} onChange={ev=>setEduField(e.id,'institution',ev.target.value)} placeholder="University of Yaoundé I" style={{gridColumn:'1/-1'}}/>
                <Field label="Degree" value={e.degree} onChange={ev=>setEduField(e.id,'degree',ev.target.value)} placeholder="Bachelor"/>
                <Field label="Field of Study" value={e.field} onChange={ev=>setEduField(e.id,'field',ev.target.value)} placeholder="Computer Science"/>
                <Field label="Start Year" type="number" value={e.start} onChange={ev=>setEduField(e.id,'start',ev.target.value)} placeholder="2020"/>
                <Field label="End Year" type="number" value={e.end} onChange={ev=>setEduField(e.id,'end',ev.target.value)} placeholder="2024"/>
                <Field label="GPA" value={e.gpa} onChange={ev=>setEduField(e.id,'gpa',ev.target.value)} placeholder="3.8"/>
                <Field label="Honors / Awards" value={e.honors} onChange={ev=>setEduField(e.id,'honors',ev.target.value)} placeholder="Cum Laude"/>
              </div>
            </CardBlock>
          ))}
        </div>
      );

      case 'extras': return (
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
          {/* Certifications */}
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem'}}>
              <SectionTitle>Certifications</SectionTitle>
              <button onClick={addCert} style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.35rem 0.75rem',background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',borderRadius:8,color:'#60A5FA',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}><Plus size={13}/>Add</button>
            </div>
            {certs.length===0 && <p style={{fontSize:'0.8rem',color:'#64748B'}}>No certifications added yet.</p>}
            {certs.map(c=>(
              <CardBlock key={c.id} style={{marginBottom:'0.5rem'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'0.5rem',alignItems:'end'}}>
                  <Field label="Certification Name" value={c.name} onChange={e=>setCertField(c.id,'name',e.target.value)} placeholder="AWS Solutions Architect"/>
                  <Field label="Issuer" value={c.issuer} onChange={e=>setCertField(c.id,'issuer',e.target.value)} placeholder="Amazon"/>
                  <button onClick={()=>removeCert(c.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',padding:'0.5rem',display:'flex',alignItems:'center'}}><Trash2 size={14}/></button>
                </div>
                <div style={{marginTop:'0.5rem'}}>
                  <Field label="Date" type="month" value={c.date} onChange={e=>setCertField(c.id,'date',e.target.value)}/>
                </div>
              </CardBlock>
            ))}
          </div>
          {/* Languages */}
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem'}}>
              <SectionTitle>Languages</SectionTitle>
              <button onClick={addLang} style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.35rem 0.75rem',background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.25)',borderRadius:8,color:'#60A5FA',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}><Plus size={13}/>Add</button>
            </div>
            {langs.map(l=>(
              <div key={l.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'0.5rem',alignItems:'end',marginBottom:'0.5rem'}}>
                <Field label="Language" value={l.name} onChange={e=>setLangField(l.id,'name',e.target.value)} placeholder="English"/>
                <div>
                  <Label>Proficiency</Label>
                  <select value={l.level} onChange={e=>setLangField(l.id,'level',e.target.value)} style={{width:'100%',padding:'0.55rem 0.75rem',background:'#263348',border:'1.5px solid rgba(148,163,184,0.25)',borderRadius:8,fontSize:'0.85rem',color:'#F1F5F9',outline:'none'}}>
                    <option value="">Select…</option>
                    {LANG_LEVELS.map(lv=><option key={lv} value={lv}>{lv}</option>)}
                  </select>
                </div>
                {langs.length>1 && <button onClick={()=>removeLang(l.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',padding:'0.5rem',display:'flex',alignItems:'center'}}><Trash2 size={14}/></button>}
              </div>
            ))}
          </div>
        </div>
      );

      case 'design': return (
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
          <SectionTitle>Template</SectionTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
            {TEMPLATES.map(t=>(
              <button key={t.id} onClick={()=>setTemplate(t.id)} style={{padding:'0.875rem 0.5rem',background:template===t.id?'rgba(37,99,235,0.15)':'#263348',border:`1.5px solid ${template===t.id?'#60A5FA':'rgba(148,163,184,0.2)'}`,borderRadius:10,cursor:'pointer',textAlign:'center',transition:'all 150ms'}}>
                <div style={{fontSize:'0.85rem',fontWeight:700,color:template===t.id?'#93C5FD':'#E2E8F0',marginBottom:'0.2rem'}}>{t.name}</div>
                <div style={{fontSize:'0.7rem',color:'#64748B'}}>{t.desc}</div>
                {template===t.id && <Check size={14} style={{color:'#60A5FA',marginTop:'0.3rem'}}/>}
              </button>
            ))}
          </div>
          <div>
            <SectionTitle>Accent Color</SectionTitle>
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              {ACCENTS.map(c=>(
                <button key={c} onClick={()=>setAccent(c)} style={{width:36,height:36,borderRadius:'50%',background:c,border:accent===c?'3px solid #fff':'3px solid transparent',boxShadow:accent===c?`0 0 0 2px ${c}`:'none',cursor:'pointer',transition:'all 150ms'}}/>
              ))}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'1rem'}}>
      {/* ── App Header ─────────────────────────────────────────────────── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
          {/* App icon — document with pen, like a native app */}
          <div style={{
            width:48,height:48,borderRadius:14,
            background:'linear-gradient(145deg,#1D4ED8,#2563EB)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 4px 16px rgba(37,99,235,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            flexShrink:0,
          }}>
            {/* Custom CV icon — white document with lines */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
              <rect x="20" y="2" width="0" height="0"/>
              <path d="M7 7h6M7 10h6M7 13h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="5" fill="#1D4ED8" stroke="white" strokeWidth="1.5"/>
              <path d="M16.5 18.5l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{fontSize:'1.375rem',fontWeight:800,color:'#F8FAFC',letterSpacing:'-0.025em',margin:0,lineHeight:1.2}}>CV Builder</h1>
            <p style={{fontSize:'0.75rem',color:'#64748B',margin:'0.1rem 0 0',fontWeight:500}}>
              {cv.fullName ? `${cv.fullName}'s Resume` : 'Create your professional resume'}
            </p>
          </div>
        </div>

        <div style={{display:'flex',gap:'0.625rem',alignItems:'center'}}>
          {/* Mobile edit/preview toggle */}
          <div style={{display:'flex',background:'#263348',borderRadius:8,padding:2}} className="md:hidden">
            {(['edit','preview'] as const).map(t=>(
              <button key={t} onClick={()=>setMobileTab(t)} style={{padding:'0.4rem 0.875rem',borderRadius:6,background:mobileTab===t?'#1E293B':'transparent',border:'none',color:mobileTab===t?'#F1F5F9':'#64748B',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',textTransform:'capitalize'}}>{t}</button>
            ))}
          </div>

          {/* Save button */}
          <button onClick={save} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.5rem 0.875rem',background:saved?'rgba(16,185,129,0.12)':'rgba(148,163,184,0.08)',border:`1px solid ${saved?'rgba(16,185,129,0.3)':'rgba(148,163,184,0.18)'}`,borderRadius:8,color:saved?'#34D399':'#94A3B8',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',transition:'all 150ms'}}>
            {saved ? <><Check size={13}/>Saved</> : <><Save size={13}/>Save</>}
          </button>

          {/* Export dropdown */}
          <div style={{position:'relative'}}>
            <button onClick={()=>setShowExportMenu(p=>!p)} disabled={exporting}
              style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.5rem 1rem',background:exporting?'rgba(37,99,235,0.5)':'linear-gradient(135deg,#1D4ED8,#2563EB)',border:'none',borderRadius:8,color:'#fff',fontSize:'0.82rem',fontWeight:700,cursor:exporting?'not-allowed':'pointer',boxShadow:'0 4px 14px rgba(37,99,235,0.4)'}}>
              <Download size={14}/>{exporting?'Exporting…':'Export ▾'}
            </button>
            {showExportMenu && (
              <div style={{position:'absolute',right:0,top:'calc(100% + 6px)',background:'#1E293B',border:'1px solid rgba(148,163,184,0.2)',borderRadius:10,overflow:'hidden',zIndex:100,minWidth:150,boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>
                {([['pdf','📄 PDF'],['jpeg','🖼 JPEG'],['docx','📝 Word (.doc)']] as const).map(([fmt,label])=>(
                  <button key={fmt} onClick={()=>exportAs(fmt)}
                    style={{display:'block',width:'100%',padding:'0.65rem 1rem',background:'none',border:'none',color:'#E2E8F0',fontSize:'0.83rem',fontWeight:600,cursor:'pointer',textAlign:'left'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(96,165,250,0.1)'}
                    onMouseLeave={e=>e.currentTarget.style.background='none'}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{marginBottom:'1.25rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.4rem'}}>
          <span style={{fontSize:'0.72rem',color:'#64748B'}}>Profile completion</span>
          <span style={{fontSize:'0.72rem',fontWeight:700,color:completion>=80?'#34D399':completion>=50?'#F59E0B':'#94A3B8'}}>{completion}%</span>
        </div>
        <div style={{height:4,background:'rgba(148,163,184,0.15)',borderRadius:99}}>
          <div style={{height:'100%',width:`${completion}%`,background:`linear-gradient(90deg,#2563EB,${completion>=80?'#34D399':'#60A5FA'})`,borderRadius:99,transition:'width 400ms ease'}}/>
        </div>
      </div>

      {/* Step tabs */}
      <div style={{display:'flex',gap:'0.25rem',marginBottom:'1.25rem',overflowX:'auto',paddingBottom:'0.25rem'}}>
        {STEPS.map((s,i)=>{
          const Icon = s.icon;
          const active = i===step;
          const done = i<step;
          return (
            <button key={s.id} onClick={()=>setStep(i)} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.5rem 0.875rem',borderRadius:8,border:`1px solid ${active?'#60A5FA':done?'rgba(52,211,153,0.3)':'rgba(148,163,184,0.15)'}`,background:active?'rgba(37,99,235,0.15)':done?'rgba(52,211,153,0.08)':'transparent',color:active?'#93C5FD':done?'#34D399':'#64748B',fontSize:'0.78rem',fontWeight:active?700:500,cursor:'pointer',whiteSpace:'nowrap',transition:'all 150ms'}}>
              {done?<Check size={13}/>:<Icon size={13}/>}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main layout: editor + preview */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
        {/* Editor panel */}
        <div style={{display: (mobileTab==='edit'||window.innerWidth>=768)?'block':'none'}}>
          <div style={{background:'#1E293B',border:'1px solid rgba(148,163,184,0.12)',borderRadius:14,padding:'1.25rem',minHeight:400}}>
            {renderStep()}
          </div>
          {/* Step navigation */}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'0.875rem'}}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.55rem 1.125rem',background:'rgba(148,163,184,0.1)',border:'1px solid rgba(148,163,184,0.2)',borderRadius:8,color:step===0?'#374151':'#E2E8F0',fontSize:'0.85rem',fontWeight:600,cursor:step===0?'not-allowed':'pointer',opacity:step===0?0.4:1}}>
              <ChevronLeft size={15}/>Previous
            </button>
            <button onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))} disabled={step===STEPS.length-1} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.55rem 1.125rem',background:'linear-gradient(135deg,#2563EB,#60A5FA)',border:'none',borderRadius:8,color:'#fff',fontSize:'0.85rem',fontWeight:700,cursor:step===STEPS.length-1?'not-allowed':'pointer',opacity:step===STEPS.length-1?0.5:1}}>
              Next<ChevronRight size={15}/>
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div style={{display: (mobileTab==='preview'||window.innerWidth>=768)?'block':'none'}}>
          <div style={{position:'sticky',top:'5rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.625rem'}}>
              <span style={{fontSize:'0.72rem',fontWeight:600,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.06em'}}>Live Preview</span>
              <span style={{fontSize:'0.7rem',color:'#374151',background:'#263348',padding:'0.2rem 0.5rem',borderRadius:4}}>A4</span>
            </div>
            <div style={{background:'#fff',borderRadius:8,overflow:'hidden',boxShadow:'0 8px 40px rgba(0,0,0,0.4)',transform:'scale(0.85)',transformOrigin:'top center',marginBottom:'-8%'}}>
              <div ref={printRef}>
                <Preview/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cv-print, #cv-print * { visibility: visible !important; }
          #cv-print { position: fixed; left: 0; top: 0; width: 210mm; }
        }
        @media (max-width: 767px) {
          .cv-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CVBuilder;
const TEMPLATES: {id:Template; name:string; desc:string}[] = [
  {id:'classic', name:'Classic',  desc:'Blue header, traditional'},
  {id:'modern',  name:'Modern',   desc:'Sidebar layout'},
  {id:'minimal', name:'Minimal',  desc:'Clean & simple'},
];

/* ── CV Preview — Classic ───────────────────────────────────────────────── */
const Sec:React.FC<{title:string;accent:string;children:React.ReactNode}> = ({title,accent,children}) => (
  <div style={{marginBottom:'1.1rem'}}>
    <h2 style={{fontSize:'0.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:accent,borderBottom:`2px solid ${accent}`,paddingBottom:'0.2rem',marginBottom:'0.6rem'}}>{title}</h2>
    {children}
  </div>
);

const ClassicCV:React.FC<{cv:CVData;work:WorkExp[];edu:Education[];certs:Cert[];langs:Lang[];accent:string}> = ({cv,work,edu,certs,langs,accent}) => (
  <div style={{fontFamily:'Georgia,serif',color:'#1a1a1a',background:'#fff',width:'100%',minHeight:'297mm'}}>
    <div style={{background:accent,padding:'1.75rem 2rem',color:'#fff'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        {cv.photo && <img src={cv.photo} alt="" style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,0.4)'}}/>}
        <div>
          <h1 style={{fontSize:'1.6rem',fontWeight:800,margin:0,letterSpacing:'-0.02em'}}>{cv.fullName||'Your Name'}</h1>
          {cv.title && <p style={{fontSize:'0.9rem',opacity:0.85,margin:'0.2rem 0 0'}}>{cv.title}</p>}
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',marginTop:'0.6rem',fontSize:'0.75rem',opacity:0.9}}>
            {cv.email    && <span>✉ {cv.email}</span>}
            {cv.phone    && <span>📞 {cv.phone}</span>}
            {cv.location && <span>📍 {cv.location}</span>}
            {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
            {cv.github   && <span>💻 {cv.github}</span>}
          </div>
        </div>
      </div>
    </div>
    <div style={{padding:'1.25rem 2rem'}}>
      {cv.summary && <Sec title="Professional Summary" accent={accent}><p style={{fontSize:'0.82rem',lineHeight:1.7,color:'#374151'}}>{cv.summary}</p></Sec>}
      {cv.skills.length>0 && <Sec title="Skills" accent={accent}><div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem'}}>{cv.skills.map(s=><span key={s} style={{padding:'0.15rem 0.6rem',background:`${accent}18`,color:accent,border:`1px solid ${accent}40`,borderRadius:99,fontSize:'0.72rem',fontWeight:600}}>{s}</span>)}</div></Sec>}
      {work.some(e=>e.company) && <Sec title="Work Experience" accent={accent}>{work.filter(e=>e.company).map(e=>(
        <div key={e.id} style={{marginBottom:'0.85rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div><p style={{fontWeight:700,fontSize:'0.85rem',color:'#111',margin:0}}>{e.role}</p><p style={{fontSize:'0.78rem',color:accent,fontWeight:600,margin:'0.1rem 0'}}>{e.company}{e.location?` · ${e.location}`:''}</p></div>
            <p style={{fontSize:'0.72rem',color:'#6B7280',whiteSpace:'nowrap',marginLeft:'0.5rem'}}>{e.start}{e.start?' – ':''}{e.current?'Present':e.end}</p>
          </div>
          {e.description && <p style={{fontSize:'0.78rem',color:'#374151',marginTop:'0.3rem',lineHeight:1.6}}>{e.description}</p>}
        </div>
      ))}</Sec>}
      {edu.some(e=>e.institution) && <Sec title="Education" accent={accent}>{edu.filter(e=>e.institution).map(e=>(
        <div key={e.id} style={{marginBottom:'0.7rem',display:'flex',justifyContent:'space-between'}}>
          <div><p style={{fontWeight:700,fontSize:'0.85rem',color:'#111',margin:0}}>{e.degree}{e.field?` in ${e.field}`:''}</p><p style={{fontSize:'0.78rem',color:accent,fontWeight:600,margin:'0.1rem 0'}}>{e.institution}</p>{e.gpa&&<p style={{fontSize:'0.72rem',color:'#6B7280'}}>GPA: {e.gpa}</p>}</div>
          <p style={{fontSize:'0.72rem',color:'#6B7280',whiteSpace:'nowrap',marginLeft:'0.5rem'}}>{e.start}{e.start?' – ':''}{e.end}</p>
        </div>
      ))}</Sec>}
      {certs.some(c=>c.name) && <Sec title="Certifications" accent={accent}>{certs.filter(c=>c.name).map(c=>(
        <div key={c.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'0.3rem'}}><span style={{fontSize:'0.78rem',fontWeight:600}}>{c.name}</span><span style={{fontSize:'0.72rem',color:'#6B7280'}}>{c.issuer}{c.date?` · ${c.date}`:''}</span></div>
      ))}</Sec>}
      {langs.some(l=>l.name) && <Sec title="Languages" accent={accent}><div style={{display:'flex',flexWrap:'wrap',gap:'1rem'}}>{langs.filter(l=>l.name).map(l=><span key={l.id} style={{fontSize:'0.78rem'}}><strong>{l.name}</strong>{l.level?` — ${l.level}`:''}</span>)}</div></Sec>}
      <div style={{marginTop:'1.5rem',paddingTop:'0.5rem',borderTop:'1px solid #E5E7EB',textAlign:'center'}}><span style={{fontSize:'0.6rem',color:'#9CA3AF'}}>Built with GraduateConnect</span></div>
    </div>
  </div>
);

const ModernCV:React.FC<{cv:CVData;work:WorkExp[];edu:Education[];certs:Cert[];langs:Lang[];accent:string}> = ({cv,work,edu,certs,langs,accent}) => (
  <div style={{fontFamily:"'Segoe UI',sans-serif",color:'#1a1a1a',background:'#fff',width:'100%',minHeight:'297mm',display:'grid',gridTemplateColumns:'33% 67%'}}>
    <div style={{background:accent,color:'#fff',padding:'1.75rem 1.25rem'}}>
      {cv.photo && <div style={{textAlign:'center',marginBottom:'1rem'}}><img src={cv.photo} alt="" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,0.4)'}}/></div>}
      <h1 style={{fontSize:'1.1rem',fontWeight:800,margin:'0 0 0.2rem',lineHeight:1.2}}>{cv.fullName||'Your Name'}</h1>
      {cv.title && <p style={{fontSize:'0.78rem',opacity:0.85,margin:'0 0 1.25rem'}}>{cv.title}</p>}
      <div style={{marginBottom:'1rem'}}>
        <h3 style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',opacity:0.65,marginBottom:'0.5rem',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:'0.25rem'}}>Contact</h3>
        {cv.email    && <div style={{fontSize:'0.72rem',marginBottom:'0.3rem',opacity:0.9}}>✉ {cv.email}</div>}
        {cv.phone    && <div style={{fontSize:'0.72rem',marginBottom:'0.3rem',opacity:0.9}}>📞 {cv.phone}</div>}
        {cv.location && <div style={{fontSize:'0.72rem',marginBottom:'0.3rem',opacity:0.9}}>📍 {cv.location}</div>}
        {cv.linkedin && <div style={{fontSize:'0.72rem',marginBottom:'0.3rem',opacity:0.9}}>🔗 {cv.linkedin}</div>}
        {cv.github   && <div style={{fontSize:'0.72rem',marginBottom:'0.3rem',opacity:0.9}}>💻 {cv.github}</div>}
      </div>
      {cv.skills.length>0 && <div style={{marginBottom:'1rem'}}>
        <h3 style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',opacity:0.65,marginBottom:'0.5rem',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:'0.25rem'}}>Skills</h3>
        {cv.skills.map(s=><div key={s} style={{marginBottom:'0.35rem'}}><div style={{fontSize:'0.72rem',marginBottom:'0.1rem'}}>{s}</div><div style={{height:3,background:'rgba(255,255,255,0.25)',borderRadius:99}}><div style={{height:'100%',width:'75%',background:'rgba(255,255,255,0.75)',borderRadius:99}}/></div></div>)}
      </div>}
      {langs.some(l=>l.name) && <div>
        <h3 style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',opacity:0.65,marginBottom:'0.5rem',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:'0.25rem'}}>Languages</h3>
        {langs.filter(l=>l.name).map(l=><div key={l.id} style={{fontSize:'0.72rem',marginBottom:'0.25rem',opacity:0.9}}><strong>{l.name}</strong>{l.level?` — ${l.level}`:''}</div>)}
      </div>}
    </div>
    <div style={{padding:'1.75rem 1.5rem'}}>
      {cv.summary && <Sec title="About Me" accent={accent}><p style={{fontSize:'0.82rem',lineHeight:1.7,color:'#374151'}}>{cv.summary}</p></Sec>}
      {work.some(e=>e.company) && <Sec title="Experience" accent={accent}>{work.filter(e=>e.company).map(e=>(
        <div key={e.id} style={{marginBottom:'0.85rem'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><div><p style={{fontWeight:700,fontSize:'0.85rem',color:'#111',margin:0}}>{e.role}</p><p style={{fontSize:'0.78rem',color:accent,fontWeight:600,margin:'0.1rem 0'}}>{e.company}</p></div><p style={{fontSize:'0.7rem',color:'#6B7280',whiteSpace:'nowrap'}}>{e.start}{e.start?'–':''}{e.current?'Present':e.end}</p></div>
          {e.description && <p style={{fontSize:'0.78rem',color:'#374151',marginTop:'0.25rem',lineHeight:1.6}}>{e.description}</p>}
        </div>
      ))}</Sec>}
      {edu.some(e=>e.institution) && <Sec title="Education" accent={accent}>{edu.filter(e=>e.institution).map(e=>(
        <div key={e.id} style={{marginBottom:'0.7rem'}}><p style={{fontWeight:700,fontSize:'0.85rem',color:'#111',margin:0}}>{e.degree}{e.field?` in ${e.field}`:''}</p><p style={{fontSize:'0.78rem',color:accent,fontWeight:600,margin:'0.1rem 0'}}>{e.institution}</p><p style={{fontSize:'0.7rem',color:'#6B7280'}}>{e.start}{e.start?'–':''}{e.end}{e.gpa?` · GPA: ${e.gpa}`:''}</p></div>
      ))}</Sec>}
      {certs.some(c=>c.name) && <Sec title="Certifications" accent={accent}>{certs.filter(c=>c.name).map(c=>(
        <div key={c.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'0.3rem'}}><span style={{fontSize:'0.78rem',fontWeight:600}}>{c.name}</span><span style={{fontSize:'0.7rem',color:'#6B7280'}}>{c.issuer}{c.date?` · ${c.date}`:''}</span></div>
      ))}</Sec>}
    </div>
  </div>
);

const MinimalCV:React.FC<{cv:CVData;work:WorkExp[];edu:Education[];certs:Cert[];langs:Lang[];accent:string}> = ({cv,work,edu,certs,langs,accent}) => (
  <div style={{fontFamily:"'Helvetica Neue',sans-serif",color:'#1a1a1a',background:'#fff',width:'100%',minHeight:'297mm',padding:'2rem 2.5rem'}}>
    <div style={{borderBottom:`3px solid ${accent}`,paddingBottom:'0.875rem',marginBottom:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        {cv.photo && <img src={cv.photo} alt="" style={{width:60,height:60,borderRadius:'50%',objectFit:'cover'}}/>}
        <div><h1 style={{fontSize:'1.75rem',fontWeight:900,margin:0,letterSpacing:'-0.03em'}}>{cv.fullName||'Your Name'}</h1>{cv.title&&<p style={{fontSize:'0.85rem',color:accent,fontWeight:600,margin:'0.15rem 0 0'}}>{cv.title}</p>}</div>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',marginTop:'0.6rem',fontSize:'0.75rem',color:'#6B7280'}}>
        {cv.email&&<span>{cv.email}</span>}{cv.phone&&<span>{cv.phone}</span>}{cv.location&&<span>{cv.location}</span>}{cv.linkedin&&<span>{cv.linkedin}</span>}{cv.github&&<span>{cv.github}</span>}
      </div>
    </div>
    {cv.summary && <div style={{marginBottom:'1.25rem'}}><p style={{fontSize:'0.85rem',lineHeight:1.8,color:'#374151'}}>{cv.summary}</p></div>}
    {cv.skills.length>0 && <div style={{marginBottom:'1.25rem'}}><h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',color:accent,marginBottom:'0.5rem'}}>Skills</h2><div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem'}}>{cv.skills.map(s=><span key={s} style={{fontSize:'0.75rem',color:'#374151',background:'#F3F4F6',padding:'0.15rem 0.55rem',borderRadius:4}}>{s}</span>)}</div></div>}
    {work.some(e=>e.company) && <div style={{marginBottom:'1.25rem'}}><h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',color:accent,marginBottom:'0.6rem'}}>Experience</h2>{work.filter(e=>e.company).map(e=>(
      <div key={e.id} style={{marginBottom:'0.85rem',paddingLeft:'0.75rem',borderLeft:`2px solid ${accent}30`}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><p style={{fontWeight:700,fontSize:'0.85rem',margin:0}}>{e.role} — <span style={{color:accent}}>{e.company}</span></p><p style={{fontSize:'0.7rem',color:'#9CA3AF'}}>{e.start}{e.start?'–':''}{e.current?'Present':e.end}</p></div>
        {e.description && <p style={{fontSize:'0.78rem',color:'#4B5563',marginTop:'0.25rem',lineHeight:1.6}}>{e.description}</p>}
      </div>
    ))}</div>}
    {edu.some(e=>e.institution) && <div style={{marginBottom:'1.25rem'}}><h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',color:accent,marginBottom:'0.6rem'}}>Education</h2>{edu.filter(e=>e.institution).map(e=>(
      <div key={e.id} style={{marginBottom:'0.7rem',display:'flex',justifyContent:'space-between'}}>
        <div><p style={{fontWeight:700,fontSize:'0.85rem',margin:0}}>{e.degree}{e.field?` in ${e.field}`:''}</p><p style={{fontSize:'0.78rem',color:accent,margin:'0.1rem 0'}}>{e.institution}</p>{e.gpa&&<p style={{fontSize:'0.7rem',color:'#9CA3AF'}}>GPA: {e.gpa}</p>}</div>
        <p style={{fontSize:'0.7rem',color:'#9CA3AF',whiteSpace:'nowrap'}}>{e.start}{e.start?'–':''}{e.end}</p>
      </div>
    ))}</div>}
    {certs.some(c=>c.name) && <div><h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',color:accent,marginBottom:'0.5rem'}}>Certifications</h2>{certs.filter(c=>c.name).map(c=>(
      <div key={c.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'0.3rem'}}><span style={{fontSize:'0.78rem',fontWeight:600}}>{c.name}</span><span style={{fontSize:'0.7rem',color:'#9CA3AF'}}>{c.issuer}{c.date?` · ${c.date}`:''}</span></div>
    ))}</div>}
  </div>
);

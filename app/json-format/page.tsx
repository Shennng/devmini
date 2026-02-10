"use client";
import{useState,useEffect}from"react";
import{Button}from"@/components/ui/button";
import{Label}from"@/components/ui/label";
import{useToast}from"@/lib/hooks/use-toast";
import{Copy,Download,Check,AlertCircle}from"lucide-react";

function validateJSON(input:string){try{if(!input.trim())return{valid:true};JSON.parse(input);return{valid:true}}catch(e){return{valid:false,message:(e as Error).message}}}

export default function JsonFormatPage(){
const[input,setInput]=useState("");
const[output,setOutput]=useState("");
const[indent,setIndent]=useState(2);
const[isValid,setIsValid]=useState(true);
const[msg,setMsg]=useState("");
const{toast}=useToast();

useEffect(()=>{if(input.trim()){const v=validateJSON(input);setIsValid(v.valid);setMsg(v.message||"")}else{setIsValid(true);setMsg("")}
try{setOutput(JSON.stringify(JSON.parse(input),null,indent))}catch{setOutput("")}},[input,indent]);

const copy=async(t:string)=>{try{await navigator.clipboard.writeText(t);toast({title:"已复制"})}catch{toast({title:"复制失败"})}};

return(
<div className="flex h-[calc(100vh-3.5rem)] divide-x divide-border">
<div className="flex-1 flex flex-col min-w-0">
<div className="h-10 flex items-center px-4 border-b border-border bg-muted/20">
<span className="text-xs font-medium text-muted-foreground uppercase">输入</span>
</div>
<textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴 JSON..." className="flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none"/>
</div>
<div className="flex-1 flex flex-col min-w-0">
<div className="h-10 flex items-center justify-between px-4 border-b border-border bg-muted/20">
<div className={isValid?"flex items-center gap-1 text-xs text-green-400":"flex items-center gap-1 text-xs text-red-400"}>
{isValid?<Check className="h-3 w-3"/>:<AlertCircle className="h-3 w-3"/>}
{msg||"等待输入..."}
</div>
<div className="flex gap-1">
<Button variant="ghost" size="icon" onClick={()=>copy(output)}><Copy className="h-4 w-4"/></Button>
<Button variant="ghost" size="icon" onClick={()=>{const b=new Blob([output],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="output.json";a.click();}}><Download className="h-4 w-4"/></Button>
</div>
</div>
<textarea value={output} readOnly placeholder="结果..." className="flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none"/>
</div>
</div>
);
}

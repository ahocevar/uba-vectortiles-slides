import{p as w}from"./chunk-K2ZEYYM2-BfFZGE72.js";import{p as B}from"./gitGraph-YCYPL57B-RWHQZFFZ-BfkMCLM1.js";import{as as S,s as F,g as z,q as P,t as W,c as T,d as D,_ as n,l as v,at as x,au as _,v as A,aU as E,m as N}from"./md-DX8lb7v5.js";import"./chunk-TZBO7MLI-B0TG-anE.js";import"./monaco/bundled-types-B0nSufkl.js";import"./modules/vue-C10BxpJy.js";import"./modules/file-saver-igGfcqei.js";import"./lz-string-7V7f_eN4.js";import"./index-ClURjBdN.js";import"./modules/shiki-gSk8N4GD.js";import"./slidev/default-B8GzIpyp.js";import"./slidev/context-DC0wzfoI.js";var C={packet:[]},h=structuredClone(C),L=S.packet,Y=n(()=>{const t=x({...L,..._().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),I=n(()=>h.packet,"getPacket"),M=n(t=>{t.length>0&&h.packet.push(t)},"pushWord"),O=n(()=>{A(),h=structuredClone(C)},"clear"),u={pushWord:M,getPacket:I,getConfig:Y,clear:O,setAccTitle:F,getAccTitle:z,setDiagramTitle:P,getDiagramTitle:W,getAccDescription:T,setAccDescription:D},U=1e4,q=n(t=>{w(t,u);let e=-1,o=[],s=1;const{bitsPerRow:i}=u.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,v.debug(`Packet block ${a} - ${e} with label ${p}`);o.length<=i+1&&u.getPacket().length<U;){const[b,c]=G({start:a,end:r,label:p},s,i);if(o.push(b),b.end+1===s*i&&(u.pushWord(o),o=[],s++),!c)break;({start:a,end:r,label:p}=c)}}u.pushWord(o)},"populate"),G=n((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),H={parse:n(async t=>{const e=await B("packet",t);v.debug(e),q(e)},"parse")},K=n((t,e,o,s)=>{const i=s.db,a=i.getConfig(),{rowHeight:r,paddingY:p,bitWidth:b,bitsPerRow:c}=a,m=i.getPacket(),l=i.getDiagramTitle(),g=r+p,d=g*(m.length+1)-(l?0:r),k=b*c+2,f=E(e);f.attr("viewbox",`0 0 ${k} ${d}`),N(f,d,k,a.useMaxWidth);for(const[$,y]of m.entries())R(f,y,$,a);f.append("text").text(l).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=n((t,e,o,{rowHeight:s,paddingX:i,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:b})=>{const c=t.append("g"),m=o*(s+a)+a;for(const l of e){const g=l.start%p*r+1,d=(l.end-l.start+1)*r-i;if(c.append("rect").attr("x",g).attr("y",m).attr("width",d).attr("height",s).attr("class","packetBlock"),c.append("text").attr("x",g+d/2).attr("y",m+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(l.label),!b)continue;const k=l.end===l.start,f=m-2;c.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(l.start),k||c.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(l.end)}},"drawWord"),X={draw:K},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=n(({packet:t}={})=>{const e=x(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),ct={parser:H,db:u,renderer:X,styles:J};export{ct as diagram};

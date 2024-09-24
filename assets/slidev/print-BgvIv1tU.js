import{d as _,U as u,A as h,o as n,b as l,e as t,x as s,J as c,F as f,V as g,I as v,l as x,g as b}from"../modules/vue-C10BxpJy.js";import{k,j as y}from"../index-ClURjBdN.js";import{c as m}from"../monaco/bundled-types-B0nSufkl.js";import{_ as N}from"./NoteDisplay.vue_vue_type_style_index_0_lang-BS-bFtnK.js";import"../modules/shiki-gSk8N4GD.js";import"../modules/file-saver-igGfcqei.js";const V={id:"page-root"},w={class:"m-4"},L={class:"mb-10"},T={class:"text-4xl font-bold mt-2"},B={class:"opacity-50"},H={class:"text-lg"},S={class:"font-bold flex gap-2"},j={class:"opacity-50"},A={key:0,class:"border-main mb-8"},I=_({__name:"print",setup(C){const{slides:p,total:d}=k();u(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),y({title:`Notes - ${m.title}`});const i=h(()=>p.value.map(e=>{var a;return(a=e.meta)==null?void 0:a.slide}).filter(e=>e!==void 0&&e.noteHTML!==""));return(e,a)=>(n(),l("div",V,[t("div",w,[t("div",L,[t("h1",T,s(c(m).title),1),t("div",B,s(new Date().toLocaleString()),1)]),(n(!0),l(f,null,g(i.value,(o,r)=>(n(),l("div",{key:r,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",H,[t("div",S,[t("div",j,s(o==null?void 0:o.no)+"/"+s(c(d)),1),v(" "+s(o==null?void 0:o.title)+" ",1),a[0]||(a[0]=t("div",{class:"flex-auto"},null,-1))])]),x(N,{"note-html":o.noteHTML,class:"max-w-full"},null,8,["note-html"])]),r<i.value.length-1?(n(),l("hr",A)):b("v-if",!0)]))),128))])]))}});export{I as default};

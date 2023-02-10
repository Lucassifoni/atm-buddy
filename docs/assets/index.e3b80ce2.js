var S=Object.defineProperty,R=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var z=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var v=(o,s,l)=>s in o?S(o,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[s]=l,f=(o,s)=>{for(var l in s||(s={}))z.call(s,l)&&v(o,l,s[l]);if(g)for(var l of g(s))I.call(s,l)&&v(o,l,s[l]);return o},y=(o,s)=>R(o,C(s));import{r as $,o as _,c as h,a as t,F as B,b as A,d as x,n as O,w as F,e as r,t as u,f as N,g as M,h as q,i as k}from"./vendor.4f9d7adc.js";const P=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const i of e.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function l(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerpolicy&&(e.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?e.credentials="include":n.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(n){if(n.ep)return;n.ep=!0;const e=l(n);fetch(n.href,e)}};P();var m=(o,s)=>{const l=o.__vccOpts||o;for(const[a,n]of s)l[a]=n;return l};const D={computed:{routes(){return this.$router.getRoutes()}},mounted(){}},L={id:"app"},T={class:"tags"},H={class:"box",style:{width:"100%","max-width":"540px",margin:"auto","margin-bottom":"15px"}};function V(o,s,l,a,n,e){const i=$("router-link"),w=$("router-view");return _(),h("div",L,[t("div",T,[(_(!0),h(B,null,A(e.routes,b=>(_(),h("div",{class:O(["tag",{"is-primary":b.path===o.$route.path}])},[x(i,{to:b.path},{default:F(()=>[r(u(b.name),1)]),_:2},1032,["to"])],2))),256))]),t("div",H,[x(w)])])}var E=m(D,[["render",V]]);const d=(o,s,l)=>{try{return JSON.parse(localStorage.getItem(o))[s]||l}catch{return l}},p=(o,s,l,a,n)=>{try{o[a]=n;const e=y(f({},l),{key:n});return localStorage.setItem(s,JSON.stringify(e)),n}catch{return n}},c=o=>o.toString().replace(",","."),J={name:"App",data(){return{r:Number(c(d("__sphero","r","40"))),s:Number(c(d("__sphero","s","3"))),b:Number(c(d("__sphero","b","3"))),curve:"concave"}},methods:{set(o,s){p(this,"__sphero",{b:this.b,s:this.s,r:this.r,curve:this.curve},o,s)},normalize:c},computed:{roc(){const o=this.r,s=this.s,l=this.curve==="concave"?this.b:-this.b;return(o*o+s*s)/(2*s)+l/2}}},Q=t("h3",{class:"subtitle",style:{"margin-bottom":"0"}}," ROC = (r\xB2 + s\xB2) / 2s \xB1 b/2 ",-1),j=t("hr",null,null,-1),G={class:"field is-horizontal"},K=t("label",{for:"",class:"label is-small"},"Radius of feet (in mm): ",-1),U=["value"],W={class:"field is-horizontal"},X=t("label",{for:"",class:"label is-small"},"Sagitta (in mm): ",-1),Y=["value"],Z={class:"field is-horizontal"},tt=t("label",{for:"",class:"label is-small"},"Ball diameter (in mm): ",-1),st=["value"],et={class:"field is-horizontal"},ot=t("label",{for:"",class:"label is-small"},"Curve : ",-1),nt={class:"select is-small"},rt=["value"],lt=t("option",{value:"concave"},"Concave",-1),it=t("option",{value:"convex"},"Convex",-1),at=[lt,it],ct={class:"button is-primary",style:{"white-space":"normal"}},ut=r("ROC: \xA0 ");function dt(o,s,l,a,n,e){return _(),h("div",null,[Q,j,t("div",G,[K,t("input",{class:"input is-small",value:n.r,onInput:s[0]||(s[0]=i=>e.set("r",Number(e.normalize(i.target.value))))},null,40,U)]),t("div",W,[X,t("input",{class:"input is-small",value:n.s,onInput:s[1]||(s[1]=i=>e.set("s",Number(e.normalize(i.target.value))))},null,40,Y)]),t("div",Z,[tt,t("input",{class:"input is-small",value:n.b,onInput:s[2]||(s[2]=i=>e.set("b",Number(e.normalize(i.target.value))))},null,40,st)]),t("div",et,[ot,t("div",nt,[t("select",{name:"",id:"",value:n.curve},at,8,rt)])]),t("div",ct,[t("span",null,[ut,t("strong",null,"\xA0"+u(e.roc.toFixed(2)),1)])])])}var _t=m(J,[["render",dt]]);const ht={name:"App",data(){return{R:Number(c(d("__rsphero","R","2500"))),r:Number(c(d("__rsphero","r","35"))),b:Number(c(d("__rsphero","b","3"))),curve:"concave"}},methods:{set(o,s){p(this,"__rsphero",{R:this.R,r:this.r,curve:this.curve,b:this.b},o,s)},normalize:c},computed:{sag(){const o=this.r,s=this.R,l=this.curve==="concave"?this.b:-this.b,a=s+l/2;return a-Math.sqrt(a*a-o*o)}}},mt=t("h3",{class:"subtitle",style:{"margin-bottom":"0"}}," Sagitta = ROC \xB1 b/2 - sqrt((ROC \xB1 b/2)\xB2 - r\xB2) ",-1),pt=t("hr",null,null,-1),bt={class:"field is-horizontal"},gt=t("label",{for:"",class:"label is-small"},"Radius of feet (in mm): ",-1),vt=["value"],ft={class:"field is-horizontal"},yt=t("label",{for:"",class:"label is-small"},"Desired ROC (in mm): ",-1),$t=["value"],xt={class:"field is-horizontal"},Nt=t("label",{for:"",class:"label is-small"},"Ball diameter (in mm): ",-1),wt=["value"],St={class:"field is-horizontal"},Rt=t("label",{for:"",class:"label is-small"},"Curve : ",-1),Ct={class:"select is-small"},zt=["value"],It=t("option",{value:"concave"},"Concave",-1),Bt=t("option",{value:"convex"},"Convex",-1),At=[It,Bt],Ot={class:"button is-primary",style:{"white-space":"normal"}},Ft=r("Sagitta: \xA0 ");function Mt(o,s,l,a,n,e){return _(),h("div",null,[mt,pt,t("div",bt,[gt,t("input",{class:"input is-small",value:n.r,onInput:s[0]||(s[0]=i=>e.set("r",Number(e.normalize(i.target.value))))},null,40,vt)]),t("div",ft,[yt,t("input",{class:"input is-small",value:n.R,onInput:s[1]||(s[1]=i=>e.set("R",Number(e.normalize(i.target.value))))},null,40,$t)]),t("div",xt,[Nt,t("input",{class:"input is-small",value:n.b,onInput:s[2]||(s[2]=i=>e.set("b",Number(e.normalize(i.target.value))))},null,40,wt)]),t("div",St,[Rt,t("div",Ct,[t("select",{name:"",id:"",value:n.curve},At,8,zt)])]),t("div",Ot,[t("span",null,[Ft,t("strong",null,"\xA0"+u(e.sag.toFixed(3)),1)])])])}var qt=m(ht,[["render",Mt]]);const kt={name:"App",data(){return{r:Number(c(d("__sinetable","r","125"))),R:Number(c(d("__sinetable","R","2500")))}},methods:{set(o,s){p(this,"__sinetable",{R:this.R,r:this.r},o,s)},normalize:c},computed:{x(){const o=this.r/this.R;return Math.asin(o)*(180/Math.PI)}}},Pt=t("h3",{class:"subtitle",style:{"margin-bottom":"0"}}," Sine table",-1),Dt=t("p",null,[r("where x is the angle between the two planes."),t("br"),r(" r is the cup radius"),t("br"),r("(measure outside for a concave curve, inside for a convex curve !)"),t("br"),r(" sin(x) = r / R ")],-1),Lt=t("hr",null,null,-1),Tt={class:"field is-horizontal"},Ht=t("label",{for:"",class:"label is-small"},"Cup radius (in mm): ",-1),Vt=["value"],Et={class:"field is-horizontal"},Jt=t("label",{for:"",class:"label is-small"},"Desired ROC (in mm): ",-1),Qt=["value"],jt={class:"button is-primary",style:{"white-space":"normal"}},Gt=r("Angle x in degrees : \xA0 ");function Kt(o,s,l,a,n,e){return _(),h("div",null,[Pt,Dt,Lt,t("div",Tt,[Ht,t("input",{class:"input is-small",value:n.r,onInput:s[0]||(s[0]=i=>e.set("r",Number(e.normalize(i.target.value))))},null,40,Vt)]),t("div",Et,[Jt,t("input",{class:"input is-small",value:n.R,onInput:s[1]||(s[1]=i=>e.set("R",Number(e.normalize(i.target.value))))},null,40,Qt)]),t("div",jt,[t("span",null,[Gt,t("strong",null,"\xA0"+u(e.x.toFixed(2)),1)])])])}var Ut=m(kt,[["render",Kt]]);const Wt={name:"App",data(){return{f:Number(c(d("__mpcc","f","1200"))),d:Number(c(d("__mpcc","d","300")))}},methods:{set(o,s){p(this,"__mpcc",{f:this.f,d:this.d},o,s)},normalize:c},computed:{ratio(){return this.f/this.d},correction(){return this.d/(1.1264*(this.ratio*this.ratio*this.ratio))},undercorrection(){const o=4/this.ratio;return o*o*o*o*.81},target(){return-1-this.undercorrection/this.correction}}},Xt=t("h3",{class:"subtitle",style:{"margin-bottom":"0"}}," Baader MPCC Conic calculator ",-1),Yt=t("p",null,[r(" In waves @550nm :"),t("br"),r("Correction of a parabola : D (mm) / (1.1264 * (F/D)^3) "),t("br"),r("MPCC S.A. undercorrection : (4 / (F/D))^4 * 0.81 ")],-1),Zt=t("hr",null,null,-1),ts={class:"field is-horizontal"},ss=t("label",{for:"",class:"label is-small"},"Diameter (mm) : ",-1),es=["value"],os={class:"field is-horizontal"},ns=t("label",{for:"",class:"label is-small"},"Focal length (mm) : ",-1),rs=["value"],ls=t("hr",null,null,-1),is=t("strong",null,"Focal ratio :",-1),as=t("br",null,null,-1),cs=t("strong",null,"Parabola correction :",-1),us=t("br",null,null,-1),ds=t("strong",null,"MPCC Undercorrection :",-1),_s=t("br",null,null,-1),hs=t("strong",null,"Target conic : ",-1);function ms(o,s,l,a,n,e){return _(),h("div",null,[Xt,Yt,Zt,t("div",ts,[ss,t("input",{class:"input is-small",value:n.d,onInput:s[0]||(s[0]=i=>e.set("d",Number(e.normalize(i.target.value))))},null,40,es)]),t("div",os,[ns,t("input",{class:"input is-small",value:n.f,onInput:s[1]||(s[1]=i=>e.set("f",Number(e.normalize(i.target.value))))},null,40,rs)]),ls,t("p",null,[is,r(" "+u(e.ratio),1),as,cs,r(" "+u(e.correction),1),us,ds,r(" "+u(e.undercorrection),1),_s,hs,r(" "+u(e.target),1)])])}var ps=m(Wt,[["render",ms]]);const bs={name:"App",data(){return{b:Number(c(d("__baseqty","b","150")))}},methods:{set(o,s){p(this,"__baseqty",{f:this.f,d:this.d},o,s)},normalize:c},computed:{silver(){return Number((1.6*(this.b/150)).toFixed(2))},soda(){return Number((2.5*(this.b/150)).toFixed(2))},sugarwater(){return Number((300*(this.b/150)).toFixed(2))},sugar(){return Number((12*(this.b/150)).toFixed(2))},firstQty(){return Number((100*(this.b/150)).toFixed(2))}}},gs=t("h3",{class:"subtitle",style:{"margin-bottom":"0"}}," Spray silvering proportions & recipe. ",-1),vs=t("p",{style:{"margin-bottom":".75em"}},[r(" Base quantity is 150ml distilled water + 1.6g silver nitrate."),t("br"),r(" Other quantities are derived from that."),t("br"),r(" Recipe from Gerhard S. on Cloudy Nights"),t("br")],-1),fs={class:"field"},ys=t("label",{for:"",class:"label"},"Base quantity in ml of the first solution",-1),$s=["value"],xs={style:{"margin-bottom":".75em"}},Ns=t("strong",{class:"tag is-info"},"Solution 1",-1),ws=r(": "),Ss=r(" silver nitrate + "),Rs=r(" distilled water"),Cs=t("br",null,null,-1),zs=t("strong",{class:"tag is-success"},"Solution 2",-1),Is=r(": "),Bs=r(" sodium hydroxide + "),As=r(" distilled water"),Os=t("br",null,null,-1),Fs=t("strong",{class:"tag is-warning"},"Solution 3",-1),Ms=r(": "),qs=r(" glucose + "),ks=r(" distilled water"),Ps=t("br",null,null,-1),Ds=N('<p style="margin-bottom:.75em;"><strong class="tag is-dark">Bottle 1</strong> is the mixed solution according to below instructions.<br><strong class="tag is-danger">Bottle 2</strong> contains the sugar <strong class="tag is-warning">Solution 3</strong></p><h4 style="font-weight:700;">Mixing of silver solution (becomes <strong class="tag is-dark">Bottle 1</strong> )</h4>',2),Ls=r("1 : Pour about "),Ts=r(" of "),Hs=t("strong",{class:"tag is-info"},"Solution 1",-1),Vs=r(" into a mixing bowl."),Es=N('<li>2 : Add <strong>a few drops</strong> of <strong>ammonia solution (25% dilution)</strong></li><li>3 : Add <strong>all of</strong> <strong class="tag is-success">Solution 2</strong></li><li>4 : Add <strong>the rest</strong> of <strong class="tag is-info">Solution 1</strong> (the solution will turn brown)</li><li>5 : Carefully add <strong>ammonia solution drop by drop</strong> while stirring until a transparent, slightly brownish solution is obtained.</li>',4),Js=t("hr",null,null,-1),Qs=t("p",null,"Any precipitate that may still be present should be completely dissolved",-1),js=t("hr",null,null,-1),Gs=t("p",null,[r("To use, first calibrate "),t("strong",{class:"tag is-dark"},"Bottle 1"),r(" and "),t("strong",{class:"tag is-danger"},"Bottle 2"),r(" with water, ensuring that the same quantity of water is sprayed with 100 sprays.")],-1);function Ks(o,s,l,a,n,e){return _(),h("div",null,[gs,vs,t("div",fs,[ys,t("input",{type:"number",class:"input",value:n.b,onInput:s[0]||(s[0]=i=>e.set("b",i.target.value))},null,40,$s)]),t("p",xs,[Ns,ws,t("strong",null,u(e.silver)+"g",1),Ss,t("strong",null,u(n.b)+"ml",1),Rs,Cs,zs,Is,t("strong",null,u(e.soda)+"g",1),Bs,t("strong",null,u(n.b)+"ml",1),As,Os,Fs,Ms,t("strong",null,u(e.sugar)+"g",1),qs,t("strong",null,u(e.sugarwater)+"ml",1),ks,Ps]),Ds,t("ul",null,[t("li",null,[Ls,t("strong",null,u(e.firstQty)+"ml",1),Ts,Hs,Vs]),Es]),Js,Qs,js,Gs])}var Us=m(bs,[["render",Ks]]);const Ws={},Xs=t("h3",{class:"subtitle"},"ATM Buddy",-1),Ys=t("p",null,"Mobile-friendly collection of one-off tools for ATMs",-1),Zs=[Xs,Ys];function te(o,s){return _(),h("div",null,Zs)}var se=m(Ws,[["render",te]]);const ee=M({history:q(),routes:[{path:"/",name:"Home",component:se},{path:"/sphero",name:"Spherometer to ROC",component:_t},{path:"/reverse_sphero",name:"ROC to Spherometer",component:qt},{path:"/sine_table",name:"Sine table",component:Ut},{path:"/mpcc_hyperbolic",name:"Baader MPCCIII Hyperbola",component:ps},{path:"/spray_silvering",name:"Spray Silvering calculations",component:Us}]});k(E).use(ee).mount("#app");
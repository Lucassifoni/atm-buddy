(function(t){function e(e){for(var r,i,a=e[0],l=e[1],u=e[2],p=0,f=[];p<a.length;p++)i=a[p],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&f.push(o[i][0]),o[i]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);c&&c(e);while(f.length)f.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],r=!0,a=1;a<n.length;a++){var l=n[a];0!==o[l]&&(r=!1)}r&&(s.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},o={app:0},s=[];function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/sphero/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],l=a.push.bind(a);a.push=e,a=a.slice();for(var u=0;u<a.length;u++)e(a[u]);var c=l;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"box",staticStyle:{width:"100%","max-width":"540px",margin:"auto","margin-bottom":"15px"}},[n("h2",{staticClass:"subtitle",staticStyle:{"margin-bottom":"0"}},[t._v(t._s(t.l["title"]))]),t._m(0),n("p",[n("span",{domProps:{innerHTML:t._s(t.l["equation_1"])}}),n("span",{domProps:{innerHTML:t._s(t.l["equation_2"])}}),n("span",{domProps:{innerHTML:t._s(t.l["equation_3"])}})]),n("hr"),n("div",{staticClass:"field is-horizontal"},[n("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(t._s(t.l["language"])+" :")]),n("div",{staticClass:"select is-small"},[n("select",{staticClass:"is-small",attrs:{name:"language",id:""},domProps:{value:t.lang},on:{change:function(e){return t.set("lang",e.target.value)}}},[n("option",{attrs:{value:"fr"}},[t._v("Français")]),n("option",{attrs:{value:"en"}},[t._v("English")])])])]),n("div",{staticClass:"field is-horizontal"},[n("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(" D : ")]),n("input",{staticClass:"input is-small",domProps:{value:t.d},on:{input:function(e){t.set("d",Number(t.normalize(e.target.value)))}}})]),n("div",{staticClass:"field is-horizontal"},[n("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(" S : ")]),n("input",{staticClass:"input is-small",domProps:{value:t.s},on:{input:function(e){t.set("s",Number(t.normalize(e.target.value)))}}})]),n("div",{staticClass:"button is-primary",staticStyle:{"white-space":"normal"}},[n("span",[t._v(t._s(t.l["roc"])+" "),n("strong",[t._v(" "+t._s(t.r.toFixed(2)))])])])])])},s=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h3",{staticClass:"subtitle",staticStyle:{"margin-bottom":"0"}},[t._v(" R = (S / 2) + (D"),n("sup",[t._v("2")]),t._v(" / 8 * S) ")])}],i=(n("a9e3"),n("d3b7"),n("ac1f"),n("25f0"),n("5319"),n("5530")),a={language:"Langue",title:"Sphéromètre",equation_1:"<strong>D</strong> est le diamètre du cercle des pattes.<br>",equation_2:"<strong>S</strong> est la profondeur mesurée.<br>",equation_3:"<strong>R</strong> est le rayon de courbure = <strong>2 * F</strong>",units:"Unités",mm:"Millimètres",in:"Pouces",roc:"Rayon de courbure"},l={language:"Language",title:"Spherometer (unitless)",equation_1:"<strong>D</strong> is the feet's circle diameter.<br>",equation_2:"<strong>S</strong> is the measured sagitta (depth).<br>",equation_3:"<strong>R</strong> is the radius of curvature = <strong>2 * F</strong>",units:"Units",mm:"Millimeters",in:"Inches",roc:"Radius of curvature"},u=function(t,e,n){try{return JSON.parse(localStorage.getItem(t))[e]||n}catch(r){return n}},c=function(t,e,n,r,o){try{t[r]=o;var s=Object(i["a"])(Object(i["a"])({},n),{},{key:o});return localStorage.setItem(e,JSON.stringify(s)),o}catch(a){return o}},p=function(t){return t.toString().replace(",",".")},f={name:"App",data:function(){return{lang:u("__sphero","lang","fr"),d:Number(p(u("__sphero","d","40"))),s:Number(p(u("__sphero","s","3")))}},methods:{set:function(t,e){c(this,"__sphero",{d:this.d,s:this.s,units:this.units,lang:this.lang},t,e)},normalize:p},computed:{r:function(){var t=this.d,e=this.s,n=e/2+t*t/(8*e);return n},l:function(){return"fr"===this.lang?a:l}}},d=f,g=(n("5c0b"),n("2877")),m=Object(g["a"])(d,o,s,!1,null,null,null),h=m.exports,v=n("9483");Object(v["a"])("".concat("/sphero/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}}),r["a"].config.productionTip=!1,new r["a"]({render:function(t){return t(h)}}).$mount("#app")},"5c0b":function(t,e,n){"use strict";n("9c0c")},"9c0c":function(t,e,n){}});
//# sourceMappingURL=app.77193836.js.map
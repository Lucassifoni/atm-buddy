(function(t){function e(e){for(var n,a,i=e[0],l=e[1],u=e[2],p=0,d=[];p<i.length;p++)a=i[p],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&d.push(r[a][0]),r[a]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);c&&c(e);while(d.length)d.shift()();return o.push.apply(o,u||[]),s()}function s(){for(var t,e=0;e<o.length;e++){for(var s=o[e],n=!0,i=1;i<s.length;i++){var l=s[i];0!==r[l]&&(n=!1)}n&&(o.splice(e--,1),t=a(a.s=s[0]))}return t}var n={},r={app:0},o=[];function a(e){if(n[e])return n[e].exports;var s=n[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=t,a.c=n,a.d=function(t,e,s){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(s,n,function(e){return t[e]}.bind(null,n));return s},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/sphero/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var c=l;o.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var n=s("2b0e"),r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"has-background-grey",attrs:{id:"app"}},[s("div",{staticClass:"box",staticStyle:{"max-width":"540px",margin:"auto","margin-bottom":"15px"}},[s("h2",{staticClass:"title"},[t._v(t._s(t.l["title"]))]),t._m(0),s("p",[s("span",{domProps:{innerHTML:t._s(t.l["equation_1"])}}),s("span",{domProps:{innerHTML:t._s(t.l["equation_2"])}}),s("span",{domProps:{innerHTML:t._s(t.l["equation_3"])}})])]),s("div",{staticClass:"box",staticStyle:{"max-width":"540px",margin:"auto","margin-bottom":"15px"}},[s("div",{staticClass:"field is-horizontal"},[s("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(t._s(t.l["language"])+" :")]),s("div",{staticClass:"select is-small"},[s("select",{staticClass:"is-small",attrs:{name:"language",id:""},domProps:{value:t.lang},on:{change:function(e){return t.set("lang",e.target.value)}}},[s("option",{attrs:{value:"fr"}},[t._v("Français")]),s("option",{attrs:{value:"en"}},[t._v("English")])])])]),s("div",{staticClass:"field is-horizontal"},[s("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(" D : ")]),s("input",{staticClass:"input is-small",attrs:{type:"number"},domProps:{value:t.d},on:{input:function(e){t.set("d",parseFloat(e.target.value,10))}}})]),s("div",{staticClass:"field is-horizontal"},[s("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(" S : ")]),s("input",{staticClass:"input is-small",attrs:{type:"number"},domProps:{value:t.s},on:{input:function(e){t.set("s",parseFloat(e.target.value,10))}}})]),s("div",{staticClass:"field is-horizontal"},[s("label",{staticClass:"label is-small",attrs:{for:""}},[t._v(t._s(t.l["units"])+" : ")]),s("div",{staticClass:"select is-small"},[s("select",{attrs:{name:"",id:""},domProps:{value:t.units},on:{change:function(e){return t.set("units",e.target.value)}}},[s("option",{attrs:{value:"mm"}},[t._v(t._s(t.l["mm"]))]),s("option",{attrs:{value:"in"}},[t._v(t._s(t.l["in"]))])])])]),s("div",{staticClass:"button is-primary",staticStyle:{"white-space":"normal"}},[s("span",[t._v(t._s(t.l["roc"])+" "),s("strong",[t._v(" "+t._s(t.r.toFixed(2))+t._s("mm"===t.units?"mm":"in"))])])])])])},o=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("h3",{staticClass:"subtitle"},[t._v(" R = (D"),s("sup",[t._v("2")]),t._v(" + 4 * S"),s("sup",[t._v("2")]),t._v(") / (8 * S) ")])}],a=s("5530"),i={language:"Langue",title:"Sphéromètre",equation_1:"<strong>D</strong> est le diamètre du cercle des pattes.<br>",equation_2:"<strong>S</strong> est la profondeur mesurée.<br>",equation_3:"<strong>R</strong> est le rayon de courbure = <strong>2 * F</strong>",units:"Unités",mm:"Millimètres",in:"Pouces",roc:"Rayon de courbure"},l={language:"Language",title:"Spherometer",equation_1:"<strong>D</strong> is the feet's circle diameter.<br>",equation_2:"<strong>S</strong> is the measured sagitta (depth).<br>",equation_3:"<strong>R</strong> is the radius of curvature = <strong>2 * F</strong>",units:"Units",mm:"Millimeters",in:"Inches",roc:"Radius of curvature"},u=function(t,e,s){try{return JSON.parse(localStorage.getItem(t))[e]||s}catch(n){return s}},c=function(t,e,s,n,r){try{t[n]=r;var o=Object(a["a"])(Object(a["a"])({},s),{},{key:r});return localStorage.setItem(e,JSON.stringify(o)),r}catch(i){return r}},p={name:"App",data:function(){return{lang:u("__sphero","lang","fr"),d:parseFloat(u("__sphero","d",40),10),s:parseFloat(u("__sphero","s",3),10),units:u("__sphero","units","mm")}},methods:{set:function(t,e){c(this,"__sphero",{d:this.d,s:this.s,units:this.units,lang:this.lang},t,e)}},computed:{r:function(){var t=this.d,e=this.s,s=(t*t+4*e*e)/8*e;return"mm"!==this.units?s/25.4:s},l:function(){return"fr"===this.lang?i:l}},watch:{units:function(t,e){"mm"===t?(this.set("d",25.4*this.d),this.set("s",25.4*this.s)):(this.set("d",this.d/25.4),this.set("s",this.s/25.4))}}},d=p,f=(s("5c0b"),s("2877")),g=Object(f["a"])(d,r,o,!1,null,null,null),m=g.exports,h=s("9483");Object(h["a"])("".concat("/sphero/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}}),n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(m)}}).$mount("#app")},"5c0b":function(t,e,s){"use strict";s("9c0c")},"9c0c":function(t,e,s){}});
//# sourceMappingURL=app.87d94694.js.map
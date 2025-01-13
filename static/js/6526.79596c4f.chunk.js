/*! For license information please see 6526.79596c4f.chunk.js.LICENSE.txt */
(self.webpackChunk=self.webpackChunk||[]).push([[6526],{10364:(t,e,r)=>{"use strict";function n(){return(null===r.g||void 0===r.g?void 0:r.g.crypto)||(null===r.g||void 0===r.g?void 0:r.g.msCrypto)||{}}function o(){const t=n();return t.subtle||t.webkitSubtle}Object.defineProperty(e,"__esModule",{value:!0}),e.isBrowserCryptoAvailable=e.getSubtleCrypto=e.getBrowerCrypto=void 0,e.getBrowerCrypto=n,e.getSubtleCrypto=o,e.isBrowserCryptoAvailable=function(){return!!n()&&!!o()}},96454:(t,e)=>{"use strict";function r(){return"undefined"===typeof document&&"undefined"!==typeof navigator&&"ReactNative"===navigator.product}function n(){return"undefined"!==typeof process&&"undefined"!==typeof process.versions&&"undefined"!==typeof process.versions.node}Object.defineProperty(e,"__esModule",{value:!0}),e.isBrowser=e.isNode=e.isReactNative=void 0,e.isReactNative=r,e.isNode=n,e.isBrowser=function(){return!r()&&!n()}},8129:(t,e,r)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(46613);n.__exportStar(r(10364),e),n.__exportStar(r(96454),e)},46613:(t,e,r)=>{"use strict";r.r(e),r.d(e,{__assign:()=>s,__asyncDelegator:()=>R,__asyncGenerator:()=>g,__asyncValues:()=>w,__await:()=>m,__awaiter:()=>f,__classPrivateFieldGet:()=>P,__classPrivateFieldSet:()=>x,__createBinding:()=>p,__decorate:()=>a,__exportStar:()=>d,__extends:()=>o,__generator:()=>l,__importDefault:()=>O,__importStar:()=>E,__makeTemplateObject:()=>_,__metadata:()=>u,__param:()=>c,__read:()=>y,__rest:()=>i,__spread:()=>b,__spreadArrays:()=>v,__values:()=>h});var n=function(t,e){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])},n(t,e)};function o(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var s=function(){return s=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},s.apply(this,arguments)};function i(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}function a(t,e,r,n){var o,s=arguments.length,i=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)i=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(i=(s<3?o(i):s>3?o(e,r,i):o(e,r))||i);return s>3&&i&&Object.defineProperty(e,r,i),i}function c(t,e){return function(r,n){e(r,n,t)}}function u(t,e){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(t,e)}function f(t,e,r,n){return new(r||(r=Promise))((function(o,s){function i(t){try{c(n.next(t))}catch(e){s(e)}}function a(t){try{c(n.throw(t))}catch(e){s(e)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(i,a)}c((n=n.apply(t,e||[])).next())}))}function l(t,e){var r,n,o,s,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"===typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(s){return function(a){return function(s){if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(o=2&s[0]?n.return:s[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,s[1])).done)return o;switch(n=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return i.label++,{value:s[1],done:!1};case 5:i.label++,n=s[1],s=[0];continue;case 7:s=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===s[0]||2===s[0])){i=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){i.label=s[1];break}if(6===s[0]&&i.label<o[1]){i.label=o[1],o=s;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(s);break}o[2]&&i.ops.pop(),i.trys.pop();continue}s=e.call(t,i)}catch(a){s=[6,a],n=0}finally{r=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,a])}}}function p(t,e,r,n){void 0===n&&(n=r),t[n]=e[r]}function d(t,e){for(var r in t)"default"===r||e.hasOwnProperty(r)||(e[r]=t[r])}function h(t){var e="function"===typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"===typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function y(t,e){var r="function"===typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,s=r.call(t),i=[];try{for(;(void 0===e||e-- >0)&&!(n=s.next()).done;)i.push(n.value)}catch(a){o={error:a}}finally{try{n&&!n.done&&(r=s.return)&&r.call(s)}finally{if(o)throw o.error}}return i}function b(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(y(arguments[e]));return t}function v(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var s=arguments[e],i=0,a=s.length;i<a;i++,o++)n[o]=s[i];return n}function m(t){return this instanceof m?(this.v=t,this):new m(t)}function g(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),s=[];return n={},i("next"),i("throw"),i("return"),n[Symbol.asyncIterator]=function(){return this},n;function i(t){o[t]&&(n[t]=function(e){return new Promise((function(r,n){s.push([t,e,r,n])>1||a(t,e)}))})}function a(t,e){try{(r=o[t](e)).value instanceof m?Promise.resolve(r.value.v).then(c,u):f(s[0][2],r)}catch(n){f(s[0][3],n)}var r}function c(t){a("next",t)}function u(t){a("throw",t)}function f(t,e){t(e),s.shift(),s.length&&a(s[0][0],s[0][1])}}function R(t){var e,r;return e={},n("next"),n("throw",(function(t){throw t})),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:m(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function w(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t=h(t),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise((function(n,o){(function(t,e,r,n){Promise.resolve(n).then((function(e){t({value:e,done:r})}),e)})(n,o,(e=t[r](e)).done,e.value)}))}}}function _(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function E(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function O(t){return t&&t.__esModule?t:{default:t}}function P(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)}function x(t,e,r){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,r),r}},76526:(t,e,r)=>{"use strict";r.d(e,{A:()=>m,V:()=>m});var n=r(27284),o=r(99038),s=r.n(o),i=r(48661),a=r(10632),c=Object.defineProperty,u=Object.defineProperties,f=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,h=(t,e,r)=>e in t?c(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,y=(t,e)=>{for(var r in e||(e={}))p.call(e,r)&&h(t,r,e[r]);if(l)for(var r of l(e))d.call(e,r)&&h(t,r,e[r]);return t},b=(t,e)=>u(t,f(e));const v={headers:{Accept:"application/json","Content-Type":"application/json"},method:"POST"};class m{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.url=t,this.disableProviderPing=e,this.events=new n.EventEmitter,this.isAvailable=!1,this.registering=!1,!(0,a.isHttpUrl)(t))throw new Error("Provided URL is not compatible with HTTP connection: ".concat(t));this.url=t,this.disableProviderPing=e}get connected(){return this.isAvailable}get connecting(){return this.registering}on(t,e){this.events.on(t,e)}once(t,e){this.events.once(t,e)}off(t,e){this.events.off(t,e)}removeListener(t,e){this.events.removeListener(t,e)}async open(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.url;await this.register(t)}async close(){if(!this.isAvailable)throw new Error("Connection already closed");this.onClose()}async send(t){this.isAvailable||await this.register();try{const e=(0,i.h)(t),r=await(await s()(this.url,b(y({},v),{body:e}))).json();this.onPayload({data:r})}catch(e){this.onError(t.id,e)}}async register(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.url;if(!(0,a.isHttpUrl)(t))throw new Error("Provided URL is not compatible with HTTP connection: ".concat(t));if(this.registering){const t=this.events.getMaxListeners();return(this.events.listenerCount("register_error")>=t||this.events.listenerCount("open")>=t)&&this.events.setMaxListeners(t+1),new Promise(((t,e)=>{this.events.once("register_error",(t=>{this.resetMaxListeners(),e(t)})),this.events.once("open",(()=>{if(this.resetMaxListeners(),typeof this.isAvailable>"u")return e(new Error("HTTP connection is missing or invalid"));t()}))}))}this.url=t,this.registering=!0;try{if(!this.disableProviderPing){const e=(0,i.h)({id:1,jsonrpc:"2.0",method:"test",params:[]});await s()(t,b(y({},v),{body:e}))}this.onOpen()}catch(e){const t=this.parseError(e);throw this.events.emit("register_error",t),this.onClose(),t}}onOpen(){this.isAvailable=!0,this.registering=!1,this.events.emit("open")}onClose(){this.isAvailable=!1,this.registering=!1,this.events.emit("close")}onPayload(t){if(typeof t.data>"u")return;const e="string"==typeof t.data?(0,i.j)(t.data):t.data;this.events.emit("payload",e)}onError(t,e){const r=this.parseError(e),n=r.message||r.toString(),o=(0,a.formatJsonRpcError)(t,n);this.events.emit("payload",o)}parseError(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.url;return(0,a.parseConnectionError)(t,e,"HTTP")}resetMaxListeners(){this.events.getMaxListeners()>10&&this.events.setMaxListeners(10)}}},32116:(t,e,r)=>{"use strict";r.d(e,{Vc:()=>o,kF:()=>i});class n{}class o extends n{constructor(t){super()}}class s extends n{constructor(){super()}}class i extends s{constructor(t){super()}}},76765:(t,e,r)=>{"use strict";r.d(e,{Uf:()=>f,XW:()=>l,fO:()=>c,jf:()=>u,zR:()=>a});const n="PARSE_ERROR",o="INVALID_REQUEST",s="METHOD_NOT_FOUND",i="INVALID_PARAMS",a="INTERNAL_ERROR",c="SERVER_ERROR",u=[-32700,-32600,-32601,-32602,-32603],f={[n]:{code:-32700,message:"Parse error"},[o]:{code:-32600,message:"Invalid Request"},[s]:{code:-32601,message:"Method not found"},[i]:{code:-32602,message:"Invalid params"},[a]:{code:-32603,message:"Internal error"},[c]:{code:-32e3,message:"Server error"}},l=c},53587:(t,e,r)=>{"use strict";var n=r(8129);r.o(n,"IJsonRpcProvider")&&r.d(e,{IJsonRpcProvider:function(){return n.IJsonRpcProvider}}),r.o(n,"formatJsonRpcError")&&r.d(e,{formatJsonRpcError:function(){return n.formatJsonRpcError}}),r.o(n,"formatJsonRpcRequest")&&r.d(e,{formatJsonRpcRequest:function(){return n.formatJsonRpcRequest}}),r.o(n,"formatJsonRpcResult")&&r.d(e,{formatJsonRpcResult:function(){return n.formatJsonRpcResult}}),r.o(n,"getBigIntRpcId")&&r.d(e,{getBigIntRpcId:function(){return n.getBigIntRpcId}}),r.o(n,"isHttpUrl")&&r.d(e,{isHttpUrl:function(){return n.isHttpUrl}}),r.o(n,"isJsonRpcError")&&r.d(e,{isJsonRpcError:function(){return n.isJsonRpcError}}),r.o(n,"isJsonRpcRequest")&&r.d(e,{isJsonRpcRequest:function(){return n.isJsonRpcRequest}}),r.o(n,"isJsonRpcResponse")&&r.d(e,{isJsonRpcResponse:function(){return n.isJsonRpcResponse}}),r.o(n,"isJsonRpcResult")&&r.d(e,{isJsonRpcResult:function(){return n.isJsonRpcResult}}),r.o(n,"isLocalhostUrl")&&r.d(e,{isLocalhostUrl:function(){return n.isLocalhostUrl}}),r.o(n,"isReactNative")&&r.d(e,{isReactNative:function(){return n.isReactNative}}),r.o(n,"isWsUrl")&&r.d(e,{isWsUrl:function(){return n.isWsUrl}}),r.o(n,"payloadId")&&r.d(e,{payloadId:function(){return n.payloadId}})},11834:(t,e,r)=>{"use strict";r.d(e,{eF:()=>a,mE:()=>o,rI:()=>i,vG:()=>s});var n=r(76765);function o(t){return n.jf.includes(t)}function s(t){return Object.keys(n.Uf).includes(t)?n.Uf[t]:n.Uf[n.XW]}function i(t){const e=Object.values(n.Uf).find((e=>e.code===t));return e||n.Uf[n.XW]}function a(t,e,r){return t.message.includes("getaddrinfo ENOTFOUND")||t.message.includes("connect ECONNREFUSED")?new Error("Unavailable ".concat(r," RPC url at ").concat(e)):t}},50301:(t,e,r)=>{"use strict";r.d(e,{ER:()=>s,Im:()=>c,dZ:()=>u,eX:()=>i,e_:()=>a});var n=r(11834),o=r(76765);function s(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3;return Date.now()*Math.pow(10,t)+Math.floor(Math.random()*Math.pow(10,t))}function i(){return BigInt(s(arguments.length>0&&void 0!==arguments[0]?arguments[0]:6))}function a(t,e,r){return{id:r||s(),jsonrpc:"2.0",method:t,params:e}}function c(t,e){return{id:t,jsonrpc:"2.0",result:e}}function u(t,e,r){return{id:t,jsonrpc:"2.0",error:f(e,r)}}function f(t,e){return"undefined"===typeof t?(0,n.vG)(o.zR):("string"===typeof t&&(t=Object.assign(Object.assign({},(0,n.vG)(o.fO)),{message:t})),"undefined"!==typeof e&&(t.data=e),(0,n.mE)(t.code)&&(t=(0,n.rI)(t.code)),t)}},10632:(t,e,r)=>{"use strict";r.d(e,{IJsonRpcProvider:()=>i.kF,formatJsonRpcError:()=>s.dZ,formatJsonRpcRequest:()=>s.e_,formatJsonRpcResult:()=>s.Im,getBigIntRpcId:()=>s.eX,isHttpUrl:()=>a.q$,isJsonRpcError:()=>c.U$,isJsonRpcRequest:()=>c.p3,isJsonRpcResponse:()=>c.tq,isJsonRpcResult:()=>c.xT,isLocalhostUrl:()=>a.z,isWsUrl:()=>a.A1,parseConnectionError:()=>n.eF,payloadId:()=>s.ER});r(76765);var n=r(11834),o=r(53587);r.o(o,"IJsonRpcProvider")&&r.d(e,{IJsonRpcProvider:function(){return o.IJsonRpcProvider}}),r.o(o,"formatJsonRpcError")&&r.d(e,{formatJsonRpcError:function(){return o.formatJsonRpcError}}),r.o(o,"formatJsonRpcRequest")&&r.d(e,{formatJsonRpcRequest:function(){return o.formatJsonRpcRequest}}),r.o(o,"formatJsonRpcResult")&&r.d(e,{formatJsonRpcResult:function(){return o.formatJsonRpcResult}}),r.o(o,"getBigIntRpcId")&&r.d(e,{getBigIntRpcId:function(){return o.getBigIntRpcId}}),r.o(o,"isHttpUrl")&&r.d(e,{isHttpUrl:function(){return o.isHttpUrl}}),r.o(o,"isJsonRpcError")&&r.d(e,{isJsonRpcError:function(){return o.isJsonRpcError}}),r.o(o,"isJsonRpcRequest")&&r.d(e,{isJsonRpcRequest:function(){return o.isJsonRpcRequest}}),r.o(o,"isJsonRpcResponse")&&r.d(e,{isJsonRpcResponse:function(){return o.isJsonRpcResponse}}),r.o(o,"isJsonRpcResult")&&r.d(e,{isJsonRpcResult:function(){return o.isJsonRpcResult}}),r.o(o,"isLocalhostUrl")&&r.d(e,{isLocalhostUrl:function(){return o.isLocalhostUrl}}),r.o(o,"isReactNative")&&r.d(e,{isReactNative:function(){return o.isReactNative}}),r.o(o,"isWsUrl")&&r.d(e,{isWsUrl:function(){return o.isWsUrl}}),r.o(o,"payloadId")&&r.d(e,{payloadId:function(){return o.payloadId}});var s=r(50301),i=r(33453),a=r(81385),c=r(33985)},33453:(t,e,r)=>{"use strict";r.d(e,{kF:()=>n.kF});var n=r(32116)},81385:(t,e,r)=>{"use strict";r.d(e,{A1:()=>a,q$:()=>i,z:()=>c});const n="^https?:",o="^wss?:";function s(t,e){const r=function(t){const e=t.match(new RegExp(/^\w+:/,"gi"));if(e&&e.length)return e[0]}(t);return"undefined"!==typeof r&&new RegExp(e).test(r)}function i(t){return s(t,n)}function a(t){return s(t,o)}function c(t){return new RegExp("wss?://localhost(:d{2,5})?").test(t)}},33985:(t,e,r)=>{"use strict";function n(t){return"object"===typeof t&&"id"in t&&"jsonrpc"in t&&"2.0"===t.jsonrpc}function o(t){return n(t)&&"method"in t}function s(t){return n(t)&&(i(t)||a(t))}function i(t){return"result"in t}function a(t){return"error"in t}r.d(e,{U$:()=>a,p3:()=>o,tq:()=>s,xT:()=>i})},48661:(t,e,r)=>{"use strict";r.d(e,{h:()=>i,j:()=>s});const n=t=>JSON.stringify(t,((t,e)=>"bigint"===typeof e?e.toString()+"n":e)),o=t=>{const e=t.replace(/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g,'$1"$2n"$3');return JSON.parse(e,((t,e)=>"string"===typeof e&&e.match(/^\d+n$/)?BigInt(e.substring(0,e.length-1)):e))};function s(t){if("string"!==typeof t)throw new Error("Cannot safe json parse value of type ".concat(typeof t));try{return o(t)}catch(e){return t}}function i(t){return"string"===typeof t?t:n(t)||""}},99038:(t,e,r)=>{var n="undefined"!==typeof globalThis&&globalThis||"undefined"!==typeof self&&self||"undefined"!==typeof r.g&&r.g,o=function(){function t(){this.fetch=!1,this.DOMException=n.DOMException}return t.prototype=n,new t}();!function(t){!function(e){var n="undefined"!==typeof t&&t||"undefined"!==typeof self&&self||"undefined"!==typeof r.g&&r.g||{},o="URLSearchParams"in n,s="Symbol"in n&&"iterator"in Symbol,i="FileReader"in n&&"Blob"in n&&function(){try{return new Blob,!0}catch(t){return!1}}(),a="FormData"in n,c="ArrayBuffer"in n;if(c)var u=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],f=ArrayBuffer.isView||function(t){return t&&u.indexOf(Object.prototype.toString.call(t))>-1};function l(t){if("string"!==typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw new TypeError('Invalid character in header field name: "'+t+'"');return t.toLowerCase()}function p(t){return"string"!==typeof t&&(t=String(t)),t}function d(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return s&&(e[Symbol.iterator]=function(){return e}),e}function h(t){this.map={},t instanceof h?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){if(2!=t.length)throw new TypeError("Headers constructor: expected name/value pair to be length 2, found"+t.length);this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function y(t){if(!t._noBody)return t.bodyUsed?Promise.reject(new TypeError("Already read")):void(t.bodyUsed=!0)}function b(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function v(t){var e=new FileReader,r=b(e);return e.readAsArrayBuffer(t),r}function m(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function g(){return this.bodyUsed=!1,this._initBody=function(t){var e;this.bodyUsed=this.bodyUsed,this._bodyInit=t,t?"string"===typeof t?this._bodyText=t:i&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:a&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:o&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():c&&i&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=m(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):c&&(ArrayBuffer.prototype.isPrototypeOf(t)||f(t))?this._bodyArrayBuffer=m(t):this._bodyText=t=Object.prototype.toString.call(t):(this._noBody=!0,this._bodyText=""),this.headers.get("content-type")||("string"===typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):o&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},i&&(this.blob=function(){var t=y(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))}),this.arrayBuffer=function(){if(this._bodyArrayBuffer){var t=y(this);return t||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}if(i)return this.blob().then(v);throw new Error("could not read as ArrayBuffer")},this.text=function(){var t=y(this);if(t)return t;if(this._bodyBlob)return function(t){var e=new FileReader,r=b(e),n=/charset=([A-Za-z0-9_-]+)/.exec(t.type),o=n?n[1]:"utf-8";return e.readAsText(t,o),r}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a&&(this.formData=function(){return this.text().then(_)}),this.json=function(){return this.text().then(JSON.parse)},this}h.prototype.append=function(t,e){t=l(t),e=p(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},h.prototype.delete=function(t){delete this.map[l(t)]},h.prototype.get=function(t){return t=l(t),this.has(t)?this.map[t]:null},h.prototype.has=function(t){return this.map.hasOwnProperty(l(t))},h.prototype.set=function(t,e){this.map[l(t)]=p(e)},h.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},h.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),d(t)},h.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),d(t)},h.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),d(t)},s&&(h.prototype[Symbol.iterator]=h.prototype.entries);var R=["CONNECT","DELETE","GET","HEAD","OPTIONS","PATCH","POST","PUT","TRACE"];function w(t,e){if(!(this instanceof w))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r=(e=e||{}).body;if(t instanceof w){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new h(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new h(e.headers)),this.method=function(t){var e=t.toUpperCase();return R.indexOf(e)>-1?e:t}(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal||function(){if("AbortController"in n)return(new AbortController).signal}(),this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(r),("GET"===this.method||"HEAD"===this.method)&&("no-store"===e.cache||"no-cache"===e.cache)){var o=/([?&])_=[^&]*/;if(o.test(this.url))this.url=this.url.replace(o,"$1_="+(new Date).getTime());else{this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}}function _(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function E(t){var e=new h;return t.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t})).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();try{e.append(n,o)}catch(s){console.warn("Response "+s.message)}}})),e}function O(t,e){if(!(this instanceof O))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');if(e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.status<200||this.status>599)throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");this.ok=this.status>=200&&this.status<300,this.statusText=void 0===e.statusText?"":""+e.statusText,this.headers=new h(e.headers),this.url=e.url||"",this._initBody(t)}w.prototype.clone=function(){return new w(this,{body:this._bodyInit})},g.call(w.prototype),g.call(O.prototype),O.prototype.clone=function(){return new O(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new h(this.headers),url:this.url})},O.error=function(){var t=new O(null,{status:200,statusText:""});return t.ok=!1,t.status=0,t.type="error",t};var P=[301,302,303,307,308];O.redirect=function(t,e){if(-1===P.indexOf(e))throw new RangeError("Invalid status code");return new O(null,{status:e,headers:{location:t}})},e.DOMException=n.DOMException;try{new e.DOMException}catch(A){e.DOMException=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},e.DOMException.prototype=Object.create(Error.prototype),e.DOMException.prototype.constructor=e.DOMException}function x(t,r){return new Promise((function(o,s){var a=new w(t,r);if(a.signal&&a.signal.aborted)return s(new e.DOMException("Aborted","AbortError"));var u=new XMLHttpRequest;function f(){u.abort()}if(u.onload=function(){var t={statusText:u.statusText,headers:E(u.getAllResponseHeaders()||"")};0===a.url.indexOf("file://")&&(u.status<200||u.status>599)?t.status=200:t.status=u.status,t.url="responseURL"in u?u.responseURL:t.headers.get("X-Request-URL");var e="response"in u?u.response:u.responseText;setTimeout((function(){o(new O(e,t))}),0)},u.onerror=function(){setTimeout((function(){s(new TypeError("Network request failed"))}),0)},u.ontimeout=function(){setTimeout((function(){s(new TypeError("Network request timed out"))}),0)},u.onabort=function(){setTimeout((function(){s(new e.DOMException("Aborted","AbortError"))}),0)},u.open(a.method,function(t){try{return""===t&&n.location.href?n.location.href:t}catch(e){return t}}(a.url),!0),"include"===a.credentials?u.withCredentials=!0:"omit"===a.credentials&&(u.withCredentials=!1),"responseType"in u&&(i?u.responseType="blob":c&&(u.responseType="arraybuffer")),r&&"object"===typeof r.headers&&!(r.headers instanceof h||n.Headers&&r.headers instanceof n.Headers)){var d=[];Object.getOwnPropertyNames(r.headers).forEach((function(t){d.push(l(t)),u.setRequestHeader(t,p(r.headers[t]))})),a.headers.forEach((function(t,e){-1===d.indexOf(e)&&u.setRequestHeader(e,t)}))}else a.headers.forEach((function(t,e){u.setRequestHeader(e,t)}));a.signal&&(a.signal.addEventListener("abort",f),u.onreadystatechange=function(){4===u.readyState&&a.signal.removeEventListener("abort",f)}),u.send("undefined"===typeof a._bodyInit?null:a._bodyInit)}))}x.polyfill=!0,n.fetch||(n.fetch=x,n.Headers=h,n.Request=w,n.Response=O),e.Headers=h,e.Request=w,e.Response=O,e.fetch=x,Object.defineProperty(e,"__esModule",{value:!0})}({})}(o),o.fetch.ponyfill=!0,delete o.fetch.polyfill;var s=n.fetch?n:o;(e=s.fetch).default=s.fetch,e.fetch=s.fetch,e.Headers=s.Headers,e.Request=s.Request,e.Response=s.Response,t.exports=e}}]);
//# sourceMappingURL=6526.79596c4f.chunk.js.map
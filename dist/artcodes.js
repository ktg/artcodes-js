Object.defineProperty(exports,"__esModule",{value:!0});var t=require("mirada");class e{constructor(t){this.streaming=!1,this.settings=null,this._constraints=t,this.video=document.createElement("video"),this.video.muted=!0,this.video.playsInline=!0,this.video.style.display="none",this.canvas=document.createElement("canvas"),this.canvas.style.display="none",document.body.append(this.video),document.body.append(this.canvas),this.context=this.canvas.getContext("2d"),this.mat=cv.Mat.zeros(10,10,cv.CV_8UC4),this.streaming=!1}get isStreaming(){return this.streaming}get constraints(){return this._constraints}set constraints(t){const e=this.streaming;this.stop(),this._constraints=t,e&&this.start()}get deviceId(){return this._deviceId}read(){this.context.drawImage(this.video,0,0,this.settings.width,this.settings.height);const t=this.context.getImageData(0,0,this.settings.width,this.settings.height);return this.mat.data.set(t.data),this.mat}async start(){this.stream=this.video.srcObject=await navigator.mediaDevices.getUserMedia(this._constraints);const t=this.settings=this.stream.getVideoTracks()[0].getSettings();this._deviceId=t.deviceId;const e=t.width,s=t.height;return this.video.width=e,this.video.height=s,await this.video.play(),this.canvas.width=e,this.canvas.height=s,this.mat=cv.Mat.zeros(s,e,cv.CV_8UC4),this.streaming=!0,t}stop(){var t;this.streaming&&(null===(t=this.stream)||void 0===t||t.getVideoTracks().forEach((t=>t.stop())),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.video.pause(),this.streaming=!1,this.mat.delete())}}class s{constructor(t,e,s){this.nodeIndex=t,this.regions=e,this.action=s}equals(t){return null!=t&&this.regions.length==t.regions.length&&this.regions.every((function(e,s){return e===t.regions[s]}))}}class i{constructor(t,e){this.code=t,this.action=e}}class n{constructor(t){this.experience=t;let e=Array(),s=20,n=1,a=20,r=1;t.actions.forEach((t=>{t.codes.forEach((o=>{const c=new i(o.split(":").map((t=>Number.parseInt(t))),t);e.push(c),a=Math.min(c.code.length,a),r=Math.max(c.code.length,r),c.code.forEach((t=>{s=Math.min(t,s),n=Math.max(t,n)}))}))})),this.codes=e,this.maxRegions=a,this.minRegions=r,this.maxValue=n,this.minValue=s}findMarker(t){for(let e=0;e<t.cols;++e){let s=this.createMarkerForNode(e,t);if(null!=s)return s}return null}static getFirstChild(t,e){return t.intPtr(0,e)[2]}static getNextNode(t,e){return t.intPtr(0,e)[0]}createMarkerForNode(t,e){let i=[],a=n.getFirstChild(e,t);for(;a>=0;){let t=this.countLeafs(a,e);if(null==t)return null;if(i.length>=this.maxRegions)return null;i.push(t),a=n.getNextNode(e,a)}if(i.length<this.minRegions)return null;i.sort();for(let e of this.codes){if(e.code.length==i.length&&e.code.every(((t,e)=>t===i[e])))return new s(t,i,e.action)}return null}countLeafs(t,e){let s=0,i=n.getFirstChild(e,t);for(;i>=0;){if(n.getFirstChild(e,i)>=0)return null;if(s++,s>this.maxValue)return null;i=n.getNextNode(e,i)}return s<this.minValue?null:s}}var a;function r(t){if(null==t)return new cv.Scalar(255,255,0,255);const e=function(t){if("#"==t.substr(0,1)){const e=(t.length-1)/3,s=[17,1,.062272][e-1];return[Math.round(parseInt(t.substr(1,e),16)*s),Math.round(parseInt(t.substr(1+e,e),16)*s),Math.round(parseInt(t.substr(1+2*e,e),16)*s)]}return t.split("(")[1].split(")")[0].split(",").map((t=>+t))}(t);return new cv.Scalar(e[0],e[1],e[2],255)}exports.ScannerState=void 0,(a=exports.ScannerState||(exports.ScannerState={}))[a.loading=0]="loading",a[a.idle=1]="idle",a[a.scanning=2]="scanning";class o{constructor(t,s){var i;this._state=exports.ScannerState.loading,this.fps=10,this.currentMarker=null,this.selectListener=()=>{var t;this.camera.stop(),this.camera.constraints={video:{deviceId:null===(t=this.options.deviceSelect)||void 0===t?void 0:t.value}},this.start()},this.experience=t,this.options=s,this.detector=new n(t),this.camera=new e({video:{facingMode:"environment"},audio:!1}),null===(i=s.stateChanged)||void 0===i||i.call(s,exports.ScannerState.loading)}setState(t){var e,s;this._state=t,null===(s=(e=this.options).stateChanged)||void 0===s||s.call(e,t)}get state(){return this._state}async start(){var t,e,s,i,n,a,o;if(this._state!=exports.ScannerState.scanning)try{const c=(null===(t=this.experience.settings)||void 0===t?void 0:t.actionTimout)||5e3,h=(null===(e=this.experience.settings)||void 0===e?void 0:e.threshSize)||101,l=(null===(s=this.experience.settings)||void 0===s?void 0:s.threshConst)||1,d=r(this.options.outlineColor),u=await this.camera.start(),v=new cv.Mat(u.width,u.height,cv.CV_8UC1);this.options.canvas.width=u.width,this.options.canvas.height=u.height;let p=0;if(null===(n=(i=this.options).stateChanged)||void 0===n||n.call(i,exports.ScannerState.scanning),null===(o=(a=this.options).markerChanged)||void 0===o||o.call(a,null),this.options.useUrlHash&&history.replaceState(null,"","#play"),null!=this.options.deviceSelect){for(this.options.deviceSelect.removeEventListener("input",this.selectListener);this.options.deviceSelect.options.length>0;)this.options.deviceSelect.remove(0);const t=(await navigator.mediaDevices.enumerateDevices()).filter((t=>"videoinput"==t.kind));t.length>1&&(t.forEach((t=>{var e;const s=document.createElement("option");s.value=t.deviceId,s.innerHTML=t.label,null===(e=this.options.deviceSelect)||void 0===e||e.appendChild(s)})),null!=this.camera.deviceId&&(this.options.deviceSelect.value=this.camera.deviceId),this.options.deviceSelect.addEventListener("input",this.selectListener),this.options.deviceSelect.style.display="")}const g=()=>{var t,e,s,i;if(this.camera.isStreaming){const n=Date.now(),a=this.camera.read();cv.cvtColor(a,v,cv.COLOR_RGBA2GRAY),cv.adaptiveThreshold(v,v,255,cv.ADAPTIVE_THRESH_MEAN_C,cv.THRESH_BINARY,h,l);const r=new cv.MatVector,o=new cv.Mat;cv.findContours(v,r,o,cv.RETR_TREE,cv.CHAIN_APPROX_SIMPLE),this.options.debugView?cv.cvtColor(v,v,cv.COLOR_GRAY2RGBA):a.copyTo(v);const m=this.detector.findMarker(o);null!=m?(m.equals(this.currentMarker)||(this.currentMarker=m,null===(e=(t=this.options).markerChanged)||void 0===e||e.call(t,m)),p=Date.now()+c,cv.drawContours(v,r,m.nodeIndex,d,2,cv.LINE_AA,o,100)):null!=this.currentMarker&&0!=p&&Date.now()>p&&(p=0,this.currentMarker=m,null===(i=(s=this.options).markerChanged)||void 0===i||i.call(s,null)),"user"==u.facingMode&&cv.flip(v,v,1),cv.imshow(this.options.canvas,v);const S=1e3/this.fps-(Date.now()-n);setTimeout(g,S)}else v.delete(),this.setState(exports.ScannerState.idle)};g()}catch(t){console.log("error: ",t.message,t.name),console.trace(t),this.stop()}}stop(){this.options.useUrlHash&&history.replaceState(null,""," "),this.camera.stop(),this.setState(exports.ScannerState.idle)}}exports.Marker=s,exports.Scanner=o,exports.createScanner=async function(e,s){if("https:"!=location.protocol&&"localhost"!=location.hostname)throw new Error("Artcodes requires https in order to access camera");await t.loadOpencv({opencvJsLocation:"opencv.js"});const i=new o(e,s);return"#play"==location.hash?await i.start():i.stop(),i};

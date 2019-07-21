const TOOL = {

/*
  The comments explain what every function do, and the words in [brackets] explay how should be readed the key word; there are also words between the brackets just to connect the acronym words

  *list of key-words below*

  $I : id (String) | ex. "myId"
  $T : Element tag (String) | ex. "div"
  $p : path (Element) | ex. document.body
  $E : Element | ex. document.body
  $S : String | ex. ""
  $A : Array | ex. []
  $o : output
  S$ : not String (Array or Object) | ex. [] or {}
  $f : flag (Boolean)
  $s : symbol
  $n : name (string)
  r : range (Number)
  $N : Number
  k : key (String)
  sg : signature (String)
  l : length (Number)
  $O : Object 
  v : value (String/Object....)

*/

"DOM":{
// createElement [Create Element]
"cE":function($T){if($T&&typeof $T=="string"){return document.createElement($T)}},
// getElementById [Get Element] by id
"gE":function($I,$p){if($I&&typeof $I=="string"){$p=$p?$p:document;return $p.getElementById($I)}},
// querySelectorAll [Query Selector All]
"qSA":function($S,$p,$N){if($S&&typeof $S=="string"){$p=$p?$p:document;let $o=$p.querySelectorAll($S);$N=typeof $N=="number"||!isNaN($N)?Number($N):null;return !$N&&typeof $N!=="number"?$o:$o[$N]}},
// appendChild [Append Child]
"aC":function($E,$p){if($E&&$E instanceof HTMLElement){$p=$p?$p:document.body;return $p.appendChild($E)}},
// removeChild [Remove Child]
"rC":function($E,$p){if($E&&$E instanceof HTMLElement){$p=$p?$p:document.body;return $p.removeChild($E)}},
// [<Element> Attributes]
"eAttr":function($E,$O){if($E&&$O&&$E instanceof HTMLElement&&typeof $O=="object"){let k=Object.keys($O);for(let i=0;i<k.length;i++){let $n=k[i];$E[$n]=$O[$n]}}}
},
// let t=TOOL.Math;let r=t.r(5-10)
"Math":{
"f":function($N){if($N&&typeof $N=="number"){return Math.floor($N)}},
"r":function($N){if($N&&typeof $N=="number"){return Math.round($N)}},
"c":function($N){if($N&&typeof $N=="number"){return Math.ceil($N)}},
"a":function($N){if($N&&typeof $N=="number"){return Math.abs($N)}},
// random a number [Math Random]
"R":function($N,r){if($N&&!isNaN($N)||typeof $N=="number"){return r&&!isNaN(r)||typeof r=="number"?Math.floor(Math.random()*(r-$N))+$N:Math.floor(Math.random()*$N)}}
},

"Array":{
"r":function($A){if($A&&Array.isArray($A)){return $A.reduce((a,b)=>a+b)}},
"s":function($A,$N,r){if($A&&$N&&Array.isArray($A)&&!isNaN($N)){return !isNaN(r)&&r>=$N?$A.slice($N,r):$A.slice($N)}},
// [Recurring Values Indexes]
"rVI":function(v,$A){if(v&&$A&&Array.isArray($A)){v=Array.isArray(v)?v:[v];let $o=[];for(let I=0;I<v.length;I++){for(let i=0;i<$A.length;i++){if(JSON.stringify($A[i])==JSON.stringify(v[I])){$o.push(i)}}}return $o.sort((a,b)=>a-b)}}
},

"String":{

// variety of symbols that are supported in the text encoding/decoding  [Symbols]
"s":["A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y","Z","z","à","è","é","ì","ò","ù","0","1","2","3","4","5","6","7","8","9","Й","й","Ц","ц","У","у","К","к","Е","е","Н","н","Г","г","Ш","ш","Щ","щ","З","з","Х","х","Ъ","ъ","Ф","ф","Ы","ы","В","в","А","а","П","п","Р","р","О","о","Л","л","Д","д","Ж","ж","Э","э","Я","я","Ч","ч","С","с","М","м","И","и","Т","т","Ь","ь","Б","б","Ю","ю",".",",",";",":","!","?","\"","'","\\","{","}","[","]","(",")","&","|","~","*","#","<",">","@","%","_","-","+","=","/","`"," ","$","€","^"],
// return an encrypted string wich encode method is based on a key
"encode":class{constructor($S,k,$f){this.output="";if($S&&typeof $S=="string"&&k){let t=TOOL.String;$S=t.tSC($S);k=t.tSC(k);k=String(k);let o=t.oStr($S+k);let c=t.cA(k,t.s);[...o].forEach(v=>{let $s=c[TOOL.Array.rVI(v,t.s)[0]];if(typeof $s!=="undefined"){this.output+=$s}});this.signature=this.output.slice(-k.length);this.output=this.output.slice(0,-k.length);if(!$f){delete this.signature}}else{this.output=$S&&!k?$S:undefined}}},
// decodes a string with the use of a key
"decode":class{constructor($S,k){this.output="";if($S&&typeof $S=="string"&&k){let t=TOOL.String;$S=t.tSC($S);k=t.tSC(k);let o=t.oStr($S);let c=t.cA(k,t.s);[...o].forEach(v=>{this.output+=t.s[TOOL.Array.rVI(v,c)[0]]})}else{this.output=$S&&!k?$S:undefined}}},
// [Create] new [Array] for encoder/decoder
"cA":function($S,$A){if($S&&$A&&typeof $S=="string"&&Array.isArray($A)){let t=TOOL.String;let k=t.oStr($S);let n=0;let l=$A.length;[...k].forEach(v=>{n+=TOOL.Array.rVI(v,$A)});let a=Math.floor(n/l);let i=n-(a*l)+a;while(i>l){i=i-l+1}let c=[...$A.slice(i),...$A.slice(0,i)];return c}},
// returns a String as a new String() [Object String]
"oStr":function($S){if($S&&typeof $S=="string"){return Object(String($S))}},
// decode validate if decode was correct
"dVal":function($S,k,sg){if($S&&typeof $S=="string"&&k||typeof k=="number"&&sg){k=String(k);let t=TOOL.String;let o=new t.decode($S,k);let s=new t.decode(sg,k);if(s.output===k){return true}else{return false}}},
// [Toggle] all the [special Characters] from a String
"tSC":function($S){if($S&&typeof $S=="string"){$S=$S.replace(/(\r\n\t|\n|\r\t)/gm,"")}return $S},
// [Encode] and [Stringify Data] returns a String
"eSD":function(S$,k){if(S$&&k&&typeof S$!=="string"&&typeof k=="string"){let t=TOOL;S$=t.JS(S$);S$=new t.string.encode(S$,k).output;return S$}},
// [Decode] and [Parse String] into data
"dPS":function($S,k){if($S&&k||typeof k=="number"&&typeof $S+k=="string"){let t=TOOL;k=String(k);$S=new t.string.decode($S,k).output;return t.JP($S)}},
// return a random generated string [Random String] generator
"rS":function(l){if(l&&!isNaN(l)){let t=TOOL;let s=t.string.s;let $o="";for(let i=0;i<l;i++){$o+=s[t.MR(s.length)]}return $o}},
// how many times each symbol is used in a string [String Symbol Analyzer]
"sSA":class{constructor($S,$f){if($S&&typeof $S=="string"){let o=$f&&typeof $f=="boolean"?Object($S):Object($S.toLowerCase());let l=[o[0]];[...o].forEach(v=>{if(!l.includes(v)){l.push(v)}});l.forEach(v=>{this[v]=[...o].filter(a=>a==v).length})}}}
},

"LS":{
// localStorage.setItem(name,value) [Local Storage Set] item
"s":function($n,$v){if($n&&$v&&typeof $n=="string"){localStorage.setItem($n,$v)}},
// localStorage.getItem(name) [Local Storage Get] item
"g":function($n){if($n&&typeof $n=="string"){return localStorage.getItem($n)}},
// delete localStorage[name] [Local Storage Delete] item
"d":function($n){if($n&&typeof $n=="string"){delete localStorage[$n]}}
},

"JSON":{
// JSON.stringify(non_string) [Json Stringify]
"s":function(S$){if(S$&&typeof S$!=="string"){return JSON.stringify(S$)}},
// JSON.parse(string) [Json Parse]
"p":function($S){if($S&&typeof $S=="string"){return JSON.parse($S)}}
}


}

/*
const TOOL={"DOM":{"cE":function($T){if($T&&typeof $T=="string"){return document.createElement($T)}},"gE":function($I,$p){if($I&&typeof $I=="string"){$p=$p?$p:document;return $p.getElementById($I)}},"qSA":function($S,$p,$N){if($S&&typeof $S=="string"){$p=$p?$p:document;let $o=$p.querySelectorAll($S);$N=typeof $N=="number"||!isNaN($N)?Number($N):null;return!$N&&typeof $N!=="number"?$o:$o[$N]}},"aC":function($E,$p){if($E&&$E instanceof HTMLElement){$p=$p?$p:document.body;return $p.appendChild($E)}},"rC":function($E,$p){if($E&&$E instanceof HTMLElement){$p=$p?$p:document.body;return $p.removeChild($E)}},"eAttr":function($E,$O){if($E&&$O&&$E instanceof HTMLElement&&typeof $O=="object"){let k=Object.keys($O);for(let i=0;i<k.length;i++){let $n=k[i];$E[$n]=$O[$n]}}}},"Math":{"f":function($N){if($N&&typeof $N=="number"){return Math.floor($N)}},"r":function($N){if($N&&typeof $N=="number"){return Math.round($N)}},"c":function($N){if($N&&typeof $N=="number"){return Math.ceil($N)}},"a":function($N){if($N&&typeof $N=="number"){return Math.abs($N)}},"R":function($N,r){if($N&&!isNaN($N)||typeof $N=="number"){return r&&!isNaN(r)||typeof r=="number"?Math.floor(Math.random()*(r-$N+1))+$N:Math.floor(Math.random()*$N)}}},"Array":{"r":function($A){if($A&&Array.isArray($A)){return $A.reduce((a,b)=>a+b)}},"s":function($A,$N,r){if($A&&$N&&Array.isArray($A)&&!isNaN($N)){return!isNaN(r)&&r>=$N?$A.slice($N,r):$A.slice($N)}},"rVI":function($s,$A){if($s&&$A&&Array.isArray($A)){$s=typeof $s=="number"?String($s):$s;let $o=[];for(let i=0;i<$A.length;i++){if(String($A[i])==$s){$o.push(i)}}return $o}}},"String":{"s":["A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y","Z","z","à","è","é","ì","ò","ù","0","1","2","3","4","5","6","7","8","9","Й","й","Ц","ц","У","у","К","к","Е","е","Н","н","Г","г","Ш","ш","Щ","щ","З","з","Х","х","Ъ","ъ","Ф","ф","Ы","ы","В","в","А","а","П","п","Р","р","О","о","Л","л","Д","д","Ж","ж","Э","э","Я","я","Ч","ч","С","с","М","м","И","и","Т","т","Ь","ь","Б","б","Ю","ю",".",",",";",":","!","?","\"","'","\\","{","}","[","]","(",")","&","|","~","*","#","<",">","@","%","_","-","+","=","/","`"," ","$","€","^"],"encode":class{constructor($S,k,$f){this.output="";if($S&&typeof $S=="string"&&k){let t=TOOL.String;$S=t.tSC($S);k=t.tSC(k);k=String(k);let o=t.oStr($S+k);let c=t.cA(k,t.s);[...o].forEach(v=>{let $s=c[TOOL.Array.rVI(v,t.s)[0]];if(typeof $s!=="undefined"){this.output+=$s}});this.signature=this.output.slice(-k.length);this.output=this.output.slice(0,-k.length);if(!$f){delete this.signature}}else{this.output=$S&&!k?$S:undefined}}},"decode":class{constructor($S,k){this.output="";if($S&&typeof $S=="string"&&k){let t=TOOL.String;$S=t.tSC($S);k=t.tSC(k);let o=t.oStr($S);let c=t.cA(k,t.s);[...o].forEach(v=>{this.output+=t.s[TOOL.Array.rVI(v,c)[0]]})}else{this.output=$S&&!k?$S:undefined}}},"cA":function($S,$A){if($S&&$A&&typeof $S=="string"&&Array.isArray($A)){let t=TOOL.String;let k=t.oStr($S);let n=0;let l=$A.length;[...k].forEach(v=>{n+=TOOL.Array.rVI(v,$A)});let a=Math.floor(n/l);let i=n-(a*l)+a;while(i>l){i=i-l+1}let c=[...$A.slice(i),...$A.slice(0,i)];return c}},"oStr":function($S){if($S&&typeof $S=="string"){return Object(String($S))}},"dVal":function($S,k,sg){if($S&&typeof $S=="string"&&k||typeof k=="number"&&sg){k=String(k);let t=TOOL.String;let o=new t.decode($S,k);let s=new t.decode(sg,k);if(s.output===k){return!0}else{return!1}}},"tSC":function($S){if($S&&typeof $S=="string"){$S=$S.replace(/(\r\n\t|\n|\r\t)/gm,"")}return $S},"eSD":function(S$,k){if(S$&&k&&typeof S$!=="string"&&typeof k=="string"){let t=TOOL;S$=t.JS(S$);S$=new t.string.encode(S$,k).output;return S$}},"dPS":function($S,k){if($S&&k||typeof k=="number"&&typeof $S+k=="string"){let t=TOOL;k=String(k);$S=new t.string.decode($S,k).output;return t.JP($S)}},"rS":function(l){if(l&&!isNaN(l)){let t=TOOL;let s=t.string.s;let $o="";for(let i=0;i<l;i++){$o+=s[t.MR(s.length)]}return $o}},"sSA":class{constructor($S,$f){if($S&&typeof $S=="string"){let o=$f&&typeof $f=="boolean"?Object($S):Object($S.toLowerCase());let l=[o[0]];[...o].forEach(v=>{if(!l.includes(v)){l.push(v)}});l.forEach(v=>{this[v]=[...o].filter(a=>a==v).length})}}}},"LS":{"s":function($n,$v){if($n&&$v&&typeof $n=="string"){localStorage.setItem($n,$v)}},"g":function($n){if($n&&typeof $n=="string"){return localStorage.getItem($n)}},"d":function($n){if($n&&typeof $n=="string"){delete localStorage[$n]}}},"JSON":{"s":function(S$){if(S$&&typeof S$!=="string"){return JSON.stringify(S$)}},"p":function($S){if($S&&typeof $S=="string"){return JSON.parse($S)}}}};
*/
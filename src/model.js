export const MODES = [
  {id:'cake',name:'Just One Slice',tag:'THAT WAS PER SLICE.',icon:'cake',color:'#ed93ba',rounds:1,unit:5,bonus:0,rule:'Spin for a slice price. The catch: Faith sells the whole eight-slice cake. The cake opens up and all eight slices are charged at that price.',short:'One little slice price. One whole-cake bill.',action:'Price a slice'},
  {id:'candles',name:'Wish Again',tag:'YOU LEFT THE CANDLES ON.',icon:'candle',color:'#b79bed',rounds:3,unit:5,bonus:5,rule:'Three puffs pay the candles you blow out; each relights at a higher price. The catch: all four burning candles go on the final bill again, at their new prices.',short:'Blow them out. The relit candles come back on the bill.',action:'Blow the candles'},
  {id:'balloons',name:'The Whole Bunch',tag:'THEY COME AS A SET.',icon:'balloon',color:'#86d9c5',rounds:3,unit:5,bonus:10,rule:'Three pops charge connected matching balloons and a bonus for a chain of three or more. The catch: the balloons still standing are part of the set. They get charged too.',short:'Pay for what you pop. Then the ones you did not.',action:'Pop a balloon'},
  {id:'guests',name:'Plus-Ones Have Plus-Ones',tag:'THEY BROUGHT FRIENDS. AGAIN.',icon:'invite',color:'#e9b272',rounds:2,unit:5,bonus:15,rule:'Two spins invite guests, with cover per person and service per full table of three. The catch: every guest brings a plus-one, and all those guests bring another. The guest list quadruples; the extra people and new tables join the bill.',short:'A few guests. Two waves of uninvited plus-ones.',action:'Send an invite'},
  {id:'wishes',name:'Wishful Spending',tag:'THAT INCLUDES YOUR FIRST SPINS.',icon:'star',color:'#aea7ed',rounds:3,unit:5,bonus:15,rule:'Pick two wishes. Three spins pay a base gift plus a bonus on a chosen wish; repeat matches double that bonus. The catch: the birthday wish doubles the entire bill, including the two ordinary spins before this game.',short:'Make a wish. Double the entire round.',action:'Make a wish'},
  {id:'chairs',name:'Reserved For Everyone',tag:'YOU BOOKED THE WHOLE TABLE.',icon:'chair',color:'#e79db2',rounds:3,unit:5,bonus:0,rule:'Three spins charge a chair and pass its value to its two neighbors. The catch: every chair still at the table is on your reservation. All remaining chair prices are added together and charged once.',short:'Take three seats. Find out who paid for the table.',action:'Take a seat'},
  {id:'confetti',name:'Confetti Cleanup',tag:'YOU POP IT. YOU PAY FOR IT.',icon:'cannon',color:'#ed93ba',rounds:3,unit:5,bonus:10,rule:'Three cash spins fill one popper. Each unit of cash also loads one confetti ticket. Pull the cord: the cash comes out, followed by a cleaning charge for every ticket. The piece count and editable fee are shown in the reveal.',short:'One cash-filled popper. A very expensive mess.',action:'Fill the popper'},
  {id:'ribbon',name:'Wrapping Not Included',tag:'THAT PRICE WAS PER INCH.',icon:'bow',color:'#ce9bdd',rounds:1,unit:5,bonus:0,rule:'Spin for one to six feet of ribbon, initially quoted at the base price per foot. The catch: the price tag says per inch. Every foot unfolds into twelve priced inches, making the ribbon bill twelve times the quote.',short:'Order a little ribbon. Read the tiny price tag.',action:'Measure the ribbon'},
  {id:'photos',name:'Say Fees!',tag:'THOSE WERE DIGITS, DARLING.',icon:'camera',color:'#a7c4eb',rounds:3,unit:1,bonus:0,rule:'Three photos print digits one to six. They first look like three small amounts added together. The catch: the plus signs vanish and the photos slide into the largest possible three-digit bill, multiplied by the editable number rate.',short:'Three small numbers. One very big receipt.',action:'Take a photo'},
  {id:'bingo',name:'Birthday Discount*',tag:'THE DISCOUNT IS A SURCHARGE.',icon:'coupon',color:'#bdc98c',rounds:2,unit:10,bonus:0,rule:'Spin a gift price, then a coupon marked 25, 50, 75 or 100 percent off. The catch: the coupon flips from OFF to ON. That percentage is added to the gift price. The bill never decreases; amounts round to the nearest cent.',short:'A birthday discount. Terms and conditions apply.',action:'Spin the offer'},
];
export const PALETTE=['#e89ab9','#bca4ea','#9edacb','#f1cf8c'];
export const money=n=>'$'+(n/100).toLocaleString('en-US',{minimumFractionDigits:n%100?2:0,maximumFractionDigits:2});
export const mode=id=>MODES.find(m=>m.id===id);
const OLD_NAMES={cake:['Layer Cake Levy'],candles:['Trick Candle Club'],balloons:['Balloon Avalanche'],guests:['The Plus-One Problem'],chairs:['Musical Shares'],confetti:['Confetti Overload','Party Popper Payday'],ribbon:['Ribbon Runaround'],photos:['Birthday Photo Finish'],bingo:['Birthday Bingo']};
export function defaults(){return {version:3,cash:[5,10,15,20,25,30,15,10],seconds:5.6,volume:.35,modes:Object.fromEntries(MODES.map(m=>[m.id,{name:m.name,enabled:true,unit:m.unit,bonus:m.bonus}]))};}
export function settings(raw){
  const d=defaults();if(!raw||typeof raw!=='object')return d;
  const num=(v,f,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?Math.round(v*100)/100:f;
  return {...d,cash:d.cash.map((v,i)=>num(raw.cash?.[i],v,0,10000)),seconds:num(raw.seconds,d.seconds,3.5,12),volume:num(raw.volume,d.volume,0,1),modes:Object.fromEntries(MODES.map(m=>{
    const v={...(raw.modes?.[m.id]??{})};
    if(raw.version!==3){
      if(OLD_NAMES[m.id]?.includes(v.name))v.name=m.name;
      if(m.id==='confetti'&&(raw.version!==2||v.bonus===25))v.bonus=m.bonus;
    }
    return [m.id,{name:typeof v.name==='string'&&v.name.trim()?v.name.trim().slice(0,32):m.name,enabled:typeof v.enabled==='boolean'?v.enabled:true,unit:num(v.unit,m.unit,0,1000),bonus:num(v.bonus,m.bonus,0,10000)}];
  }))};
}
const cents=n=>Math.round(n*100);
let roundSequence=0;
export function round(player=''){return {version:2,roundId:++roundSequence,player:player.slice(0,40),mode:null,phase:'ready',warmups:0,turn:0,total:0,remaining:2,memory:{},log:[],last:null,revision:0};}
function award(s,amount,title,detail,meta={}){if(!Number.isSafeInteger(amount)||amount<0)throw Error('Invalid award');s.total+=amount;s.last={amount,title,detail,...meta};s.log.push({...s.last,mode:s.mode});s.log=s.log.slice(-40);s.revision++;}
export function activate(s,id,c){const m=mode(id);if(!m)throw Error('Unknown birthday game');s.mode=id;s.phase=id==='wishes'?'choose':'ready';s.turn=0;s.remaining=m.rounds;s.last=null;const u=cents(c.modes[id].unit);s.memory=id==='cake'?{layers:[]}:id==='candles'?{values:[u,2*u,3*u,4*u],hits:[0,0,0,0]}:id==='balloons'?{colors:[0,0,1,1,0,2,2,1,3,3,2,3],popped:[]}:id==='guests'?{guests:0,tables:0}:id==='wishes'?{chosen:[],matches:[0,0,0,0]}:id==='chairs'?{chairs:[1,2,3,4,5,6].map((n,i)=>({id:i,value:n*u}))}:id==='confetti'?{deposits:[],loaded:0,pieces:0,fired:false}:id==='ribbon'?{distance:0,milestones:[]}:id==='photos'?{digits:[],order:[]}: {quote:0,percent:0};s.memory.openingTotal=s.total;s.revision++;return s;}
export function select(s,index){if(s.phase!=='choose'||!Number.isInteger(index))return false;if(s.mode==='wishes'&&index>=0&&index<4){const a=s.memory.chosen,i=a.indexOf(index);if(i>=0)a.splice(i,1);else if(a.length<2)a.push(index);s.revision++;return true;}return false;}
export function confirm(s,c,choice){
  if(choice!==undefined)return false;
  if(s.phase==='choose'&&s.mode==='wishes'&&s.memory.chosen.length===2){s.phase='ready';s.revision++;return true;}
  if(s.phase!=='reveal'||!s.memory.reveal)return false;
  const r=s.memory.reveal;
  if(s.mode==='confetti')s.memory.fired=true;
  award(s,r.due,r.title,r.equation,{kind:'twist',scam:s.mode,quote:r.quote,extra:r.extra,gameTotal:r.result});
  s.phase='finished';return true;
}
// Each reveal is frozen when the last spin lands. Changing config or repeating
// confirm cannot alter or pay an already revealed bill.
export function makeReveal(s,c){
  const mem=s.memory,u=cents(c.modes[s.mode].unit),b=cents(c.modes[s.mode].bonus),charged=s.total-mem.openingTotal;
  let quote=charged,extra=0,proof={},equation='',title=mode(s.mode).tag;
  switch(s.mode){
    case 'cake':extra=quote*7;proof={price:quote,count:8};equation=`8 slices × ${money(quote)} = ${money(quote*8)}`;break;
    case 'candles':extra=mem.values.reduce((a,n)=>a+n,0);proof={values:[...mem.values]};equation=`${money(quote)} already charged + ${money(extra)} for the relit candles`;break;
    case 'balloons':{const remaining=mem.colors.map((_,i)=>i).filter(i=>!mem.popped.includes(i));extra=remaining.reduce((a,i)=>a+(i%3+1)*u,0);proof={remaining,values:mem.colors.map((_,i)=>(i%3+1)*u),popped:[...mem.popped]};equation=`${money(quote)} popped + ${money(extra)} still on the string`;break;}
    case 'guests':{const original=mem.guests,guests=original*4,extraGuests=guests-original,newTables=Math.floor(guests/3)-mem.tables;extra=extraGuests*u+newTables*b;proof={original,guests,extraGuests,newTables,cover:u,service:b};equation=`${money(quote)} booked + ${extraGuests} guests × ${money(u)} + ${newTables} tables × ${money(b)}`;break;}
    case 'wishes':quote=s.total;extra=quote;proof={opening:mem.openingTotal,birthday:charged,chosen:[...mem.chosen]};equation=`(${money(mem.openingTotal)} earlier spins + ${money(charged)} birthday game) × 2`;break;
    case 'chairs':extra=mem.chairs.reduce((a,x)=>a+x.value,0);proof={chairs:mem.chairs.map(x=>({...x}))};equation=`${money(quote)} seats taken + ${money(extra)} reserved seats`;break;
    case 'confetti':quote=mem.loaded;extra=mem.pieces*b;proof={pieces:mem.pieces,fee:b,loaded:mem.loaded};equation=`${money(quote)} in the popper + ${mem.pieces} tickets × ${money(b)} cleaning fee`;break;
    case 'ribbon':extra=quote*11;proof={feet:mem.distance,inches:mem.distance*12,price:u};equation=`${mem.distance} feet = ${mem.distance*12} inches × ${money(u)}`;break;
    case 'photos':{const digits=[...mem.digits].sort((a,b)=>b-a),number=Number(digits.join(''));quote=mem.digits.reduce((a,n)=>a+n*u,0);extra=number*u-quote;proof={digits:[...mem.digits],sorted:digits,number,rate:u};equation=`${mem.digits.join(' + ')} becomes ${number} × ${money(u)}`;break;}
    case 'bingo':quote=mem.quote;extra=Math.round(quote*mem.percent/100);proof={percent:mem.percent,fee:extra};equation=`${money(quote)} + ${mem.percent}% (${money(extra)})`;break;
  }
  const result=quote+extra;
  const due=['confetti','photos'].includes(s.mode)?result:extra;
  return {mode:s.mode,title,quote,extra,result,due,roundTotal:s.total+due,equation,proof};
}
export function sectors(s,c){const u=cents(c.modes[s.mode]?.unit??0);if(!s.mode)return c.cash.map((n,i)=>({label:money(cents(n)),value:cents(n),color:PALETTE[i%2]}));const labels=(values,fn)=>values.map((n,i)=>({label:fn(n),value:n,color:PALETTE[i%4]}));switch(s.mode){case 'cake':return labels([1,2,3,4,2,3,5,1],n=>money(n*u));case 'candles':return labels([1,2,3,1,2,3,1,2],n=>n+' PUFF'+(n>1?'S':''));case 'balloons':return s.memory.colors.map((color,i)=>({label:String(i+1),value:i,color:PALETTE[color]})).filter(x=>!s.memory.popped.includes(x.value));case 'guests':return labels([1,2,1,3,2,1,2,3],n=>'+'+n+' GUEST'+(n>1?'S':''));case 'wishes':return ['CROWN','CAKE','STAR','HEART','CROWN','CAKE','STAR','HEART'].map((label,i)=>({label,value:i%4,color:PALETTE[i%4]}));case 'chairs':return s.memory.chairs.map((x,i)=>({label:money(x.value),value:x.id,color:PALETTE[i%4]}));case 'confetti':return labels([1,2,3,4,5,6,2,3],n=>money(n*u));case 'ribbon':return labels([1,2,3,4,5,6,2,3],n=>n+' LENGTH'+(n>1?'S':''));case 'photos':return labels([1,2,3,4,5,6],String);case 'bingo':return s.turn===0?labels([2,3,4,5,6,7,8,5],n=>money(n*u)):labels([25,50,75,100,50,75,100,25],n=>'-'+n+'%');default:return [];}}
export function plan(s,c,rng=Math.random){if(s.phase!=='ready'||s.remaining<=0)return null;const items=sectors(s,c),r=Math.max(0,Math.min(.999999999,rng()));return {roundId:s.roundId,mode:s.mode,turn:s.turn,revision:s.revision,index:Math.floor(r*items.length),items};}
export const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function neighbors(i){const a=[];if(i%4)a.push(i-1);if(i%4<3)a.push(i+1);if(i>=4)a.push(i-4);if(i<8)a.push(i+4);return a;}
export function settle(s,p,c){if(!p||s.roundId!==p.roundId||s.mode!==p.mode||s.turn!==p.turn||s.revision!==p.revision||!['ready','spinning'].includes(s.phase))return false;const actual=sectors(s,c)[p.index];if(!actual)return false;const value=actual.value,u=cents(c.modes[s.mode]?.unit??0),b=cents(c.modes[s.mode]?.bonus??0),mem=s.memory;s.phase='ready';s.turn++;s.remaining--;if(!s.mode){s.warmups++;award(s,value,'A LITTLE BIRTHDAY GIFT',money(value));if(s.warmups===2)s.phase='activate';return true;}
switch(s.mode){case 'cake':{mem.layers.push(value*u);const sum=mem.layers.reduce((a,x)=>a+x,0);award(s,sum,'JUST ONE LITTLE SLICE',money(sum)+' for a slice',{kind:'cake',layers:[...mem.layers]});break;}
case 'candles':{const start=(s.turn-1)%4,hits=Array.from({length:value},(_,i)=>(start+i)%4),amount=hits.reduce((a,i)=>a+mem.values[i],0);const before=hits.map(i=>mem.values[i]);hits.forEach(i=>{mem.values[i]+=b;mem.hits[i]++;});award(s,amount,'THEY RELIT. OF COURSE.',before.map(money).join(' + '),{kind:'candles',hits});break;}
case 'balloons':{const queue=[value],popped=[],seen=new Set(mem.popped);while(queue.length){const i=queue.pop();if(seen.has(i)||mem.colors[i]!==mem.colors[value])continue;seen.add(i);popped.push(i);queue.push(...neighbors(i));}mem.popped.push(...popped);const amount=popped.reduce((a,i)=>a+(i%3+1)*u,0)+(popped.length>=3?b:0);award(s,amount,'POP GOES THE BUDGET',`${popped.length} balloons${popped.length>=3?' + chain bonus':''}`,{kind:'balloons',popped});if(mem.popped.length===12)s.remaining=0;break;}
case 'guests':{mem.guests+=value;const tables=Math.floor(mem.guests/3),added=tables-mem.tables;mem.tables=tables;award(s,value*u+added*b,'THEY BROUGHT FRIENDS',`${value} guests x ${money(u)}${added?' + '+money(added*b)+' table service':''}`,{kind:'guests',added:value});break;}
case 'wishes':{const chosen=mem.chosen.includes(value);if(chosen)mem.matches[value]++;const premium=chosen?b*(mem.matches[value]>1?2:1):0;award(s,u+premium,chosen?'WISH GRANTED':'A LITTLE PARTY GIFT',`${money(u)}${chosen?' + '+money(premium)+' wish bonus':''}`,{kind:'wishes',wish:value,matched:chosen});break;}
case 'chairs':{const index=mem.chairs.findIndex(x=>x.id===value),chair=mem.chairs[index];mem.chairs.splice(index,1);const left=mem.chairs[(index-1+mem.chairs.length)%mem.chairs.length],right=mem.chairs[index%mem.chairs.length];left.value+=Math.floor(chair.value/2);right.value+=chair.value-Math.floor(chair.value/2);const amount=chair.value,detail=money(chair.value)+' chair';award(s,amount,'TAKE A SEAT. PAY AGAIN.',detail,{kind:'chairs',removed:value,neighbors:[left.id,right.id]});break;}
case 'confetti':{const deposit=value*u;mem.deposits.push(deposit);mem.loaded+=deposit;mem.pieces+=value;award(s,0,'INTO THE PARTY POPPER',`${money(mem.loaded)} waiting for the pull`,{kind:'confetti',deposit,loaded:mem.loaded,fired:false});break;}
case 'ribbon':{mem.distance+=value;award(s,value*u,'A LITTLE BIT OF RIBBON',`${value} feet at ${money(u)} each`,{kind:'ribbon',distance:mem.distance});break;}
case 'photos':mem.digits.push(value);award(s,0,'STRIKE AN EXPENSIVE POSE','Photo '+s.turn+' printed: '+value,{kind:'photos',digit:value});break;
case 'bingo':{if(s.turn===1){mem.quote=value*u;award(s,mem.quote,'YOUR BIRTHDAY GIFT',money(mem.quote)+' before your coupon',{kind:'bingo'});}else{mem.percent=value;award(s,0,'A BIRTHDAY DISCOUNT?',value+'% OFF — terms apply',{kind:'bingo'});}break;}}
if(!s.remaining){s.phase='reveal';s.memory.reveal=makeReveal(s,c);}return true;}
export function randomMode(c,rng=Math.random){const pool=MODES.filter(m=>c.modes[m.id].enabled);return pool.length?pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))].id:null;}

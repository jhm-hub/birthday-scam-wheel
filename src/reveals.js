import {money} from './model.js';

export const REVEAL_MS=7600;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const indexed=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');

// The props tell the joke. The receipt beneath them always shows the real math.
export function revealMarkup(r,icon,candy){
  const p=r.proof;
  let prop='',label='THE LITTLE QUOTE';
  switch(r.mode){
    case 'cake':{
      const point=a=>[150+124*Math.cos(a),150+124*Math.sin(a)];
      prop=`<div class="cake-unfold"><svg viewBox="0 0 300 300" aria-label="Eight separately priced cake slices">${indexed(8,i=>{
        const a=-Math.PI/2+i*Math.PI/4,b=a+Math.PI/4,v=point(a),w=point(b),x=150+83*Math.cos(a+Math.PI/8),y=150+83*Math.sin(a+Math.PI/8),cherryX=150+111*Math.cos(a+Math.PI/8),cherryY=150+111*Math.sin(a+Math.PI/8);
        return `<g class="cake-slice ${i?'extra-slice':''}" style="--i:${i}"><path d="M150 150L${v}A124 124 0 0 1 ${w}Z" fill="${i%2?'#baa0dd':'#e6a0bb'}" stroke="#fff1d5" stroke-width="4"/><path d="M${v}A124 124 0 0 1 ${w}" fill="none" stroke="#fff1d5" stroke-width="11" stroke-linecap="round"/><circle cx="${cherryX}" cy="${cherryY}" r="6" fill="#b93f7c" stroke="#ffbad5" stroke-width="2"/><text x="${x}" y="${y}" dominant-baseline="central" text-anchor="middle">${money(p.price)}</text></g>`;
      })}<circle cx="150" cy="150" r="29" fill="#fff1d5"/><text class="cake-count" x="150" y="151" text-anchor="middle" dominant-baseline="central">×8</text></svg></div>`;
      break;
    }
    case 'candles':
      label='THREE PUFFS LATER';
      prop=`<div class="relight-bill">${p.values.map((n,i)=>`<div class="bill-candle" style="--i:${i}"><i class="bill-flame"></i><div class="candle-body"></div><b>${money(n)}</b><small>RELIT</small></div>`).join('')}</div>`;
      break;
    case 'balloons':
      label='THE BALLOONS YOU POPPED';
      prop=`<div class="whole-bouquet">${p.values.map((n,i)=>`<div class="bill-balloon ${p.remaining.includes(i)?'unbought':'paid'}" style="--i:${i};--balloon-color:${['#e6a0bb','#baa0dd','#9edacb'][i%3]}">${icon('balloon')}<b>${money(n)}</b><small>${p.remaining.includes(i)?'ALSO YOURS':'PAID'}</small></div>`).join('')}</div>`;
      break;
    case 'guests':
      label='YOUR ORIGINAL GUEST LIST';
      prop=`<div class="guest-waves">${[1,1,2].map((factor,wave)=>`<div class="guest-wave wave-${wave}"><small>${['INVITED','THEIR PLUS-ONES','THE PLUS-ONES’ PLUS-ONES'][wave]}</small><div>${indexed(p.original*factor,i=>`<span style="--i:${i}">${icon('guest')}</span>`)}</div></div>`).join('')}</div>`;
      break;
    case 'wishes':
      label='THE BILL BEFORE YOUR WISH';
      prop=`<div class="wish-contract"><div class="wish-receipts"><div><small>FIRST TWO SPINS</small><b>${money(p.opening)}</b></div><i>+</i><div><small>BIRTHDAY GAME</small><b>${money(p.birthday)}</b></div></div><div class="wish-seal">${candy('heart')}<b>×2</b></div><span class="contract-stamp">THE WHOLE ROUND</span></div>`;
      break;
    case 'chairs':
      label='THE SEATS YOU TOOK';
      prop=`<div class="table-reservation"><div class="reservation-sign">RESERVED <span>BY YOU</span></div><div class="reserved-chairs">${p.chairs.map((chair,i)=>`<div style="--i:${i}">${icon('chair')}<b>${money(chair.value)}</b></div>`).join('')}</div></div>`;
      break;
    case 'confetti':
      label='CASH IN THE POPPER';
      prop=`<div class="cleanup-popper"><div class="cleanup-sprite">${icon('cannon','cleanup-body')}${icon('cannon','cleanup-cap')}</div><div class="cleanup-tickets">${indexed(p.pieces,i=>`<span class="fee-ticket" style="--i:${i};--x:${(i*71%330)-165}px;--y:${-75-(i*31%80)}px;--tilt:${i*37%34-17}deg;--gx:${-215+i%6*86}px;--gy:${-118+Math.floor(i/6)*49}px">${money(p.fee)}</span>`)}</div><b class="ticket-count">${p.pieces} PIECES. ${money(p.fee)} EACH.</b></div>`;
      break;
    case 'ribbon':
      prop=`<div class="inch-trap"><div class="ribbon-label"><span>${p.feet} FT</span><b>${p.inches} INCHES</b></div><div class="inch-ruler">${indexed(12,i=>`<div style="--i:${i}"><span>${i+1}″</span></div>`)}</div><small class="ruler-caption">12 INCHES IN EVERY FOOT</small><div class="price-tag">${money(p.price)} <span>PER FOOT</span><b>PER INCH</b></div></div>`;
      break;
    case 'photos':{
      const order=p.digits.map((n,i)=>({n,i})).sort((a,b)=>b.n-a.n||a.i-b.i);
      prop=`<div class="digit-scam"><b class="digit-dollar">${p.rate===100?'$':''}</b>${p.digits.map((n,i)=>`<div class="scam-photo" style="--from:${i};--to:${order.findIndex(x=>x.i===i)};--angle:${(i-1)*6}deg"><div>${n}</div><small>BIRTHDAY SNAP</small></div>`).join('')}<i class="photo-plus plus-a">+</i><i class="photo-plus plus-b">+</i><span class="digit-caption">${p.rate===100?'ONE NUMBER. BIGGEST FIRST.':p.number+' × '+money(p.rate)}</span></div>`;
      break;
    }
    case 'bingo':
      label='YOUR GIFT BEFORE THE COUPON';
      prop=`<div class="coupon-stage"><div class="coupon-flip"><div class="coupon-front"><small>BIRTHDAY TREAT</small><strong>−${p.percent}%</strong><b>OFF</b><span>*terms apply</span></div><div class="coupon-back"><small>HAPPY BIRTHDAY TO FAITH</small><strong>+${p.percent}%</strong><b>ON</b><span>SURCHARGE APPLIED</span></div></div></div>`;
      break;
  }
  return `<div class="scam-reveal reveal-${r.mode}"><div class="scam-quote"><small>${label}</small><strong>${money(r.quote)}</strong></div><div class="scam-catch"><small>BIRTHDAY TERMS APPLY</small><h2>${esc(r.title)}</h2></div><div class="scam-prop">${prop}</div><div class="scam-receipt"><div><small>THE CATCH ADDS</small><strong>+${money(r.extra)}</strong></div><p>${esc(r.equation)}</p><b>${r.mode==='wishes'?'ROUND BILL':'THIS GAME'}: ${money(r.result)}</b></div></div>`;
}

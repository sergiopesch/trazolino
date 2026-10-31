import { WRITING } from './lettering.js'

export const clamp = n => Math.max(0, Math.min(1, n))
export const smooth = n => { const t = clamp(n); return t*t*t*(t*(t*6-15)+10) }
const mix = (a,b,t) => a+(b-a)*t
const distance = (a,b) => Math.hypot(b.x-a.x,b.y-a.y)
export const PEN_ACCELERATION = 1100 // Drawing units per second squared.

// Shared by the app and offline proofs: flatten cubics, then sample by distance.
function samplePath(d) {
  const tokens = d.match(/[MC]|-?\d+(?:\.\d+)?/g)
  const raw = []; let i=0, p
  while(i<tokens.length) {
    const op=tokens[i++]
    if(op==='M') { p={x:+tokens[i++],y:+tokens[i++]}; raw.push(p); continue }
    if(op!=='C') throw new Error(`Unsupported pen command ${op}`)
    const a=p, b={x:+tokens[i++],y:+tokens[i++]}, c={x:+tokens[i++],y:+tokens[i++]}, e={x:+tokens[i++],y:+tokens[i++]}
    const count=Math.max(16,Math.ceil((distance(a,b)+distance(b,c)+distance(c,e))*2))
    for(let j=1;j<=count;j++) {
      const t=j/count, q=1-t
      raw.push({x:q*q*q*a.x+3*q*q*t*b.x+3*q*t*t*c.x+t*t*t*e.x,
        y:q*q*q*a.y+3*q*q*t*b.y+3*q*t*t*c.y+t*t*t*e.y})
    }
    p=e
  }
  let length=0
  const distances=raw.map((p,i)=>{ if(i) length+=distance(raw[i-1],p); return length })
  const count=Math.ceil(length/.7); let cursor=1
  return Array.from({length:count+1},(_,i)=>{
    const at=length*i/count
    while(cursor<raw.length-1 && distances[cursor]<at) cursor++
    const a=raw[cursor-1],b=raw[cursor]
    const t=(at-distances[cursor-1])/(distances[cursor]-distances[cursor-1]||1)
    return {x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),s:at}
  })
}

function pressureAt(keys,t) {
  const j=keys.findIndex(([at])=>at>=t)
  if(j<=0) return keys[Math.max(j,0)][1]
  const [a,b]=[keys[j-1],keys[j]]
  return mix(a[1],b[1],smooth((t-a[0])/(b[0]-a[0])))
}

function prepare() {
  let clock=550
  const sampled=WRITING.map(stroke=>samplePath(stroke.d))
  const strokes=WRITING.map((stroke,index)=>{
    const samples=sampled[index], length=samples.at(-1).s
    const pressureSamples=samples.map((p,i)=>{
      const a=samples[Math.max(0,i-3)],b=samples[Math.min(samples.length-1,i+3)]
      const dx=b.x-a.x,dy=b.y-a.y
      const down=Math.max(0,dy/(Math.hypot(dx,dy)||1))
      return stroke.pressure?pressureAt(stroke.pressure,p.s/length):.20+.58*down
    })
    const points=samples.map((p,i)=>{
      // A pen cannot change pressure instantly at a turn. Smooth in distance,
      // independently of frame rate, then taper the contact at each endpoint.
      let pressure=0,weight=0
      for(let k=-7;k<=7;k++) {
        const w=Math.exp(-k*k/18)
        pressure+=pressureSamples[Math.max(0,Math.min(samples.length-1,i+k))]*w
        weight+=w
      }
      const endpoint=Math.min(1,p.s/9,(length-p.s)/9)
      const z=clamp(pressure/weight*(.65+.35*smooth(endpoint)))
      const prev=samples[Math.max(0,i-6)],next=samples[Math.min(samples.length-1,i+6)]
      const ux=p.x-prev.x,uy=p.y-prev.y,vx=next.x-p.x,vy=next.y-p.y
      const turn=i===0||i===samples.length-1?0:Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/((Math.hypot(ux,uy)*Math.hypot(vx,vy))||1))))
      const v=(stroke.name==='pencil underline'?410:310)/(1+turn*1.8+z*.65+(1-endpoint)*.5)
      return {x:p.x,y:p.y,z,v,t:0}
    })
    // Plan in both directions: anticipate a corner, then accelerate out of it.
    // v² = u² + 2as bounds acceleration without shifting the authored path.
    points[0].v=Math.min(points[0].v,75)
    points.at(-1).v=Math.min(points.at(-1).v,75)
    for(let i=1;i<points.length;i++) {
      const ds=samples[i].s-samples[i-1].s
      points[i].v=Math.min(points[i].v,Math.sqrt(points[i-1].v**2+2*PEN_ACCELERATION*ds))
    }
    for(let i=points.length-2;i>=0;i--) {
      const ds=samples[i+1].s-samples[i].s
      points[i].v=Math.min(points[i].v,Math.sqrt(points[i+1].v**2+2*PEN_ACCELERATION*ds))
    }
    let time=0
    for(let i=1;i<points.length;i++) {
      time+=2*(samples[i].s-samples[i-1].s)/(points[i-1].v+points[i].v)*1000
      points[i].t=time
    }
    // The dot is a short press and release, not a one-frame flash.
    const duration=Math.max(time,stroke.name==='i dot'?180:0)
    if(duration!==time) for(const p of points) {p.t*=duration/time;p.v*=time/duration}
    const next=sampled[index+1]
    const travel=next?distance(samples.at(-1),next[0]):0
    const pauseAfter=next?Math.max(stroke.pause,50+12*Math.sqrt(travel)):0
    const result={...stroke,index,points,start:clock,end:clock+duration,duration,origin:points[0],pauseAfter}
    clock=result.end+pauseAfter
    return result
  })
  const transitionStart=clock+2100
  const fadeEnd=transitionStart+900
  const moveStart=transitionStart+700,moveEnd=moveStart+1600
  return {strokes,writeEnd:clock,transitionStart,fadeEnd,moveStart,moveEnd,duration:moveEnd+450}
}

export const SCORE=prepare()

export function pointsAt(stroke,ms) {
  const local=Math.max(0,ms-stroke.start)
  if(local>=stroke.duration) return stroke.points
  let lo=0,hi=stroke.points.length-1
  while(lo+1<hi) {const mid=(lo+hi)>>1; if(stroke.points[mid].t<=local) lo=mid;else hi=mid}
  const a=stroke.points[lo],b=stroke.points[hi]
  const elapsed=(local-a.t)/1000,interval=(b.t-a.t)/1000
  // Integrate the planned acceleration within the segment, not just at samples.
  const t=clamp((a.v*elapsed+(b.v-a.v)*elapsed*elapsed/(2*interval))/((a.v+b.v)*interval/2))
  return [...stroke.points.slice(0,lo+1),{x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t),t:local}]
}

export function frameAt(ms,{wordmark=false}={}) {
  const time=wordmark?SCORE.writeEnd:Math.max(0,Math.min(SCORE.duration,ms))
  const transition=smooth((time-SCORE.moveStart)/(SCORE.moveEnd-SCORE.moveStart))
  return SCORE.strokes.map(stroke=>({
    stroke, points:pointsAt(stroke,time), visible:time>stroke.start,
    complete:time>=stroke.end,
    opacity:time<=stroke.start?0:stroke.group==='T'?1:1-smooth((time-SCORE.transitionStart)/(SCORE.fadeEnd-SCORE.transitionStart)),
    x:stroke.group==='T'?transition*176:0, y:0,
  }))
}

export function fitCamera(width,height) {
  // At a 320 px phone width the canvas is 280 px after page padding. Preserve
  // enough scale to stay above the native thin-stroke solid-render threshold.
  const horizontalMargin=width<=320?24:32
  const z=Math.min(2.5,Math.max(.01,(width-horizontalMargin)/700),Math.max(.01,(height-32)/300))
  return {x:width/(2*z)-356,y:height/(2*z)-169,z}
}

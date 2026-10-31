import { b64Vecs, createShapeId } from 'tldraw'
import { SCORE, frameAt } from './motion.js'

const relativePoints=(stroke,points)=>points.map(p=>({x:p.x-stroke.origin.x,y:p.y-stroke.origin.y,z:p.z}))
const ids=SCORE.strokes.map(s=>createShapeId(`signature-stroke-${s.index}`))
const fullPaths=SCORE.strokes.map(s=>b64Vecs.encodePoints(relativePoints(s,s.points)))

export function nativeFrame(ms,options) {
  return frameAt(ms,options).map(f=>({
    id:ids[f.stroke.index],type:'draw',isLocked:true,
    x:f.stroke.origin.x+f.x,y:f.stroke.origin.y+f.y,opacity:f.opacity,
    meta:{penWidth:f.stroke.width,accent:f.stroke.group==='accent',gesture:f.stroke.name},
    props:{segments:[{type:'free',path:f.complete?fullPaths[f.stroke.index]:b64Vecs.encodePoints(relativePoints(f.stroke,f.points))}],
      color:'black',fill:'none',dash:'draw',size:'m',isComplete:f.complete,isClosed:false,isPen:true,scale:1,scaleX:1,scaleY:1},
  }))
}

export function applyFrame(editor,ms,options) {
  if(!editor || editor.isDisposed) return
  const changes=nativeFrame(ms,options).flatMap(next=>{
    const current=editor.getShape(next.id)
    if(!current) return []
    if(current.x===next.x && current.y===next.y && current.opacity===next.opacity &&
       current.props.isComplete===next.props.isComplete && current.props.segments[0].path===next.props.segments[0].path) return []
    return [{...current,...next}]
  })
  if(changes.length) editor.store.put(changes)
}

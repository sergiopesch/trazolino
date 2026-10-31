import React from 'react'
import { DrawShapeUtil } from 'tldraw'
import { paintDefinitions, paintId } from './paint.js'

const PencilDefinitions=()=> <g dangerouslySetInnerHTML={{__html:paintDefinitions()}}/>

// Only the paint and base width change. tldraw owns pen geometry, pressure,
// smoothing, native draw records, rendering, and SVG export.
export class PencilDrawShapeUtil extends DrawShapeUtil {
  constructor(editor) {
    super(editor)
    this.options={...this.options,getCustomDisplayValues:(_editor,shape)=>({
      strokeColor:`url(#${paintId(shape.meta.accent===true)})`,
      strokeWidth:typeof shape.meta.penWidth==='number'?shape.meta.penWidth:4,
    })}
  }
  getCanvasSvgDefs() {
    return [...super.getCanvasSvgDefs(),{key:'trazolino-pencil-grain',component:PencilDefinitions}]
  }
  toSvg(shape,ctx) {
    ctx.addExportDef({key:'trazolino-pencil-grain',getElement:()=> <PencilDefinitions/>})
    return super.toSvg(shape,ctx)
  }
}

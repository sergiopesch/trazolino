import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n.jsx'
import { Tldraw } from 'tldraw'
import { getAssetUrls } from '@tldraw/assets/selfHosted'
import { SCORE, fitCamera } from './motion.js'
import { nativeFrame, applyFrame } from './native.js'
import { PencilDrawShapeUtil } from './PencilDrawShapeUtil.jsx'
import 'tldraw/tldraw.css'


const ASSETS=getAssetUrls({baseUrl:'/tldraw'})
const SHAPE_UTILS=[PencilDrawShapeUtil]
const COMPONENTS={Background:null,Grid:null,PageMenu:null,NavigationPanel:null,Toolbar:null,HelpMenu:null,MainMenu:null,StylePanel:null,ActionsMenu:null,ZoomMenu:null}
const motionQuery=()=>window.matchMedia('(prefers-reduced-motion: reduce)')

export default function SignaturePlayer() {
  const { t } = useLocale()
  const [editor,setEditor]=useState(null)
  const [mode,setMode]=useState('playing')
  const [reduced,setReduced]=useState(()=>motionQuery().matches)
  const elapsed=useRef(0),canvasRef=useRef(null)

  const onMount=useCallback(instance=>{
    for(const type of ['text','files','file-replace','url','svg-text','embed','tldraw','excalidraw']) instance.registerExternalContentHandler(type,null)
    instance.registerExternalAssetHandler('file',null)
    instance.registerExternalAssetHandler('url',null)
    instance.createShapes(nativeFrame(0,{wordmark:motionQuery().matches}))
    instance.updateInstanceState({isReadonly:true,isGridMode:false})
    instance.setCameraOptions({isLocked:true})
    instance.clearHistory()
    setEditor(instance)
  },[])

  useEffect(()=>{
    const mq=motionQuery(),change=()=>setReduced(mq.matches)
    mq.addEventListener('change',change)
    return ()=>mq.removeEventListener('change',change)
  },[])

  useEffect(()=>{
    if(!editor || !canvasRef.current) return
    const fit=()=>{
      if(!canvasRef.current || editor.isDisposed) return
      const {width,height}=canvasRef.current.getBoundingClientRect()
      if(width>32 && height>32) editor.setCamera(fitCamera(width,height),{force:true})
    }
    const observer=new ResizeObserver(fit)
    observer.observe(canvasRef.current);fit()
    return ()=>observer.disconnect()
  },[editor])

  useEffect(()=>{
    if(!editor) return
    if(reduced || mode==='lettering') {applyFrame(editor,0,{wordmark:true});return}
    applyFrame(editor,elapsed.current)
    if(mode!=='playing') return
    const tick=delta=>{
      if(document.hidden || editor.isDisposed) return
      elapsed.current=Math.min(SCORE.duration,elapsed.current+Math.min(delta,50))
      applyFrame(editor,elapsed.current)
      if(elapsed.current>=SCORE.duration) setMode('finished')
    }
    // Use the editor's own frame clock; unsubscribe for pause, stills, and unmount.
    editor.on('tick',tick)
    return ()=>editor.off('tick',tick)
  },[editor,mode,reduced])

  const replay=()=>{elapsed.current=0;applyFrame(editor,0);setMode('playing')}
  return <section className="signature-player">
    <div ref={canvasRef} className="signature-canvas" aria-label="Trazolino">
      <Tldraw hideUi licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY} assetUrls={ASSETS} shapeUtils={SHAPE_UTILS} components={COMPONENTS} onMount={onMount}/>
    </div>
    {!reduced && <div className="signature-controls">
      <button className="quiet-button" disabled={mode==='finished'||mode==='lettering'} onClick={()=>setMode(mode==='playing'?'paused':'playing')}>{t(mode==='paused'?'Resume this step':'Pause')}</button>
      <button className="quiet-button" onClick={()=>setMode('lettering')}>{t('View signature')}</button>
      <button className="quiet-button" onClick={replay}>{t('Replay')}</button>
    </div>}
  </section>
}

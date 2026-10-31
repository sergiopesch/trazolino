export const PAPER='#FFFDF7'
export const GRAPHITE='#292723'
export const YELLOW='#F3C33D'
export const paintId=accent=>accent?'trazolino-pencil-yellow':'trazolino-pencil-graphite'
// Fixed paper grain: no frame-to-frame randomness or moving noise.
export function patternMarkup(accent) {
  let seed=4271
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
  const grain=Array.from({length:110},()=>{
    const x=random()*37,y=random()*31,rx=.025+random()*.11,ry=.10+random()*.65
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(24 ${x} ${y})" fill="${PAPER}" opacity="${.08+random()*.18}"/>`
  }).join('')
  return `<pattern id="${paintId(accent)}" width="37" height="31" patternUnits="userSpaceOnUse"><rect width="37" height="31" fill="${accent?YELLOW:GRAPHITE}"/>${grain}</pattern>`
}
export const paintDefinitions=()=>patternMarkup(false)+patternMarkup(true)

import { ArrowShapeUtil, DefaultFontStyle, DrawShapeUtil, GeoShapeUtil } from "tldraw";
import type { TLShapeUtilCanvasSvgDef } from "tldraw";

// Read-only authored canvases use vector paint, never the SDK's bitmap hatch.
// DefaultCanvas collects definitions even for unused registered shape types.
// Remove only that shared definition; preserve every other SDK definition.
const SDK_HATCH_KEY = `${DefaultFontStyle.id}:pattern`;
const withoutUnusedHatch = (defs: TLShapeUtilCanvasSvgDef[]) =>
  defs.filter(({ key }) => key !== SDK_HATCH_KEY);

export class NoHatchDrawShapeUtil extends DrawShapeUtil {
  override getCanvasSvgDefs() {
    return withoutUnusedHatch(super.getCanvasSvgDefs());
  }
}

export class NoHatchGeoShapeUtil extends GeoShapeUtil {
  override getCanvasSvgDefs() {
    return withoutUnusedHatch(super.getCanvasSvgDefs());
  }
}

export class NoHatchArrowShapeUtil extends ArrowShapeUtil {
  override getCanvasSvgDefs() {
    return withoutUnusedHatch(super.getCanvasSvgDefs());
  }
}

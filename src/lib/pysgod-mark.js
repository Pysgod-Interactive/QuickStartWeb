// pi.svg (the Pysgod Interactive logo) doesn't use currentColor. Most of its
// paths just rely on SVG's default fill (black), and a few have an explicit
// stroke:black. To recolor it we swap the literal "black" text, and add an
// explicit fill so the paths with no fill declared pick it up too.
import piMarkup from "../assets/pi.svg?raw";

export function pysgodMark(color) {
  return piMarkup.replaceAll('style="', `style="fill:${color};`).replaceAll("black", color);
}

"""Horizontal logo lockups: the badge beside the OFF 80 / ELECTRIC wordmark, all outlined.
Writes assets/lockup-light.svg (for paper and white) and assets/lockup-dark.svg (for night grounds).
Usage: python3 tools/make-lockup.py   (after tools/outline-logo.py)"""
import re, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
ROOT = pathlib.Path(__file__).resolve().parent.parent
SLAB = TTFont(ROOT / 'tools/fonts/AlfaSlabOne-Regular.ttf'); SANS = TTFont(ROOT / 'tools/fonts/Archivo-Bold.ttf')

def text(font, s, size, ls, x, y, fill):
    cmap = font.getBestCmap(); gs = font.getGlyphSet(); k = size / font['head'].unitsPerEm
    out = []; cur = x
    for ch in s:
        g = gs[cmap[ord(ch)]]; pen = SVGPathPen(gs); g.draw(pen)
        if pen.getCommands(): out.append(f'<path transform="translate({cur:.2f} {y:.2f}) scale({k:.5f} {-k:.5f})" d="{pen.getCommands()}"/>')
        cur += g.width * k + ls
    return f'<g fill="{fill}">' + ''.join(out) + '</g>', cur - ls - x

badge = (ROOT / 'assets/logo-off80.svg').read_text()
inner = re.sub(r'^<svg[^>]*>', '', badge.strip()).rsplit('</svg>', 1)[0]
for name, word, sub in [('light', '#16302F', '#B9481F'), ('dark', '#F2EBDA', '#E7CF97')]:
    w1, len1 = text(SLAB, 'OFF 80', 112, 2, 236, 128, word)
    w2, len2 = text(SANS, 'ELECTRIC', 38, 15.5, 240, 180, sub)
    width = 236 + max(len1, len2) + 12
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} 210" role="img" aria-label="Off 80 Electric">'
           f'<svg x="0" y="0" width="210" height="210" viewBox="0 0 400 400">{inner.replace("id=\"o80-", "id=\"" + name + "-").replace("#o80-", "#" + name + "-")}</svg>'
           f'{w1}{w2}</svg>')
    (ROOT / f'assets/lockup-{name}.svg').write_text(svg)
    print('wrote', f'assets/lockup-{name}.svg', f'{width:.0f}x210')

"""Turns the lettering in assets/logo-*.svg into vector outlines, so the badge
looks identical in any app, printer or sign shop without the fonts installed.
Usage: python3 tools/outline-logo.py   (run after node tools/make-logo.mjs)"""
import math, re, html, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = {'slab': TTFont(ROOT / 'tools/fonts/AlfaSlabOne-Regular.ttf'), 'sans': TTFont(ROOT / 'tools/fonts/Archivo-Bold.ttf')}

def glyph(font, ch):
    cmap = font.getBestCmap(); gs = font.getGlyphSet(); upm = font['head'].unitsPerEm
    name = cmap.get(ord(ch))
    if ch == ' ' and not name: return '', 0.2 * upm  # thin space
    if not name: name = cmap.get(ord(' '))
    pen = SVGPathPen(gs); gs[name].draw(pen)
    return pen.getCommands(), gs[name].width

def run(font, text, size, ls):
    upm = font['head'].unitsPerEm; k = size / upm
    out = [(glyph(font, ch)) for ch in text]
    return [(d, w * k) for d, w in out], k

def on_arc(font, text, size, ls, cx, cy, R, top, fill):
    glyphs, k = run(font, text, size, ls)
    total = sum(w + ls for _, w in glyphs) - ls
    L = math.pi * R
    s = (L - total) / 2
    parts = []
    for d, w in glyphs:
        mid = s + w / 2
        phi = (math.pi + mid / R) if top else (math.pi - mid / R)
        x, y = cx + R * math.cos(phi), cy + R * math.sin(phi)
        tx, ty = ((-math.sin(phi), math.cos(phi)) if top else (math.sin(phi), -math.cos(phi)))
        rot = math.degrees(math.atan2(ty, tx))
        if d:
            parts.append(f'<path transform="translate({x:.2f} {y:.2f}) rotate({rot:.2f}) translate({-w/2:.2f} 0) scale({k:.5f} {-k:.5f})" d="{d}"/>')
        s += w + ls
    return f'<g fill="{fill}">' + ''.join(parts) + '</g>'

def straight(font, text, size, ls, x, y, fill):
    glyphs, k = run(font, text, size, ls)
    total = sum(w + ls for _, w in glyphs) - ls
    cur = x - total / 2; parts = []
    for d, w in glyphs:
        if d: parts.append(f'<path transform="translate({cur:.2f} {y:.2f}) scale({k:.5f} {-k:.5f})" d="{d}"/>')
        cur += w + ls
    return f'<g fill="{fill}">' + ''.join(parts) + '</g>'

for f in sorted((ROOT / 'assets').glob('logo-*.svg')):
    if f.name.endswith('-outlined.svg'): continue
    svg = f.read_text()
    arcs = {m.group(1): (float(m.group(2)), float(m.group(3)), float(m.group(4)), m.group(5) == '1')
            for m in re.finditer(r'<path id="([^"]+)" d="M([\d.]+),([\d.]+) A([\d.]+),[\d.]+ 0 0 ([01])', svg)}
    def arc_text(m):
        size, fill, ls, ref, text = float(m.group(1)), m.group(2), float(m.group(3)), m.group(4), html.unescape(m.group(5))
        x0, cy, R, top = arcs[ref]
        return on_arc(FONTS['slab'], text, size, ls, x0 + R, cy, R, top, fill)
    svg = re.sub(r'<text font-family="[^"]*" font-size="([\d.]+)" fill="([^"]+)" letter-spacing="([\d.]+)"><textPath href="#([^"]+)" startOffset="50%" text-anchor="middle">([^<]+)</textPath></text>', arc_text, svg)
    def tab_text(m):
        x, y, ls, size, fill, text = float(m.group(1)), float(m.group(2)), float(m.group(4)), float(m.group(3)), m.group(5), m.group(6)
        return straight(FONTS['sans'], text, size, ls, x, y, fill)
    svg = re.sub(r'<text x="([\d.]+)" y="([\d.]+)" text-anchor="middle" font-family="[^"]*" font-weight="700" font-size="([\d.]+)" letter-spacing="([\d.]+)" fill="([^"]+)">([^<]+)</text>', tab_text, svg)
    assert '<text' not in svg, f'unconverted text left in {f.name}'
    svg = re.sub(r'<path id="[^"]+" d="M[^"]+"/>', '', svg)  # the text paths are no longer needed
    f.write_text(svg)
    print('outlined', f.name, len(svg), 'bytes')

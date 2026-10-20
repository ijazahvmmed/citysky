"""Generate the published project catalogues from shared website data.

Requirements: Python 3, reportlab and Pillow; Node + repo dependencies installed.
Run from any directory: python scripts/generate-catalogues.py
PDFs go to public/catalogs, metadata to src/lib/data/catalogues.json.
Image downloads are cached in the system temporary directory.
Only supplied project visuals are described as project imagery. Unsplash
placeholders are labelled as visual references; generic plans/specs are omitted.
"""
from __future__ import annotations

import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import urllib.request
from xml.sax.saxutils import escape

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/catalogs'
CACHE = Path(tempfile.gettempdir()) / 'citysky-catalogue-assets'
OUT.mkdir(parents=True, exist_ok=True)
CACHE.mkdir(parents=True, exist_ok=True)
DATA = json.loads(subprocess.check_output(['node', str(ROOT / 'scripts/catalogue-data.mjs')], cwd=ROOT, text=True, encoding='utf-8'))
SITE = DATA['site']
FONT_DIR = Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts'
if (FONT_DIR / 'arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('Citysky', str(FONT_DIR / 'arial.ttf')))
    pdfmetrics.registerFont(TTFont('CityskyBold', str(FONT_DIR / 'arialbd.ttf')))
else:
    pdfmetrics.registerFont(TTFont('Citysky', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
    pdfmetrics.registerFont(TTFont('CityskyBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('Citysky', normal='Citysky', bold='CityskyBold')

W, H = 595.28, 841.89
M = 42
INK = colors.HexColor('#21382e')
MUTED = colors.HexColor('#65716a')
PAPER = colors.HexColor('#fafaf7')
LINE = colors.HexColor('#d8ddd7')
PALE = colors.HexColor('#eef2ed')
RED = colors.HexColor('#9b5750')

def clean(s):
    return str(s).replace('—', '-').replace('–', '-').replace('₹', 'INR ').replace('’', "'")

class Catalogue:
    def __init__(self, project):
        self.p = project
        self.page = 0
        self.filename = OUT / f"{project['slug']}.pdf"
        self.c = canvas.Canvas(str(self.filename), pagesize=(W, H), pageCompression=1)
        self.c.setTitle(f"{project['name']} | Citysky project catalogue")
        self.c.setAuthor(SITE['name'])
        self.c.setSubject('Project overview, imagery and contact information' if project['soldOut'] else 'Project overview, imagery, finish choices and starting prices')

    def text(self, text, x, y, size=11, color=INK, bold=False):
        self.c.setFillColor(color)
        self.c.setFont('CityskyBold' if bold else 'Citysky', size)
        self.c.drawString(x, H-y-size, clean(text))

    def para(self, text, x, y, width=W-2*M, size=11, color=INK, leading=None):
        style = ParagraphStyle('body', fontName='Citysky', fontSize=size, leading=leading or size*1.5, textColor=color)
        p = Paragraph(escape(clean(text)), style)
        _, h = p.wrap(width, H)
        p.drawOn(self.c, x, H-y-h)
        return y+h

    def box(self, x, y, width, height, fill=PALE):
        self.c.setFillColor(fill)
        self.c.rect(x, H-y-height, width, height, fill=1, stroke=0)

    def line(self, x, y, width):
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(.5)
        self.c.line(x, H-y, x+width, H-y)

    def start(self, chapter):
        if self.page: self.c.showPage()
        self.page += 1
        self.box(0, 0, W, H, PAPER)
        self.text('C I T Y S K Y', M, 28, 12, bold=True)
        self.text(chapter.upper(), 335, 31, 8, MUTED)
        self.line(M, 58, W-2*M)
        self.line(M, H-45, W-2*M)
        self.text(self.p['name'], M, H-32, 8, MUTED)
        self.text(SITE['domain'], 235, H-32, 8, MUTED)
        self.text(f'{self.page:02d}', W-M-16, H-32, 8, MUTED)
        self.c.linkURL(SITE['url'] + '/projects/' + self.p['slug'], (M, 12, W-M, 36), relative=0)

    def title(self, label, headline, y=86):
        self.text(label.upper(), M, y, 9, MUTED)
        self.text(headline, M, y+24, 27, bold=True)

    def photo(self, ref, x, y, width, height, fit='cover'):
        key = ref['id'] if isinstance(ref, dict) else ref
        if key.startswith('/'):
            path = ROOT / 'public' / key.lstrip('/')
        else:
            path = CACHE / f'{key}.jpg'
            if not path.exists():
                url = f'https://images.unsplash.com/photo-{key}?w=1800&q=85&auto=format&fit=crop'
                req = urllib.request.Request(url, headers={'User-Agent': 'Citysky-Catalogue/1.0'})
                with urllib.request.urlopen(req, timeout=45) as response:
                    path.write_bytes(response.read())
        with Image.open(path) as im:
            im = im.convert('RGB')
            if fit == 'cover':
                ratio = width / height
                actual = im.width / im.height
                if actual > ratio:
                    nw = int(im.height * ratio)
                    left = (im.width-nw)//2
                    im = im.crop((left, 0, left+nw, im.height))
                else:
                    nh = int(im.width / ratio)
                    top = (im.height-nh)//2
                    im = im.crop((0, top, im.width, top+nh))
            im.thumbnail((1900, 1900), Image.Resampling.LANCZOS)
            b = io.BytesIO()
            im.save(b, format='JPEG', quality=86, optimize=True)
            self.c.drawImage(ImageReader(b), x, H-y-height, width=width, height=height, preserveAspectRatio=(fit=='contain'), anchor='c', mask='auto')

    def caption(self, text, y, reference=False):
        self.para(text, M, y, size=9, color=MUTED)
        if reference:
            self.para('Visual reference only. These images are not photographs of this project.', M, y+20, size=8, color=MUTED)

    def cover(self):
        p=self.p
        self.start('Project catalogue' if not p['soldOut'] else 'Completed project record')
        self.text(p['name'], M, 87, 37, bold=True)
        self.text(p['location'], M, 141, 12, MUTED)
        self.photo(p['cover'], M, 185, W-2*M, 350)
        supplied=p['cover']['id'].startswith('/')
        self.caption('Project imagery supplied to Citysky.' if supplied else 'Architectural mood and material reference.', 546, not supplied)
        self.text('COMPLETED / SOLD OUT' if p['soldOut'] else p['status'].upper(), M, 606, 9, RED if p['soldOut'] else INK, True)
        self.para(p['summary'], M, 636, width=390, size=15, leading=21)
        if not p['soldOut']:
            self.text(f"Homes starting from INR {DATA['prices']['unfurnished']} lakhs", M, 737, 12, bold=True)
        else:
            self.text('A record of the project. No homes currently offered for sale.', M, 737, 10, MUTED)

    def overview(self):
        p=self.p
        self.start('Project at a glance')
        self.title('The project', 'A clear starting point.')
        y=176
        facts=[('LOCATION', p['location']), ('PROJECT', p['configuration']), ('HOME TYPES', p['unitTypes']), ('BUILT-UP AREA', p['builtUp']), ('SITE AREA', p['plotArea']), ('STATUS', 'Completed / Sold out' if p['soldOut'] else p['status'])]
        for label,value in facts:
            self.text(label, M, y+10, 8, MUTED)
            self.para(value, 207, y+8, width=W-M-207, size=12)
            self.line(M,y+45,W-2*M)
            y+=56
        self.text('ABOUT THE HOMES', M, 540, 9, MUTED)
        self.para(p['overview'][0], M, 567, size=11)
        self.box(M, 685, W-2*M, 80)
        self.para('Project information follows the current Citysky listing. Ask for the home-specific area statement and approved drawings before making a purchase decision.', M+16, 700, width=W-2*M-32, size=10, color=MUTED)

    def room_pairs(self):
        for n, label in enumerate(['Ground floor living', 'Dining area', 'Kitchen', 'Private patio', 'First floor lounge', 'Master bedroom', 'Balcony / flex room']):
            pair=self.p['gallery'][n*2:n*2+2]
            self.start('Room-by-room visual guide')
            self.title(f'Space {n+1:02d} / 07', label)
            for index, item in enumerate(pair):
                y=180+index*289
                self.photo(item['image'], M, y, W-2*M, 240)
                self.text('UNFURNISHED VIEW' if index==0 else 'FURNISHED VIEW', M, y+251, 9, bold=True)
            self.para('Supplied room visuals. Furnished views show styling possibilities; the agreed finish schedule determines what is included.', M, 757, size=8, color=MUTED, leading=11)

    def gallery(self, items, title, label='Project imagery'):
        self.start(label)
        self.title('Inside the project' if label=='Project imagery' else 'Visual direction', title)
        for i,item in enumerate(items):
            y=181+i*292
            self.photo(item['image'], M, y, W-2*M, 240)
            cap=item.get('caption') or item['image']['alt']
            self.para(cap, M, y+250, size=9, color=MUTED, leading=12)
        if any(not item['image']['id'].startswith('/') for item in items):
            self.para('Reference imagery only - not project photography. Source: Unsplash imagery used on the Citysky website.', M, 764, size=8, color=MUTED, leading=11)

    def finishes(self):
        self.start('Finish options and pricing')
        self.title('Choose your finish', 'One home. Three ways to settle in.')
        y=180
        for tier in DATA['tiers']:
            self.box(M,y,W-2*M,173, PALE if tier['key']!='semi' else colors.HexColor('#e7ede7'))
            self.text(tier['numeral'],M+16,y+16,12,MUTED)
            self.text(tier['name'],M+51,y+14,17,bold=True)
            self.text(f"From INR {DATA['prices'][tier['key']]} lakhs",M+51,y+43,13,bold=True)
            self.para(tier['tagline'],M+16,y+76,width=W-2*M-32,size=10)
            self.para(' / '.join(tier['includes']),M+16,y+109,width=W-2*M-32,size=9,color=MUTED,leading=13)
            y+=186
        self.para('Starting prices are indicative. Availability, home-specific pricing, taxes, registration and the final inclusion schedule are confirmed in the written quotation.',M,752,size=8,color=MUTED,leading=11)

    def finish_table(self):
        self.start('Finish comparison')
        self.title('Compare what is included', 'The details, side by side.')
        self.text('INCLUSION',M,184,8,MUTED)
        for x,tier in zip([298,378,458],DATA['tiers']):
            self.text(tier['name'].replace('-',' '),x,184,8,bold=True)
        y=212
        for row in DATA['comparisonRows']:
            self.line(M,y,W-2*M)
            self.text(row['feature'],M,y+13,11)
            for x, included in zip([310,390,470],row['tiers']):
                self.text('Included' if included else '-',x,y+14,9,INK if included else MUTED)
            y+=35
        self.box(M,672,W-2*M,95)
        self.text('Confirm the schedule for your home.',M+16,689,12,bold=True)
        self.para('This comparison follows Citysky\'s current finish options. Furniture models, materials, appliance provision and quantities must be agreed in the home-specific quotation.',M+16,715,width=W-2*M-32,size=10,color=MUTED)

    def contact(self):
        sold=self.p['soldOut']
        self.start('Keep in touch')
        self.title('Your next step', 'Explore what comes next.' if sold else 'See the home. Ask the details.')
        steps = [('01', 'Browse available homes', 'View the latest projects and availability on our website.'),('02', 'Speak to Citysky', 'Tell us the location, home size and finish level you have in mind.'),('03', 'Plan a site visit', 'Arrange a visit and request the project documents relevant to your home.')]
        if not sold:
            steps=[('01','Choose your finish','Compare Unfurnished, Semi-Furnished and Fully Furnished starting prices.'),('02','Visit and review','Arrange a visit. Ask for approved drawings, the area statement and the detailed specification schedule.'),('03','Get a written quotation','Confirm availability, inclusions, payment schedule, applicable charges and handover timing directly with Citysky.')]
        y=179
        for number,title,copy in steps:
            self.text(number,M,y,20,MUTED)
            self.text(title,M+47,y,15,bold=True)
            self.para(copy,M+47,y+29,width=W-2*M-47,size=11,color=MUTED)
            self.line(M,y+91,W-2*M)
            y+=112
        self.box(M,542,W-2*M,180,INK)
        self.text('CITYSKY BUILDERS',M+20,561,10,colors.white,True)
        for y,text,url in [(594,SITE['phone'],SITE['phoneHref']), (625,SITE['email'],'mailto:'+SITE['email']), (656,SITE['domain'],SITE['url'])]:
            self.text(text,M+20,y,14,colors.white)
            self.c.linkURL(url,(M+20,H-y-23,W-M-20,H-y+2),relative=0)
        self.para('Open the project online for the latest availability and live route information. Journey lengths depend on the selected route; no estimated distances are published in this catalogue.',M,743,size=9,color=MUTED,leading=12)

    def save(self):
        self.c.save()
        return {'pages':self.page,'bytes':self.filename.stat().st_size,'content':'Project imagery, overview and contact details' if self.p['soldOut'] else 'Project imagery, overview, finish comparison and starting prices'}

manifest={}
for project in DATA['projects']:
    book=Catalogue(project)
    book.cover()
    book.overview()
    if project['slug']=='mirzad-road':
        book.room_pairs()
    elif project['slug']=='1008':
        book.gallery(project['gallery'][:2], 'Around the homes.')
        book.gallery(project['gallery'][2:4], 'From construction to completion.')
        book.gallery(project['gallery'][4:6], 'Arrival and front elevation.')
    else:
        book.gallery(project['gallery'][:2], 'Space, light and materials.', 'Architectural references')
        book.gallery(project['gallery'][2:4], 'A considered way to live.', 'Architectural references')
    if not project['soldOut']:
        book.finishes()
        book.finish_table()
    book.contact()
    manifest[project['slug']]=book.save()
    print(f"{project['slug']}: {book.page} pages, {manifest[project['slug']]['bytes']:,} bytes")
(ROOT / 'src/lib/data/catalogues.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')

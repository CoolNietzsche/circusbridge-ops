#!/usr/bin/env python3
"""Render Circus Bridge sales-kit HTML from YAML. Run via: bash sales-kit/build.sh"""
import glob, os, sys, yaml, jinja2
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, "sales-kit"); OUT = os.path.join(KIT, "out")
os.makedirs(OUT, exist_ok=True)
env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.join(KIT, "templates")), autoescape=True)
fonts = open(os.path.join(KIT, "templates/fonts.css")).read().replace("url('fonts/", "url('file://" + os.path.join(KIT, "templates/fonts/"))
css = fonts + open(os.path.join(KIT, "templates/base.css")).read()
c = yaml.safe_load(open(os.path.join(KIT, "company.yaml")))
logo = next(iter(sorted(glob.glob(os.path.join(ROOT, "assets/logo-horizontal*")))), None)
logo = "file://" + logo if logo else None
artists = [yaml.safe_load(open(f)) for f in sorted(glob.glob(os.path.join(ROOT, "artists/*.yaml")))]
def has_tbc(obj): return "TBC" in yaml.safe_dump(obj)
for a in artists:
    photos = sorted(p for p in glob.glob(os.path.join(ROOT, "assets/artists", a["id"], "*")) if p.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))[:4]
    html = env.get_template("act_sheet.html").render(a=a, c=c, css=css, logo=logo, photos=["file://" + p for p in photos], draft=has_tbc(a) or has_tbc(c))
    open(os.path.join(OUT, f"CircusBridge_ActSheet_{a['stage_name']}.html"), "w").write(html)
html = env.get_template("agency_onepager.html").render(artists=artists, c=c, css=css, logo=logo, draft=has_tbc(c))
open(os.path.join(OUT, "CircusBridge_AgencyPartner.html"), "w").write(html)
print("\n".join(sorted(os.listdir(OUT))))

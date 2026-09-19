from pathlib import Path
import sys, subprocess, json, shutil
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import pypdfium2 as pdfium

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.tools'))
import imageio_ffmpeg
FF=imageio_ffmpeg.get_ffmpeg_exe()
SOURCE=Path(r'E:\坤\作品集')
OUT=ROOT/'public'/'media'
OUT.mkdir(parents=True,exist_ok=True)
VIDEOS=[
 ('history','宏业三十载·中国建设监理之路.mp4',39.08),
 ('annual','24年年会开场.mp4',70.20),
 ('song','宏业之歌 MV 1.0.mp4',70.81),
 ('book-film','镜号18 宏业故事发布 无文字版.mp4',52.77),
 ('tibet','西藏分公司.mp4',21.85),
 ('celebration','1月17日.mp4',22.14),
 ('birthday','24年11月生日会.mp4',18.13),
 ('father','父亲节视频.mp4',112.35),
 ('xian','西安分公司.mp4',29.25),
 ('wuhan','武汉分公司 竖屏 终.mp4',70.08),
 ('ningxia','宁夏分公司 .mp4',48.12),
 ('sep1','9月1日.mp4',22.47),
]
FORCE='--force' in sys.argv
def run(args): subprocess.run([FF,'-hide_banner','-loglevel','error','-y',*args],check=True)
def hero():
 crop='crop=iw:ih*0.76:0:ih*0.12,scale=1280:-2'
 run(['-ss','20.7','-i',str(SOURCE/'西藏分公司.mp4'),'-t','8','-an','-vf',crop+',fps=24','-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'hero.mp4')])
 run(['-ss','21.85','-i',str(SOURCE/'西藏分公司.mp4'),'-frames:v','1','-vf',crop,str(OUT/'hero-poster.jpg')])
 print('Hero ready',flush=True)
if '--hero-only' in sys.argv:
 hero()
 sys.exit(0)
for slug,name,second in VIDEOS:
 cover=OUT/f'{slug}.jpg'
 if FORCE or not cover.exists():
  run(['-ss',str(second),'-i',str(SOURCE/name),'-frames:v','1','-vf','scale=1600:1600:force_original_aspect_ratio=decrease',str(cover)])
shutil.copy2(ROOT/'qa'/'image2.jpg',OUT/'portrait.jpg')
DESIGNS=[('book-cover','宏业故事封面确定.pdf'),('book-interior','宏业故事内页设计.pdf'),('book-alternate','宏业故事封皮（未选用版）.pdf'),('brand-values','上墙图 价值观.pdf'),('brand-mission','上墙图 使命.pdf'),('brand-vision','上墙图 愿景.pdf'),('brand-spirit','上墙图 精神.pdf'),('brand-box','牌盒.pdf'),('brand-card','牌背.pdf')]
for slug,name in DESIGNS:
 pdf=pdfium.PdfDocument(str(SOURCE/'设计'/name)); page=pdf[0]
 im=page.render(scale=min(1800/page.get_width(),1800/page.get_height())).to_pil().convert('RGB')
 im.save(OUT/f'{slug}.jpg',quality=90)
im=Image.open(next((SOURCE/'设计').glob('*.jpg'))).convert('RGB'); im.thumbnail((2000,2000)); im.save(OUT/'annual-board.jpg',quality=90)
print('Images ready',flush=True)
if FORCE or not (OUT/'hero.mp4').exists() or not (OUT/'hero-poster.jpg').exists(): hero()
def encode(item):
 slug,name,_=item
 target=OUT/f'{slug}.mp4'
 if target.exists() and not FORCE:
  print(slug+' exists',flush=True)
  return
 run(['-i',str(SOURCE/name),'-map','0:v:0','-map','0:a?','-vf','scale=1280:1280:force_original_aspect_ratio=decrease,fps=25','-c:v','libx264','-preset','fast','-crf','26','-threads','3','-c:a','aac','-b:a','128k','-pix_fmt','yuv420p','-movflags','+faststart',str(target)])
 print(slug+' ready',flush=True)
with ThreadPoolExecutor(max_workers=2) as pool: list(pool.map(encode,VIDEOS))
(ROOT/'qa'/'asset-sources.json').write_text(json.dumps({'video':VIDEOS,'design':DESIGNS},ensure_ascii=False,indent=2),encoding='utf8')
print('All media ready',flush=True)

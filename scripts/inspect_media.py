from pathlib import Path
import sys, subprocess, re, json, zipfile
from PIL import Image, ImageDraw, ImageFont
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools'))
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
SOURCE = Path(r'E:\坤\作品集')
QA = ROOT / 'qa'
MEDIA = ROOT / 'public' / 'media'
FONT = ImageFont.truetype(r'C:\Windows\Fonts\msyh.ttc', 18)
records = []
tiles = []
for index, path in enumerate(sorted(SOURCE.glob('*.mp4'))):
    info = subprocess.run([FF, '-hide_banner', '-i', str(path)], capture_output=True).stderr.decode('utf-8', errors='replace')
    match = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info)
    duration = sum(float(v) * m for v,m in zip(match.groups(), [3600,60,1])) if match else 30
    records.append({'file': path.name, 'duration': duration, 'info': info})
    for fraction in [.12, .38, .65]:
        second = round(duration*fraction, 2)
        out = QA / f'video-{index}-{fraction}.jpg'
        frame = subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-ss', str(second), '-i', str(path), '-frames:v', '1', '-vf', 'scale=480:-1', '-f', 'image2pipe', '-vcodec', 'mjpeg', 'pipe:1'], check=True, capture_output=True)
        out.write_bytes(frame.stdout)
        tile = Image.new('RGB', (500,315), '#17191d')
        im = Image.open(out); im.thumbnail((480,260))
        tile.paste(im, ((500-im.width)//2,0))
        ImageDraw.Draw(tile).text((10,268), f'{index} | {path.stem[:20]} | {second}s', font=FONT, fill='white')
        tiles.append(tile)
    if len(tiles) == 18:
        sheet = Image.new('RGB', (1500,1890), '#17191d')
        for j,t in enumerate(tiles): sheet.paste(t, ((j%3)*500,(j//3)*315))
        sheet.save(QA / f'videos-{index//6}.jpg'); tiles=[]
(QA/'video-info.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf8')
designs=[]
for index,path in enumerate(sorted((SOURCE/'设计').glob('*.pdf'))):
    pdf=pdfium.PdfDocument(str(path))
    page=pdf[0]; scale=min(1400/page.get_width(),1000/page.get_height())
    im=page.render(scale=scale).to_pil().convert('RGB')
    im.save(QA/f'design-{index}.jpg', quality=92)
    tile=Image.new('RGB',(500,380),'#dddde0'); im.thumbnail((480,320)); tile.paste(im,((500-im.width)//2,0))
    ImageDraw.Draw(tile).text((10,332),f'{index} | {path.stem} | {len(pdf)}页',font=FONT,fill='black')
    designs.append(tile)
sheet=Image.new('RGB',(1500,380*((len(designs)+2)//3)),'#dddde0')
for j,t in enumerate(designs): sheet.paste(t,((j%3)*500,(j//3)*380))
sheet.save(QA/'designs.jpg')
with zipfile.ZipFile(r'D:\工作\月度绩效考核表\1\张坤简历_蓝色几何一页版_含照片.docx') as z:
    for name in z.namelist():
        if name.startswith('word/media/'):
            out=QA/Path(name).name; out.write_bytes(z.read(name))
            print('resume image',name,Image.open(out).size)
print('Media inspection complete', [(r['file'],r['duration']) for r in records])

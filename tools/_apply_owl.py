import os
from collections import deque
from PIL import Image

ROOT=os.path.join(os.path.dirname(__file__), '..')
SRC=r'C:\Users\gela.shonia\.claude\uploads\d3ddca95-6a01-4fec-aa09-e6e8fda8a963\352365f0-11632D0F7FCE4E17BAF6526B1BCEFDF7.png'
im=Image.open(SRC).convert('RGBA')
W,H=im.size
px=im.load()

# flood-fill the baked checker background -> transparent, starting from the border.
# "passable" = neutral light gray/white (the checker), NOT the warm cream belly (R>>B).
def passable(r,g,b):
    return (max(r,g,b)-min(r,g,b))<24 and min(r,g,b)>198
bg=bytearray(W*H)         # 1 = background
dq=deque()
for x in range(W):
    for y in (0,H-1):
        i=y*W+x
        if not bg[i]:
            r,g,b,a=px[x,y]
            if passable(r,g,b): bg[i]=1; dq.append((x,y))
for y in range(H):
    for x in (0,W-1):
        i=y*W+x
        if not bg[i]:
            r,g,b,a=px[x,y]
            if passable(r,g,b): bg[i]=1; dq.append((x,y))
while dq:
    x,y=dq.popleft()
    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx,ny=x+dx,y+dy
        if 0<=nx<W and 0<=ny<H:
            ni=ny*W+nx
            if not bg[ni]:
                r,g,b,a=px[nx,ny]
                if passable(r,g,b):
                    bg[ni]=1; dq.append((nx,ny))
for y in range(H):
    for x in range(W):
        if bg[y*W+x]:
            r,g,b,a=px[x,y]; px[x,y]=(r,g,b,0)

# crop to the owl bounding box
bbox=im.getbbox()
owl=im.crop(bbox)
ow,oh=owl.size
side=max(ow,oh)
master=Image.new('RGBA',(side,side),(0,0,0,0))
master.paste(owl,((side-ow)//2,(side-oh)//2),owl)
master.save(os.path.join(ROOT,'brand-preview','owl-amber-master.png'))

def icon(path,size,scale,bgcol):
    canvas=Image.new('RGBA',(size,size),bgcol)
    inner=int(size*scale)
    o=master.resize((inner,inner),Image.LANCZOS)
    off=(size-inner)//2
    canvas.paste(o,(off,off),o)
    canvas.convert('RGB').save(path)

WHITE=(255,255,255,255)
icon(os.path.join(ROOT,'icon-512.png'),512,0.84,WHITE)
icon(os.path.join(ROOT,'icon-192.png'),192,0.84,WHITE)
icon(os.path.join(ROOT,'apple-touch-180.png'),180,0.84,WHITE)
icon(os.path.join(ROOT,'icon-maskable-512.png'),512,0.72,WHITE)
icon(os.path.join(ROOT,'favicon-32.png'),32,0.92,WHITE)
icon(os.path.join(ROOT,'favicon-180.png'),180,0.9,WHITE)
print('master', master.size, 'bbox', bbox)
print('built: icon-512/192, icon-maskable-512, apple-touch-180, favicon-32, favicon-180')

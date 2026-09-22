#!/usr/bin/env python3
"""Render the original 24-second folder scene to a self-hosted MP4 and poster.
Requires system Chromium, ffmpeg; Python playwright, pymupdf, Pillow.
Only blank release PDFs are used. Run from anywhere after scripts/build.py.
"""
import base64
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
import subprocess
from threading import Thread
from urllib.request import urlretrieve
import pymupdf
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
CACHE=ROOT/'.animation-cache'
OUT=ROOT/'site/media'
VERSION=(ROOT/'VERSION').read_text().strip()
FPS=24
DURATION=24

def main():
    CACHE.mkdir(exist_ok=True); OUT.mkdir(exist_ok=True)
    three=CACHE/'three.module.js'
    if not three.exists():
        urlretrieve('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js',three)
    for name in ['appointment-sheet','current-information','medicines-list','follow-up-tracker']:
        doc=pymupdf.open(ROOT/'dist'/f'{name}-v{VERSION}.pdf')
        doc[0].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).save(CACHE/f'{name}.png')
        if name=='medicines-list':
            doc[1].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).save(CACHE/'pharmacy-labels.png')
    class Handler(SimpleHTTPRequestHandler):
        def log_message(self,*args): pass
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    target=OUT/'folder-journey-v1.mp4'
    process=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(target)],stdin=subprocess.PIPE)
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
            page=browser.new_page(viewport={'width':960,'height':840})
            errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{server.server_port}/scripts/animation/scene.html')
            page.wait_for_function('window.sceneReady',timeout=60000)
            data=page.evaluate('()=>document.querySelector("canvas").toDataURL("image/png").split(",")[1]')
            Image.open(BytesIO(base64.b64decode(data))).save(OUT/'folder-journey-poster.webp',quality=90)
            for frame in range(FPS*DURATION):
                data=page.evaluate('(t)=>{window.renderFrame(t);return document.querySelector("canvas").toDataURL("image/jpeg",.95).split(",")[1]}',frame/FPS)
                process.stdin.write(base64.b64decode(data))
                if frame%48==0: print(f'Rendered {frame}/{FPS*DURATION} frames',flush=True)
            assert not errors,errors
            browser.close()
        process.stdin.close()
        assert process.wait(timeout=90)==0,'ffmpeg failed'
        print(f'Finished: {target} ({target.stat().st_size:,} bytes)',flush=True)
    finally:
        if process.poll() is None: process.kill()
        server.shutdown()

if __name__=='__main__': main()

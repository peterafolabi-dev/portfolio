"""Upscales public/img/seq (1280 wide) to public/img/seq-hd (1920 wide, same aspect): ESPCN x2 super-resolution, then Lanczos down to 1920 and a light sharpen.
Needs: pip install opencv-contrib-python-headless, and ESPCN_x2.pb from github.com/fannymonori/TF-ESPCN (export/ESPCN_x2.pb).
This reconstructs plausible detail; it cannot recover detail that was never in the 720p source."""
import cv2, glob, os, sys
model = sys.argv[1] if len(sys.argv) > 1 else 'ESPCN_x2.pb'
sr = cv2.dnn_superres.DnnSuperResImpl_create(); sr.readModel(model); sr.setModel('espcn', 2)
os.makedirs('public/img/seq-hd', exist_ok=True)
for f in sorted(glob.glob('public/img/seq/*.jpg')):
    im = cv2.imread(f)
    h, w = im.shape[:2]
    up = cv2.resize(sr.upsample(im), (int(w * 1.5), int(h * 1.5)), interpolation=cv2.INTER_AREA)
    blur = cv2.GaussianBlur(up, (0, 0), 1.2)
    up = cv2.addWeighted(up, 1.35, blur, -0.35, 0)
    cv2.imwrite(f.replace('/seq/', '/seq-hd/'), up, [cv2.IMWRITE_JPEG_QUALITY, 82])

"""Gentle clarity pass for the hero frames: partial CLAHE on luminance + unsharp mask. Run on public/img/seq and seq-s, then scripts/upscale-hd.py.
(Strong denoising was tried and made skin look plastic, so it is not used.)"""
import cv2, glob, sys
def clean(im):
    l, a, b = cv2.split(cv2.cvtColor(im, cv2.COLOR_BGR2LAB))
    l2 = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(6, 6)).apply(l)
    l = cv2.addWeighted(l, 0.6, l2, 0.4, 0)
    out = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)
    return cv2.addWeighted(out, 1.45, cv2.GaussianBlur(out, (0, 0), 1.3), -0.45, 0)
for d in sys.argv[1:]:
    for f in sorted(glob.glob(d + '/*.jpg')):
        cv2.imwrite(f, clean(cv2.imread(f)), [cv2.IMWRITE_JPEG_QUALITY, 88])

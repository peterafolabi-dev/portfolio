#!/usr/bin/env bash
# Usage: scripts/make-frames.sh path/to/orbit.mp4
# Turns a video into 230 frames at public/img/seq/001.jpg..230.jpg (what the hero scrubs through).
set -e
rm -rf public/img/seq && mkdir -p public/img/seq
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
ffmpeg -y -i "$1" -vf "fps=230/$D,scale=960:-2" -frames:v 230 -q:v 4 public/img/seq/%03d.jpg
ls public/img/seq | wc -l

#!/usr/bin/env bash
# Usage: scripts/make-frames.sh path/to/orbit.mp4
# Turns a video into every frame of the video (190 for the current 8-second clip) at public/img/seq/001.jpg.. and set COUNT in src/components/SeqBackground.tsx to match (what the hero scrubs through).
set -e
rm -rf public/img/seq && mkdir -p public/img/seq
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
ffmpeg -y -i "$1" -vsync 0 -q:v 2 public/img/seq/%03d.jpg
ls public/img/seq | wc -l

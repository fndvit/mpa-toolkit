#!/bin/bash
DESTDIR=dist/image-optimizer-lambda
mkdir -p $DESTDIR
cp -R src/image-optimizer/functions/image-processing/* $DESTDIR
npm install sharp@0.31.2 --prefix $DESTDIR --platform=linux --arch=x64

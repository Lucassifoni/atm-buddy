#!/bin/bash
rm -rf docs
yarn build
mv dist docs
git add .
git commit -m "Last build"
git push

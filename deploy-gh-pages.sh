#!/usr/bin/env sh

# abort on errors
set -e

# build
cd docs
npm install
npm run build

# navigate into the build output directory
cd src/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b gh-pages
git add -A
git commit -m 'deploy'
git push -f git@github.com:alireza0sfr/vue-client-print.git gh-pages:gh-pages
git checkout main
git branch -D gh-pages
cd -
rm -rf docs/.vuepress/dist
rm -rf docs/.vuepress/dist/.git
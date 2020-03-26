#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'marketplaceproduce.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://MarketPlaceProduce.github.io
git push -f git@github.com:MarketPlaceProduce/MarketPlaceProduce.github.io.git master

# if you are deploying to https://MarketPlaceProduce.github.io/marketplaceproduce.com
# git push -f git@github.com:MarketPlaceProduce/marketplaceproduce.com.git master:gh-pages

cd -
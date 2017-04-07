# 发布脚本

```shell
#! /bin/sh
# https://github.com/vuejs/vue/blob/dev/build/release.sh

set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r

echo    # 输出个空行

if [[ $REPLY =~ ^[Yy]$ ]] 
then
    echo "Releasing $VERSION ..."

    npm run compile
    npm run test

    # git add -A
    # git commit -m "[build] $VERSION"
    npm version $VERSION --message "release: $VERSION"

    git push origin refs/tags/v$VERSION
    git push
    npm publish
fi
```

结合`package.json`中的`script: {"release": "bash release.sh"}`可快速发版
date
echo "Build branch started"
rm -rf branch
mkdir branch
touch branch/index.html
rm -rf agama
git clone https://github.com/komodoplatform/agama
cd agama
git checkout dev
cd ../
cp version agama
cp version_build agama
cd agama
mkdir assets/bin
mkdir assets/bin/linux64
cp ../komodod/komodod assets/bin/linux64
cp ../komodod/komodo-cli assets/bin/linux64
#./binary_artifacts.sh
npm install
cd gui
git clone https://github.com/komodoplatform/EasyDEX-GUI
cd EasyDEX-GUI/react
git checkout dev
npm install
sleep 2
npm install
#npm install readable-stream@2.0.2
#npm install agama-wallet-lib
#npm install react-double-scrollbar
cd ../../../
rm -rf node_modules/secp256k1
cp -R ../secp256k1 node_modules/secp256k1

## build the app
mkdir build
echo
echo "Build script for Iguana application for Linux x64 platform."
echo "Preparing electron package $1"

npm run make-patch
electron-packager . --platform=linux --arch=x64 \
  --icon=assets/icons/agama_icons/128x128.png \
  --out=build/ \
  --buildVersion=$1 \
  --ignore=assets/bin/win64 \
  --ignore=assets/bin/osx \
  --ignore=react/node_modules \
  --ignore=react/src \
  --ignore=react/www \
  --overwrite
cd build/Agama-linux-x64/resources/app
rm -rf gui
unzip -o patch.zip
rm patch.zip
cd ../../../
zip -r Agama-linux-x64 Agama-linux-x64
mv Agama-linux-x64.zip ../../branch/Agama-linux-x64-v$1.zip
date
echo "Build branch finished"

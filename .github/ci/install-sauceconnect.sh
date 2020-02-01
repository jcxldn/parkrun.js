#!/bin/sh
#!/usr/bin/env bash

# STATIC VARIABLES
VERSION="4.5.4"


# Create tmp directory
rm -rf .ci_tmp && mkdir .ci_tmp && cd .ci_tmp


# Download based on platform

if [[ $OSTYPE == "win32" || $OSTYPE == "msys" || $OSTYPE == "cgwin" ]]; then

echo "Downloading for Windows..."

curl https://saucelabs.com/downloads/sc-$VERSION-win32.zip -o saucelabs.zip
unzip saucelabs.zip

else

echo "Downloading for Linux..."

curl https://saucelabs.com/downloads/sc-$VERSION-linux.tar.gz -o saucelabs.tar.gz
tar -xzf saucelabs.tar.gz

fi

cd sc-*
mv bin/sc ../sc
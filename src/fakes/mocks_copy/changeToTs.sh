#!/bin/bash

cd $1

for jsFile in `ls *.js`; do
  newName=${jsFile/.js/.ts}

  mv $jsFile $newName
done;

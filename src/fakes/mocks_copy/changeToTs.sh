#!/bin/bash

for jsFile in `ls *.js`; do
  newName=${jsFile/.js/.ts}

  mv $jsFile $newName
done;

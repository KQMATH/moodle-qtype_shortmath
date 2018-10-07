#! /bin/sh

cp $HOME/git/kqm/visual-math-input/*.css visualmathinput/
cp $HOME/git/kqm/visual-math-input/*.js amd/src/
rsync -av $HOME/git/kqm/visual-math-input/fonts/ visualmathinput/font/

git add ../.
git commit -m "new commit"
git branch -M dev
git remote add speakup-api https://github.com/brizgalka/speakup-api.git
git pull speakup-api dev
git push speakup-api dev
git add .
git commit -am 'HEROKU DEPLOYMENT'
git push heroku master
heroku run worker
heroku ps:restart web
heroku open
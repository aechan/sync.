// server.js
// serves static content from heroku
const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;


function start() {
  const express  = require('express');
  const app      = express();                               
  const morgan = require('morgan');            
  const bodyParser = require('body-parser');    
  const cors = require('cors');

  app.use(morgan('tiny'));                                        
  app.use(bodyParser.urlencoded({'extended':'true'}));            
  app.use(bodyParser.json());                                     
  app.use(cors());
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  app.use(express.static('www'));
  app.get('/getconfig', function(req, res) {
    res.send(process.env.FIREBASE_CONF);
  });
  app.set('port', process.env.PORT || 3000);
  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);

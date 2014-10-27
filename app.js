// Module dependencies
var http = require('http');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var exec = require('child_process').exec;

var app = express();
var on = false;

// All environments
http.globalAgent.maxSockets = 999999;

// Middleware
app.set('port', process.env.PORT || 3050);
app.use(morgan('dev'));
app.use(methodOverride());
app.use(serveStatic(path.join(__dirname, 'public'), {'index': ['index.html']}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/switch/status', function(req, res, next){
  res.contentType('text');
  res.send(on ? '1' : '0');
});

app.get('/switch', function(req, res, next){
  on = !on;
  if (on) {
    exec(__dirname + '/node_modules/.bin/hls-endless kill ', function(error, stdout, stderr){
      exec(__dirname + '/node_modules/.bin/hls-endless start', function(error, stdout, stderr){
        console.log(error, stdout, stderr);
        res.send('1');
      });
    });
  } else {
    exec(__dirname + '/node_modules/.bin/hls-endless stop ',function(error, stdout, stderr){
      console.log(error, stdout, stderr);
      res.send('0');
    });
  }
});

app.get('/kill', function(req, res, next){
  on = false;
  exec(__dirname + '/node_modules/.bin/hls-endless kill ', function(error, stdout, stderr){
    console.log('stdout:' + stdout);
    res.send('0');
  });
});

app.get('/', function(req, res){
  res.render('index.html', {on:on});
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var express = require('express');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var Appointment = require('./model');


var app = express();



mongoose.connect('mongodb://localhost/appointment');
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(cookieParser('cdERer$5&73csdg82#voopsm(&te'));
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", ['GET','DELETE','PUT', 'POST']);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			return next();
		});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use(stormpath.init(app, {
  apiKeyFile: 'apiKey.properties',
 application: 'https://api.stormpath.com/v1/applications/6Y3mOJcdt9y4e6i6hAAmit' ,
 secretKey: 'YKfx8YB50wgyJladZMXIy13tHtlq194W9IJn8BW5lvs',
  expand: {
    customData: true
  }
}));




app.get('/', stormpath.getUser, function(req, res) {

  console.log(req.user)

  Appointment.find({'email':req.user.email}, function (err, people) {
    if (err) {
        console.log("Error 500")
    } else {
        console.log(people)


  res.render('pages/index', {
    title: 'Welcome',
    userName:req.user.givenName,
    userEmail:req.user.email,
    scheduleList:people

  });

}
});


});


app.post('/',function(req,res,next){
  var date = new Date();
  var current_hour = date.getHours();
  var userInfo = new Appointment({
  email: req.body.userEmail,
  dateBooked: current_hour,
  task: req.body.task,
  dateAssigned:req.body.dateAssigned,
  timeAssigned:req.body.timeAssigned
});

userInfo.save(function(err) {
  if (err) throw err;

  console.log('User Info saved successfully!');

});
res.render('pages/index', {
  title: 'Welcome',
  userName:req.body.givenName,
  userEmail:req.body.userEmail

});

})

app.on('stormpath.ready',function(){
  console.log('Stormpath Ready');
});

//app.listen(3000);
app.listen(3047)

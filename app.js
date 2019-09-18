require('dotenv').config();
var cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
var stringSimilarity = require('string-similarity');
let secureEnv = require('secure-env');
global.env = secureEnv({secret:'mySecretPassword'});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.sendFile("views/index.html", {"root": __dirname});
});
var cloudant = cloudant({account:global.env.cloudantusername, password:global.env.cloudantpassword});

var responsequiz1;
var responsequiz2;
var responsequiz3;
var responsequiz4;
var responsequiz5;
var time;
var url;
var counter=0;

quizdb = cloudant.db.use('infy-ai-quiz');


app.post('/quizsubmissionai', function(req,res){
    if(stringSimilarity.compareTwoStrings(req.body.quiz_1,'d')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_2,'a')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_3,'c')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_4,'b')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_5,'a')){
       counter++;
       }
    var quizscore = counter;
    var doc={
        _id:req.headers.host + req.url,
        score:quizscore,
        time: new Date().toISOString()
        };
    
quizdb.insert(doc,function(err,body,header){
    if(err){
        res.sendFile(__dirname + "/views/error.html");
        console.log('Error:'+err.message);
        return;
    }
    else{
        res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<center><h2>Thank you for taking the quiz!</h2><center>');   
    res.write('<center><h3>You have scored '+quizscore+'!</h3><center>');   
    res.end();
    }
});
});

const port = 3001;
app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;
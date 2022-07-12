const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const day= require(__dirname+"/date.js");
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const app = express();
const _ = require('lodash');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cpquestionsDB", { //can write the mongodb atlas link here
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const questionSchema = {
  title: String,
  content: String,
  link: String,
  tag: String
};

const Question = mongoose.model("Question", questionSchema);

let links=[];
let ids=[];
let tgs=[];
let cnts=[];


app.get("/",function(req,res){
  res.render("list", {
    listTitle: day.getDate(),
    qsts: ids,
    link: links,
    content: cnts,
    tag: tgs
  });
})



app.post("/",function(req,res){
  let itemName = _.toLower(req.body.qst);
  itemName = itemName.replace(/\s+/g, '');
  Question.find(function(err,foundQuestions){
if(err)
{
  console.log(err);
}
else
{
  ids=[];
  links=[];
  tgs=[];
  cnts=[];
  foundQuestions.forEach(function(foundQuestion){
    let a=_.toLower(foundQuestion.title);
    a=a.replace(/\s+/g, '');
    if(a.includes(itemName))
    {
      ids.push(foundQuestion.title);
      links.push(foundQuestion.link);
      tgs.push(foundQuestion.tag);
      cnts.push(foundQuestion.content);
      console.log(foundQuestion.tag);
      console.log("hello");
    }
    let b=_.toLower(foundQuestion.content);
    b=b.replace(/\s+/g, '');
    if(b.includes(itemName))
    {
      ids.push(foundQuestion.title);
      links.push(foundQuestion.link);
      tgs.push(foundQuestion.tag);
      cnts.push(foundQuestion.content);
      console.log(foundQuestion.tag);
      console.log("hello");
    }
    let d=_.toLower(foundQuestion.tag);
    d=d.replace(/\s+/g, '');
    if(d.includes(itemName))
    {
      ids.push(foundQuestion.title);
      links.push(foundQuestion.link);
      tgs.push(foundQuestion.tag);
      cnts.push(foundQuestion.content);
      console.log(foundQuestion.tag);
      console.log("hello");
    }
  });
}

    res.render("list2", {
      listTitle: day.getDate(),
      qsts: ids,
      link: links,
      content: cnts,
      tag: tgs
    });



  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});

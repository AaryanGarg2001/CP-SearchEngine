const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const reqP = require('request-promise');
const axios = require('axios');
const {
  parse
} = require('node-html-parser')



let t = "";
var i=0;
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


for (var i = 1; i <= 10; i++) {
  const url = 'https://codeforces.com/problemset/page/' + i;

  reqP(url)
    .then(function(html) {
      const dom = parse(html);
      const h1 = dom.querySelectorAll("a");
      var m = [];
      var cnt = 0;
      for (var i = 0; i < h1.length; i++) {
        var a = h1[i].text.trim();
        var b = h1[i].getAttribute("href");
        b = b.trim();
        var check = b.substr(1, 19);
        if (check === 'problemset/problem/') {
          let str = b;
          str = str.substr(20);
          let newStr = str.replace('/', '');
          newStr = newStr.replace('/', '');
          if (newStr != a) {
            const item1 = new Question({
              title: newStr,
              content: a,
              link: "https://codeforces.com" + b,
            });
            item1.save();


            const ur = "https://codeforces.com" + h1[i].getAttribute("href");
            reqP(ur).then(function(html) {
                const dom = parse(html);
                const h1 = dom.querySelectorAll(".tag-box");
                t = "";
                for (var i = 0; i < h1.length; i++) {
                  t += h1[i].innerText.trim();
                  t += '/';
                }
                Question.updateOne({
                  title: newStr
                }, {
                  tag: t
                }, function(err) {
                  if (err) {
                    console.log(err);
                  } 
                });
              })
              .catch(function(err) {
                //handle error
              });

            cnt++;
          }
        }
      }
      console.log(h1.length);
      console.log(cnt);
    })
    .catch(function(err) {
      //handle error
    });
}


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

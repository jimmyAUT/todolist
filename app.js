const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
// 在views找要render的檔案,ex:index.ejs

app.get("/", function (req, res) {
  var today = new Date();
  var current = today.getDay();
  var day = "";

  switch (current) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Satday";
      break;
    default:
      console.log("error: " + current);
  }

  res.render("list", { kindOfDay: day });
  // 到views folder找list這個檔案, 並傳JS object到該檔案中
  // object 的key為在list.ejs所設定的變數名
  res.send();
});

app.listen(3000, function () {
  console.log("Server runs on port 3000");
});

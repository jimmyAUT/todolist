const express = require("express");
const app = express();

let items = [];
let works = [];
//設定global letiable使其在不同rout中可以使用

app.set("view engine", "ejs");
// 在views找要render的檔案,ex:index.ejs

app.use(express.urlencoded({ extended: true }));
// 新版node可使用express框架接收post資料

app.use(express.static("public"));
//express框架只會執行app.js及views裡的檔案
//因此要將其他的檔案如css, images等放入public中,並use才可

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleDateString("en-US", options);

  //   let current = today.getDay();
  //   let day = "";

  //   switch (current) {
  //     case 0:
  //       day = "Sunday";
  //       break;
  //     case 1:
  //       day = "Monday";
  //       break;
  //     case 2:
  //       day = "Tuesday";
  //       break;
  //     case 3:
  //       day = "Wednesday";
  //       break;
  //     case 4:
  //       day = "Thursday";
  //       break;
  //     case 5:
  //       day = "Friday";
  //       break;
  //     case 6:
  //       day = "Satday";
  //       break;
  //     default:
  //       console.log("error: " + current);
  //   }

  res.render("list", { listType: day, list: items });
  // 到views folder找list這個檔案, 並傳JS object到該檔案中
  // object 的key為在list.ejs所設定的變數名
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.list === "Works") {
    works.push(item);
    res.redirect("/works");
  } else {
    items.push(item);
    console.log(item);
    res.redirect("/");
    //刷新頁面將newItem傳到web page
  }
});

//set up the second rout "works"
app.get("/works", function (req, res) {
  res.render("list", { listType: "Works", list: works });
});

app.post("/works", function (req, res) {
  let item = req.body.newItem;
  works.push(item);
  res.redirect("/works");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server runs on port 3000");
});

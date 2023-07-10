const express = require("express");
const app = express();
const _ = require("lodash");

//使用mongoose
const mongoose = require("mongoose");

const date = require(__dirname + "/function.js");
// import the other js files as module objects

// console.log(date);
// let items = [];
// let works = [];
//設定global letiable使其在不同rout中可以使用

// 建立資料庫連線
const localURL = "mongodb://127.0.0.1:27017";
const mongodbURL =
  "mongodb+srv://admin-jimmy:16981047@cluster0.3x3hlap.mongodb.net";
mongoose.connect(mongodbURL + "/todolistDB", {
  useNewUrlParser: true,
});

//建立mongodb的 schema
const itemSchema = new mongoose.Schema({
  name: String,
});

//建立資料庫model
const Item = mongoose.model("Item", itemSchema);

//從model建立object
const item1 = new Item({
  name: "Welcome to the List",
});

const item2 = new Item({
  name: "Press + to add up new item to the list",
});

const item3 = new Item({
  name: "<--- press here to delete an item",
});
//建立array來裝新objects
const defaultItems = [item1, item2, item3];

//建立存在DB上的route list,先宣告存儲的物件格式,在使用model宣告建立該物件的constructor
//每一個route都存有各自的items, items存儲格式使用先前建立的itemSchema
const newRouteSchema = new mongoose.Schema({
  routeName: String,
  items: [itemSchema],
});

const Route = mongoose.model("Route", newRouteSchema);

app.set("view engine", "ejs");
// 在views找要render的檔案,ex:index.ejs

app.use(express.urlencoded({ extended: true }));
// 新版node可使用express框架接收post資料

app.use(express.static("public"));
//express框架只會執行app.js及views裡的檔案
//因此要將其他的檔案如css, images等放入public中,並use才可

app.get("/", function (req, res) {
  //使用model.find() access data in the DB
  Item.find({})
    .then((items) => {
      if (items.length === 0) {
        //check are the defaultiems already exist in the DB
        //否則使用insertMany()將array存到資料庫中,並重新返回頁面
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Upload default item to DB successfully");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listType: "Today", list: items });
      }
    })
    .catch((err) => {
      console.log("error : " + err);
    });
  // 使用import的module object中的method
  // let day = date.nowDate();

  // 到views folder找list這個檔案, 並傳JS object到該檔案中
  // object 的key為在list.ejs所設定的變數名
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);
  let newItem = new Item({ name: item });

  let routeName = req.body.listType;

  if (routeName === "Today") {
    //將單筆資料存入DB
    newItem.save();
    res.redirect("/");
    //刷新頁面將newItem傳到web page
  } else {
    Route.findOne({ routeName: routeName })
      .then((routeList) => {
        routeList.items.push(newItem);
        routeList.save();
        res.redirect("/" + routeName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", (req, res) => {
  let removeId = req.body.checkbox;
  console.log(removeId);
  let route = req.body.listType;
  if (route === "Today") {
    //刪除DB的資料modelname.findByIdAndRemove()
    Item.findByIdAndRemove(removeId)
      .then(() => {
        console.log(removeId + " item has been removed");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    // findOneAndUpdate({conditions},{update}).then().catch() =>
    // findOneAndUpdate({conditions},{$pull:{field:{query}}}).then().catch() =>
    // conditions 是搜尋Route DB中的物件,這裡是以routeName 屬性來搜尋特定物件
    // $pull是mongodb的刪除特定資料方法,用以搜尋物件中的array屬性，以特定的key來搜尋,這裡的items建立時即帶有特定id,並搭配key _id
    Route.updateOne(
      { routeName: route },
      { $pull: { items: { _id: removeId } } }
    )
      .then(() => {
        console.log("delete item");
        res.redirect("/" + route);
      })
      .catch((err) => {
        console.log(err);
      });
    // Route.findOneAndUpdate(
    //   { routeName: route },
    //   { $pull: { items: { _id: removeId } } }
    // )
    //   .then(() => {
    //     console.log("delete item");
    //     res.redirect("/" + route);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
});

//set up the second rout "works"
// app.get("/works", function (req, res) {
//   res.render("list", { listType: "Works", list: works });
// });
// use the url iuput parameters to create a new route
app.get("/:newRoute", function (req, res) {
  let newRoute = _.capitalize(req.params.newRoute);
  Route.find({ routeName: newRoute })
    .then((result) => {
      if (result.length > 0) {
        res.render("list", { listType: newRoute, list: result[0].items });
      } else {
        let routeList = new Route({
          routeName: newRoute,
          items: defaultItems,
        });
        routeList.save();
        res.redirect("/" + newRoute);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server runs on port 3000");
});

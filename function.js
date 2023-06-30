console.log(module);

// 輸出module這個object, 其中nowDate這個method 指向nowDate這個function ,不需要加(), 在這邊只是宣告attribute
// 可以省略module
exports.nowDate = function () {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

module.exports.nowDay = nowDay;
function nowDay() {
  let today = new Date();
  let options = {
    weekday: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}

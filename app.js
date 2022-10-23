const express = require("express");
const res = require("express/lib/response");
const app = express();
const mongoose = require("mongoose");

//Create a global variable to be accessible to other function
var items = [];
var workItems = [];

app.set("view engine", "ejs");

//Required to use the read form values functions
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Tell express to serve up public folder as static resource
app.use(express.static("public"));

//Mongoose create and connect to todolistDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

//Create the Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//Create the Model
const Item = mongoose.model("Item", itemSchema);

//Create the Object Document
const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item>",
});

const defaultItems = [item1, item2, item3];

//
app.get("/", function (req, res) {
  var today = new Date();
  var currentDay = today.getDay();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  //list = ejs file from views folder
  //kindOfDay = variable name of an element in list.ejs

  Item.find({}, function (err, foundItems) {
    if (foundItems.length == 0) {
      //Insert many
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to db");
        }
      });
      //redirect to render the list
      //2nd run will proceed to else statement
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItem: foundItems,
      });
    }
  });
});

app.get("/work", function (req, res) {
  var title = "Work";
  res.render("list", {
    listTitle: title,
    newListItem: workItems,
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

//Get the value from the form in the HTML
app.post("/", function (request, response) {
  // if (request.body.list === "Work") {
  //   workItems.push(request.body.newItem);
  //   response.redirect("/work");
  // } else {
  //   items.push(request.body.newItem);
  //   //After pushing the element value redirect to get "/" to rerender items list
  //   response.redirect("/");
  // }

  const itemName = request.body.newItem;
  const item = new Item({ name: itemName });

  item.save();
  console.log("New Item Saved to DB");
  response.redirect("/");
});

app.post("/delete", function (request, response) {
  const checkedItemID = request.body.checkBox;
  console.log(checkedItemID);

  Item.findByIdAndRemove(checkedItemID, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted record with ID: " + checkedItemID);
      response.redirect("/");
    }
  });
});

app.listen("3000", function () {
  console.log("Server started on port 3000");
});

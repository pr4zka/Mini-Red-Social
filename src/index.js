const express = require("express");
const config = require("./server/config");

const app = config(express());

//database connection
require("./database");




app.listen(app.get("port"), () => {
  console.log(`Server on port`, app.get("port"));
});

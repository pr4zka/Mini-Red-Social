const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const express = require("express");
const errorhanlder = require("errorhandler");
const routes = require("../routes/index");
const { format } = require("timeago.js");
module.exports = (app) => {
  //settings
  app.set("port", process.env.PORT || 3000);

  //le digo donde buscar la carpeta views
  app.set("views", path.join(__dirname, "../views"));

  //configuro el motor de plantillas
  app.set("view engine", "ejs");

  //middlewares //funciones de pre procesado
  app.use(morgan("dev"));

  //el single .image es del formulario para poder recibir y procesar la imagen
  app.use(
    multer({ dest: path.join(__dirname, "../public/upload/temp") }).single(
      "image"
    )
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  //global variables
  //le damos un formato a la hora y le pasamos al ejs con el el format()
  app.use((req, res, next) => {
    app.locals.format = format;
    next();
 })
  //routes //recibe la funcion de routes
  routes(app);

  //static files //para que los archivos pueba verse desde el navegador
  app.use("/public", express.static(path.join(__dirname, "../public")));

  //errorhanlder
  if ("developmen" === app.get("env")) {
    app.use(errorhanlder);
  }

  return app;
};

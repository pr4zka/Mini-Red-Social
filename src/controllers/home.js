const ctrl = {};

const { Image } = require("../models");
const sidebar = require("../helpers/sidebar");
ctrl.index = async (req, res) => {
  //solicito de la base de datos las imagenes para mostrar al frondend
  const images = await Image.find().sort({ timestamp: -1 });
  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
  //viewModel almacena las estadisticas en general
  res.render("index", viewModel);
};

module.exports = ctrl;

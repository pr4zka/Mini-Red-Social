const path = require("path");
const { ramdonNumber } = require("../helpers/libs");
const fs = require("fs-extra");
const md5 = require("md5");
const { Image, Comment } = require("../models");
const sidebar = require('../helpers/sidebar');
const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel =  { image: {}, comments: {}}
  //uso la expresion regular para traer la imagen segun su id y guardar en la constante
  const image = await Image.findOne({filename: { $regex: req.params.image_id }});
  //si la imagen existe entonces devuelvo los datos
  if (image) {
    //incrementar la vista de las imagenes cada vez que renderiza la imagen
    image.views = image.views + 1;
    viewModel.image = image;
    //guramos la imagen con los views en la base de datos
    await image.save();
    //le pongo el filename o si no me devuelve un objeto vacio
    const comments = await Comment.find({ image_id: image._id });
    //guardamos en view model los comentarios extraidos
     viewModel.comments = comments;
     viewmodel = await sidebar(viewModel);
    res.render("image", viewModel);
  }
};
ctrl.create = async (req, res) => {
  const saveImage = async () => {
    const imgUrl = ramdonNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      // de path saco la ruta de la imagen subida
      const imageTempPath = req.file.path;
      //obtengo la extencion original de la imagen y la guardo en una constante
      const ext = path.extname(req.file.originalname).toLowerCase();
      //le asingo un numero aleatorio a la imagen subida, mas la extencion y l a guardo en upload
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });
        const imageSaved = await newImg.save();
        res.redirect("/images/" + imageSaved.uniqueId);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: "Only Images are allowed" });
      }
    }
  };
  saveImage();
};
ctrl.like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

ctrl.comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect("/images/" + image.uniqueId);
  } else {
    res.redirect("/");
  }
};
ctrl.remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    //borramos la imagen de la carpeta donde se encontraba la imagen con fs
    await fs.unlink(path.resolve("./src/public/upload/" + image.filename));
    await Comment.deleteOne({ image_id: image._id });
    await image.remove();
    res.json(true);
  
  }
};

module.exports = ctrl;

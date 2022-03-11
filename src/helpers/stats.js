const { Comment, Image } = require("../models");

async function imageCounter() {
  return await Image.countDocuments();
}
async function commentsCounter() {
  return await Comment.countDocuments();
}
async function imageTotalViewCounter() {
  //va tomar el valor de las vistas de todas las imagenes y las ira sumando y las almaceno en viewsTotal
  const result = await Image.aggregate([
    {
      $group: {
        _id: "1",
        viewsTotal: { $sum: "$views" },
      },
    },
  ]);
  return result[0].viewsTotal;
}
async function likesTotalCounter() {
  const result = await Image.aggregate([
    {
      $group: {
        _id: "1",
        likesTotal: { $sum: "$likes" },
      },
    },
  ]);
  return result[0].likesTotal;
}
module.exports = async () => { 
  const reuslts = await Promise.all([
        imageCounter(),
        commentsCounter(),
        imageTotalViewCounter(),
        likesTotalCounter()
    ] )
    return {
        image: reuslts[0],
        comments: reuslts[1],
        views: reuslts[2],
        likes: reuslts[3]
    }
};

const helpers = {};

helpers.ramdonNumber = () => {
  const possible = "abcdfhgijklmnopqrstwxyz0123456789";
  let ramdonNumber = 0;
  for (let i = 0; i < 6; i++) {
    //genera un  numero aleatorio usando el contenido de possible
    ramdonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return ramdonNumber;
};

module.exports = helpers;
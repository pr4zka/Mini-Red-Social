
$('#post-comment').hide();
$('#btn-toggle-comment').click(function(e){
  e.preventDefault();
  $('#post-comment').slideToggle();

})
//funcion del boton like
$("#btn-like").click(function (e) {
  e.preventDefault();
  let imageId = $(this).data("id");
  $.post("/images/" + imageId + "/like").done((data) => {
    $(".likes-count").text(data.likes);
  });
});

//funcion del boton eliminar
$("#btn-delete").click(function (e) {
  e.preventDefault();
  let $this = $(this);
  const response = confirm("Are you sure want to delete this image?");
  if (response) {
    let imageId = $this.data("id");
      $.ajax({
        url: '/images/' + imageId, 
        type: 'DELETE'
      })
       .done(function (result){

        //cambiamos el boton eliminar cuando se ejecute la accion
        $this.removeClass('btn-danger').addClass('btn-success');
        $this.find('i').removeClass('fa-times').addClass('fa-check');
        $this.append(`<span>Deleted</span>`);
      })
  }
});

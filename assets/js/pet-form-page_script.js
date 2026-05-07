window.addEventListener("DOMContentLoaded", () => {
  //Creación de contenido de nueva alergia en el formulario de dada de alta de una mascota nueva
  document.addEventListener("DOMContentLoaded", function () {
    const btnAdd = document.getElementById("btn-add");
    const container = document.getElementById("container-allergies");
    const template = document.getElementById("allergy-item");

    btnAdd.addEventListener("click", function () {
      const newAllergy = template.content.cloneNode(true);

      const btnRemove = newAllergy.querySelector("#btn-remove");
      btnRemove.addEventListener("click", function (e) {
        e.target.closest("#allergy-block").remove();
      });

      btnAdd.before(newAllergy);
    });
  });
});

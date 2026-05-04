document.addEventListener("DOMContentLoaded", function () {
  function updateClock() {
    var date = new Date();
    var hour = date.toLocaleTimeString();
    document.getElementById("clock").textContent = hour;
  }

  //Ejecta la función cada 1000 milisegundos (1 segundo)
  setInterval(updateClock, 1000);

  updateClock();
});

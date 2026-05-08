window.addEventListener("DOMContentLoaded", () => {
  console.log("detalles de la mascota");

  let params = new URLSearchParams(document.location.search);
  let idPet = params.get("id");
  console.log(idPet);

  const urlPet = `http://localhost:8080/pets/${idPet}`;

  const getPetData = async () => {
    try {
      const [pets] = await Promise.all([fetch(urlPet)]);

      const petsData = await pets.json();

      console.log(petsData);

      if (petsData.data) {
        createPets(petsData.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
});

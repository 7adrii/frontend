window.addEventListener("DOMContentLoaded", () => {
  console.log("detalles de la mascota");

  let params = new URLSearchParams(document.location.search);
  let idPet = params.get("id");
  console.log(idPet);

  const urlPet = `http://localhost:8080/pets/${idPet}`;
  const urlAllergies = `http://localhost:8080/allergies/pet/${idPet}`;
  
  const getPetData = async () => {
    try {
      const pet = await fetch(urlPet);
      const petData = await pet.json();


      const dniOwner = petData.data.owner_dni;
      const urlOwner = `http://localhost:8080/owners/${dniOwner}`;

      const owner = await fetch(urlPet);
      const ownerData = await owner.json();

      const allergies = await fetch(urlAllergies);
      const allergiesData = await allergies.json();

      console.log(petData);
      console.log(ownerData);
      console.log(allergiesData);

      /*if (petData.data) {
        createPet(petData.data);
      }*/
    } catch (error) {
      console.error(error);
    }
  };

  getPetData();
});

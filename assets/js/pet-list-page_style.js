const urlPet = `http://localhost:8080/pets`;
const urlOwners = `http://localhost:8080/owners`;

const getListPets = async () => {
  try {
    const [pets, owners] = await Promise.all([
      fetch(urlPet),
      fetch(urlOwners)
    ]);

    const petsData = await pets.json();
    const ownersData = await owners.json();

    console.log(petsData);
    console.log(ownersData);

    if (petsData.data && ownersData.data) {
      createPets(petsData.data, ownersData.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const createPets = (petsList, ownersList) => {
  console.log(petsList);
  console.log(ownersList);

  //Creacion de la linea de tipos de especies de la base de datos
  const typeAnimal = document.getElementById("type-animal");
  typeAnimal.innerHTML = ``;

  const types = [];
  petsList.forEach((pet) => {
    const { type } = pet;

    if (!types.includes(type)) {
        types.push(type);

        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");

        listItem.innerHTML = `
                <a class="nav-text active" aria-current="page" href="#">${type}</a>
        `;

        typeAnimal.appendChild(listItem);
    }
  });

  //Creacion de la tabla de mascotas con su respectiva informacion y contacto del dueño
  const listPets = document.getElementById("pets-list");
  listPets.innerHTML = ``;

  petsList.forEach((pet) => {
    const { id_pet, name, type, breed, weight, sex, birth_date, owner_dni } = pet;

    // Obtener el dueño segun el DNI del dueño de la mascota
    const owner = ownersList.find(o => o.dni_owner == owner_dni);

    // Obtener el nombre y teléfono de contacto del dueño
    const ownerName = owner ? owner.name : "Desconocido";
    const ownerContact = owner ? owner.phone : "Desconocido";

    const tableRow = document.createElement("tr");
    tableRow.classList.add("line-hover");

    tableRow.innerHTML = `
            <th scope="row" class="d-none d-md-table-cell">Ej: xx-xx-xxxx</th>
            <th scope="row">${name}</th>
            <th scope="row" class="d-none d-md-table-cell">${type}</th>
            <th scope="row" class="d-none d-md-table-cell">${ownerName}</th>
            <th scope="row">${owner_dni}</th>
            <th scope="row" class="d-none d-md-table-cell"></th>
            <th scope="row">${ownerContact}</th>
            <th scope="row">
                <a href="pet-detail.html?id=${id_pet}">
                    <button class="btn btn-primary">+ info</button>
                </a>
            </th>
        `;

    listPets.appendChild(tableRow);
  });

  //Creacion de las tarjetas de ultimos registros en la base de datos
  
  const cardPets = document.getElementById("last-aditions");
  cardPets.innerHTML = ``;

  for (let i = petsList.length-1; i >= petsList.length-3; i--) {

    const pet = petsList[i];
    const { id_pet, name, type, breed, weight, sex, birth_date, owner_dni } = pet;

    const cardPet = document.createElement("div");
    cardPet.classList.add("card");
    cardPet.style.width = "18rem";

    cardPet.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${type}</h6>
        <p class="card-text">${owner_dni}</p>
        <a href="#" class="card-link">
          <button class="btn btn-primary">+ info</button>
        </a>
      </div>
    `;
    
    cardPets.appendChild(cardPet);
  }  
};

getListPets();

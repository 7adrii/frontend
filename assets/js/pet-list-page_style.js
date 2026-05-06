const urlPet = `http://localhost:8080/pets`;
const urlOwners = `http://localhost:8080/owners`;

const getListPets = async () => {
  try {
    const result = await fetch(urlPet);
    const pets = await result.json();
    console.log(pets);

    if (pets && pets.data) {
      createPets(pets.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const createPets = (petsList) => {
  console.log(petsList);

  //Creacion de la linea de tipos de especies
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

  //Creacion de la tabla de mascotas
  const listPets = document.getElementById("pets-list");
  listPets.innerHTML = ``;

  petsList.forEach((pet) => {
    const { id_pet, name, type, breed, weight, sex, birth_date, owner_dni } = pet;

    const tableRow = document.createElement("tr");
    tableRow.classList.add("line-hover");

    tableRow.innerHTML = `
            <th scope="row" class="d-none d-md-table-cell">Ej: xx-xx-xxxx</th>
            <th scope="row">${name}</th>
            <th scope="row" class="d-none d-md-table-cell">${type}</th>
            <th scope="row" class="d-none d-md-table-cell">Nombre Dueño</th>
            <th scope="row">${owner_dni}</th>
            <th scope="row" class="d-none d-md-table-cell"></th>
            <th scope="row">Tel/Email</th>
            <th scope="row">
                <a href="pet-detail.html?id=${id_pet}">
                    <button class="btn btn-primary">+ info</button>
                </a>
            </th>
        `;

    listPets.appendChild(tableRow);
  });
};

getListPets();

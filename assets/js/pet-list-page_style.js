const urlPet = `http://44.195.69.26:8080/pets`;
const urlOwners = `http://44.195.69.26:8080/owners`;

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

  //Creación de las tarjetas de resumen datos
  //Tarjeta de total registros que de altas que tiene la clinica
  const cardAllRegister = document.getElementById("card-all-register");
  const numberRegister = petsList.length;

  if (cardAllRegister) {
    cardAllRegister.innerHTML = `
            <div class="card-body bg-dark rounded-4">
                <div class="header-card">
                    <h5 class="card-title text-light"><i class="fa-solid fa-book-open"></i></h5>
                    <h6 class="card-subtitle mb-2 text-light">Registers</h6>
                </div>
                <h6 class="card-subtitle mb-2 text-light d-none d-lg-block">Total</h6>
                <div class="body-card">
                  <h6 class="card-subtitle mb-2 text-light">Complete historic</h6>
                  <h5 class="card-title text-light">${numberRegister}</h5>
                </div>
            </div>
            
        `;
  }

  //Tarjeta de total registros que de altas que tiene la clinica
  const cardDeleteRegister = document.getElementById("card-delete");
  let deletePetData = localStorage.getItem("allDeletes") || 0;

  if (cardDeleteRegister) {
    cardDeleteRegister.innerHTML = `
            <div class="card-body bg-dark rounded-4">
                <div class="header-card">
                    <h5 class="card-title text-secondary"><i class="fa-solid fa-calendar-minus"></i></h5>
                    <h6 class="card-subtitle mb-2 text-secondary">Cancellations</h6>
                </div>
                <h6 class="card-subtitle mb-2 text-secondary d-none d-lg-block">Desactivated registers</h6>
                <div class="body-card">
                  <h6 class="card-subtitle mb-2 text-secondary">Cancellations</h6>
                  <h5 class="card-title text-secondary">${deletePetData}</h5>
                </div>
            </div>
        `;
  }

  //Tarjeta de total de especies que hay en la clínica
  const cardAllSpecies = document.getElementById("card-species");

  const differentSpecies = [];
  let numberSpecies = 0;

  for (let i = 0; i < petsList.length; i++) {
    if (!differentSpecies.includes(petsList[i].type)) {
      differentSpecies.push(petsList[i].type);
      numberSpecies++;
    }
  }

  if (cardAllSpecies) {
    cardAllSpecies.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-bone"></i></h5>
                    <h6 class="card-subtitle mb-2">Species</h6>
                </div>
                <h6 class="card-subtitle mb-2 d-none d-lg-block">Different types of animals</h6>
                <div class="body-card">
                  <h6 class="card-subtitle mb-2">Total</h6>
                  <h5 class="card-title">${numberSpecies}</h5>
                </div>
            </div>
        `;
  }

  //Tarjeta de total de dueños que hay registrados
  const cardAllOwners = document.getElementById("card-owners");

  const dniOwners = [];
  let numberOwners = 0;

  for (let i = 0; i < ownersList.length; i++) {
    if (!dniOwners.includes(ownersList[i].dni_owner)) {
      dniOwners.push(ownersList[i].dni_owner);
      numberOwners++;
    }
  }

  if (cardAllOwners) {
    cardAllOwners.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-user"></i></h5>
                    <h6 class="card-subtitle mb-2">Owners</h6>
                </div>
                <h6 class="card-subtitle mb-2 d-none d-lg-block">Registered owners</h6>
                <div class="body-card">
                  <h6 class="card-subtitle mb-2">Total</h6>
                  <h5 class="card-title">${numberOwners}</h5>
                </div>
            </div>
        `;
  }

  //Obtenemos la fecha de hoy y la formateamos a formato dd-mm-yyyy para ponerla en la tarjeta de nuevos registros del dia
  const dateToday = new Date();
  const day = String(dateToday.getDate()).padStart(2, '0');
  const month = String(dateToday.getMonth() + 1).padStart(2, '0');
  const year = dateToday.getFullYear();
  const formattedToday = `${day}/${month}/${year}`

  //Tarjeta de total registros que se han hecho hoy.
  const cardNewRegisters = document.getElementById("card-new-register");
  let numberNewRegister = 0;


  //Calculamos cuantas mascotas se han registrado hoy
  petsList.forEach((pet) => {
    const dateParts = pet.register_date.split('/');
    const registerDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    if (dateToday.getDate() === registerDate.getDate()) {
      numberNewRegister++;
    }
  });

  if (cardNewRegisters) {
    cardNewRegisters.innerHTML = `
            <div class="card-body bg-dark rounded-4">
                <div class="header-card">
                    <h5 class="card-title text-primary"><i class="fa-solid fa-calendar-plus"></i></h5>
                    <h6 class="card-subtitle mb-2 text-primary">New</h6>
                </div>
                <h6 class="card-subtitle mb-2 text-primary d-none d-lg-block">New registers</h6>
                <div class="body-card">
                  <h6 class="card-subtitle mb-2 text-primary">${formattedToday}</h6>
                  <h5 class="card-title text-primary">${numberNewRegister}</h5>
                </div>
            </div>
        `;
  }

  //Creacion de la tabla de mascotas con su respectiva informacion y contacto del dueño
  const listPets = document.getElementById("pets-list");
  listPets.innerHTML = ``;

  petsList.forEach((pet) => {
    const { id, name_pet, type, breed, weight, sex, birth_date, register_date, owner_dni } = pet;

    // Obtener el dueño segun el DNI del dueño de la mascota
    const owner = ownersList.find(o => o.dni_owner == owner_dni);

    // Obtener el nombre y teléfono de contacto del dueño
    const ownerSurname = owner ? owner.surname : "Desconocido";
    const ownerContact = owner ? owner.phone : "Desconocido";

    const tableRow = document.createElement("tr");
    tableRow.classList.add("line-hover");

    tableRow.innerHTML = `
            <th scope="row">${register_date}</th>
            <th scope="row">${name_pet}</th>
            <th scope="row" class="d-none d-md-table-cell">${type}</th>
            <th scope="row">${ownerSurname}</th>
            <th scope="row" class="d-none d-md-table-cell">${owner_dni}</th>
            <th scope="row" class="d-none d-md-table-cell">${ownerContact}</th>
            <th scope="row">
                  <a href="pet-detail.html?id=${id}" class="btn">
                    <i class="fa-solid fa-info"></i>
                  </a>
            </th>
            <th scope="row">
                  <a class="btn btn-delete-pet d-none d-md-table-cell">
                    <i class="fa-solid fa-trash"></i>
                  </a>
            </th>
            
        `;

    listPets.appendChild(tableRow);

    //Boton eliminar mascota de la base de datos
    const btnDelete = tableRow.querySelector(".btn-delete-pet");
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmAction = await Swal.fire({
        title: `You are going to delete this register!`,
        html: `¿<strong>Are you sure you want to remove</strong> pacient <strong>${name_pet}</strong>?`,
        icon: "warning",
        iconColor: "#8a3938",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        cancelButtonText: "No, cancel",
      });

      if (confirmAction.isConfirmed) {
        await deletePet(id);
      } else {
        return;
      }
    });
  });

  //Creacion de las tarjetas de ultimos registros en la base de datos
  const cardPets = document.getElementById("last-aditions");
  cardPets.innerHTML = ``;

  for (let i = petsList.length - 1; i >= petsList.length - 6; i--) {

    const pet = petsList[i];
    const { id, name_pet, type, breed, weight, sex, birth_date, owner_dni } = pet;

    const owner = ownersList.find(o => o.dni_owner === owner_dni);
    const ownerName = owner.name_owner;
    const ownerSurname = owner.surname;
    const fullName = ownerName + " " + ownerSurname;

    const cardPet = document.createElement("div");
    cardPet.classList.add("card-last-register");

    cardPet.innerHTML = `
    <div class="card-new">
      <div class="card-body">
        <div class="header-card">
          <h5 class="card-title"><i class="fa-solid fa-paw"></i></h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${type}</h6>
        </div>
        <h5 class="card-title">${name_pet}</h5>
        <h6 class="card-title">${fullName}</h6>
        <div class="btn-options">
          <a href="pet-detail.html?id=${id}" class="btn">
            <i class="fa-solid fa-info"></i>
          </a>
          <a class="btn btn-delete-pet">
            <i class="fa-solid fa-trash"></i>
          </a>
        </div>
      </div>
    </div>
    `;

    cardPets.appendChild(cardPet);

    //Boton eliminar mascota de la base de datos desde las tarjetas de registros más recientes
    const btnDelete = cardPet.querySelector(".btn-delete-pet");
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmAction = await Swal.fire({
        title: `You are going to delete this register!`,
        html: `¿<strong>Are you sure you want to remove</strong> pacient <strong>${name_pet}</strong>?`,
        icon: "warning",
        iconColor: "#8a3938",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        cancelButtonText: "No, cancel",
      });

      if (confirmAction.isConfirmed) {
        await deletePet(id);
      } else {
        return;
      }
    });
  }

  const deletePet = async (id_pet) => {
    try {
      const deleteResponse = await fetch(`http://44.195.69.26:8080/pets/${id_pet}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (deleteResponse.ok) {
        let currentDeletes = parseInt(localStorage.getItem("allDeletes") || "0");
        localStorage.setItem("allDeletes", currentDeletes + 1);
        Swal.fire({
          title: "Register eliminated!",
          text: "The register has been successfully removed",
          icon: "success",
          iconColor: "#318a3a",
          confirmButtonText: "Go back to pacients",
          confirmButtonColor: "#2a1418",
        }).then(() => {
          window.location.href = "pet-list-page.html";
        });
      } else {
        Swal.fire({
          title: "Error",
          text: `Error: ${deleteResponse.status}`,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Conection error",
        text: error.message,
        icon: "error",
      });
    }
  };
};

getListPets();

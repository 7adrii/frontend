window.addEventListener("DOMContentLoaded", () => {
  console.log("detalles de la mascota");

  let params = new URLSearchParams(document.location.search);
  let idPet = params.get("id");
  console.log(idPet);

  const urlPet = `http://localhost:8080/pets/${idPet}`;
  const urlAllergies = `http://localhost:8080/allergies/pet/${idPet}`;
  const urlAppointments = `http://localhost:8080/appointments/pet/${idPet}`;

  const getPetData = async () => {
    try {
      const pet = await fetch(urlPet);
      const petData = await pet.json();

      const dniOwner = petData.data.owner_dni;
      const urlOwner = `http://localhost:8080/owners/${dniOwner}`;

      const owner = await fetch(urlOwner);
      const ownerData = await owner.json();

      const allergies = await fetch(urlAllergies);
      const allergiesData = await allergies.json();

      const appointments = await fetch(urlAppointments);
      const appointmentsData = await appointments.json();

      console.log(petData);
      console.log(ownerData);
      console.log(allergiesData);
      console.log(appointmentsData);

      if (
        petData.data &&
        ownerData.data &&
        allergiesData.data &&
        appointmentsData.data
      ) {
        createPet(
          petData.data,
          ownerData.data,
          allergiesData.data,
          appointmentsData.data,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createPet = async (
    petData,
    ownerData,
    allergiesData,
    appointmentsData,
  ) => {
    //Datos del dueño
    const ownerElement = document.getElementById("owner");
    const { dni_owner, name_owner, surname, phone, email } = ownerData;

    ownerElement.innerHTML = `
      <div class="owner-name">
        <i class="fa-solid fa-user fa-2x"></i>
        <h4>Datos de contacto ${name_owner} ${surname}</h4>
      </div>
      <div class="owner-contact">
        <p><i class="fa-solid fa-address-card"></i> ${dni_owner}</p>
        <p><i class="fa-solid fa-envelope"></i> ${email}</p>
        <p><i class="fa-solid fa-mobile"></i> ${phone}</p>
      </div>
    `;

    //Datos de la mascota
    const petElement = document.getElementById("pet");
    const { id_pet, name_pet, type, breed, weight, sex, birth_date } = petData;

    if (!breed || breed === undefined) {
      type = "-";
    }

    petElement.innerHTML = `
      <div class="pet-intro">
        <div class="pet-name">
          <i class="fa-solid fa-paw fa-2x"></i>
          <h2>${name_pet}</h2>
        </div>

        <div class="pet-btns">
          <a href="#" class="btn btn-primary"><i class="fa-solid fa-pencil"></i></a>
          <a href="#" class="btn btn-secondary"><i class="fa-solid fa-trash"></i></a>
        </div>
      </div>

      <div>
        <div>
          <h4>${type}</h4>
          <h6>${breed}</h6>
        </div>
          <p>${weight} kg</p>
          <p>${sex}</p>
          <p>${birth_date}</p>
      </div>
    `;

    //Numero de alergias
    const allergiesQuantity = document.getElementById("pet-allergy");
    const numAllergies = allergiesData.length;
    allergiesQuantity.innerHTML = `
      <h4>Total alergias: ${numAllergies}</h4>
      <a href="new-allergy.html" class="btn btn-secondary"><i class="fa-solid fa-plus"></i></a>
    `;

    //Datos de las alergias
    const allergyList = document.getElementById("allergy");
    allergyList.innerHTML = ``;

    allergiesData.forEach((allergy) => {
      const allergyInfo = document.createElement("li");
      allergyInfo.classList.add("list-group-item");

      const { id_allergy, allergen, emergency_treatment } = allergy;

      allergyInfo.innerHTML = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Alergeno</th>
              <th scope="col">Tratamiento emergencia</th>
            </tr>
          </thead>
          <tbody id="consult-list">
            <th scope="col">${allergen}</th>
            <th scope="col">${emergency_treatment}</th>
            <th scope="col">
              <div class="dropdown">
                <button class="btn-options" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false"><i
                  class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" href="#">Más información</a></li>
                  <li><a class="dropdown-item" href="#">Editar</a></li>
                  <li><a class="dropdown-item" href="#">Eliminar</a></li>
                </ul>
              </div>
            </th>
          </tbody>
        </table>
      `;

      allergyList.appendChild(allergyInfo);
    });

    //Datos del historial de citas
    const appointmentsList = document.getElementById("clinic-history");
    appointmentsList.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Día de la cita</th>
          <th scope="col" class="d-none d-md-table-cell">Hora</th>
          <th scope="col" class="d-none d-md-table-cell">Causa</th>
          <th scope="col">Veterinario</th>
          <th scope="col" class="d-none d-md-table-cell">Duración</th>
          <th scope="col"></th>
        </tr>
      </thead>
    `;

    appointmentsData.forEach((appointment) => {
      const appointmentInfo = document.createElement("tbody");

      const {
        date_appointment,
        start_time,
        end_time,
        observations,
        consult_id,
        veterinarian_dni,
      } = appointment;

      const date = "2024-01-01";

      const start = new Date(`${date}T${start_time}`);
      const end = new Date(`${date}T${end_time}`);

      const diferenceMs = end - start;
      const duration = diferenceMs / (1000 * 60);

      appointmentInfo.innerHTML = `
        <tr>
          <td scope="col">${date_appointment}</td>
          <td scope="col" class="d-none d-md-table-cell">${start_time}</td>
          <td scope="col" class="d-none d-md-table-cell">${observations}</td>
          <td scope="col">${veterinarian_dni}</td>
          <td scope="col" class="d-none d-md-table-cell">${duration} minutos</td>
          <td scope="col">
            <div class="dropdown">
              <button class="btn-options" type="button" id="dropdownMenuButton1"
                data-bs-toggle="dropdown" aria-expanded="false"><i
                class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" href="#">Más información</a></li>
                <li><a class="dropdown-item" href="#">Editar</a></li>
                <li><a class="dropdown-item" href="#">Eliminar</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;

      appointmentsList.appendChild(appointmentInfo);
    });
  };

  getPetData();
});

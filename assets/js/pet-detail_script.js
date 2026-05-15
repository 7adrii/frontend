window.addEventListener("DOMContentLoaded", () => {
  console.log("detalles de la mascota");

  let params = new URLSearchParams(document.location.search);
  let idPet = params.get("id");
  console.log(idPet);

  const urlPet = `http://localhost:8080/pets/${idPet}`;
  const urlPathologies = `http://localhost:8080/pathologies/pet/${idPet}`;
  const urlAppointments = `http://localhost:8080/appointments/pet/${idPet}`;
  const urlVeterinarians = `http://localhost:8080/veterinarians`;

  const getPetData = async () => {
    try {
      const pet = await fetch(urlPet);
      const petData = await pet.json();

      const dniOwner = petData.data.owner_dni;
      const urlOwner = `http://localhost:8080/owners/${dniOwner}`;

      const owner = await fetch(urlOwner);
      const ownerData = await owner.json();

      const pathologies = await fetch(urlPathologies);
      let pathologiesData;

      if (pathologies.status === 404) {
        pathologiesData = { data: [] };
      } else {
        pathologiesData = await pathologies.json();
      }

      const appointments = await fetch(urlAppointments);
      const appointmentsData = await appointments.json();

      const veterinarians = await fetch(urlVeterinarians);
      const veterinariansData = await veterinarians.json();

      console.log(petData);
      console.log(ownerData);
      console.log(pathologiesData);
      console.log(appointmentsData);

      if (
        petData.data &&
        ownerData.data &&
        pathologiesData.data &&
        appointmentsData.data &&
        veterinariansData
      ) {
        createPet(
          petData.data,
          ownerData.data,
          pathologiesData.data,
          appointmentsData.data,
          veterinariansData.data
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createPet = async (petData, ownerData, pathologiesData, appointmentsData, veterinariansData) => {
    //Datos del dueño
    const ownerElement = document.getElementById("owner");
    const {
      dni_owner,
      name_owner,
      surname,
      phone,
      email,
      direction,
      floor,
      city,
      province,
      postal_code,
    } = ownerData;

    ownerElement.innerHTML = `
    <div class="owner-name">
        <div class="intro">
          <h6 class="text-light">Información del dueñ@</h6>
          <button type="button" id="btnOpenPopUpOwner" class="btn btn-primary"><i class="fa-solid fa-pencil"></i></button>
        </div>

      <div class="information-elements">
        <div class="owner-name">
          <div class="information-section">
            <h6>Nombre</h6>
            <h6 class="text-primary">${name_owner}</h6>
          </div>
          <div class="information-section">
            <h6>Apellidos</h6>
            <h6 class="text-primary">${surname}</h6>
          </div>
        </div>
        <div class="owner-contact">
          <h6>Datos de contacto</h6>
          <div class="information-section">
            <i class="fa-solid fa-address-card"></i>
            <h6 class="text-primary">${dni_owner}</h6>
          </div>
          <div class="information-section">
            <i class="fa-solid fa-envelope"></i>
            <h6 class="text-primary">${email}</h6>
          </div>
          <div class="information-section">
            <i class="fa-solid fa-mobile"></i>
            <h6 class="text-primary">${phone}</h6>
          </div>
        </div>
      <div class="owner-direction">
        <h6>Dirección de residencia</h6>
        <div class="information-section">
          <h6>Calle</h6>
          <h6 class="text-primary">${direction}</h6>
        </div>
        <div class="information-section">
          <h6>Piso</h6>
          <h6 class="text-primary">${floor}</h6>
        </div>
        <div class="information-section">
          <h6>Ciudad</h6>
          <h6 class="text-primary">${city}</h6>
        </div>
        <div class="information-section">
          <h6>Código Postal</h6>
          <h6 class="text-primary">${postal_code}</h6>
        </div>
      </div>
    </div>
    `;

    //Pop Up para editar los datos del dueño
    const btnPopUpOwner = document.getElementById("btnOpenPopUpOwner");
    const popUpOwner = document.getElementById("editOwnerPopUp");

    btnPopUpOwner.addEventListener("click", (e) => {
      e.preventDefault();

      console.log("Abriendo modal");

      document.getElementById("name_owner").value = name_owner;
      document.getElementById("surname").value = surname;
      document.getElementById("phone").value = phone;
      document.getElementById("email").value = email;
      document.getElementById("direction").value = direction;
      document.getElementById("floor").value = floor;
      document.getElementById("city").value = city;
      document.getElementById("province").value = province;
      document.getElementById("postal_code").value = postal_code;

      popUpOwner.showModal();
    });

    const saveBtnOwner = document.getElementById("saveChangesOwner");
    saveBtnOwner.addEventListener("click", async (e) => {
      e.preventDefault();

      const ownerPutAPI = {
        name_owner: document.getElementById("name_owner").value.trim(),
        surname: document.getElementById("surname").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        direction: document.getElementById("direction").value.trim(),
        floor: document.getElementById("floor").value.trim(),
        city: document.getElementById("city").value.trim(),
        province: document.getElementById("province").value.trim(),
        postal_code: document.getElementById("postal_code").value.trim(),
      };

      const {
        name_owner,
        surname,
        phone,
        email,
        direction,
        floor,
        city,
        province,
        postal_code,
      } = ownerPutAPI;

      if (
        !name_owner ||
        !surname ||
        !phone ||
        !email ||
        !direction ||
        !floor ||
        !city ||
        !province ||
        !postal_code
      ) {
        Swal.fire({
          title: "Faltan datos por rellenar",
          confirmButtonText: "Volver a la edición",
        });
        return;
      }
      console.log("Cuerpo del envío:", JSON.stringify(ownerPutAPI));
      await sendOwnerData(ownerPutAPI, dni_owner);
    });

    const sendOwnerData = async (ownerPutAPI, dni_owner) => {
      try {
        const PutResponse = await fetch(
          `http://localhost:8080/owners/${dni_owner}`,
          {
            method: "PUT",
            body: JSON.stringify(ownerPutAPI),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
        );

        if (PutResponse.ok) {
          const popUp = document.getElementById("editOwnerPopUp");
          popUp.close();
          window.location.reload();
        } else {
          const errorData = await PutResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${PutResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    //Datos de la mascota
    const petHeader = document.getElementById("pet-header");
    const petElement = document.getElementById("pet");

    const {
      id_pet,
      name_pet,
      type,
      breed,
      weight,
      sex,
      birth_date,
      age,
      register_date,
      owner_dni,
    } = petData;

    let newBreed;

    if (!breed || breed === undefined || breed == "anonymous") {
      newBreed = "-";
    }
    else{
      newBreed = breed;
    }

    const initialsPet = name_pet.substring(0, 2).toUpperCase();

    petHeader.innerHTML = `
      <span class="avatar-text">${initialsPet}</span>
      <h5 class="text-light">${name_pet}</h5>
      <div class="header-info">
        <h6 class="text-light">${type}</h6>
        <h6 class="text-light">${newBreed}</h6>
      </div>
      <div class="btn-options">
        <button type="button" id="btnOpenPopUpPet" class="btn btn-primary"><i class="fa-solid fa-pencil"></i></button>
        <a href="#" class="btn btn-secondary" id="btn-delete"><i class="fa-solid fa-trash"></i></a>
      </div>
      

    `

    petElement.innerHTML = `
    <div class="intro">
        <h6 class="text-light">Información de la mascota</h6>
    </div>

    <div class="information-elements">

      <div class="information-section">
          <h6>Peso</h6>
          <h6 class="text-primary">${weight} kg</h6>
      </div>

      <div class="information-section">
          <h6>Sexo</h6>
          <h6 class="text-primary">${sex}</h6>
      </div>

      <div class="information-section">
          <h6>Fecha de nacimiento</h6>
          <h6 class="text-primary">${birth_date}</h6>
      </div>

      <div class="information-section">
          <h6>Edad</h6>
          <h6 class="text-primary">${age}</h6>
      </div>

      <div class="information-section">
          <h6>Fecha de registro</h6>
          <h6 class="text-primary">${register_date}</h6>
      </div>

    </div>
    `;

    //Pop up de editar datos de la mascota y guardar los cambios
    const btnPopUpPet = document.getElementById("btnOpenPopUpPet");
    const popUpPet = document.getElementById("editPetPopUp");

    btnPopUpPet.addEventListener("click", (e) => {
      e.preventDefault();

      //Cambiamos la fecha a formato año-mes-dia para que se muestre en el modal
      const dayMonthYear = birth_date.split('/');
      const day = dayMonthYear[0].toString().padStart(2, '0');
      const month = dayMonthYear[1].toString().padStart(2, '0');
      const year = dayMonthYear[2];
      const newBirthDate = `${year}-${month}-${day}`;

      console.log("Abriendo modal");

      document.getElementById("name_pet").value = name_pet;
      document.getElementById("type").value = type;
      document.getElementById("breed").value = breed;
      document.getElementById("weight").value = weight;
      document.getElementById("sex").value = sex;
      document.getElementById("birth_date").value = newBirthDate;

      popUpPet.showModal();
    });

    const saveBtnPet = document.getElementById("saveChangesPet");
    saveBtnPet.addEventListener("click", async (e) => {
      e.preventDefault();

      const petOwnerDni = petData.owner_dni;

      const petPutAPI = {
        name_pet: document.getElementById("name_pet").value.trim(),
        type: document.getElementById("type").value.trim(),
        breed: document.getElementById("breed").value.trim(),
        weight: parseFloat(document.getElementById("weight").value),
        sex: document.getElementById("sex").value,
        birth_date: document.getElementById("birth_date").value,
        owner_dni: petOwnerDni,
      };

      const { name_pet, type, breed, weight, sex, birth_date, owner_dni } =
        petPutAPI;

      if (!name_pet || !type || isNaN(weight) || !sex || !birth_date) {
        Swal.fire({
          title: "El campo año está vacio",
          confirmButtonText: "Volver a la edición",
        });
        return;
      }
      console.log(id_pet);
      console.log("Cuerpo del envío:", JSON.stringify(petPutAPI));
      await sendPetData(petPutAPI, id_pet);
    });


    const sendPetData = async (petPutAPI, id) => {
      try {
        const PutResponse = await fetch(`http://localhost:8080/pets/${id}`, {
          method: "PUT",
          body: JSON.stringify(petPutAPI),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (PutResponse.ok) {
          const popUp = document.getElementById("editPetPopUp");
          popUp.close();
          window.location.reload();
        } else {
          const errorData = await PutResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${PutResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    //Numero de patologias
    const pathologiesQuantity = document.getElementById("pet-pathology");
    const numPathologies = pathologiesData.length;
    pathologiesQuantity.classList.add("intro-pathologies");
    pathologiesQuantity.innerHTML = `
      <h5 class="text-light">Total patologías: ${numPathologies}</h5>
      <a href="new-allergy.html?id=${id_pet}" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>
    `;

    //Datos de las patologias
    const pathologiesList = document.getElementById("pathology");
    pathologiesList.innerHTML = ``;

    if (numPathologies === 0) {
      const pathologyInfo = document.createElement("div");
      pathologyInfo.classList.add("no-pathology")
      pathologyInfo.innerHTML = `
        <h6>No hay alergias registradas para ${petData.name_pet}.</h6>
      `;
      pathologiesList.appendChild(pathologyInfo);
    } else {
      pathologiesData.forEach((pathology) => {
        const pathologyInfo = document.createElement("li");
        pathologyInfo.classList.add("list-group-item");

        const {
          id_pathology,
          name,
          type,
          severity_level,
          detection_date
        } = pathology;

        pathologyInfo.innerHTML = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Tipo</th>
              <th scope="col" class="d-none d-md-table-cell">Nivel</th>
              <th scope="col" class="d-none d-md-table-cell">Fecha</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="consult-list">
            <th scope="col" style="max-width: 80px">${name}</th>
            <th scope="col" style="max-width: 80px">${type}</th>
            <th scope="col" style="max-width: 80px" class="d-none d-md-table-cell">${severity_level}</th>
            <th scope="col" style="max-width: 80px" class="d-none d-md-table-cell">${detection_date}</th>
            <th scope="col">
              <div class="dropdown">
                <button class="btn-options" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false"><i
                  class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item btn-show-pathology" data-id="${id_pathology}">Más información</a></li>
                  <li><a class="dropdown-item btn-edit-pathology" data-id="${id_pathology}">Editar</a></li>
                  <li><a class="dropdown-item btn-delete-pathology" data-id="${id_pathology}">Eliminar</a></li>
                </ul>
              </div>
            </th>
          </tbody>
        </table>
      `;

        pathologiesList.appendChild(pathologyInfo);
      });
    }
    //Variable para saber en que alergia estamos para sacar la informacion en los modales
    let selectedPathologyId = null;

    //Pop up para mostrar la información de la alergia en mayor detalle
    let showPathologyId = null;
    let showBtn;
    const popUpShowPathology = document.getElementById('showPathologyPopUp');
    pathologiesList.addEventListener("click", (e) => {
      showBtn = e.target.closest('.btn-show-pathology');

      if (showBtn) {
        e.preventDefault();

        selectedPathologyId = showBtn.getAttribute("data-id");
        const pathology = pathologiesData.find(all => all.id_pathology == selectedPathologyId);
        console.log(pathology);

        document.getElementById("show_name").textContent = pathology.name;
        document.getElementById("show_type").textContent = pathology.type;
        document.getElementById("show_diagnostic_method").textContent = pathology.diagnostic_method;
        document.getElementById("show_symptoms").textContent = pathology.symptoms;
        document.getElementById("show_severity_level").textContent = pathology.severity_level;
        document.getElementById("show_treatment").textContent = pathology.treatment;
        document.getElementById("show_is_chronic").textContent = pathology.is_chronic;
        document.getElementById("show_detection_date").textContent = pathology.detection_date;

        popUpShowPathology.showModal();
      }
    });


    //Pop up de editar datos de una alergia y guardar los cambio
    const popUpPathology = document.getElementById("editPathologyPopUp");
    let editBtn;

    pathologiesList.addEventListener("click", (e) => {
      //Se busca que se hizo click
      editBtn = e.target.closest(".btn-edit-pathology");

      if (editBtn) {
        e.preventDefault();

        //almacenamos el id de la alergia
        selectedPathologyId = editBtn.getAttribute("data-id");

        //buscamos la alergia de la base de datos que tiene ese id para mostrar los datos
        const pathology = pathologiesData.find(all => all.id_pathology == selectedPathologyId);

        //formateamos la fecha para poder mostrarla
        const dayMonthYear = pathology.detection_date.split('/');
        const day = dayMonthYear[0].toString().padStart(2, '0');
        const month = dayMonthYear[1].toString().padStart(2, '0');
        const year = dayMonthYear[2];
        const newDetectionDate = `${year}-${month}-${day}`;

        if (pathology) {
          document.getElementById("name").value = pathology.name;
          document.getElementById("type").value = pathology.type;
          document.getElementById("diagnostic_method").value = pathology.diagnostic_method;
          document.getElementById("symptoms").value = pathology.symptoms;
          document.getElementById("severity_level").value = pathology.severity_level;
          document.getElementById("treatment").value = pathology.treatment;
          document.getElementById("is_chronic").value = pathology.is_chronic;
          document.getElementById("detection_date").value = newDetectionDate;

          popUpPathology.showModal();
        }
      }
    });

    const saveBtnPathology = document.getElementById("saveChangesPathology");
    saveBtnPathology.addEventListener("click", async (e) => {
      e.preventDefault();

      const pathologyPutAPI = {

        name: document.getElementById("name").value.trim(),
        type: document.getElementById("type").value.trim(),
        diagnostic_method: document.getElementById("diagnostic_method").value.trim(),
        symptoms: document.getElementById("symptoms").value.trim(),
        severity_level: document.getElementById("severity_level").value.trim(),
        treatment: document.getElementById("treatment").value.trim(),
        is_chronic: document.getElementById("is_chronic").value.trim(),
        detection_date: document.getElementById("detection_date").value.trim(),
      };

      const {
        name,
        type,
        diagnostic_method,
        symptoms,
        severity_level,
        treatment,
        is_chronic,
        detection_date
      } = pathologyPutAPI;

      if (
        !name ||
        !type ||
        !severity_level ||
        !treatment ||
        !detection_date
      ) {
        Swal.fire({
          title: "Faltan campos por rellenar",
          confirmButtonText: "Volver a la edición",
        });
        return;
      }
      console.log(id_pet);
      console.log("Cuerpo del envío:", JSON.stringify(pathologyPutAPI));
      selectedPathologyId = editBtn.getAttribute("data-id");
      await sendPathologyData(pathologyPutAPI, selectedPathologyId);
    });

    const sendPathologyData = async (pathologyPutAPI, selectedPathologyId) => {
      try {
        const PutResponse = await fetch(
          `http://localhost:8080/pathologies/${selectedPathologyId}`,
          {
            method: "PUT",
            body: JSON.stringify(pathologyPutAPI),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
        );

        if (PutResponse.ok) {
          const popUp = document.getElementById("editPathologyPopUp");
          popUp.close();
          window.location.reload();
        } else {
          const errorData = await PutResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${PutResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    //Boton eliminar una patologia de la mascota
    let deleteBtn;

    pathologiesList.addEventListener("click", async (e) => {

      deleteBtn = e.target.closest(".btn-delete-pathology");
      if (deleteBtn) {
        e.preventDefault();

        const idPathologyDelete = deleteBtn.getAttribute("data-id");

        const confirmAction = await Swal.fire({
          title: `¡Estás a punto de eliminar la alergia!`,
          html: `¿<strong>Segur@ que deseas eliminar</strong> la alergia de la mascota <strong>${name_pet}</strong>?`,
          icon: "warning",
          iconColor: "#8a3938",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (confirmAction.isConfirmed) {
          await deletePathology(idPathologyDelete);
        } else {
          return;
        }
      }
    });

    const deletePathology = async (idPathologyDelete) => {
      try {
        const deleteResponse = await fetch(`http://localhost:8080/pathologies/${idPathologyDelete}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (deleteResponse.ok) {
          Swal.fire({
            title: "Alergia eliminado!",
            text: "La alergia se ha eliminado correctamente",
            icon: "success",
            iconColor: "#318a3a",
            confirmButtonText: "Volver al dashboard",
            confirmButtonColor: "#2a1418",
          }).then(() => {
            window.location.reload();
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
          title: "Error de conexión",
          text: error.message,
          icon: "error",
        });
      }
    };

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
        </tr>
      </thead>
    `;

    if (appointmentsData.length === 0) {
      appointmentsList.classList.add("text-center")
      appointmentsList.classList.add("m-2")
      appointmentsList.innerHTML = `
      <h6>No hay registro previo de citas para ${petData.name_pet}.</h6>
      `;
    } else {
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

        //Buscamos el nombre del veterinario buscando por su DNI
        const veterinarian = veterinariansData.find(v => v.dni_veterinarian == veterinarian_dni);
        const veterinarianName = veterinarian.name;
        const veterinarianSurname = veterinarian.surname;
        const fullVeterinarianName = veterinarianName + " " + veterinarianSurname;

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
          <td scope="col">${fullVeterinarianName}</td>
          <td scope="col" class="d-none d-md-table-cell">${duration} minutos</td>
        </tr>
      `;

        appointmentsList.appendChild(appointmentInfo);
      });
    }

    //Boton eliminar mascota de la base de datos
    const btnDelete = document.getElementById("btn-delete");
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmAction = await Swal.fire({
        title: `¡Estás a punto de eliminar un registro!`,
        html: `¿<strong>Segur@ que deseas eliminar</strong> a la mascota <strong>${name_pet}</strong>?`,
        icon: "warning",
        iconColor: "#8a3938",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirmAction.isConfirmed) {
        await deletePet(id_pet);
      } else {
        return;
      }
    });

    const deletePet = async (id_pet) => {
      try {
        const deleteResponse = await fetch(urlPet, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (deleteResponse.ok) {
          Swal.fire({
            title: "¡Registro eliminado!",
            text: "El registro se ha eliminado correctamente",
            icon: "success",
            iconColor: "#318a3a",
            confirmButtonText: "Volver al dashboard",
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
          title: "Error de conexión",
          text: error.message,
          icon: "error",
        });
      }
    };
  };

  getPetData();
});

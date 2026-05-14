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
      let allergiesData;

      if (allergies.status === 404) {
        allergiesData = { data: [] };
      } else {
        allergiesData = await allergies.json();
      }

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

  const createPet = async (petData, ownerData, allergiesData, appointmentsData) => {
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
          <h6>Información del dueñ@</h6>
          <button type="button" id="btnOpenPopUpOwner" class="btn"><i class="fa-solid fa-pencil"></i></button>
        </div>
        <div class="information-section">
          <h6>Nombre</h6>
          <h6>${name_owner}</h6>
        </div>
        <div class="information-section">
          <h6>Apellidos</h6>
          <h6>${surname}</h6>
        </div>
      </div>
      <div class="owner-contact">
        <h6>Datos de contacto</h6>
        <div class="information-section">
          <i class="fa-solid fa-address-card"></i>
          <h6>${dni_owner}</h6>
        </div>
        <div class="information-section">
          <i class="fa-solid fa-envelope"></i>
          <h6>${email}</h6>
        </div>
        <div class="information-section">
          <i class="fa-solid fa-mobile"></i>
          <h6>${phone}</h6>
        </div>
      </div>
      <div class="owner-direction">
        <h6>Dirección de residencia</h6>
        <div class="information-section">
          <h6>Calle y numero</h6>
          <h6>${direction}</h6>
        </div>
        <div class="information-section">
          <h6>Piso</h6>
          <h6>${floor}</h6>
        </div>
        <div class="information-section">
          <h6>Ciudad</h6>
          <h6>${city}</h6>
        </div>
        <div class="information-section">
          <h6>Código Postal</h6>
          <h6>${postal_code}</h6>
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
    const petElement = document.getElementById("pet");
    const {
      id_pet,
      name_pet,
      type,
      breed,
      weight,
      sex,
      birth_date,
      owner_dni,
    } = petData;

    if (!breed || breed === undefined) {
      type = "-";
    }

    petElement.innerHTML = `
      <div class="intro">
        <h6>Información de la mascota</h6>
        <div class="pet-btns">
          <button type="button" id="btnOpenPopUpPet" class="btn"><i class="fa-solid fa-pencil"></i></button>
        </div>
      </div>
      <div class="information-section">
          <h6>Nombre</h6>
          <h6>${name_pet}</h6>
      </div>

      <div class="information-section">
          <h6>Especie</h6>
          <h6>${type}</h6>
      </div>

      <div class="information-section">
          <h6>Raza</h6>
          <h6>${breed}</h6>
      </div>

      <div class="information-section">
          <h6>Peso</h6>
          <h6>${weight}</h6>
      </div>

      <div class="information-section">
          <h6>Sexo</h6>
          <h6>${sex}</h6>
      </div>

      <div class="information-section">
          <h6>Fecha de nacimiento</h6>
          <h6>${birth_date}</h6>
      </div>

    `;

    //Pop up de editar datos de la mascota y guardar los cambios
    const btnPopUpPet = document.getElementById("btnOpenPopUpPet");
    const popUpPet = document.getElementById("editPetPopUp");

    btnPopUpPet.addEventListener("click", (e) => {
      e.preventDefault();

      //Cambiamos la fecha a formato año-mes-año para que se muestre en el modal
      const dayMonthYear = birth_date.split('/');
      const newBirthDate = `${dayMonthYear[2]}-${dayMonthYear[1]}-${dayMonthYear[0]}`
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

    //Datos próxima cita, si hay una.
    const appointment = document.getElementById("appointment");
    const actualDate = new Date();
    const lastAppointment = appointmentsData.at(-1);
    console.log(lastAppointment);

    if (
      appointmentsData.length === 0 ||
      lastAppointment.date_appointment <= actualDate
    ) {
      appointment.innerHTML = `
        <h4>Próxima cita</h4>
        <p>No hay citas concertadas</p>
      `;
    } else {
      appointment.innerHTML = `
        <h4>Próxima cita</h4>
        <h6>${lastAppointment.date_appointment}</h6>
        <h6>${lastAppointment.start_time}</h6>
      `;
    }

    //Numero de alergias
    const allergiesQuantity = document.getElementById("pet-allergy");
    const numAllergies = allergiesData.length;
    allergiesQuantity.innerHTML = `
      <h4>Total alergias: ${numAllergies}</h4>
      <a href="new-allergy.html?id=${id_pet}" class="btn"><i class="fa-solid fa-plus"></i></a>
    `;

    //Datos de las alergias
    const allergyList = document.getElementById("allergy");
    allergyList.innerHTML = ``;

    if (numAllergies === 0) {
      const allergyInfo = document.createElement("h6");
      allergyInfo.innerHTML = `
        No hay alergias registradas para ${petData.name_pet}.
      `;
      allergyList.appendChild(allergyInfo);
    } else {
      allergiesData.forEach((allergy) => {
        const allergyInfo = document.createElement("li");
        allergyInfo.classList.add("list-group-item");

        const {
          id_allergy,
          allergen,
          diagnostic_method,
          symptoms,
          severity_level,
          emergency_treatment,
          detection_date,
        } = allergy;

        allergyInfo.innerHTML = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Alergeno</th>
              <th scope="col">Nivel de severidad</th>
              <th scope="col">Fecha de deteccion</th>
            </tr>
          </thead>
          <tbody id="consult-list">
            <th scope="col" style="max-width: 80px">${allergen}</th>
            <th scope="col" style="max-width: 80px">${severity_level}</th>
            <th scope="col" style="max-width: 80px">${detection_date}</th>
            <th scope="col">
              <div class="dropdown">
                <button class="btn-options" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false"><i
                  class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item btn-show-allergy" href="#" data-id="${id_allergy}">Más información</a></li>
                  <li><a class="dropdown-item btn-edit-allergy" href="#" data-id="${id_allergy}">Editar</a></li>
                  <li><a class="dropdown-item btn-delete-allergy" href="#" data-id="${id_allergy}">Eliminar</a></li>
                </ul>
              </div>
            </th>
          </tbody>
        </table>
      `;

        allergyList.appendChild(allergyInfo);
      });
    }
    //Variable para saber en que alergia estamos para sacar la informacion en los modales
    let selectedAllergyId = null;

    //Pop up para mostrar la información de la alergia en mayor detalle
    let showAllergyId = null;
    let showBtn;
    const popUpShowAllergy = document.getElementById('showAllergyPopUp');
    allergyList.addEventListener("click", (e) => {
      showBtn = e.target.closest('.btn-show-allergy');

      if (showBtn) {
        e.preventDefault();

        selectedAllergyId = showBtn.getAttribute("data-id");
        const allergy = allergiesData.find(all => all.id_allergy == selectedAllergyId);

        document.getElementById("show_allergen").textContent = allergy.allergen;
        document.getElementById("show_diagnostic_method").textContent = allergy.diagnostic_method;
        document.getElementById("show_symptoms").textContent = allergy.symptoms;
        document.getElementById("show_severity_level").textContent = allergy.severity_level;
        document.getElementById("show_emergency_treatment").textContent = allergy.emergency_treatment;
        document.getElementById("show_detection_date").textContent = allergy.detection_date;

        popUpShowAllergy.showModal();
      }
    });


    //Pop up de editar datos de una alergia y guardar los cambio
    const popUpAllergy = document.getElementById("editAllergyPopUp");
    let editBtn;

    allergyList.addEventListener("click", (e) => {
      //Se busca que se hizo click
      editBtn = e.target.closest(".btn-edit-allergy");

      if (editBtn) {
        e.preventDefault();

        //almacenamos el id de la alergia
        selectedAllergyId = editBtn.getAttribute("data-id");

        //buscamos la alergia de la base de datos que tiene ese id para mostrar los datos
        const allergy = allergiesData.find(all => all.id_allergy == selectedAllergyId);

        if (allergy) {
          document.getElementById("allergen").value = allergy.allergen;
          document.getElementById("diagnostic_method").value = allergy.diagnostic_method;
          document.getElementById("symptoms").value = allergy.symptoms;
          document.getElementById("severity_level").value = allergy.severity_level;
          document.getElementById("emergency_treatment").value = allergy.emergency_treatment;
          document.getElementById("detection_date").value = allergy.detection_date.split("T")[0];

          popUpAllergy.showModal();
        }
      }
    });

    const saveBtnAllergy = document.getElementById("saveChangesAllergy");
    saveBtnAllergy.addEventListener("click", async (e) => {
      e.preventDefault();

      const allergyPutAPI = {
        allergen: document.getElementById("allergen").value.trim(),
        diagnostic_method: document
          .getElementById("diagnostic_method")
          .value.trim(),
        symptoms: document.getElementById("symptoms").value.trim(),
        severity_level: document.getElementById("severity_level").value,
        emergency_treatment: document
          .getElementById("emergency_treatment")
          .value.trim(),
        detection_date: document.getElementById("detection_date").value,
      };

      const {
        allergen,
        diagnostic_method,
        symptoms,
        severity_level,
        emergency_treatment,
        detection_date,
      } = allergyPutAPI;

      if (
        !allergen ||
        !diagnostic_method ||
        !symptoms ||
        !severity_level ||
        !emergency_treatment ||
        !detection_date
      ) {
        Swal.fire({
          title: "Faltan campos por rellenar",
          confirmButtonText: "Volver a la edición",
        });
        return;
      }
      console.log(id_pet);
      console.log("Cuerpo del envío:", JSON.stringify(allergyPutAPI));
      selectedAllergyId = editBtn.getAttribute("data-id");
      await sendAllergyData(allergyPutAPI, selectedAllergyId);
    });

    const sendAllergyData = async (allergyPutAPI, selectedAllergyId) => {
      try {
        const PutResponse = await fetch(
          `http://localhost:8080/allergies/${selectedAllergyId}`,
          {
            method: "PUT",
            body: JSON.stringify(allergyPutAPI),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
        );

        if (PutResponse.ok) {
          const popUp = document.getElementById("editAllergyPopUp");
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

    //Boton eliminar una alergia de la mascota
    let deleteBtn;

    allergyList.addEventListener("click", async (e) => {

      deleteBtn = e.target.closest(".btn-delete-allergy");
      if (deleteBtn) {
        e.preventDefault();

        const idAllergyDelete = deleteBtn.getAttribute("data-id");

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
          await deleteAllergy(idAllergyDelete);
        } else {
          return;
        }
      }
    });

    const deleteAllergy = async (idAllergyDelete) => {
      try {
        const deleteResponse = await fetch(`http://localhost:8080/allergies/${idAllergyDelete}`, {
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
      const appointmentInfo = document.createElement("h6");
      appointmentInfo.innerHTML = `
      No hay registro previo de citas para ${petData.name_pet}.
      `;
      appointmentsList.appendChild(appointmentInfo);
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

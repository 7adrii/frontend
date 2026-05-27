window.addEventListener("DOMContentLoaded", () => {
  urlAppointments = `http://localhost:8080/appointments`;
  urlPets = `http://localhost:8080/pets`;
  urlServices = `http://localhost:8080/services`;
  urlVeterinarians = `http://localhost:8080/veterinarians`;
  urlOwners = `http://localhost:8080/owners`;
  urlRegisters = `http://localhost:8080/registers`;

  const getData = async () => {
    try {
      const appointments = await fetch(urlAppointments);
      const appointmentsData = await appointments.json();

      const pets = await fetch(urlPets);
      const petsData = await pets.json();

      const services = await fetch(urlServices);
      const servicesData = await services.json();

      const veterinarians = await fetch(urlVeterinarians);
      const veterinariansData = await veterinarians.json();

      const owners = await fetch(urlOwners);
      const ownersData = await owners.json();

      const registers = await fetch(urlRegisters);
      const registersData = await registers.json();

      createData(
        appointmentsData.data,
        petsData.data,
        servicesData.data,
        veterinariansData.data,
        ownersData.data,
        registersData.data,
      );
    } catch (Error) {
      console.error(Error);
    }
  };

  const createData = async (
    appointments,
    pets,
    services,
    veterinarians,
    owners,
    registers,
  ) => {
    //Tarjeta de total citas realizadas en la clínica
    const cardAppointment = document.getElementById("card-appointments");
    const numberAppointments = appointments.length;

    if (cardAppointment) {
      cardAppointment.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title text-light"><i class="fa-solid fa-calendar-check"></i></h5>
                    <h6 class="card-subtitle mb-2 text-light">Appointments</h6>
                </div>
                <h5 class="card-title text-light">${numberAppointments}</h5>
            </div>
        `;
    }

    //Tarjeta total mascotas/pacientes que han tenido citas.
    const cardPet = document.getElementById("card-pets");

    //Aqui buscamos ver de las mascotas que estan registradas, cuales ya han tenido minimo una cita.
    const numberPacients = [];
    let numberPets = 0;

    //Si desde la lista de citas, el id de la mascota no esta incluida en numberPacients, entonces lo metemos
    //en el array y sumamos uno numberPets.
    for (let i = 0; i < appointments.length; i++) {
      if (!numberPacients.includes(appointments[i].pet_id)) {
        numberPacients.push(appointments[i].pet_id);
        numberPets++;
      }
    }

    if (cardPet) {
      cardPet.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title text-light"><i class="fa-solid fa-bone"></i></h5>
                    <h6 class="card-subtitle mb-2 text-light">Patients</h6>
                </div>
                <h5 class="card-title text-light">${numberPets}</h5>
            </div>
        `;
    }

    //Tarjeta total especies registradas en la clínica.
    const cardBreed = document.getElementById("card-breeds");
    const dataBreed = [];
    let numberBreeds = 0;

    //Si desde la lista de mascotas, la especie de la mascota no esta incluida en dataBreed, entonces la metemos
    //en el array y sumamos uno numberBreeds.
    for (let i = 0; i < pets.length; i++) {
      const breed = pets[i].type;
      if (!dataBreed.includes(breed)) {
        dataBreed.push(breed);
        numberBreeds++;
      }
    }

    if (cardBreed) {
      cardBreed.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-paw"></i></h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Breeds</h6>
                </div>
                <h5 class="card-title">${numberBreeds}</h5>
            </div>
        `;
    }

    //Tarjeta total servicios que se ofrecen en la clínica.
    const cardService = document.getElementById("card-services");
    const dataService = [];
    let numberServices = 0;

    //Si desde la lista de servicios, el tipo de servicio no esta incluido en dataService, entonces lo metemos
    //en el array y sumamos uno numberServices.
    for (let i = 0; i < services.length; i++) {
      const serviceType = services[i].service_type;
      if (!dataService.includes(serviceType)) {
        dataService.push(serviceType);
        numberServices++;
      }
    }

    if (cardService) {
      cardService.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-shield-dog"></i></h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Services</h6>
                </div>
                <h5 class="card-title">${numberServices}</h5>
            </div>
        `;
    }

    //Obtenemos la fecha de hoy y la formateamos a formato dd-mm-yyyy para comparar con la fecha de la cita en las próximas tablas
    const dateToday = new Date();
    const day = String(dateToday.getDate()).padStart(2, "0");
    const month = String(dateToday.getMonth() + 1).padStart(2, "0");
    const year = dateToday.getFullYear();
    const formattedToday = `${day}/${month}/${year}`;

    //Metemos en <h6 class="text-light" id="today"></h6> la fecha del día actual.
    const clinicDay = document.getElementById("today");
    clinicDay.innerHTML = `Appointments of ${formattedToday}`;

    //Tabla con las citas para el dia actual.
    const tableToday = document.getElementById("table-today-consults");
    tableToday.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Owner</th>
                    <th scope="col" class="d-none d-md-table-cell">Service</th>
                    <th scope="col" class="d-none d-md-table-cell">Start</th>
                    <th scope="col" class="d-none d-md-table-cell">End</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinarian</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

    //contador de citas del día actual
    let counterToday = 0;

    //ordenamos por hora con la funcion localCompare
    appointments.sort((a, b) => a.start_time.localeCompare(b.start_time));

    appointments.forEach((appointment) => {
      //formateamos la fecha actual a formato yyyy-mm-dd
      const todayDate = new Date();
      const today = todayDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const todayFormat = today.split("/").reverse().join("-");

      //formateamos la fecha de la cita a formato yyyy-mm-dd
      const dateAppointmentSplit = appointment.date_appointment;
      const [day, month, year] = dateAppointmentSplit.split("/");
      const dateAppointment = new Date(`${year}-${month}-${day}`);
      const appDate = dateAppointment.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const newDate = appDate.split("/").reverse().join("-");

      //si son iguales entonces metemos la cita en esta tabla
      if (todayFormat === newDate) {
        const { id_appointment, date_appointment, start_time, end_time } =
          appointment;
        const service = services.find(
          (s) => s.id_service === appointment.service_id,
        );
        const serviceName = service.name;

        //buscamos el nombre de la mascota
        const pet = pets.find((p) => p.id === appointment.pet_id);
        const petName = pet.name_pet;
        const petId = pet.id;

        //buscamos el nombre del veterinario
        const veterinarian = veterinarians.find(
          (v) => v.dni_veterinarian === appointment.veterinarian_dni,
        );
        const veterinarianName = veterinarian.name;
        const veterinarianSurname = veterinarian.surname;
        const fullNameVeterinarian =
          veterinarianName + " " + veterinarianSurname;

        //buscamos el nombre del dueño
        const owner = owners.find((o) => o.dni_owner === pet.owner_dni);
        const ownerName = owner.name_owner;
        const ownerSurname = owner.surname;

        const fullNameOwner = ownerName + " " + ownerSurname;

        //metemos todos los datos en el inner.html
        const tbody = document.createElement("tbody");
        tbody.innerHTML = `
                <tr>
                    <th scope="row">${date_appointment}</th>
                    <td scope="row">${petName}</td>
                    <td scope="row" class="d-none d-md-table-cell">${fullNameOwner}</td>
                    <td scope="row">${serviceName}</td>
                    <td scope="row" class="d-none d-md-table-cell">${start_time}</td>
                    <td scope="row" class="d-none d-md-table-cell">${end_time}</td>
                    <td scope="row" class="d-none d-md-table-cell">${fullNameVeterinarian}</td>
                    <td scope="row"><a href="pet-detail.html?id=${petId}"><i class="fa-solid fa-eye text-dark"></i></a></td>
                    <td scope="row"><a class="btn-show-app" data-id="${id_appointment}"><i class="fa-solid fa-info text-dark"></i></a></td>
                    <td scope="row"><a class="btn-delete-app"><i class="fa-solid fa-trash text-dark"></i></a></td>
                </tr>
                `;
        tableToday.appendChild(tbody);
        counterToday++;

        //Boton eliminar la cita de la base de datos
        const btnDelete = tbody.querySelector(".btn-delete-app");
        btnDelete.addEventListener("click", async (e) => {
          e.preventDefault();

          const confirmAction = await Swal.fire({
            title: `You are going to remove this appointment!`,
            html: `¿<strong>Are you sure you want to remove</strong> this appointment for<strong>${petName}</strong>?`,
            icon: "warning",
            iconColor: "#9f7217",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel",
            cancelButtonText: "No",
          });

          if (confirmAction.isConfirmed) {
            await deleteAppointment(id_appointment);
          } else {
            return;
          }
        });
      }
    });

    //si no hay citas rellenamos la seccion con este contenido.
    if (counterToday == 0) {
      tableToday.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>The are no appointments for today</h6>
            </div>
                `;
    }

    //Creacion de la tabla de historial de consultas que se van a hacer
    const tableFuture = document.getElementById("future-consults");
    tableFuture.innerHTML = `
            <thead>
                <tr class="align-middle">
                    <th scope="col">Date</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Owner</th>
                    <th scope="col" class="d-none d-md-table-cell">Service</th>
                    <th scope="col" class="d-none d-md-table-cell">Start</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinarian</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

    //Tabla para mostrar el listado de citas que se han concertado en el futuro
    let counterNext = 0;

    //ordenamos el array de citas por fecha de la cita concertada
    appointments.sort((a, b) => {
      const A = a.date_appointment.split("T")[0].split("/");
      const B = b.date_appointment.split("T")[0].split("/");

      const dayA = parseInt(A[0], 10);
      const monthA = parseInt(A[1], 10) - 1;
      const yearA = parseInt(A[2], 10);

      const dayB = parseInt(B[0], 10);
      const monthB = parseInt(B[1], 10) - 1;
      const yearB = parseInt(B[2], 10);

      const dateA = new Date(yearA, monthA, dayA).getTime();
      const dateB = new Date(yearB, monthB, dayB).getTime();

      // 4. Restamos los milisegundos para ordenar cronológicamente
      return dateA - dateB;
    });

    //Recorremos la lista de appointments y si la fecha es mayor que la actual entonces lo añadimos la tabla
    appointments.forEach((appointment) => {
      const { id_appointment, date_appointment, start_time } = appointment;

      //formateamos la fecha actual a formato yyyy-mm-dd
      const todayDate = new Date();
      const today = todayDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const todayFormat = today.split("/").reverse().join("-");

      //formateamos la fecha de la cita a formato yyyy-mm-dd
      const dateAppointmentSplit = appointment.date_appointment;
      const [day, month, year] = dateAppointmentSplit.split("/");
      const dateAppointment = new Date(`${year}-${month}-${day}`);
      const appDate = dateAppointment.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const newDate = appDate.split("/").reverse().join("-");

      //si es mayor que la fecha actual añadimos los datos y sumamos 1 al contador
      if (todayFormat < newDate) {
        const service = services.find(
          (s) => s.id_service === appointment.service_id,
        );
        const serviceName = service.name;

        const pet = pets.find((p) => p.id === appointment.pet_id);
        const petName = pet.name_pet;
        const petId = pet.id;

        console.log(pet);

        const veterinarian = veterinarians.find(
          (v) => v.dni_veterinarian === appointment.veterinarian_dni,
        );
        const veterinarianName = veterinarian.name;
        const veterinarianSurname = veterinarian.surname;
        const fullNameVeterinarian =
          veterinarianName + " " + veterinarianSurname;

        const owner = owners.find((o) => o.dni_owner === pet.owner_dni);
        const ownerName = owner.name_owner;
        const ownerSurname = owner.surname;

        const fullNameOwner = ownerSurname + " " + ownerName;

        const tbody = document.createElement("tbody");
        tbody.innerHTML = `
                <tr class="line-hover">
                    <th scope="row">${date_appointment}</th>
                    <td scope="row">${petName}</td>
                    <td scope="row">${fullNameOwner}</td>
                    <td scope="row" class="d-none d-md-table-cell">${serviceName}</td>
                    <td scope="row" class="d-none d-md-table-cell">${start_time}</td>
                    <td scope="row" class="d-none d-md-table-cell">${fullNameVeterinarian}</td>
                    <td scope="row"><a href="pet-detail.html?id=${petId}"><i class="fa-solid fa-eye text-dark"></i></a></td>
                    <td scope="row"><a class="btn-show-app" data-id="${id_appointment}"><i class="fa-solid fa-info text-dark"></i></a></td>
                    <td scope="row"><a class="btn-edit-app" data-id="${id_appointment}"><i class="fa-solid fa-edit text-dark"></i></a></td>
                    <td scope="row"><a class="btn-delete-app"><i class="fa-solid fa-trash text-dark"></i></a></td>
                </tr>
            `;
        tableFuture.appendChild(tbody);
        counterNext++;

        //Boton eliminar mascota de la base de datos
        const btnDelete = tbody.querySelector(".btn-delete-app");
        btnDelete.addEventListener("click", async (e) => {
          e.preventDefault();

          const confirmAction = await Swal.fire({
            title: `You are going to remove this appointment!`,
            html: `¿<strong>Are you sure you want to remove</strong> this appointment for<strong>${petName}</strong>?`,
            icon: "warning",
            iconColor: "#9f7217",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel",
            cancelButtonText: "No",
          });

          if (confirmAction.isConfirmed) {
            await deleteAppointment(id_appointment);
          } else {
            return;
          }
        });
      }
    });

    //Si el contador es 0 entonces rellenamos la tabla con el siguiente contenido.
    if (counterNext == 0) {
      table.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>There are no registers of appointments in the future</h6>
            </div>
                `;
    }

    //Creación de la tabla de historial de consultas que ya han pasado
    const table = document.getElementById("table-consults");

    table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Patients</th>
                    <th scope="col">Owners</th>
                    <th scope="col"class="d-none d-md-table-cell">Service</th>
                    <th scope="col" class="d-none d-md-table-cell">Duration</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinarian</th>
                </tr>
            </thead>
        `;

    //Tabla para mostrar el listado de citas que ya han ocurrido
    let counter = 0;
    registers.forEach((register) => {
      const { date_service } = register;

      const service = services.find(
        (s) => s.id_service === register.service_id,
      );
      const pet = pets.find((p) => p.id === register.pet_id);
      const veterinarian = veterinarians.find(
        (v) => v.dni_veterinarian === register.veterinarian_dni,
      );

      if (service && pet && veterinarian) {
        const serviceName = service.name;
        const serviceDuration = service.duration;

        const petName = pet.name_pet;
        const petId = pet.id;

        const veterinarianName = veterinarian.name;
        const veterinarianSurname = veterinarian.surname;
        const fullNameVeterinarian =
          veterinarianName + " " + veterinarianSurname;

        const owner = owners.find((o) => o.dni_owner === pet.owner_dni);
        const ownerName = owner.name_owner;
        const ownerSurname = owner.surname;

        const fullNameOwner = ownerSurname + " " + ownerName;

        if (owner) {
          const tbody = document.createElement("tbody");
          tbody.innerHTML = `
                    <tr class="line-hover">
                        <td scope="row">${date_service}</td>
                        <td scope="row"><a class="text-dark text-decoration-none" href="pet-detail.html?id=${petId}">${petName}</td>
                        <td scope="row">${fullNameOwner}</td>
                        <td scope="row" class="d-none d-md-table-cell">${serviceName}</td>
                        <td scope="row" class="d-none d-md-table-cell">${serviceDuration} min</td>
                        <td scope="row" class="d-none d-md-table-cell">${fullNameVeterinarian}</td>
                    </tr>
                    `;
          table.appendChild(tbody);
          counter++;
        }
      }
    });

    //Si no hay historial de registros se inserta este div en table

    if (counter == 0) {
      table.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>There are no registers</h6>
            </div>
                `;
    }

    let selectedAppointmentId;

    //Pop up para mostrar los datos de una cita agendada para el día actual
    let showPathologyId = null;
    let showBtn;
    const popUpShowAppointment = document.getElementById(
      "showAppointmentPopUp",
    );
    tableToday.addEventListener("click", (e) => {
      showBtn = e.target.closest(".btn-show-app");

      if (showBtn) {
        selectedAppointmentId = showBtn.getAttribute("data-id");
        const appointment = appointments.find(
          (all) => all.id_appointment == selectedAppointmentId,
        );
        const pet = pets.find((p) => p.id === appointment.pet_id);
        const owner = owners.find((o) => o.pet_id === appointment.id);
        const ownerName = owner.name_owner;
        const ownerSurname = owner.surname;
        const ownerFullName = ownerName + " " + ownerSurname;
        const service = services.find(
          (s) => s.id_service === appointment.service_id,
        );
        const veterinarian = veterinarians.find(
          (v) => v.dni_veterinarian === appointment.veterinarian_dni,
        );
        const vetName = veterinarian.name;
        const vetSurname = veterinarian.surname;
        const vetFullName = vetName + " " + vetSurname;

        document.getElementById("show_name_pet").textContent = pet.name_pet;
        document.getElementById("show_date").textContent =
          appointment.date_appointment;
        document.getElementById("show_start_time").textContent =
          appointment.start_time;
        document.getElementById("show_end_time").textContent =
          appointment.end_time;
        document.getElementById("show_owner_name").textContent = ownerFullName;
        document.getElementById("show_service").textContent = service.name;
        document.getElementById("show_veterinarian").textContent = vetFullName;
        document.getElementById("show_observations").textContent =
          appointment.observations;

        popUpShowAppointment.showModal();
      }
    });

    //Pop up para mostrar los datos de una cita agendada para el futuro
    tableFuture.addEventListener("click", (e) => {
      showBtn = e.target.closest(".btn-show-app");

      if (showBtn) {
        selectedAppointmentId = showBtn.getAttribute("data-id");
        const appointment = appointments.find(
          (all) => all.id_appointment == selectedAppointmentId,
        );
        const pet = pets.find((p) => p.id === appointment.pet_id);
        const owner = owners.find((o) => o.pet_id === appointment.id);
        const ownerName = owner.name_owner;
        const ownerSurname = owner.surname;
        const ownerFullName = ownerName + " " + ownerSurname;
        const service = services.find(
          (s) => s.id_service === appointment.service_id,
        );
        const veterinarian = veterinarians.find(
          (v) => v.dni_veterinarian === appointment.veterinarian_dni,
        );
        const vetName = veterinarian.name;
        const vetSurname = veterinarian.surname;
        const vetFullName = vetName + " " + vetSurname;

        document.getElementById("show_name_pet").textContent = pet.name_pet;
        document.getElementById("show_date").textContent =
          appointment.date_appointment;
        document.getElementById("show_start_time").textContent =
          appointment.start_time;
        document.getElementById("show_end_time").textContent =
          appointment.end_time;
        document.getElementById("show_owner_name").textContent = ownerFullName;
        document.getElementById("show_service").textContent = service.name;
        document.getElementById("show_veterinarian").textContent = vetFullName;
        document.getElementById("show_observations").textContent =
          appointment.observations;

        popUpShowAppointment.showModal();
      }
    });

    //Pop up de editar datos de una cita y guardar los cambios
    const popUpAppointment = document.getElementById("editAppointmentPopUp");
    let editBtn;

    tableFuture.addEventListener("click", (e) => {
      //Se busca que se hizo click
      editBtn = e.target.closest(".btn-edit-app");

      if (editBtn) {
        e.preventDefault();

        //almacenamos el id de la cita
        selectedAppointmentId = editBtn.getAttribute("data-id");

        //buscamos la cita de la base de datos que tiene ese id para mostrar los datos
        const appointment = appointments.find(
          (all) => all.id_appointment == selectedAppointmentId,
        );

        //formateamos la fecha para poder mostrarla
        let formatedDate = appointment.date_appointment;
        if (formatedDate && formatedDate.includes("/")) {
          const dayMonthYear = formatedDate.split("/");
          const day = dayMonthYear[0].toString().padStart(2, "0");
          const month = dayMonthYear[1].toString().padStart(2, "0");
          const year = dayMonthYear[2];
          formatedDate = `${year}-${month}-${day}`;
        }
        const formatedHour = appointment.start_time
          ? appointment.start_time.substring(0, 5)
          : "";

        if (appointment) {
          document.getElementById("date_appointment").value = formatedDate;
          document.getElementById("start_time").value = formatedHour;
          document.getElementById("observations").value =
            appointment.observations;

          popUpAppointment.showModal();
        }
      }
    });

    //Guardar los cambios que se han hecho en la edición de la cita
    const saveBtnAppointment = document.getElementById(
      "saveChangesAppointment",
    );
    saveBtnAppointment.addEventListener("click", async (e) => {
      e.preventDefault();

      const startTime = document.getElementById("start_time").value.trim();
      const appointmentPutAPI = {
        date_appointment: document
          .getElementById("date_appointment")
          .value.trim(),
        start_time: startTime.substring(0, 5),
        observations: document.getElementById("observations").value.trim(),
      };

      console.log(appointmentPutAPI);

      if (
        !appointmentPutAPI.date_appointment ||
        !appointmentPutAPI.start_time ||
        !appointmentPutAPI.observations
      ) {
        Swal.fire({
          title: "Required fields are empty.",
          confirmButtonText: "Go back to edition",
          target: document.getElementById("editAppointmentPopUp"),
        });
        return;
      }

      //Buscamos que la fecha de date_appointment no sea anterior a la fecha actual
      const dateAppointmentSplit = appointmentPutAPI.date_appointment;
      const [day, month, year] = dateAppointmentSplit.split("/");
      const dateAppointment = new Date(`${year}-${month}-${day}`);

      const date = new Date();

      if (dateAppointment.getTime() < date.getTime()) {
        Swal.fire({
          title: "The date cannot be earlier than the current date.",
          confirmButtonText: "Go back to edition.",
          target: document.getElementById("editAppointmentPopUp"),
        });
        return;
      }
      selectedAppointmentId = editBtn.getAttribute("data-id");
      await sendAppointmentData(appointmentPutAPI, selectedAppointmentId);
    });

    //Llamamos a la API para mandar los datos
    const sendAppointmentData = async (
      appointmentPutAPI,
      selectedAppointmentId,
    ) => {
      try {
        const PutResponse = await fetch(
          `http://localhost:8080/appointments/${selectedAppointmentId}`,
          {
            method: "PUT",
            body: JSON.stringify(appointmentPutAPI),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
        );

        if (PutResponse.ok) {
          const popUp = document.getElementById("editAppointmentPopUp");
          popUp.close();
          window.location.reload();
        } else {
          const errorData = await PutResponse.json().catch(() => ({}));
          Swal.fire({
            title: "Changes could not be saved.",
            text: errorData.message || `Error code: ${PutResponse.status}`,
            icon: "error",
            iconColor: "#9f7217",
            confirmButtonText: "Understood",
            confirmButtonColor: "#2a1418",
            target: document.getElementById("editAppointmentPopUp"),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    //Boton eliminar cita que todavía no ha ocurrido
    const deleteAppointment = async (id_appointment) => {
      try {
        const deleteResponse = await fetch(
          `http://localhost:8080/appointments/${id_appointment}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          },
        );

        if (deleteResponse.ok) {
          Swal.fire({
            title: "Appointment cancelled!",
            text: "Appointment successfully cancelled",
            icon: "success",
            iconColor: "#59b2b0",
            confirmButtonText: "GO back to clinic historic",
            confirmButtonColor: "#2a1418",
          }).then(() => {
            window.location.href = "clinic-historic.html";
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `Error: ${deleteResponse.status}`,
            icon: "error",
            iconColor: "#9f7217",
            confirmButtonText: "Go back to register",
            confirmButtonColor: "#2a1418",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Conection error",
          text: error.message,
          icon: "error",
          iconColor: "#9f7217",
          confirmButtonText: "Go back to register",
          confirmButtonColor: "#2a1418",
        });
      }
    };
  };

  getData();
});

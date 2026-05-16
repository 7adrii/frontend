window.addEventListener("DOMContentLoaded", () => {
    urlAppointments = `http://localhost:8080/appointments`;
    urlPets = `http://localhost:8080/pets`;
    urlServices = `http://localhost:8080/services`;
    urlVeterinarians = `http://localhost:8080/veterinarians`;
    urlOwners = `http://localhost:8080/owners`;

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

            createData(appointmentsData.data, petsData.data, servicesData.data, veterinariansData.data, ownersData.data);
        }
        catch (Error) {
            console.error(Error);
        }
    }

    const createData = async (appointments, pets, services, veterinarians, owners) => {

        //Tarjeta de total citas
        const cardAppointment = document.getElementById("card-appointments");
        const numberAppointments = appointments.length;

        if (cardAppointment) {

            cardAppointment.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title text-light"><i class="fa-solid fa-calendar-check"></i></h5>
                    <h6 class="card-subtitle mb-2 text-light">Citas</h6>
                </div>
                <h5 class="card-title text-light">${numberAppointments}</h5>
            </div>
        `;
        }

        //Tarjeta total mascotas/pacientes
        const cardPet = document.getElementById("card-pets");

        //Aqui buscamos ver de las mascotas que estan registradas, cuales ya han tenido minimo una cita
        const numberPacients = [];
        let numberPets = 0;
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
                    <h6 class="card-subtitle mb-2 text-light">Pacientes</h6>
                </div>
                <h5 class="card-title text-light">${numberPets}</h5>
            </div>
        `;
        }

        //Tarjeta total especies
        const cardBreed = document.getElementById("card-breeds");
        const dataBreed = [];
        let numberBreeds = 0;

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
                    <h6 class="card-subtitle mb-2 text-body-secondary">Especies</h6>
                </div>
                <h5 class="card-title">${numberBreeds}</h5>
            </div>
        `;
        }

        //Tarjeta total servicios que se ofrecen
        const cardService = document.getElementById("card-services");
        const dataService = [];
        let numberServices = 0;

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
                    <h6 class="card-subtitle mb-2 text-body-secondary">Servicios</h6>
                </div>
                <h5 class="card-title">${numberServices}</h5>
            </div>
        `;
        }

        //Obtenemos la fecha de hoy y la formateamos a formato dd-mm-yyyy para comparar con la fecha de la cita en las proximas tablas
        const dateToday = new Date();
        const day = String(dateToday.getDate()).padStart(2, '0');
        const month = String(dateToday.getMonth() + 1).padStart(2, '0');
        const year = dateToday.getFullYear();
        const formattedToday = `${day}/${month}/${year}`

        const clinicDay = document.getElementById("today");
        clinicDay.innerHTML = `Citas del día: ${formattedToday}`;

        //Creacion de la tabla de historial de consultas que ya han pasado
        const table = document.getElementById("table-consults");
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Dueño</th>
                    <th scope="col"class="d-none d-md-table-cell">Servicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Inicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinario</th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

        //Tabla para mostrar el listado de citas que ya han ocurrido
        let counter = 0;
        appointments.forEach((appointment) => {
            const { date_appointment, start_time } = appointment;
            if (formattedToday > date_appointment) {
                const service = services.find(s => s.id_service === appointment.service_id);
                const serviceName = service.name;

                const pet = pets.find(p => p.id === appointment.pet_id);
                const petName = pet.name_pet;

                const veterinarian = veterinarians.find(v => v.dni_veterinarian === appointment.veterinarian_dni);
                const veterinarianName = veterinarian.name;
                const veterinarianSurname = veterinarian.surname;
                const fullNameVeterinarian = veterinarianName + " " + veterinarianSurname;

                const owner = owners.find(o => o.dni_owner === pet.owner_dni);
                const ownerName = owner.name_owner;
                const ownerSurname = owner.surname;

                const fullNameOwner = ownerSurname + " " + ownerName;

                const tbody = document.createElement("tbody");
                tbody.innerHTML = `
                <tr>
                    <th scope="row">${date_appointment}</th>
                    <td scope="row">${petName}</td>
                    <td scope="row">${fullNameOwner}</td>
                    <td scope="row" class="d-none d-md-table-cell">${serviceName}</td>
                    <td scope="row" class="d-none d-md-table-cell">${start_time}</td>
                    <td scope="row" class="d-none d-md-table-cell">${fullNameVeterinarian}</td>
                    <td scope="row"><a href="#"><i class="fa-solid fa-info text-dark"></i></a></td>
                </tr>
            `;
                table.appendChild(tbody);
                counter++;
            }
        });

        if (counter == 0) {
            table.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>No hay registro de citas</h6>
            </div>
                `;
        }

        //Creacion de la tabla de historial de consultas que se van a hacer
        const tableFuture = document.getElementById("future-consults");
        tableFuture.innerHTML = `
            <thead>
                <tr class="align-middle">
                    <th scope="col">Fecha</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Dueño</th>
                    <th scope="col" class="d-none d-md-table-cell">Servicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Inicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinario</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

        //Tabla para mostrar el listado de citas que se han concertado en el futuro
        let counterNext = 0;
        appointments.forEach((appointment) => {
            const { id_appointment, date_appointment, start_time } = appointment;
            if (formattedToday < date_appointment) {
                const service = services.find(s => s.id_service === appointment.service_id);
                const serviceName = service.name;

                const pet = pets.find(p => p.id === appointment.pet_id);
                const petName = pet.name_pet;

                const veterinarian = veterinarians.find(v => v.dni_veterinarian === appointment.veterinarian_dni);
                const veterinarianName = veterinarian.name;
                const veterinarianSurname = veterinarian.surname;
                const fullNameVeterinarian = veterinarianName + " " + veterinarianSurname;

                const owner = owners.find(o => o.dni_owner === pet.owner_dni);
                const ownerName = owner.name_owner;
                const ownerSurname = owner.surname;

                const fullNameOwner = ownerSurname + " " + ownerName;

                const tbody = document.createElement("tbody");
                tbody.innerHTML = `
                <tr>
                    <th scope="row">${date_appointment}</th>
                    <td scope="row">${petName}</td>
                    <td scope="row">${fullNameOwner}</td>
                    <td scope="row" class="d-none d-md-table-cell">${serviceName}</td>
                    <td scope="row" class="d-none d-md-table-cell">${start_time}</td>
                    <td scope="row" class="d-none d-md-table-cell">${fullNameVeterinarian}</td>
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
                        iconColor: "#8a3938",
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

        if (counterNext == 0) {
            table.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>No hay registro de citas</h6>
            </div>
                `;
        }

        //Pop up de editar datos de una cita y guardar los cambios
        const popUpAppointment = document.getElementById("editAppointmentPopUp");
        let editBtn;
        let selectedAppointmentId;

        tableFuture.addEventListener("click", (e) => {
            //Se busca que se hizo click
            editBtn = e.target.closest(".btn-edit-app");

            if (editBtn) {
                e.preventDefault();

                //almacenamos el id de la cita
                selectedAppointmentId = editBtn.getAttribute("data-id");

                //buscamos la cita de la base de datos que tiene ese id para mostrar los datos
                const appointment = appointments.find(all => all.id_appointment == selectedAppointmentId);

                //formateamos la fecha para poder mostrarla
                let formatedDate = appointment.date_appointment;
                if (formatedDate && formatedDate.includes('/')) {
                    const dayMonthYear = formatedDate.split('/');
                    const day = dayMonthYear[0].toString().padStart(2, '0');
                    const month = dayMonthYear[1].toString().padStart(2, '0');
                    const year = dayMonthYear[2];
                    formatedDate = `${year}-${month}-${day}`;
                }

                if (appointment) {
                    document.getElementById("date_appointment").value = formatedDate;
                    document.getElementById("start_time").value = appointment.start_time;
                    document.getElementById("observations").value = appointment.observations;

                    popUpAppointment.showModal();
                }
            }
        });

        const saveBtnAppointment = document.getElementById("saveChangesAppointment");
        saveBtnAppointment.addEventListener("click", async (e) => {
            e.preventDefault();

            const appointmentPutAPI = {

                date_appointment: document.getElementById("date_appointment").value.trim(),
                start_time: document.getElementById("start_time").value.trim(),
                observations: document.getElementById("observations").value.trim(),
            };

            const {
                date_appointment,
                start_time,
                observations
            } = appointmentPutAPI;

            if (
                !date_appointment ||
                !start_time ||
                !observations
            ) {
                Swal.fire({
                    title: "Required fields are empty.",
                    confirmButtonText: "Go back to edition",
                    target: document.getElementById('editAppointmentPopUp')
                });
                return;
            }
            selectedAppointmentId = editBtn.getAttribute("data-id");
            await sendAppointmentData(appointmentPutAPI, selectedAppointmentId);
        });

        const sendAppointmentData = async (appointmentPutAPI, selectedAppointmentId) => {
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
                    throw new Error(errorData.message || `Error: ${PutResponse.status}`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        //Boton eliminar cita que todavía no ha ocurrido
        const deleteAppointment = async (id_appointment) => {
            try {
                const deleteResponse = await fetch(`http://localhost:8080/appointments/${id_appointment}`, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });

                if (deleteResponse.ok) {
                    Swal.fire({
                        title: "Appointment cancelled!",
                        text: "Appointment successfully cancelled",
                        icon: "success",
                        iconColor: "#318a3a",
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

        //Tabla con las citas para el dia actual.
        const tableToday = document.getElementById("table-today-consults");
        tableToday.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Dueño</th>
                    <th scope="col" class="d-none d-md-table-cell">Servicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Inicio</th>
                    <th scope="col" class="d-none d-md-table-cell">Fin</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinario</th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

        let counterToday = 0;
        appointments.forEach((appointment) => {

            if (formattedToday === appointment.date_appointment) {
                const { date_appointment, start_time, end_time } = appointment;
                const service = services.find(s => s.id_service === appointment.service_id);
                const serviceName = service.name;

                const pet = pets.find(p => p.id === appointment.pet_id);
                const petName = pet.name_pet;

                const veterinarian = veterinarians.find(v => v.dni_veterinarian === appointment.veterinarian_dni);
                const veterinarianName = veterinarian.name;
                const veterinarianSurname = veterinarian.surname;
                const fullNameVeterinarian = veterinarianName + " " + veterinarianSurname;

                const owner = owners.find(o => o.dni_owner === pet.owner_dni);
                const ownerName = owner.name_owner;
                const ownerSurname = owner.surname;

                const fullNameOwner = ownerName + " " + ownerSurname;

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
                    <td scope="row"><a href="#"><i class="fa-solid fa-plus"></i></a></td>
                </tr>
            `;
                tableToday.appendChild(tbody);
                counterToday++;
            }
        });

        if (counterToday == 0) {
            tableToday.innerHTML = `
            <div class="p-2 text-center justify-content-center">
                <h6>No hay citas agendas para hoy</h6>
            </div>
                `;
        }
    }

    getData();
});
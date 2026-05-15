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
                    <th scope="col" class="d-none d-ld-table-cell">Dueño</th>
                    <th scope="col">Servicio</th>
                    <th scope="col" class="d-none d-ld-table-cell">Inicio</th>
                    <th scope="col" class="d-none d-ld-table-cell">Fin</th>
                    <th scope="col" class="d-none d-md-table-cell">Veterinario</th>
                    <th scope="col"></th>
                </tr>
            </thead>
        `;

        //Tabla para mostrar el listado de citas que ya han ocurrido
        let counter=0;
        appointments.forEach((appointment) => {
            const { date_appointment, start_time, end_time } = appointment;
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

                const fullNameOwner = ownerName + " " + ownerSurname;

                const tbody = document.createElement("tbody");
                tbody.innerHTML = `
                <tr>
                    <th scope="row">${date_appointment}</th>
                    <td scope="row">${petName}</td>
                    <td scope="row" class="d-none d-ld-table-cell">${fullNameOwner}</td>
                    <td scope="row">${serviceName}</td>
                    <td scope="row" class="d-none d-ld-table-cell">${start_time}</td>
                    <td scope="row" class="d-none d-ld-table-cell">${end_time}</td>
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

        //Tabla con las citas para el dia actual.
        const tableToday = document.getElementById("table-today-consults");
        tableToday.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Paciente</th>
                    <th scope="col" class="d-none d-md-table-cell">Dueño</th>
                    <th scope="col">Servicio</th>
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
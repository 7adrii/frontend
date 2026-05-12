window.addEventListener("DOMContentLoaded", () => {
    urlAppointments = `http://localhost:8080/appointments`;
    urlPets = `http://localhost:8080/pets`;
    urlServices = `http://localhost:8080/services`;

    const getData = async () => {
        try {
            const appointments = await fetch(urlAppointments);
            const appointmentsData = await appointments.json();

            const pets = await fetch(urlPets);
            const petsData = await pets.json();

            const services = await fetch(urlServices);
            const servicesData = await services.json();

            createData(appointmentsData.data, petsData.data, servicesData.data);
        }
        catch (Error) {
            console.error(Error);
        }
    }

    const createData = async (appointments, pets, services) => {

        //Tarjeta de total citas
        const cardAppointment = document.getElementById("card-appointments");
        const numberAppointments = appointments.length;

        if (cardAppointment) {

            cardAppointment.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-calendar-check"></i></h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Citas</h6>
                </div>
                <h5 class="card-title">${numberAppointments}</h5>
            </div>
        `;
        }

        //Tarjeta total mascotas/pacientes
        const cardPet = document.getElementById("card-pets");
        const numberPets = pets.length;

        if (cardPet) {
            cardPet.innerHTML = `
            <div class="card-body">
                <div class="header-card">
                    <h5 class="card-title"><i class="fa-solid fa-bone"></i></h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Pacientes</h6>
                </div>
                <h5 class="card-title">${numberPets}</h5>
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

        //Creacion de la tabla de historial de consultas
        const table = document.getElementById("table-consults");
        table.innerHTML=`
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Servicio</th>
                    <th></th>
                </tr>
            </thead>
        `;

        appointments.forEach((appointment) => {
            const {date_appointment} = appointment;
            const service = services.find(s => s.id_service === appointment.service_id);
            const serviceName = service.name;

            const pet = pets.find(p => p.id === appointment.pet_id);
            const petName = pet.name_pet;

            const tbody = document.createElement("tbody");
            tbody.innerHTML=`
                <tr>
                    <th scope="row">${date_appointment}</th>
                    <td>${petName}</td>
                    <td>${serviceName}</td>
                    <td><a href="#"><i class="fa-solid fa-plus"></i></a></td>
                </tr>
            `;
            table.appendChild(tbody);
        });
    }

    getData();
});
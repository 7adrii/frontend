window.addEventListener("DOMContentLoaded", () => {
    //Definición rutas de la API
    const urlNewPet = `http://localhost:8080/pets`;
    const urlNewOwner = `http://localhost:8080/owners`;
    const urlNewAllergy = `http://localhost:8080/allergies`;

    //Creación de contenido de nueva alergia en el formulario de dada de alta de una mascota nueva
    const setAllergyForm = () => {
        const btnAdd = document.getElementById("btn-add");
        const container = document.getElementById("container-allergies");
        const template = document.getElementById("allergy-item");

        btnAdd.addEventListener("click", function () {
            const newAllergy = template.content.cloneNode(true);

            const btnRemove = newAllergy.querySelector("#btn-remove");
            btnRemove.addEventListener("click", function (e) {
                e.target.closest("#allergy-block").remove();
            });

            btnAdd.before(newAllergy);
        });
    };

    //Creación de los datos para la inserción en la base de datos
    const getNewData = async () => {
        try {
            const [pet, owner, allergy] = await Promise.all([
                fetch(urlNewPet),
                fetch(urlNewOwner),
                fetch(urlNewAllergy),
            ]);

            const petData = await pet.json();
            const ownerData = await owner.json();
            const allergyData = await allergy.json();

            console.log(petData);
            console.log(ownerData);
            console.log(allergyData);

            createNewData(petData.data, ownerData.data, allergyData.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createNewData = () => {
        const form = document.getElementById("form-new-pet");
        form.innerHTML = `
            <div class="form-title">
                    <h4>Nuevo Registro</h4>
            </div>
            <div class="form-section form-owner">
                <h5>Datos del dueño</h5>
                <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label" id="name_owner">Nombre*</label>
                        <input type="text" class="form-control" placeholder="Ej: Juan">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label" id="surname">Apellidos*</label>
                        <input type="text" class="form-control" placeholder="Ej: Pérez García">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="owner_dni">DNI*</label>
                    <input type="text" class="form-control" placeholder="Ej: 94299329V">
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="phone">Teléfono*</label>
                    <input type="text" class="form-control" placeholder="Ej: 612 345 678">
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="email">Email*</label>
                    <input type="email" class="form-control" placeholder="Ej: juan.perez@gmail.com">
                </div>
            </div>

            <div class="form-section form-pet">
                <h5>Datos de la mascota</h5>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="name_pet">Nombre*</label>
                    <input type="text" class="form-control" placeholder="Ej: Lana">
                </div>
                <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label" id="type">Especie*</label>
                        <input type="text" class="form-control" placeholder="Ej: Perro">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label" id="breed">Raza</label>
                        <input type="text" class="form-control" placeholder="Ej: Golden Retriever">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="weight">Peso*</label>
                    <input type="text" class="form-control" placeholder="Ej: 25 kg">
                </div>
                <div class="mb-3">
                    <label for="disabledSelect" class="form-label" id="sex">Sexo*</label>
                    <select id="disabledSelect" class="form-select">
                        <option>Macho</option>
                        <option>Hembra</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label" id="birth_date">Fecha de nacimiento*</label>
                    <input type="date" class="form-control">
                </div>
            </div>
            
            <div class="form-allergy">
                <div class="form-section">
                    <h5>Alergias</h5>
                    <button type="button" class="btn btn-primary" id="btn-add">Introducir nueva alergia</button>
                    <div id="container-allergies">

                    </div>
                    <template id="allergy-item">
                        <div class="form-section" id="allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" id="allergen">Alérgeno*</label>
                                <input type="text" class="form-control" placeholder="Ej: Picadura de pulga">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" id="diagnostic_method">Método de diagnóstico*</label>
                                <input type="text" class="form-control" placeholder="Ej: Picadura de pulga">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" id="symptoms">Sintomatología</label>
                                <input type="text" class="form-control" placeholder="Ej: Ronchas, estornudos">
                            </div>
                            <div class="mb-3">
                                <label for="disabledSelect" class="form-label" id="severity_level">Nivel de severidad*</label>
                                <select id="disabledSelect" class="form-select">
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Grave/Crítica</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" id="emergency_treatment">Tratamiento de urgencia*</label>
                                <input type="text" class="form-control" placeholder="Ej: Ronchas, estornudos">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label" id="detection_date">Fecha de detección*</label>
                                <input type="date" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-secondary" id="btn-remove"
                                aria-label="Close">Eliminar</button>
                        </div>
                    </template>
                </div>
            </div>

            <div class="btns">
                <a href="pet-list-page.html">
                    <button type="submit" class="btn btn-primary" id="btnRegister">Registrar</button>
                </a>
                <a href="pet-list-page.html">
                    <button type="button" class="btn btn-secondary">Cancelar</button>
                </a>
            </div>
    `;

        const saveBtn = document.getElementById("btnRegister");
        saveBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const ownerSendAPI = {
                owner_dni: document.getElementById("owner_dni").value.trim(),
                name_owner: document.getElementById("name_owner").value.trim(),
                surname: document.getElementById("surname").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                email: document.getElementById("email").value.trim(),
            };

            const { owner_dni, name_owner, surname, phone, email } = ownerSendAPI;

            if (!owner_dni) {
                Swal.fire({
                    title: "El campo DNI está vacio",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            if (!name_owner) {
                Swal.fire({
                    title: "El nombre del dueño está vacio",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            if (!surname) {
                Swal.fire({
                    title: "Los apellidos del dueño están vacio",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            if (!phone) {
                Swal.fire({
                    title: "El teléfono está vacio",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            if (!email) {
                Swal.fire({
                    title: "El email está vacio",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            await sendNewOwner(ownerSendAPI);
        });

        const sendNewOwner = async (ownerSendAPI) => {
            try {
                const postResponse = await fetch(urlNewOwner, {
                    method: "POST",
                    body: JSON.stringify(ownerSendAPI),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });

                if (postResponse.ok) {
                    Swal.fire({
                        title: "¡Datos del dueño añadidos!",
                        text: "Se ha registrado al nuevo dueño",
                        icon: "success",
                        iconColor: "#318a3a",
                        confirmButtonText: "Volver al inicio",
                        confirmButtonColor: "#2a1418",
                    }).then(() => {
                        window.location.href = `pet-list-page.html`;
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        title: `Error: ${postResponse.status}`,
                        icon: "error",
                    });
                }
            } catch {
                Swal.fire({
                    title: "Error de conexión",
                    text: error.message,
                    icon: "error",
                });
            }
        };
    };

    getNewData().then(() => {
        setAllergyForm();
    });
});

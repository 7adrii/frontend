window.addEventListener("DOMContentLoaded", () => {
  //Definición rutas de la API
  const urlNewPet = `http://localhost:8080/pets`;
  const urlNewOwner = `http://localhost:8080/owners`;
  const urlGetOwners = `http://localhost:8080/owners`;
  const urlNewAllergy = `http://localhost:8080/allergies`;

  //Creación de contenido de nueva alergia en el formulario de dada de alta de una mascota nueva
  const setAllergyForm = () => {
    const btnAdd = document.getElementById("btn-add");
    const template = document.getElementById("allergy-item");

    btnAdd.addEventListener("click", function () {
      const newAllergy = template.content.cloneNode(true);

      const btnRemove = newAllergy.querySelector(".btn-remove");

      btnRemove.addEventListener("click", function (e) {
        const block = e.target.closest(".allergy-block");
        if (block) {
          block.remove();
        }
      });

      btnAdd.before(newAllergy);
    });
  };

  //Creación de los datos para la inserción en la base de datos
  const getNewData = async () => {
    try {
      const ownersList = await fetch(urlGetOwners);
      const ownerListData = await ownersList.json();
      console.log(ownerListData);

      createNewData(ownerListData.data);
    } catch (error) {
      console.error(error);
    }
  };

  //Creación de los datos nuevos
  const createNewData = (ownersList) => {
    //De momento no sabemos si vamos a crear un dueño nuevo asi que dejarmos la variable en falso.
    let isNewOwner = false;

    const form = document.getElementById("form-new-pet");
    form.innerHTML = `
            <div class="form-title">
                    <h4>Nuevo Registro</h4>
            </div>
            <div class="form-section form-owner">
                <h5>Datos del dueño</h5>
                <div class="mb-4">
                  <label class="form-label text-muted">Seleccionar dueño registrado:</label>
                  <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle w-100 d-flex justify-content-between align-items-center" 
                      type="button" id="owner-dropdown-btn" data-bs-toggle="dropdown" aria-expanded="false">
                      <span id="selected-owner-text"><i class="fa-solid fa-users me-2"></i> DNI - Nombre</span>
                    </button>
                    <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1" id="list-owners">

                    </ul>
                  </div>
                </div>
                
                <div id="new-owner-form" class="d-none">
                  <h5>Datos del dueño</h5>
                  <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Nombre*</label>
                        <input type="text" class="form-control" id="name_owner" placeholder="Ej: Juan">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Apellidos*</label>
                        <input type="text" class="form-control" id="surname" placeholder="Ej: Pérez García">
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">DNI*</label>
                    <input type="text" class="form-control" id="owner_dni" placeholder="Ej: 94299329V">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Teléfono*</label>
                    <input type="text" class="form-control" id="phone" placeholder="Ej: 612 345 678">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email*</label>
                    <input type="email" class="form-control" id="email" placeholder="Ej: juan.perez@gmail.com">
                  </div>
                </div>
            </div>

            <div class="form-section form-pet">
                <h5>Datos de la mascota</h5>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Nombre*</label>
                    <input type="text" class="form-control" id="name_pet" placeholder="Ej: Lana">
                </div>
                <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Especie*</label>
                        <input type="text" class="form-control" id="type" placeholder="Ej: Perro">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Raza</label>
                        <input type="text" class="form-control" id="breed" placeholder="Ej: Golden Retriever">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Peso*</label>
                    <input type="text" class="form-control" id="weight" placeholder="Ej: 25 kg">
                </div>
                <div class="mb-3">
                    <label for="disabledSelect" class="form-label">Sexo*</label>
                    <select class="form-select" id="sex">
                        <option>Macho</option>
                        <option>Hembra</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Fecha de nacimiento*</label>
                    <input type="date" class="form-control" id="birth_date">
                </div>
            </div>
            
            <div class="form-allergy">
                <div class="form-section">
                    <h5>Alergias</h5>
                    <button type="button" class="btn btn-primary" id="btn-add">Introducir nueva alergia</button>
                    <div id="container-allergies">

                    </div>
                    <template id="allergy-item">
                        <div class="form-section allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Alérgeno*</label>
                                <input type="text" class="form-control allergen" placeholder="Ej: Picadura de pulga">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Método de diagnóstico*</label>
                                <input type="text" class="form-control diagnostic_method" placeholder="Ej: Picadura de pulga">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Sintomatología</label>
                                <input type="text" class="form-control symptoms" placeholder="Ej: Ronchas, estornudos">
                            </div>
                            <div class="mb-3">
                                <label for="disabledSelect" class="form-label">Nivel de severidad*</label>
                                <select id="disabledSelect" class="form-select severity_level">
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Grave/Crítica</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Tratamiento de urgencia*</label>
                                <input type="text" class="form-control emergency_treatment" placeholder="Ej: Ronchas, estornudos">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Fecha de detección*</label>
                                <input type="date" class="form-control detection_date">
                            </div>
                            <button type="button" class="btn btn-secondary btn-remove"
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

    //Sección para listar los dueños de la base de datos
    const listOwners = document.getElementById("list-owners");
    listOwners.innerHTML = ``;

    //Ordenamos la lista por apellidos en orden descendente
    ownersList.sort((a, b) => a.surname.localeCompare(b.surname));

    const selectElement = document.getElementById("selected-owner-text");

    //Creamos los elementos para la lista
    ownersList.forEach((owner) => {
      const { dni_owner, name_owner, surname, phone, email } = owner;
      const ownerElement = document.createElement("li");

      ownerElement.innerHTML = `
        <a class="dropdown-item" href="#" onclick="document.getElementById('new-owner-form').classList.add('d-none')">${surname} ${name_owner} - ${dni_owner}</a>
      `;

      ownerElement.addEventListener("click", (e) => {
        e.preventDefault();

        selectElement.innerHTML = `${surname} ${name_owner} - ${dni_owner}`;
        document.getElementById("owner_dni").value = dni_owner;
        document.getElementById("name_owner").value = name_owner;
        document.getElementById("surname").value = surname;
        document.getElementById("phone").value = phone;
        document.getElementById("email").value = email;
      });

      listOwners.appendChild(ownerElement);
    });

    const ownersDivider = document.createElement("li");
    ownersDivider.innerHTML = `<hr class="dropdown-divider">`;
    listOwners.appendChild(ownersDivider);

    const newOwner = document.createElement("li");
    newOwner.innerHTML = `
      <a class="dropdown-item" href="#" onclick="document.getElementById('new-owner-form').classList.remove('d-none')">
        <strong>+ Dar de alta nuevo dueño</strong>
      </a>
    `;
    listOwners.appendChild(newOwner);

    newOwner.addEventListener("click", (e) => {
      isNewOwner = true;
    });

    const registerBtn = document.getElementById("btnRegister");

    //Funcion para conectar al postOwner de la API
    const sendNewOwner = async (ownerSendAPI) => {
      try {
        const postOwnerResponse = await fetch(urlNewOwner, {
          method: "POST",
          body: JSON.stringify(ownerSendAPI),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error de conexión",
          text: error.message,
          icon: "error",
        });
      }
    };

    //Funcion para conectar al postPet de la API
    const sendNewPet = async (petSendAPI) => {
      try {
        const postPetResponse = await fetch(urlNewPet, {
          method: "POST",
          body: JSON.stringify(petSendAPI),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error de conexión",
          text: error.message,
          icon: "error",
        });
      }
    };

    //Función para conectar con el postAllergy de la API
    const sendAllergies = async (allergies) => {
      for (const element of allergies) {
        try {
          const postAllergyResponse = await fetch(urlNewAllergy, {
            method: "POST",
            body: JSON.stringify(element),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        } catch (error) {
          console.error("Error en los datos de alergias: ", error);
        }
      }
    };

    registerBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      //Registrar datos del dueño
      const ownerSendAPI = {
        dni_owner: document.getElementById("owner_dni").value.trim(),
        name_owner: document.getElementById("name_owner").value.trim(),
        surname: document.getElementById("surname").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
      };

      const { dni_owner, name_owner, surname, phone, email } = ownerSendAPI;

      if (!dni_owner || !name_owner || !surname || !phone || !email) {
        Swal.fire({
          title: "Faltan campos obligatorios en el apartado de dueño",
          icon: "warning",
          confirmButtonText: "Volver al registro",
        });
        return;
      }

      //Registrar datos de la mascota
      const petSendAPI = {
        name_pet: document.getElementById("name_pet").value.trim(),
        type: document.getElementById("type").value.trim(),
        breed: document.getElementById("breed").value.trim(),
        weight: parseFloat(document.getElementById("weight").value),
        sex: document.getElementById("sex").value.trim(),
        birth_date: document.getElementById("birth_date").value,
        owner_dni: ownerSendAPI.dni_owner,
      };

      const { name_pet, type, breed, weight, sex, birth_date, owner_dni } =
        petSendAPI;

      if (!name_pet || !type || !weight || !sex || !birth_date) {
        Swal.fire({
          title: "Faltan campos obligatorios en el apartado de mascota.",
          icon: "warning",
          confirmButtonText: "Volver al registro",
        });
        return;
      }

      //Registrar datos de las alergias
      const allergyList = document.querySelectorAll(".allergy-block");
      const allergies = [];
      let error = false;

      for (let i = 0; i < allergyList.length; i++) {
        const element = allergyList[i];
        const allergy = {
          allergen: element.querySelector(".allergen").value.trim(),
          diagnostic_method: element
            .querySelector(".diagnostic_method")
            .value.trim(),
          symptoms: element.querySelector(".symptoms").value.trim(),
          emergency_treatment: element
            .querySelector(".emergency_treatment")
            .value.trim(),
          severity_level: element.querySelector(".severity_level").value,
          detection_date: element.querySelector(".detection_date").value,
        };

        const {
          allergen,
          diagnostic_method,
          symptoms,
          emergency_treatment,
          severity_level,
          detection_date,
        } = allergy;

        //Validacion de datos
        if (
          !allergen ||
          !diagnostic_method ||
          !emergency_treatment ||
          !severity_level ||
          !detection_date
        ) {
          Swal.fire({
            title: `Faltan campos por rellenar en la alergia nº ${i + 1}`,
            icon: "warning",
            confirmButtonText: "Volver al registro",
          });
          error = true;
          break;
        }

        allergies.push(allergy);
      }

      if (error) return;

      try {
        if (isNewOwner) {
          const dataOwner = await sendNewOwner(ownerSendAPI);
        }

        const dataPet = await sendNewPet(petSendAPI);

        if (allergies.length > 0) {
          const dataAllergy = await sendAllergies(allergies);
        }

        Swal.fire("Registro completado", "success").then(() => {
          window.location.href = `pet-list-page.html`;
        });
      } catch (err) {
        Swal.fire("Problema a la hora de registrar");
        console.error(err);
      }
    });
  };

  getNewData().then(() => {
    setAllergyForm();
  });
});

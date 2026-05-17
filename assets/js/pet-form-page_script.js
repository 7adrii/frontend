window.addEventListener("DOMContentLoaded", () => {
  //Definición rutas de la API
  const urlNewPet = `http://localhost:8080/pets`;
  const urlNewOwner = `http://localhost:8080/owners`;
  const urlGetOwners = `http://localhost:8080/owners`;
  const urlNewPathology = `http://localhost:8080/pathologies`;

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
                    <h4 class="text-light">Nuevo Registro</h4>
            </div>
            <div class="form-section form-owner">
                <h5>Datos del dueño</h5>
                <div class="mb-4">
                  <label class="form-label text-muted">Seleccionar dueño</label>
                  <div class="dropdown">
                    <button class="btn btn-outline-dark dropdown-toggle w-100 d-flex justify-content-between align-items-center" 
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
                        <input type="text" class="form-control" id="name_owner" placeholder="Juan">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Apellidos*</label>
                        <input type="text" class="form-control" id="surname" placeholder="Pérez García">
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">DNI*</label>
                    <input type="text" class="form-control" id="owner_dni" placeholder="94299329V">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Teléfono*</label>
                    <input type="text" class="form-control" id="phone" placeholder="612345678">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email*</label>
                    <input type="email" class="form-control" id="email" placeholder="example@gmail.com">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Direccion</label>
                    <input type="text" class="form-control" id="direction" placeholder="Paseo de Independencia 1">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Piso</label>
                    <input type="text" class="form-control" id="floor" placeholder="3B">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Ciudad*</label>
                    <input type="text" class="form-control" id="city" placeholder="Zaragoza">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Provincia*</label>
                    <input type="text" class="form-control" id="province" placeholder="Zaragoza">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Codigo postal*</label>
                    <input type="text" class="form-control" id="postal_code" placeholder="50007">
                  </div>
                </div>
            </div>

            <div class="form-section form-pet">
                <h5>Datos de la mascota</h5>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Nombre*</label>
                    <input type="text" class="form-control" id="name_pet" placeholder="Lana">
                </div>
                <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Especie*</label>
                        <input type="text" class="form-control" id="type" placeholder="Perro">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Raza</label>
                        <input type="text" class="form-control" id="breed" placeholder="Golden Retriever">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Peso (en kg)*</label>
                    <input type="text" class="form-control" id="weight" placeholder="25">
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
                    <button type="button" class="btn btn-dark" id="btn-add">Introducir nueva alergia</button>
                    <div id="container-allergies">

                    </div>
                    <template id="allergy-item">
                        <div class="form-section allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Nombre Patología*</label>
                                <input type="text" class="form-control name" placeholder="Soplo en el corazón">
                            </div>
                            <div class="row mb-3"> 
                              <div class="col-md-6">
                                <label for="exampleInputEmail1" class="form-label">Tipo*</label>
                                <select id="disabledSelect" class="form-select type">
                                    <option>Alergia</option>
                                    <option>Enfermedad</option>
                                    <option>Síndrome</option>
                                    <option>Otros</option>
                                </select>
                              </div>
                              <div class="col-md-6">
                                <label for="disabledSelect" class="form-label">Nivel de severidad*</label>
                                <select id="disabledSelect" class="form-select severity_level">
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Grave/Crítica</option>
                                </select>
                              </div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Método de diagnostico</label>
                                <input type="text" class="form-control diagnostic_method" placeholder="Analisis de sangre">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Sintomas</label>
                                <textarea class="form-control symptoms" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Tratamiento* </label>
                                <textarea class="form-control treatment" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Es cronico*</label>
                                <input type="checkbox" class="form-check-input is_chronic">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Fecha de detección*</label>
                                <input type="date" class="form-control detection_date">
                            </div>
                            <button type="button" class="btn btn-info btn-remove"
                                aria-label="Close">Eliminar</button>
                        </div>
                    </template>
                </div>
            </div>

            <div class="btns">
                <a href="pet-list-page.html">
                    <button type="submit" class="btn btn-dark" id="btnRegister">Registrar</button>
                </a>
                <a href="pet-list-page.html">
                    <button type="button" class="btn btn-info">Cancelar</button>
                </a>
            </div>
    `;

    //Sección para listar los dueños de la base de datos
    const listOwners = document.getElementById("list-owners");
    listOwners.innerHTML = ``;

    const newOwner = document.createElement("li");
    newOwner.innerHTML = `
      <a class="dropdown-item" href="#" onclick="document.getElementById('new-owner-form').classList.remove('d-none')">
        <strong>+ Dar de alta nuevo dueño</strong>
      </a>
    `;
    listOwners.appendChild(newOwner);

    const ownersDivider = document.createElement("li");
    ownersDivider.innerHTML = `<hr class="dropdown-divider">`;
    listOwners.appendChild(ownersDivider);

    newOwner.addEventListener("click", (e) => {
      isNewOwner = true;
    });

    //Ordenamos la lista por apellidos en orden descendente
    ownersList.sort((a, b) => a.surname.localeCompare(b.surname));

    const selectElement = document.getElementById("selected-owner-text");

    //Creamos los elementos para la lista
    ownersList.forEach((owner) => {
      const { dni_owner, name_owner, surname, phone, email, direction, floor, city, province, postal_code } = owner;
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
        document.getElementById("direction").value = direction;
        document.getElementById("floor").value = floor;
        document.getElementById("city").value = city;
        document.getElementById("province").value = province;
        document.getElementById("postal_code").value = postal_code;
      });

      listOwners.appendChild(ownerElement);
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

        const data = await postPetResponse.json();

        //Almacenamos el id para la asignacion de la patologias
        const id = data.data.id_pet;
        return id;

      } catch (error) {
        Swal.fire({
          title: "Error de conexión",
          text: error.message,
          icon: "error",
        });
      }
    };

    //Función para conectar con el postAllergy de la API
    const sendPathologies = async (pathologies, petId) => {
      for (const element of pathologies) {
        element.pet_id = petId;
        try {
          const postPathologyResponse = await fetch(urlNewPathology, {
            method: "POST",
            body: JSON.stringify(element),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        } catch (error) {
          console.error("Error en los datos de patologias: ", error);
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
        direction: document.getElementById("direction").value.trim(),
        floor: document.getElementById("floor").value.trim(),
        city: document.getElementById("city").value.trim(),
        province: document.getElementById("province").value.trim(),
        postal_code: document.getElementById("postal_code").value.trim(),
      };

      const { dni_owner, name_owner, surname, phone, email, direction, floor, city, province, postal_code } = ownerSendAPI;

      if (!dni_owner || !name_owner || !surname || !phone || !email || !direction || !city || !province || !postal_code) {
        Swal.fire({
          title: "Faltan campos obligatorios en el apartado de dueño",
          icon: "warning",
          confirmButtonText: "Volver al registro",
        });
        return;
      }

      //Declaramos una variable de fecha de nacimietno de la mascota para poder usarla posteriormente en patologias
      let newBirthDate;

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

      newBirthDate = new Date(birth_date);

      if (!name_pet || !type || !weight || !sex || !birth_date) {
        Swal.fire({
          title: "Faltan campos obligatorios en el apartado de mascota.",
          icon: "warning",
          confirmButtonText: "Volver al registro",
        });
        return;
      }

      //Si la fecha de nacimiento introducida es mayor que la actual lanza error
      const date = new Date();
      const birthDate = new Date(birth_date);

      if (birthDate.getTime() > date.getTime()) {
        Swal.fire({
          title: "La fecha de nacimiento no puede ser mayor que la fecha actual.",
          icon: "warning",
          confirmButtonText: "Volver al registro",
        });
        return;
      }

      //Registrar datos de las patologias
      const pathologyList = document.querySelectorAll(".allergy-block");
      const pathologies = [];
      let error = false;

      for (let i = 0; i < pathologyList.length; i++) {
        const element = pathologyList[i];
        const pathology = {
          name: element.querySelector(".name").value.trim(),
          type: element.querySelector(".type").value.trim(),
          diagnostic_method: element.querySelector(".diagnostic_method").value.trim(),
          symptoms: element.querySelector(".symptoms").value.trim(),
          severity_level: element.querySelector(".severity_level").value,
          treatment: element.querySelector(".treatment").value.trim(),
          is_chronic: element.querySelector(".is_chronic").checked,
          detection_date: element.querySelector(".detection_date").value,
        };

        const {
          name,
          type,
          diagnostic_method,
          symptoms,
          severity_level,
          treatment,
          is_chronic,
          detection_date,
        } = pathology;

        //Validacion de datos
        if (
          !name ||
          !type ||
          !treatment ||
          !severity_level ||
          !detection_date
        ) {
          Swal.fire({
            title: `Faltan campos por rellenar en la patologia nº ${i + 1}`,
            icon: "warning",
            confirmButtonText: "Volver al registro",
          });
          error = true;
          break;
        }

        const date = new Date();
        const detectionDate = new Date(detection_date);

        if (detectionDate.getTime() > date.getTime() || detectionDate.getTime() < newBirthDate.getTime()) {
          Swal.fire({
            title: `La fecha de detección de la patologia nº ${i + 1} no puede ser mayor que la fecha actual o a la de nacimiento de la mascota`,
            icon: "warning",
            confirmButtonText: "Volver al registro",
          });
          error = true;
          break;
        }

        pathologies.push(pathology);
      }

      if (error) return;

      try {
        if (isNewOwner) {
          const dataOwner = await sendNewOwner(ownerSendAPI);
        }

        const petIdCreated = await sendNewPet(petSendAPI);

        if (petIdCreated) {
          if (pathologies.length > 0) {
            const dataPathology = await sendPathologies(pathologies, petIdCreated);
          }
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

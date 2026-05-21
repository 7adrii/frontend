window.addEventListener("DOMContentLoaded", () => {
  //Definición rutas de la API
  const urlNewPet = `http://54.85.141.17:8080/pets`;
  const urlNewOwner = `http://54.85.141.17:8080/owners`;
  const urlGetOwners = `http://54.85.141.17:8080/owners`;
  const urlNewPathology = `http://54.85.141.17:8080/pathologies`;

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
      createNewData(ownerListData && ownerListData.data ? ownerListData.data : []);
    } catch (error) {
      console.error(error);
      // Si la petición falla, renderizamos el formulario vacío para permitir alta manual
      createNewData([]);
    }
  };

  //Creación de los datos nuevos
  const createNewData = (ownersList) => {
    ownersList = ownersList || [];
    //De momento no sabemos si vamos a crear un dueño nuevo asi que dejarmos la variable en falso.
    let isNewOwner = false;

    const form = document.getElementById("form-new-pet");
    form.innerHTML = `
            <div class="form-title">
                    <h4 class="text-light">New Pacient</h4>
            </div>
            <div class="form-section form-owner">
                <h5>Owner's data</h5>
                <div class="mb-4">
                  <label class="form-label text-muted">Select owner</label>
                  <div class="dropdown">
                    <button class="btn btn-outline-dark dropdown-toggle w-100 d-flex justify-content-between align-items-center" 
                      type="button" id="owner-dropdown-btn" data-bs-toggle="dropdown" aria-expanded="false">
                      <span id="selected-owner-text"><i class="fa-solid fa-users me-2"></i> DNI - Name</span>
                    </button>
                    <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1" id="list-owners">

                    </ul>
                  </div>
                </div>
                
                <div id="new-owner-form" class="d-none">
                  <h5>Owner's data</h5>
                  <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name_owner" placeholder="Juan">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Surname</label>
                        <input type="text" class="form-control" id="surname" placeholder="Pérez García">
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Birth date</label>
                    <input type="date" class="form-control" id="birth_date_owner">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">DNI</label>
                    <input type="text" class="form-control" id="owner_dni" placeholder="94299329V">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" placeholder="612345678">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="example@gmail.com">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Direction</label>
                    <input type="text" class="form-control" id="direction" placeholder="Paseo de Independencia 1">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Floor</label>
                    <input type="text" class="form-control" id="floor" placeholder="3B">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">City</label>
                    <input type="text" class="form-control" id="city" placeholder="Zaragoza">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Province</label>
                    <input type="text" class="form-control" id="province" placeholder="Zaragoza">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Postal code</label>
                    <input type="text" class="form-control" id="postal_code" placeholder="50007">
                  </div>
                </div>
            </div>

            <div class="form-section form-pet">
                <h5>Pet's data</h5>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name_pet" placeholder="Lana">
                </div>
                <div class="line-form">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Specie</label>
                        <input type="text" class="form-control" id="type" placeholder="Perro">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Breed</label>
                        <input type="text" class="form-control" id="breed" placeholder="Golden Retriever">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Weight (kg)</label>
                    <input type="text" class="form-control" id="weight" placeholder="25">
                </div>
                <div class="mb-3">
                    <label for="disabledSelect" class="form-label">Sex</label>
                    <select class="form-select" id="sex">
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Birth date</label>
                    <input type="date" class="form-control" id="birth_date">
                </div>
            </div>
            
            <div class="form-allergy">
                <div class="form-section">
                    <h5>Pathologies</h5>
                    <button type="button" class="btn btn-dark" id="btn-add">Add new pathology</button>
                    <div id="container-allergies">

                    </div>
                    <template id="allergy-item">
                        <div class="form-section allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Name</label>
                                <input type="text" class="form-control name" placeholder="Soplo en el corazón">
                            </div>
                            <div class="row mb-3"> 
                              <div class="col-md-6">
                                <label for="exampleInputEmail1" class="form-label">Type</label>
                                <select id="disabledSelect" class="form-select type">
                                    <option>Allergy</option>
                                    <option>Pathology</option>
                                    <option>Syndrome</option>
                                    <option>Other</option>
                                </select>
                              </div>
                              <div class="col-md-6">
                                <label for="disabledSelect" class="form-label">Severity Level</label>
                                <select id="disabledSelect" class="form-select severity_level">
                                    <option>Mild</option>
                                    <option>Moderate</option>
                                    <option>Severe/Critical</option>
                                </select>
                              </div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Diagnostic method</label>
                                <input type="text" class="form-control diagnostic_method" placeholder="Analisis de sangre">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Symptoms</label>
                                <textarea class="form-control symptoms" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Treatment</label>
                                <textarea class="form-control treatment" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Is cronic?</label>
                                <input type="checkbox" class="form-check-input is_chronic">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Detection's date</label>
                                <input type="date" class="form-control detection_date">
                            </div>
                            <button type="button" class="btn btn-info btn-remove"
                                aria-label="Close">Delete</button>
                        </div>
                    </template>
                </div>
            </div>

            <div class="btns">
                <a href="pet-list-page.html">
                    <button type="submit" class="btn btn-dark" id="btnRegister">Register</button>
                </a>
                <a href="pet-list-page.html">
                    <button type="button" class="btn btn-info">Cancel</button>
                </a>
            </div>
    `;

    //Sección para listar los dueños de la base de datos
    const listOwners = document.getElementById("list-owners");
    listOwners.innerHTML = ``;

    const newOwner = document.createElement("li");
    newOwner.innerHTML = `
      <a class="dropdown-item" href="#" onclick="document.getElementById('new-owner-form').classList.remove('d-none')">
        <strong>+ Register new owner</strong>
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
      const { dni_owner, name_owner, surname, birth_date, phone, email, direction, floor, city, province, postal_code } = owner;
      const ownerElement = document.createElement("li");

      const birthDate = new Date(birth_date);
      const day = String(birthDate.getDate()).padStart(2, '0');
      const month = String(birthDate.getMonth() + 1).padStart(2, '0');
      const year = birthDate.getFullYear();
      const formattedDateBirth = `${year}-${month}-${day}`

      ownerElement.innerHTML = `
        <a class="dropdown-item" href="#" onclick="document.getElementById('new-owner-form').classList.add('d-none')">${surname} ${name_owner} - ${dni_owner}</a>
      `;

      ownerElement.addEventListener("click", (e) => {
        e.preventDefault();

        selectElement.innerHTML = `${surname} ${name_owner} - ${dni_owner}`;
        document.getElementById("owner_dni").value = dni_owner;
        document.getElementById("name_owner").value = name_owner;
        document.getElementById("surname").value = surname;
        document.getElementById("birth_date_owner").value = formattedDateBirth;
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

        if (!postOwnerResponse.ok) {
          const errorData = await postOwnerResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${postOwnerResponse.status}`);
        }

        return await postOwnerResponse.json();
      } catch (error) {
        throw error;
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

        if (!postPetResponse.ok) {
          const errorData = await postPetResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${postPetResponse.status}`);
        }

        const data = await postPetResponse.json();

        //Almacenamos el id para la asignacion de la patologias
        const id = data.data.id_pet;
        return id;

      } catch (error) {
        throw error;
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

          if (!postPathologyResponse.ok) {
            const errorData = await postPathologyResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Pathology post failed: ${postPathologyResponse.status}`);
          }
        } catch (error) {
          throw error;
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
        birth_date: document.getElementById("birth_date_owner").value,
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        direction: document.getElementById("direction").value.trim(),
        floor: document.getElementById("floor").value.trim(),
        city: document.getElementById("city").value.trim(),
        province: document.getElementById("province").value.trim(),
        postal_code: document.getElementById("postal_code").value.trim(),
      };

      const { dni_owner, name_owner, surname, phone, email, direction, floor, city, province, postal_code } = ownerSendAPI;
      const ownerBirth = ownerSendAPI.birth_date;

      if (!dni_owner || !name_owner || !surname || !ownerBirth || !phone || !email || !direction || !city || !province || !postal_code) {
        Swal.fire({
          title: "Required fields are missing in the owner section.",
          icon: "warning",
          iconColor: "#9f7217",
          confirmButtonText: "Go back to the register",
          confirmButtonColor: "#2a1418",
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
          title: "Required fields are missing in the pet section.",
          icon: "warning",
          iconColor: "#9f7217",
          confirmButtonText: "Go back to the register",
          confirmButtonColor: "#2a1418",
        });
        return;
      }

      //Si la fecha de nacimiento introducida es mayor que la actual lanza error
      const date = new Date();
      const birthDate = new Date(birth_date);

      if (birthDate.getTime() > date.getTime()) {
        Swal.fire({
          title: "The date of birth cannot be later than the current date.",
          icon: "warning",
          iconColor: "#9f7217",
          confirmButtonText: "Go back to the register",
          confirmButtonColor: "#2a1418",
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
            title: `Required fields are missing in the pathology nº${i + 1}.`,
            icon: "warning",
            iconColor: "#9f7217",
            confirmButtonText: "Go back to the register",
            confirmButtonColor: "#2a1418",
          });
          error = true;
          break;
        }

        const date = new Date();
        const detectionDate = new Date(detection_date);

        if (detectionDate.getTime() > date.getTime() || detectionDate.getTime() < newBirthDate.getTime()) {
          Swal.fire({
            title: `The detection date for pathology no. ${i + 1} cannot be later than the current date or earlier than the pet's date of birth`,
            icon: "warning",
            iconColor: "#9f7217",
            confirmButtonText: "Go back to the register",
            confirmButtonColor: "#2a1418",
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

        Swal.fire({
          title: "Register completed.",
          text: "The pacient has been registered successfully",
          icon: 'success',
          iconColor: '#59b2b0',
          confirmButtonText: 'Accept',
          confirmButtonColor: '#2a1418'
        }).then(() => {
          window.location.href = `pet-list-page.html`;
        });
      } catch (err) {
        Swal.fire({
          title: "Problem when registering.",
          text: err.message,
          icon: "error",
          iconColor: "#9f7217",
          confirmButtonText: "Understood",
          confirmButtonColor: "#2a1418",
        });
        console.error(err);
      }
    });
  };

    getNewData().then(() => {
      setAllergyForm();
    });
});

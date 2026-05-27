window.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(document.location.search);
    let idPet = params.get("id");

    const urlPathologies = `http://localhost:8080/pathologies`;
    const urlPet = `http://localhost:8080/pets/${idPet}`;

    const getNewPathology = async () => {
        try {
            const pet = await fetch(urlPet);
            const petData = await pet.json();

            createNewPathology(petData.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createNewPathology = (petData) => {
        const form = document.getElementById("form-new-pathology");
        form.innerHTML = `
        <div class="form-title">
                    <h4 class="text-light">New Pathology</h4>
            </div>
            
            <div class="form-allergy">
                <div class="form-section">
                        <div class="form-section allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Name pathology</label>
                                <input type="text" class="form-control" id="name" placeholder="Heart murmur">
                            </div>
                            <div class="row mb-3"> 
                              <div class="col-md-6">
                                <label for="exampleInputEmail1" class="form-label">Type</label>
                                <select class="form-select" id="type">
                                    <option>Allergy</option>
                                    <option>Illness</option>
                                    <option>Syndrom</option>
                                    <option>Other</option>
                                </select>
                              </div>
                              <div class="col-md-6">
                                <label for="disabledSelect" class="form-label">Severity level</label>
                                <select class="form-select" id="severity_level">
                                    <option>Mild</option>
                                    <option>Moderate</option>
                                    <option>Severe/Critical</option>
                                </select>
                              </div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Diagnostic Method</label>
                                <input type="text" class="form-control" id="diagnostic_method" placeholder="Blood test">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Symptoms</label>
                                <textarea class="form-control" id="symptoms" rows="3" placeholder="Hives"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Treatment</label>
                                <textarea class="form-control" id="treatment" rows="3" placeholder="Intravenous medication"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Is cronic?</label>
                                <input type="checkbox" class="form-check-input" id="is_chronic">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Detection's date</label>
                                <input type="date" class="form-control" id="detection_date">
                            </div>
                        </div>
                </div>
            </div>

            <div class="btns">
                <a>
                    <button type="submit" class="btn btn-dark" id="btnRegister">Register</button>
                </a>
                <a href="pet-detail.html?id=${idPet}">
                    <button type="button" class="btn btn-info">Cancel</button>
                </a>
            </div>
    `;

        const registerBtn = document.getElementById("btnRegister");
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const pathologySendAPI = {
                name: document.getElementById("name").value.trim(),
                type: document.getElementById("type").value.trim(),
                diagnostic_method: document.getElementById("diagnostic_method").value.trim(),
                symptoms: document.getElementById("symptoms").value,
                severity_level: document.getElementById("severity_level").value.trim(),
                treatment: document.getElementById("treatment").value,
                is_chronic: document.getElementById("is_chronic").checked,
                detection_date: document.getElementById("detection_date").value,
                pet_id: idPet,
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
            } = pathologySendAPI;

            if (
                !name ||
                !diagnostic_method ||
                !symptoms ||
                !severity_level ||
                !treatment ||
                !detection_date
            ) {
                Swal.fire({
                    title: "Required pathology fields are missing.",
                    icon: "warning",
                    iconColor: "#9f7217",
                    confirmButtonText: "Go back to the register",
                    confirmButtonColor: "#2a1418",
                });
                return;
            }

            const date = new Date();
            const newDetectionDate = new Date(detection_date);
            const newBirthDate = new Date(petData.birth_date);

            if (newDetectionDate.getTime() > date.getTime() || newDetectionDate.getTime() < newBirthDate.getTime()) {
                Swal.fire({
                    title: 'The pathology detection date cannot be later than the current date or earlier than the date of birth of the pet.',
                    icon: "warning",
                    iconColor: "#9f7217",
                    confirmButtonText: "Go back to the register",
                    confirmButtonColor: "#2a1418",
                });
                return
            }



            //Buscamos la fecha de nacimiento de la mascota para poder compararla con la fecha de detección de la
            //patología. Si la fecha de la patología es anterior a la de nacimiento saltará un error.
            const birthDateSplit = petData.birth_date;
            const [day, month, year] = birthDateSplit.split("/");
            const birthDate = new Date(`${year}-${month}-${day}`);

            const detectionDate = new Date(detection_date);
            console.log(birthDate);
            console.log(detectionDate);
            if (detectionDate.getTime() < birthDate.getTime()) {
                Swal.fire({
                    title: "The pathology detection date cannot be later than the current date or earlier than the date of birth of the pet.",
                    icon: "warning",
                    iconColor: "#9f7217",
                    confirmButtonText: "Go back to the register",
                    confirmButtonColor: "#2a1418",
                });
                return;
            }

            await sendPathology(pathologySendAPI);
        });

        //Función para conectar con el postAllergy de la API
        const sendPathology = async (pathologySendAPI) => {
            try {
                const postPathologyResponse = await fetch(urlPathologies, {
                    method: "POST",
                    body: JSON.stringify(pathologySendAPI),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });

                if (postPathologyResponse.ok) {
                    Swal.fire({
                        title: "New pathology added",
                        text: "The pathology has been added",
                        icon: "success",
                        iconColor: "#59b2b0",
                        confirmButtonText: "Go back to pet",
                        confirmButtonColor: "#2a1418",
                    }).then(() => {
                        window.location.href = `pet-detail.html?id=${idPet}`;
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: `Error: ${postPathologyResponse.status}`,
                        icon: "error",
                        iconColor: "#9f7217",
                        confirmButtonText: "Go back to register",
                        confirmButtonColor: "#2a1418"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Conection error",
                    text: error.message,
                    icon: "error",
                    iconColor: "#9f7217",
                    confirmButtonText: "Go back to register",
                    confirmButtonColor: "#2a1418"
                });
            }
        };
    };

    getNewPathology();
});

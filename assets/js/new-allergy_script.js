window.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(document.location.search);
    let idPet = params.get("id");
    console.log(idPet);

    const urlPathologies = `http://localhost:8080/pathologies`;

    const getNewPathology = async () => {
        try {
            createNewPathology();
        } catch (error) {
            console.error(error);
        }
    };

    const createNewPathology = () => {
        const form = document.getElementById("form-new-pathology");
        form.innerHTML = `
        <div class="form-title">
                    <h4 class="text-light">Nueva Patología</h4>
            </div>
            
            <div class="form-allergy">
                <div class="form-section">
                        <div class="form-section allergy-block">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Nombre Patología*</label>
                                <input type="text" class="form-control" id="name" placeholder="Soplo en el corazón">
                            </div>
                            <div class="row mb-3"> 
                              <div class="col-md-6">
                                <label for="exampleInputEmail1" class="form-label">Tipo*</label>
                                <select class="form-select" id="type">
                                    <option>Alergia</option>
                                    <option>Enfermedad</option>
                                    <option>Síndrome</option>
                                    <option>Otros</option>
                                </select>
                              </div>
                              <div class="col-md-6">
                                <label for="disabledSelect" class="form-label">Nivel de severidad*</label>
                                <select class="form-select" id="severity_level">
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Grave/Crítica</option>
                                </select>
                              </div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Método de diagnostico</label>
                                <input type="text" class="form-control" id="diagnostic_method" placeholder="Analisis de sangre">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Sintomas</label>
                                <textarea class="form-control" id="symptoms" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Tratamiento* </label>
                                <textarea class="form-control" id="treatment" rows="3" placeholder="Ronchas"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Es cronico*</label>
                                <input type="checkbox" class="form-check-input" id="is_chronic">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Fecha de detección*</label>
                                <input type="date" class="form-control" id="detection_date">
                            </div>
                        </div>
                </div>
            </div>

            <div class="btns">
                <a>
                    <button type="submit" class="btn btn-primary" id="btnRegister">Registrar</button>
                </a>
                <a href="pet-detail.html?id=${idPet}">
                    <button type="button" class="btn btn-secondary">Cancelar</button>
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
                    title: "Faltan campos obligatorios de la alergia.",
                    icon: "warning",
                    confirmButtonText: "Volver al registro",
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
                        title: "Nueva alergia añadida",
                        text: "Se ha añadido la alergia",
                        icon: "success",
                        iconColor: "#318a3a",
                        confirmButtonText: "Volver a la ficha de la mascota",
                        confirmButtonColor: "#2a1418",
                    }).then(() => {
                        window.location.href = `pet-detail.html?id=${idPet}`;
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: `Error: ${postPathologyResponse.status}`,
                        icon: "error",
                    });
                }
            } catch (error){
                Swal.fire({
                    title: "Error de conexión",
                    text: error.message,
                    icon: "error",
                });
            }
        };
    };

    getNewPathology();
});

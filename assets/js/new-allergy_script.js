window.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(document.location.search);
    let idPet = params.get("id");
    console.log(idPet);

    const urlNewAllergy = `http://localhost:8080/allergies`;

    const getNewAllergy = async () => {
        try {
            createNewAllergy();
        } catch (error) {
            console.error(error);
        }
    };

    const createNewAllergy = () => {
        const form = document.getElementById("form-new-allergy");
        form.innerHTML = `
        <div class="form-allergy">
            <div class="form-section">
                <h5>Nueva alergia</h5>
                <div class="form-section allergy-block">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Alérgeno*</label>
                        <input type="text" class="form-control" id="allergen" placeholder="Ej: Picadura de pulga">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Método de diagnóstico*</label>
                        <input type="text" class="form-control" id="diagnostic_method" placeholder="Ej: Picadura de pulga">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Sintomatología</label>
                        <input type="text" class="form-control" id="symptoms" placeholder="Ej: Ronchas, estornudos">
                    </div>
                    <div class="mb-3">
                        <label for="disabledSelect" class="form-label">Nivel de severidad*</label>
                        <select class="form-select" id="severity_level">
                            <option>Leve</option>
                            <option>Moderada</option>
                            <option>Grave/Crítica</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Tratamiento de urgencia*</label>
                        <input type="text" class="form-control" id="emergency_treatment" placeholder="Ej: Ronchas, estornudos">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Fecha de detección*</label>
                        <input type="date" class="form-control" id="detection_date">
                    </div>
                </div>
            </div>
            <div class="btns">
                <button type="submit" class="btn btn-primary" id="btnRegister">Registrar</button>
                <a href="pet-detail.html?id=${idPet}">
                    <button type="button" class="btn btn-secondary">Cancelar</button>
                </a>
            </div>
        </div>
    `;

        const registerBtn = document.getElementById("btnRegister");
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const allergySendAPI = {
                allergen: document.getElementById("allergen").value.trim(),
                diagnostic_method: document.getElementById("diagnostic_method").value.trim(),
                symptoms: document.getElementById("symptoms").value.trim(),
                severity_level: document.getElementById("severity_level").value,
                emergency_treatment: document.getElementById("emergency_treatment").value.trim(),
                detection_date: document.getElementById("detection_date").value,
                id_pet: idPet,
            };

            const {
                allergen,
                diagnostic_method,
                symptoms,
                severity_level,
                emergency_treatment,
                detection_date,
            } = allergySendAPI;

            if (
                !allergen ||
                !diagnostic_method ||
                !symptoms ||
                !severity_level ||
                !emergency_treatment ||
                !detection_date
            ) {
                Swal.fire({
                    title: "Faltan campos obligatorios de la alergia.",
                    icon: "warning",
                    confirmButtonText: "Volver al registro",
                });
                return;
            }

            await sendAllergies(allergySendAPI);
        });

        //Función para conectar con el postAllergy de la API
        const sendAllergies = async (allergySendAPI) => {
            try {
                const postAllergyResponse = await fetch(urlNewAllergy, {
                    method: "POST",
                    body: JSON.stringify(allergySendAPI),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });

                if (postAllergyResponse.ok) {
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
                        text: `Error: ${postResponse.status}`,
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

    getNewAllergy();
});

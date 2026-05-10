const form = document.getElementById('formNuevaCita');
const params = new URLSearchParams(window.location.search);
const editId = params.get('edit');

// Si estamos en modo edición, cargamos los datos
if (editId) {
    document.querySelector('h2').innerText = "Editar Cita";
    document.querySelector('button[type="submit"]').innerHTML = 'Actualizar Cita <i class="bi bi-check-circle ms-2"></i>';
    
    fetch(`http://localhost:8080/appointments/${editId}`)
        .then(res => res.json())
        .then(result => {
            if (result.data) {
                const app = result.data;
                console.log("Datos cargados para editar:", app);
                // Rellenar campos del formulario
                if (app.date_appointment) {
                    // Convertimos la fecha a formato YYYY-MM-DD
                    const date = new Date(app.date_appointment);
                    form.date_appointment.value = date.toISOString().split('T')[0];
                }
                form.start_time.value = app.start_time || '';
                form.pet_id.value = app.pet_id || '';
                form.veterinarian_dni.value = app.veterinarian_dni || '';
                form.cleaner_dni.value = app.cleaner_dni || ''; 
                form.consult_id.value = app.consult_id || '';
                form.consult_room.value = app.consult_room || '';
                form.observations.value = app.observations || '';
            }
        })
        .catch(err => console.error("Error al cargar cita para editar:", err));
}

// Evento de envio del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dataCita = Object.fromEntries(formData.entries());

    // Valida el dia para evitar el sabado y domingo
    const [year, month, day] = dataCita.date_appointment.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);

    // Si el dia es sabado o domingo, muestra un mensaje de error
    if (fecha.getDay() === 0 || fecha.getDay() === 6) {
        alert('Vettion no abre los sabados ni domingos. Por favor, selecciona otro día.');
        return;
    }

    // Determinamos método y URL según si es edición o creación
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8080/appointments/${editId}` : 'http://localhost:8080/appointments';

    // Envio del formulario al backend 
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataCita)
        });

        // Si la respuesta es OK, se actualiza la cita
        if (response.ok) {
            alert(editId ? 'Cita actualizada con éxito.' : 'Cita agendada con éxito.');
            window.location.href = 'consults.html';
        } else {
            // Si la respuesta no es OK, se muestra un error
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            
            // Si hay errores de validación, se muestra un mensaje de error
            if (errorData.errors) {
                const msg = errorData.errors.map(err => `${err.path}: ${err.msg}`).join('\n');
                alert('Errores de validación:\n' + msg);
            } else {
                alert('Error del servidor: ' + (errorData.message || 'No se pudo procesar'));
            }
        }
    } catch (error) {
        console.error('Error de red o ejecución:', error);
        alert('❌ Error de conexión: ¿Está el servidor encendido en el puerto 8080?');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Definimos los elementos de la página
    const listContainer = document.getElementById('appointments-list');
    const countText = document.getElementById('count-text');
    const API_URL = 'http://localhost:8080/appointments';

    // Fetches de las citas desde la API
    async function fetchConsultas() {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            // Muestra un mensaje de error si la respuesta no es OK
            if (!response.ok) {
                throw new Error(result.message || 'Error en la petición al servidor');
            }

            // Si hay citas, se renderiza la tabla
            if (result.data && result.data.length > 0) {
                renderTable(result.data);
                actualizarEstadoSalas(result.data);
                countText.innerText = `${result.data.length} citas registradas en total`;
            // Si no hay citas, se muestra un mensaje
            } else {
                listContainer.innerHTML = '<div class="text-center p-5"><h4>No hay citas registradas</h4><p class="text-muted">Usa el botón "Nueva Cita" para empezar</p></div>';
                countText.innerText = `0 citas registradas`;
            }
        } catch (e) {
            console.error("Error en fetchConsultas:", e);
            listContainer.innerHTML = `<div class="alert alert-danger text-center">
                <strong>Error de conexión:</strong> ${e.message}<br>
                <small>¿Está el backend corriendo en el puerto 8080?</small>
            </div>`;
        }
    }

    // Renderiza la tabla de consultas
    function renderTable(appointments) {
        const rows = appointments.map((app, index) => `
        <!-- Cada fila de la tabla de consultas -->
            <tr class="align-middle" style="animation-delay: ${index * 0.1}s">
                <!-- Columna de ID -->
                <td class="fw-bold text-turquoise">#${app.id_appointment}</td>
                <!-- Columna de fecha -->
                <td><i class="bi bi-calendar-event me-2 text-muted"></i>${new Date(app.date_appointment).toLocaleDateString()}</td>
                <!-- Columna de hora -->
                <td><span class="badge bg-light text-dark border p-2 px-3"><i class="bi bi-clock me-1 text-turquoise"></i>${app.start_time.substring(0, 5)}</span></td>
                <!-- Columna de mascota -->
                <td><strong>Mascota: ${app.pet_id}</strong></td>
                <!-- Columna de sala -->
                <td><span class="fw-bold"><i class="bi bi-geo-alt me-1 text-turquoise"></i>${app.consult_room || 'Sala'}</span></td>
                <!-- Columna de observaciones -->
                <td class="text-muted small italic">${app.observations || '-'}</td>
                <!-- Columna de acciones -->
                <td>
                    <div class="d-flex gap-2">
                        <!-- Boton para editar -->
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${app.id_appointment}" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <!-- Boton para eliminar -->
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${app.id_appointment}" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        listContainer.innerHTML = `
            <table class="table">
                <!-- Encabezado de la tabla -->
                <thead>
                    <tr>
                        <th>ID</th><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Ubicación</th><th>Notas</th><th>Acciones</th>
                    </tr>
                </thead>
                <!-- Cuerpo de la tabla -->
                <tbody>${rows}</tbody>
            </table>`;

        // Asignar eventos a los botones después de renderizar

        // Botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteAppointment(btn.dataset.id));
        });

        // Botones de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = `citaForm.html?edit=${btn.dataset.id}`;
            });
        });
    }

    // Función para eliminar una cita
    async function deleteAppointment(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

        // Elimina la cita
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            // Si la respuesta es OK, se elimina la cita
            if (response.ok) {
                alert('Cita eliminada con éxito.');
                fetchConsultas(); // Recargar la tabla
            } else {
                // Si la respuesta no es OK, se muestra un error
                const errorData = await response.json();
                alert('Error al eliminar: ' + (errorData.message || 'No se pudo eliminar'));
            }
        } catch (error) {
            // Si hay un error de conexión, se muestra un mensaje de error
            console.error('Error al eliminar:', error);
            alert('Error de conexión al intentar eliminar.');
        }
    }
    
    // Actualiza el estado de las salas
    function actualizarEstadoSalas(appointments) {
    // Resetear todas a libre
    document.querySelectorAll('.status-badge').forEach(badge => {
        badge.innerText = "Libre";
        badge.className = "sala-badge status-badge bg-libre";
    });

    // Marcar como ocupadas las que tienen cita ahora
    appointments.forEach(app => {
        if (app.consult_room) {
            // Extrae el número del string
            const roomNumber = app.consult_room.replace(/\D/g, ""); 
            const badge = document.getElementById(`status-sala-${roomNumber}`);
            if (badge) {
                badge.innerText = "Ocupado";
                badge.className = "sala-badge status-badge bg-ocupado";
            }
        }
    });
}

    fetchConsultas();
});
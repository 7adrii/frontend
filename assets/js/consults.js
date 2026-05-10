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
            <tr class="align-middle" style="animation-delay: ${index * 0.1}s">
                <td class="fw-bold text-turquoise">#${app.id_appointment}</td>
                <td><i class="bi bi-calendar-event me-2 text-muted"></i>${new Date(app.date_appointment).toLocaleDateString()}</td>
                <td><span class="badge bg-light text-dark border p-2 px-3"><i class="bi bi-clock me-1 text-turquoise"></i>${app.start_time.substring(0, 5)}</span></td>
                <td><strong>Mascota: ${app.pet_id}</strong></td>
                <td><span class="fw-bold"><i class="bi bi-geo-alt me-1 text-turquoise"></i>${app.consult_room || 'Sala'}</span></td>
                <td class="text-muted small italic">${app.observations || '-'}</td>
            </tr>
        `).join('');
        
        listContainer.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Ubicación</th><th>Notas</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>`;
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
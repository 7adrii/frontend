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
            if (result.data && result.data.length > 0) {
                renderTable(result.data);
                actualizarEstadoSalas(result.data);
                countText.innerText = `${result.data.length} citas programadas hoy`;
            } else {
                listContainer.innerHTML = '<div class="text-center p-5"><h4>No hay citas registradas</h4></div>';
            }
        } catch (e) {
            listContainer.innerHTML = '<div class="alert alert-danger text-center">Error de conexión</div>';
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
        document.querySelectorAll('.status-badge').forEach(b => {
            b.innerText = "Libre"; b.className = "sala-badge status-badge bg-libre";
        });
        appointments.forEach(app => {
            const num = app.consult_room ? app.consult_room.match(/\d+/) : null;
            if (num) {
                const badge = document.getElementById(`status-sala-${num[0]}`);
                if (badge) {
                    badge.innerText = "Ocupado";
                    badge.className = "sala-badge status-badge bg-ocupado";
                }
            }
        });
    }

    fetchConsultas();
});
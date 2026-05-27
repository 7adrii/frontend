document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formNuevaCita');
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');

    //Función para cargar datos en los desplegables de la API
    async function cargarDesplegable(url, selectId, labelFn, valueFn, placeholder) {
        const select = document.getElementById(selectId);
        try {
            const res = await fetch(url);
            const result = await res.json();
            const items = result.data || [];

            select.innerHTML = `<option value="">${placeholder}</option>`;
            items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = valueFn(item);
                opt.textContent = labelFn(item);
                select.appendChild(opt);
            });
        } catch (err) {
            console.error(`Error cargando desplegable (${selectId}):`, err);
            select.innerHTML = `<option value="">Error loading data</option>`;
        }
    }

    // Cargamos los 5 desplegables en paralelo
    await Promise.all([
        // Mascotas
        cargarDesplegable(
            'http://localhost:8080/pets',
            'select-mascota',
            p => `${p.name_pet} — ${p.type}, ${p.breed || '-'} (Owner: ${p.owner_name} ${p.owner_surname})`,
            p => p.id,
            '— Select a patient —'
        ),
        // Veterinarios
        cargarDesplegable(
            'http://localhost:8080/veterinarians',
            'select-veterinario',
            v => `${v.surname} ${v.name}, ${v.speciality}, [${v.dni_veterinarian}]`,
            v => v.dni_veterinarian,
            '— Select a veterinarian —'
        ),
        // Personal de limpieza
        cargarDesplegable(
            'http://localhost:8080/cleaners',
            'select-limpieza',
            c => `${c.surname}, ${c.name}  [${c.dni_cleaner}]`,
            c => c.dni_cleaner,
            '— Select a cleaner —'
        ),
        // Tipos de servicio
        cargarDesplegable(
            'http://localhost:8080/services',
            'select-servicio',
            c => `${c.name} — ${c.service_type} (${c.duration} min, ${c.base_price}€)`,
            c => c.id_service,
            '— Select a service —'
        ),

        // Salas
        cargarDesplegable(
            'http://localhost:8080/rooms',
            'select-sala',
            r => `${r.name} — ${r.type}`,
            r => r.room_code,
            '— Select a room —'
        )
    ]);

    // Carga de datos si es un id de edicion
    if (editId) {
        document.querySelector('h2').innerText = 'Editar Cita';
        document.querySelector('button[type="submit"]').innerHTML = 'Update appointment <i class="bi bi-check-circle ms-2"></i>';

        try {
            const res = await fetch(`http://localhost:8080/appointments/${editId}`);
            const result = await res.json();

            // Si hay datos de la cita, rellenamos el formulario
            if (result.data) {
                const app = result.data;
                console.log('Datos cargados para editar:', app);

                // Fecha
                if (app.date_appointment) {
                    const date = new Date(app.date_appointment);
                    form.date_appointment.value = date.toISOString().split('T')[0];
                }

                // Hora
                form.start_time.value = app.start_time || '';

                // Desplegables: asignar el value que corresponde al dato guardado
                document.getElementById('select-mascota').value = app.pet_id || '';
                document.getElementById('select-veterinario').value = app.veterinarian_dni || '';
                document.getElementById('select-servicio').value = app.service_id || '';

                // cleaner_dni viene del servicio de limpieza asociado a esta cita
                // Lo buscamos consultando el clean_service
                try {
                    const csRes = await fetch(`http://localhost:8080/clean_services`);
                    const csResult = await csRes.json();
                    const csData = csResult.data || [];
                    const cs = csData.find(s => s.appointment_id == editId);
                    if (cs) {
                        document.getElementById('select-limpieza').value = cs.cleaner_dni || '';
                    }
                } catch (e) {
                    console.warn('No se pudo cargar el personal de limpieza de la cita:', e);
                }

                form.code_room.value = app.code_room || '';
                form.observations.value = app.observations || '';
            }
        } catch (err) {
            console.error('Error al cargar cita para editar:', err);
        }
    }

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const dataCita = Object.fromEntries(formData.entries());

        // Convertir a número los campos que el backend espera como int
        dataCita.pet_id = parseInt(dataCita.pet_id, 10);
        dataCita.service_id = parseInt(dataCita.service_id, 10);

        // Validar que no sea fin de semana
        const [year, month, day] = dataCita.date_appointment.split('-').map(Number);
        const fecha = new Date(year, month - 1, day);

        // Control de fin de semana
        if (fecha.getDay() === 0 || fecha.getDay() === 6) {
            Swal.fire({
                title: "Vettion is closed on weekends",
                text:"The clinic is closed on saturdays and sundays. Please select another day.",
                confirmButtonText: "Go back to edition",
                icon: 'error',
                iconColor: '#9f7217',
                confirmButtonText: 'Edit',
                confirmButtonColor: '#2a1418',
            });
            return;
        }

        // Ajusta el método y la URL
        const method = editId ? 'PUT' : 'POST';
        const url = editId
            ? `http://localhost:8080/appointments/${editId}`
            : 'http://localhost:8080/appointments';

        // Envío de la solicitud
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataCita)
            });

            // Respuesta del servidor
            if (response.ok) {
                await Swal.fire({
                    title: '¡Appointment scheduled!',
                    text: 'The appointment has been added to the register',
                    icon: 'success',
                    iconColor: '#59b2b0',
                    confirmButtonText: 'Accept',
                    confirmButtonColor: '#2a1418'
                });
                window.location.href = 'clinic-historic.html';
            } else {
                // Manejo de errores del servidor
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);

                const reportDiv = document.getElementById('itErrorReport');
                if (reportDiv) {
                    reportDiv.innerHTML = `
                        <div>
                            URL: ${url}<br>
                            Status Code: ${response.status}
                        </div>
                    `;
                }

                if (response.status === 422) {
                    Swal.fire({
                        title: 'Error',
                        text: errorData.reason || 'Modo pruebas denegado',
                        icon: 'error',
                        iconColor: '#9f7217',
                        confirmButtonText: 'Edit',
                        confirmButtonColor: '#2a1418',
                    });
                } else if (errorData.errors) {
                    // Muestra los errores de validación
                    const msg = errorData.errors.map(err => `${err.path}: ${err.msg}`).join('\n');
                    Swal.fire({
                        title: 'Error in validation',
                        text: msg,
                        icon: 'error',
                        iconColor: '#9f7217',
                        confirmButtonText: 'Edit',
                        confirmButtonColor: '#2a1418',
                    });
                } else {
                    Swal.fire({
                        title: 'Server error',
                        text: 'Server error: ' + (errorData.message || 'Could not process'),
                        icon: 'error',
                        iconColor: '#9f7217',
                        confirmButtonText: 'Edit',
                        confirmButtonColor: '#2a1418',
                    });
                }
            }
        } catch (error) {
            console.error('Error de red o ejecución:', error);
            Swal.fire({
                title: 'Conection',
                text: 'Connection error: Is the server running on port 8080?',
                icon: 'error',
                iconColor: '#9f7217',
                confirmButtonText: 'Edit',
                confirmButtonColor: '#2a1418',
            });
        }
    });
});
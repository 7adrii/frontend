document.getElementById('formNuevaCita').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dataCita = Object.fromEntries(formData.entries());

    // Valida el dia para evitar el sabado y domingo
    const [year, month, day] = dataCita.date_appointment.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    
    if (fecha.getDay() === 0 || fecha.getDay() === 6) {
        alert('Vettion no abre los sabados ni domingos. Por favor, selecciona otro día.');
        return;
    }

    // Envio del formulario al backend 
    try {
        const response = await fetch('http://localhost:8080/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataCita)
        });

        if (response.ok) {
            alert('✅ Cita agendada con éxito.');
            window.location.href = 'consults.html';
        } else {
            const errorData = await response.json();
            alert('❌ Error del servidor: ' + (errorData.message || 'No se pudo crear'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión: ¿Está el servidor encendido en el puerto 8080?');
    }
});
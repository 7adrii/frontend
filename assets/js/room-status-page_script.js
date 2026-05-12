// Declaramos constantes con las rutas de la API.
const ENDPOINTS = {
  rooms: "http://localhost:8080/rooms",
  appointments: "http://localhost:8080/appointments",
  pets: "http://localhost:8080/pets",
  services: "http://localhost:8080/services",
};

// Seleccionamos los elementos del DOM que vamos a usar.
const tableBody = document.getElementById("rooms-table-body");
const totalRoomsElement = document.getElementById("total-rooms");
const freeRoomsElement = document.getElementById("free-rooms");
const busyRoomsElement = document.getElementById("busy-rooms");
const errorElement = document.getElementById("rooms-error");

// Función para convertir el tiempo a minutos.
const toMinutes = (timeValue) => {
  if (!timeValue || typeof timeValue !== "string") {
    return null;
  }
  // Convertimos el tiempo a minutos.
  const [hours, minutes, seconds] = timeValue
    .split(":")
    .map((value) => Number(value));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  // Multiplicamos las horas por 60 y sumamos los minutos y segundos para obtener el tiempo total en minutos.
  return hours * 60 + minutes + (seconds || 0) / 60;
};

// Función para comprobar si la cita es actual.
const isCurrentAppointment = (appointment, now) => {
  if (!appointment || !appointment.date_appointment) {
    return false;
  }

  // Comprueba si la fecha de la cita es igual a la fecha actual.
  const today = now.toISOString().split("T")[0];
  if (appointment.date_appointment !== today) {
    return false;
  }

  // Convierte la hora de inicio y fin de la cita a minutos.
  const startMinutes = toMinutes(appointment.start_time);
  const endMinutes = toMinutes(appointment.end_time);
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  // Comprueba si la hora está entre la hora de inicio y la hora de fin de la cita.
  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

// Función para obtener datos de la API.
const fetchData = async (url) => {
  const response = await fetch(url);

  // Comprueba si la respuesta es exitosa.
  if (!response.ok) {
    throw new Error(`Error ${response.status} while requesting ${url}`);
  }

  // Convierte la respuesta a JSON.
  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
};

// Función para construir un mapa a partir de una lista.
const buildMap = (list, keyField, valueField, alternativeKeyField) => {
  const map = new Map();

  // Recorre la lista y crea un mapa con la clave y el valor.
  list.forEach((item) => {
    const key = item[keyField] ?? item[alternativeKeyField];
    if (key !== undefined && key !== null) {
      map.set(String(key), item[valueField] || "Sin nombre");
    }
  });

  return map;
};

// Función para crear una etiqueta de estado.
const createStatusBadge = (isBusy) => {
  // Si esta ocupada se muestra una etiqueta de color naranja.
  if (isBusy) {
    return '<span class="badge text-bg-warning">Ocupada</span>';
  }

  // Si esta libre se muestra una etiqueta de color verde.
  return '<span class="badge text-bg-success">Libre</span>';
};

// Función para mostrar un error.
const setError = (message) => {
  errorElement.hidden = false;
  errorElement.textContent = message;
};

// Función para limpiar el error.
const clearError = () => {
  errorElement.hidden = true;
  errorElement.textContent = "";
};

// Función para obtener los detalles de una cita.
const getAppointmentDetails = (appointment, petMap, serviceMap) => {
  // Obtiene el nombre del paciente.
  const patientName =
    petMap.get(String(appointment.pet_id)) ||
    `Paciente #${appointment.pet_id}`;
  
  // Obtiene el nombre del servicio.
  const serviceName =
    serviceMap.get(String(appointment.service_id)) ||
    `Servicio #${appointment.service_id}`;

  // Obtiene la fecha y hora de la cita.
  const schedule = `${String(appointment.start_time).slice(0, 5)} - ${String(appointment.end_time).slice(0, 5)}`;

  // Devuelve los detalles de la cita.
  return { patientName, serviceName, schedule };
};

// Función para renderizar las filas de la tabla.
const renderRows = (rooms, appointments, petMap, serviceMap) => {
  const now = new Date();

  // Ordena las salas por código de sala.
  const orderedRooms = [...rooms].sort((a, b) =>
    String(a.room_code).localeCompare(String(b.room_code)),
  );

  // Inicializa el contador de salas libres y ocupadas.
  let freeRooms = 0;
  let busyRooms = 0;

  // Recorre las salas y crea las filas de la tabla.
  const rowsHtml = orderedRooms.map((room) => {
    // Filtra las citas activas por sala.
    const activeAppointments = appointments.filter(
      (appointment) =>
        appointment.code_room === room.room_code &&
        isCurrentAppointment(appointment, now),
    );

    // Ordena las citas activas por hora de inicio.
    const currentAppointment = activeAppointments.sort(
      (a, b) => (toMinutes(a.start_time) || 0) - (toMinutes(b.start_time) || 0),
    )[0];

    // Comprueba si la sala esta ocupada.
    const isBusy = Boolean(currentAppointment);

    if (isBusy) {
      // Si esta ocupada, incrementa el contador de salas ocupadas.
      busyRooms += 1;
    } else {
      // Si esta libre, incrementa el contador de salas libres.
      freeRooms += 1;
    }

    // Obtiene los detalles de la cita.
    const { patientName, serviceName, schedule } = isBusy
      ? getAppointmentDetails(currentAppointment, petMap, serviceMap)
      : { patientName: "-", serviceName: "-", schedule: "-" };

    // Devuelve las filas de la tabla.
    return `
      <tr>
        <td><strong>${room.room_code}</strong> - ${room.name}</td>
        <td>${room.type}</td>
        <td>${room.location}</td>
        <td>${createStatusBadge(isBusy)}</td>
        <td>${patientName}</td>
        <td>${serviceName}</td>
        <td>${schedule}</td>
      </tr>
    `;
  });

  // Inserta las filas en la tabla.
  tableBody.innerHTML =
    rowsHtml.length > 0
      ? rowsHtml.join("")
      : '<tr><td colspan="7" class="text-center py-4">No hay salas registradas.</td></tr>';

  // Actualiza el contador de salas totales.
  totalRoomsElement.textContent = String(orderedRooms.length);
  freeRoomsElement.textContent = String(freeRooms);
  busyRoomsElement.textContent = String(busyRooms);
};

// Función para cargar el estado de las salas.
const loadRoomStatus = async () => {

  try {
    clearError();

    // Carga los datos de las salas, citas, pacientes y servicios.
    const [rooms, appointments, pets, services] = await Promise.all([
      fetchData(ENDPOINTS.rooms),
      fetchData(ENDPOINTS.appointments),
      fetchData(ENDPOINTS.pets),
      fetchData(ENDPOINTS.services),
    ]);

    // Construye un mapa a partir de la lista de pacientes y de servicios.
    const petMap = buildMap(pets, "id", "name_pet", "id_pet");
    const serviceMap = buildMap(services, "id_service", "name", "id");

    // Renderiza las filas de la tabla.
    renderRows(rooms, appointments, petMap, serviceMap);
    
  } catch (error) {
    // Muestra un error si no se han podido cargar los datos.
    setError(
      "No se han podido cargar las salas. Comprueba que el back-end está iniciado en el puerto 8080.",
    );
    // Inserta una fila de error en la tabla.
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">Error cargando datos.</td>
      </tr>
    `;
    console.error(error);
  }
};

// Actualiza el estado de las salas cada minuto.
setInterval(loadRoomStatus, 60000);
loadRoomStatus();

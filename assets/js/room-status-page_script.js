const ENDPOINTS = {
  rooms: "http://localhost:8080/rooms",
  appointments: "http://localhost:8080/appointments",
  pets: "http://localhost:8080/pets",
  services: "http://localhost:8080/services",
};

const tableBody = document.getElementById("rooms-table-body");
const totalRoomsElement = document.getElementById("total-rooms");
const freeRoomsElement = document.getElementById("free-rooms");
const busyRoomsElement = document.getElementById("busy-rooms");
const errorElement = document.getElementById("rooms-error");

const toMinutes = (timeValue) => {
  if (!timeValue || typeof timeValue !== "string") {
    return null;
  }

  const [hours, minutes, seconds] = timeValue
    .split(":")
    .map((value) => Number(value));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes + (seconds || 0) / 60;
};

const isCurrentAppointment = (appointment, now) => {
  if (!appointment || !appointment.date_appointment) {
    return false;
  }

  const today = now.toISOString().split("T")[0];
  if (appointment.date_appointment !== today) {
    return false;
  }

  const startMinutes = toMinutes(appointment.start_time);
  const endMinutes = toMinutes(appointment.end_time);
  const nowMinutes =
    now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

const fetchData = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status} while requesting ${url}`);
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
};

const buildMap = (list, keyField, valueField, alternativeKeyField) => {
  const map = new Map();

  list.forEach((item) => {
    const key = item[keyField] ?? item[alternativeKeyField];
    if (key !== undefined && key !== null) {
      map.set(String(key), item[valueField] || "Sin nombre");
    }
  });

  return map;
};

const createStatusBadge = (isBusy) => {
  if (isBusy) {
    return '<span class="badge text-bg-warning">Ocupada</span>';
  }

  return '<span class="badge text-bg-success">Libre</span>';
};

const setError = (message) => {
  errorElement.hidden = false;
  errorElement.textContent = message;
};

const clearError = () => {
  errorElement.hidden = true;
  errorElement.textContent = "";
};
 
const getAppointmentDetails = (appointment, petMap, serviceMap) => {
  const patientName =
    petMap.get(String(appointment.pet_id)) ||
    `Paciente #${appointment.pet_id}`;
  const serviceName =
    serviceMap.get(String(appointment.service_id)) ||
    `Servicio #${appointment.service_id}`;
  const schedule = `${String(appointment.start_time).slice(0, 5)} - ${String(appointment.end_time).slice(0, 5)}`;

  return { patientName, serviceName, schedule };
};

const renderRows = (rooms, appointments, petMap, serviceMap) => {
  const now = new Date();

  const orderedRooms = [...rooms].sort((a, b) =>
    String(a.room_code).localeCompare(String(b.room_code)),
  );

  let freeRooms = 0;
  let busyRooms = 0;

  const rowsHtml = orderedRooms.map((room) => {
    const activeAppointments = appointments.filter(
      (appointment) =>
        appointment.code_room === room.room_code &&
        isCurrentAppointment(appointment, now),
    );

    const currentAppointment = activeAppointments.sort(
      (a, b) => (toMinutes(a.start_time) || 0) - (toMinutes(b.start_time) || 0),
    )[0];

    const isBusy = Boolean(currentAppointment);

    if (isBusy) {
      busyRooms += 1;
    } else {
      freeRooms += 1;
    }

    const { patientName, serviceName, schedule } = isBusy
      ? getAppointmentDetails(currentAppointment, petMap, serviceMap)
      : { patientName: "-", serviceName: "-", schedule: "-" };

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

  tableBody.innerHTML =
    rowsHtml.length > 0
      ? rowsHtml.join("")
      : '<tr><td colspan="7" class="text-center py-4">No hay salas registradas.</td></tr>';

  totalRoomsElement.textContent = String(orderedRooms.length);
  freeRoomsElement.textContent = String(freeRooms);
  busyRoomsElement.textContent = String(busyRooms);
};

const loadRoomStatus = async () => {

  try {
    clearError();

    const [rooms, appointments, pets, services] = await Promise.all([
      fetchData(ENDPOINTS.rooms),
      fetchData(ENDPOINTS.appointments),
      fetchData(ENDPOINTS.pets),
      fetchData(ENDPOINTS.services),
    ]);

    const petMap = buildMap(pets, "id", "name_pet", "id_pet");
    const serviceMap = buildMap(services, "id_service", "name", "id");

    renderRows(rooms, appointments, petMap, serviceMap);
  } catch (error) {
    setError(
      "No se han podido cargar las salas. Comprueba que el back-end está iniciado en el puerto 8080.",
    );
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">Error cargando datos.</td>
      </tr>
    `;
    console.error(error);
  }
};

setInterval(loadRoomStatus, 60000);
loadRoomStatus();

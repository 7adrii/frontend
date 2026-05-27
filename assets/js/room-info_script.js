const ENDPOINT_BASE = "http://localhost:8080";

const roomTitle = document.getElementById("room-title");
const dateInput = document.getElementById("date-input");
const loadBtn = document.getElementById("load-day");
const appointmentsList = document.getElementById("appointments-list");
const cleaningList = document.getElementById("cleaning-list");
const errorElement = document.getElementById("room-info-error");

const qs = new URLSearchParams(window.location.search);
const roomCode = qs.get("room");

const today = new Date().toISOString().split("T")[0];
if (dateInput) dateInput.value = today;

const urlRoom = `http://localhost:8080/rooms`;
let roomName;

const getRoomsData = async () => {
  try {
    const room = await fetch(urlRoom);
    const roomData = await room.json();

    createRoomName(roomData.data);
  } catch (error) {
    console.error(error);
  }
};

const createRoomName = (roomData) => {
  const room = roomData.find((r) => r.room_code == roomCode);
  roomName = room.name;

  if (roomTitle) roomTitle.textContent = `Room ${roomCode || ""} - ${roomName}`;
  document.title = `Vettion - ${roomName}`;
};

const setError = (msg) => {
  if (errorElement) {
    errorElement.hidden = false;
    errorElement.textContent = msg;
  }
};
const clearError = () => {
  if (errorElement) {
    errorElement.hidden = true;
    errorElement.textContent = "";
  }
};

const fetchDayInfo = async (room, date) => {
  const url = `${ENDPOINT_BASE}/rooms/${encodeURIComponent(room)}/day?date=${encodeURIComponent(date)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching room day info");
  const json = await res.json();
  return json.data || {};
};

const urlCleaners = `http://localhost:8080/cleaners`;
const fetchCleaners = async () => {
  try {
    const res = await fetch(urlCleaners);
    if (!res.ok) throw new Error("Error fetching cleaners");
    const json = await res.json();
    return json.data || json || [];
  } catch (err) {
    console.error("Cleaners could not be loaded:", err);
    return [];
  }
};

const renderAppointments = (appointments) => {
  if (!appointments || appointments.length === 0) {
    appointmentsList.innerHTML = `<ul class="list-group">
          <li class="list-group-item p-0">
            <div class="bg-dark p-2 rounded-top-2 d-flex justify-content-between">
              <h6 class="text-light">Appointments</h6>
              <h6 class="text-light">Total: ${appointments.length}</h6>
            </div>

            <div class="p-3 text-center justify-content-center">
              <h6>There are no registers of appointments in this room</h6>
            </div>
        </li>
      </ul>
      `;
    return;
  }

  const tableRows = appointments
    .map((a) => {
      const owner = a.name_owner
        ? `${a.name_owner} ${a.owner_surname || ""}`.trim()
        : "-";
      const veterinarian = a.veterinarian_name
        ? `${a.veterinarian_name} ${a.veterinarian_surname || ""}`.trim()
        : "-";
      const service = a.service_name ? `${a.service_name || ""}`.trim() : "-";
      const pet = a.name_pet || "-";
      const start = String(a.start_time).slice(0, 5);
      const end = String(a.end_time || "").slice(0, 5) || "-";

      return `
      <tr class="line-hover">
        <td scope="row">${pet}</td>
        <td scope="row">${start}</td>
        <td scope="row" class="d-none d-md-table-cell">${end}</td>
        <td scope="row" class="d-none d-md-table-cell">${owner}</td>
        <td scope="row">${service}</td>
        <td scope="row" class="d-none d-md-table-cell">${veterinarian}</td>
        <td scope="row"><a class="text-dark text-decoration-none" href="pet-detail.html?id=${a.pet_id}"><i class="fa-solid fa-eye"></i></a></td>
      </tr>
    `;
    })
    .join("");

  appointmentsList.innerHTML = `
    <div class="border border-2 rounded shadow-sm overflow-hidden">
      <ul class="list-group">
          <li class="list-group-item p-0">
            <div class="bg-dark p-2 rounded-top-2 d-flex justify-content-between">
              <h6 class="text-light">Appointments</h6>
              <h6 class="text-light">Total: ${appointments.length}</h6>
            </div>
        </li>
      </ul>

      <table class="table table-striped m-0">
        <thead>
          <tr>
            <th scope="col">Patient</th>
            <th scope="col">Start hour</th>
            <th scope="col" class="d-none d-md-table-cell">End hour</th>
            <th scope="col" class="d-none d-md-table-cell">Owner</th>
            <th scope="col">Service</th>
            <th scope="col" class="d-none d-md-table-cell">Veterinarian</th>
            <th scope="col" class="d-none d-md-table-cell"></th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
};

const renderCleanServices = (cleanServices, cleanersList) => {
  if (!cleanServices || cleanServices.length === 0) {
    cleaningList.innerHTML = `
    <ul class="list-group">
          <li class="list-group-item p-0">
            <div class="bg-dark p-2 rounded-top-2 d-flex justify-content-between">
              <h6 class="text-light">Clean services</h6>
              <h6 class="text-light">Total: ${cleanServices.length}</h6>
            </div>

            <div class="p-3 text-center justify-content-center">
              <h6>There are no registers of clean services in this room</h6>
            </div>
        </li>
      </ul>`;
    return;
  }

  const tableRowsClean = cleanServices
    .map((c) => {
      const start = String(c.start_time).slice(0, 5);
      const end = String(c.end_time || "").slice(0, 5) || "-";

      //Sacamos el nombre del limpiador y su contacto
      const cleaner = cleanersList.find(
        (cl) => cl.cleaner_dni === c.cleaner_dni,
      );
      console.log(cleaner);
      const cleanerName = cleaner.name;
      const cleanerSurname = cleaner.surname;
      const fullName = cleanerSurname + " " + cleanerName;
      const cleanerPhone = cleaner.phone;

      return `
      <tr class="line-hover">
        <td scope="col">${start}</td>
        <td scope="col" class="d-none d-md-table-cell">${end}</td>
        <td scope="col">${fullName}</td>
        <td scope="col">${cleanerPhone}</td>
        <td scope="col" class="d-none d-md-table-cell">${c.observations || "There are no observations"}</td>
      </tr>
    `;
    })
    .join("");

  cleaningList.innerHTML = `
    <div class="border border-2 rounded shadow-sm overflow-hidden">
      <ul class="list-group">
          <li class="list-group-item p-0">
            <div class="bg-dark p-2 rounded-top-2 d-flex justify-content-between">
              <h6 class="text-light">Clean services</h6>
              <h6 class="text-light">Total: ${cleanServices.length}</h6>
            </div>
        </li>
      </ul>

      <table class="table table-striped m-0">
        <thead>
          <tr>
            <th scope="col">Start hour</th>
            <th scope="col" class="d-none d-md-table-cell">End hour</th>
            <th scope="col">Cleaner</th>
            <th scope="col">Contact</th>
            <th scope="col" class="d-none d-md-table-cell">Observations</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsClean}
        </tbody>
      </table>
    </div>
  `;
};

const load = async () => {
  try {
    clearError();
    if (!roomCode) {
      setError("Room code not especified in the URL.");
      return;
    }
    const date = dateInput.value || today;
    const [data, cleanersList, ownersList] = await Promise.all([
      fetchDayInfo(roomCode, date),
      fetchCleaners(),
    ]);
    console.log(data.appointments);
    renderAppointments(data.appointments || []);
    renderCleanServices(data.cleanServices || [], cleanersList);
  } catch (err) {
    console.error(err);
    setError("Error loading information of the room.");
  }
};

if (loadBtn) loadBtn.addEventListener("click", load);
// Carga inicial
load();

getRoomsData();

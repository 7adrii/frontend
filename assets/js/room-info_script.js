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
if (roomTitle) roomTitle.textContent = `Sala ${roomCode || ""}`;

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

const renderAppointments = (appointments) => {
  if (!appointments || appointments.length === 0) {
    appointmentsList.innerHTML =
      `<ul class="list-group">
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

  const tableRows = appointments.map((a) => {
    const owner = a.name_owner
      ? `${a.name_owner} ${a.owner_surname || ""}`.trim()
      : "-";
    const pet = a.name_pet || "-";
    const start = String(a.start_time).slice(0, 5);
    const end = String(a.end_time || "").slice(0, 5) || "-";
    return `
      <tr>
        <td scope="row">${pet}</td>
        <td scope="row">${start}</td>
        <td scope="row">${end}</td>
        <td scope="row"></td>
        <td scope="row" class="d-none d-md-table-cell"></td>
        <td scope="row" class="d-none d-md-table-cell"></td>
      </tr>
    `;
  }).join("");

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
            <th scope="col">End hour</th>
            <th scope="col">Owner</th>
            <th scope="col" class="d-none d-md-table-cell">Service</th>
            <th scope="col" class="d-none d-md-table-cell">Veterinarian</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
};

const renderCleanServices = (cleanServices) => {
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

  const tableRowsClean = cleanServices.map((c) => {
    const start = String(c.start_time).slice(0, 5);
    const end = String(c.end_time || "").slice(0, 5) || "-";
    return `
      <tr>
        <td scope="row">${start}</td>
        <td scope="row">${end}</td>
        <td scope="row">${c.cleaner_dni}</td>
        <td scope="row"></td>
        <td scope="row" class="d-none d-md-table-cell"></td>
        <td scope="row" class="d-none d-md-table-cell"></td>
      </tr>
    `;
  }).join("");

  cleaningList.innerHTML = `
    <div class="border border-2 rounded shadow-sm overflow-hidden">
      <ul class="list-group">
          <li class="list-group-item p-0">
            <div class="bg-dark p-2 rounded-top-2 d-flex justify-content-between">
              <h6 class="text-light">Appointments</h6>
              <h6 class="text-light">Total: ${cleanServices.length}</h6>
            </div>
        </li>
      </ul>

      <table class="table table-striped m-0">
        <thead>
          <tr>
            <th scope="col">Start hour</th>
            <th scope="col">End hour</th>
            <th scope="col">Cleaner</th>
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
      setError("Código de sala no especificado en la URL.");
      return;
    }
    const date = dateInput.value || today;
    const data = await fetchDayInfo(roomCode, date);
    renderAppointments(data.appointments || []);
    renderCleanServices(data.cleanServices || []);
  } catch (err) {
    console.error(err);
    setError("Error cargando información de la sala.");
  }
};

if (loadBtn) loadBtn.addEventListener("click", load);
// Carga inicial
load();

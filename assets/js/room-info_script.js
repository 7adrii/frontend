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
      '<p class="text-muted">There are no appointments for the selected date.</p>';
    return;
  }

  const items = appointments.map((a) => {
    const owner = a.name_owner
      ? `${a.name_owner} ${a.owner_surname || ""}`.trim()
      : "-";
    const pet = a.name_pet || "-";
    const start = String(a.start_time).slice(0, 5);
    const end = String(a.end_time || "").slice(0, 5) || "-";
    return `
      <div class="card mb-2">
        <div class="card-body">
          <h5 class="card-title">${start} - ${end}</h5>
          <p class="card-text"><strong>Pacient:</strong> ${pet} <br/><strong>Owner:</strong> ${owner}</p>
        </div>
      </div>
    `;
  });

  appointmentsList.innerHTML = items.join("");
};

const renderCleanServices = (cleanServices) => {
  if (!cleanServices || cleanServices.length === 0) {
    cleaningList.innerHTML =
      '<p class="text-muted">There are no clean services for the selected date</p>';
    return;
  }

  const items = cleanServices.map((c) => {
    const start = String(c.start_time).slice(0, 5);
    const end = String(c.end_time || "").slice(0, 5) || "-";
    return `
      <div class="card mb-2">
        <div class="card-body">
          <h5 class="card-title">${start} - ${end}</h5>
          <p class="card-text">Associated with appointment: ${c.appointment_id || "-"} </p>
        </div>
      </div>
    `;
  });

  cleaningList.innerHTML = items.join("");
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

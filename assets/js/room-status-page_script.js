// Script para mostrar la lista de salas con diseño de tarjetas (grid)
const ENDPOINTS = {
  rooms: "http://54.85.141.17:8080/rooms",
};

const roomsContainer = document.getElementById("rooms-container");
const totalRoomsElement = document.getElementById("total-rooms");
const errorElement = document.getElementById("rooms-error");

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

const fetchRooms = async () => {
  const res = await fetch(ENDPOINTS.rooms);
  if (!res.ok) throw new Error("Error fetching rooms");
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
};

const getTypeIcon = (type) => {
  const icons = {
    General: "bi-door-closed",
    Cirugía: "bi-bandaid",
    Emergencia: "bi-exclamation-triangle",
    Recuperación: "bi-heart-pulse",
  };
  return icons[type] || "bi-door-closed";
};

const renderRoomsList = (rooms) => {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    roomsContainer.innerHTML =
      '<div class="col-12 text-center py-5"><p class="text-muted">No hay salas registradas.</p></div>';
    totalRoomsElement.textContent = "0";
    return;
  }

  totalRoomsElement.textContent = String(rooms.length);

  const cards = rooms.map((room) => {
    const infoUrl = `room-info.html?room=${encodeURIComponent(room.room_code)}`;
    const typeIcon = getTypeIcon(room.type);

    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 shadow-sm room-card">
          <div class="card-header bg-dark text-light d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <i class="bi ${typeIcon} text-light fs-5"></i>
              <h5 class="mb-0">${room.name}</h5>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <small class="text-muted d-block mb-2">
                <i class="bi bi-tag"></i> Type: <strong>${room.type}</strong>
              </small>
              <small class="text-muted d-block mb-2">
                <i class="bi bi-geo-alt"></i> Location: <strong>${room.location}</strong>
              </small>
            </div>
          </div>
          <div class="card-footer bg-white border-top">
            <a href="${infoUrl}" class="btn btn-dark w-100">
              <i class="bi bi-info-circle"></i> Ver información
            </a>
          </div>
        </div>
      </div>
    `;
  });

  roomsContainer.innerHTML = cards.join("");
};

const init = async () => {
  try {
    clearError();
    const rooms = await fetchRooms();
    renderRoomsList(rooms);
  } catch (err) {
    console.error(err);
    setError(
      "No se han podido cargar las salas. Comprueba que el back-end está iniciado en http://54.85.141.17:8080",
    );
    roomsContainer.innerHTML =
      '<div class="col-12 text-center py-5"><p class="text-danger"><i class="bi bi-exclamation-triangle"></i> Error loading data.</p></div>';
  }
};

init();

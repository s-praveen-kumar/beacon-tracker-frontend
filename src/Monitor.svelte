<script>
  export let SERVER;
  import L from "leaflet";
  import { onMount } from "svelte";
  import VehicleLi from "./VehicleLi.svelte";
  import { formatDateTime, formatRelativeTime } from "./TimeUtils";
  const getOptions = {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  let map,
    checkpoints,
    routes,
    markers = new Map(),
    markersDisplay,
    routeLine;
  let vehicles, currentVehicle;

  const vehiclePromise = fetchVehicles();

  onMount(() => {
    let options = {
      center: [0, 0],
      zoom: 2,
    };
    map = L.map("monitorMap", options);
    map.addLayer(
      L.tileLayer("https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: wmflabs | Routing: <a href="https://routing.openstreetmap.de">OSRM</a>',
      })
    );
    getCheckPoints();
    getRoutes();
  });

  async function getCheckPoints() {
    try {
      const data = await fetch(SERVER + "/cp/get", getOptions);
      const receivedCp = await data.json();
      if (receivedCp.success) {
        checkpoints = new Map(receivedCp.checkpoints.map((i) => [i._id, i]));
        displayCheckpoints();
      } else {
        console.log(receivedCp.msg);
      }
    } catch (err) {
      console.log(err);
      //Display Errors
    }
  }

  async function getRoutes() {
    try {
      const data = await fetch(SERVER + "/route/get", getOptions);
      const receivedRoutes = await data.json();
      if (receivedRoutes.success) {
        routes = new Map(receivedRoutes.routes.map((i) => [i._id, i]));
      } else {
        console.log(receivedRoutes.msg);
      }
    } catch (err) {
      console.log(err);
      //Display Errors
    }
  }

  function displayCheckpoints() {
    const markerArray = [];
    if (!checkpoints) return;
    for (let [id, cp] of checkpoints.entries()) {
      let marker = L.marker([cp.location.lat, cp.location.lon]);
      marker
        .bindPopup(cp.name, {
          closeOnClick: false,
          autoClose: false,
        })
        .on("mouseover", (ev) => {
          ev.target.getPopup().bringToFront();
        });
      markers.set(cp._id, marker);
      markerArray.push(marker);
    }
    markersDisplay = L.featureGroup(markerArray);
    map.fitBounds(markersDisplay.getBounds().pad(0.05));
    map.addLayer(markersDisplay);
  }

  async function fetchVehicles() {
    const data = await fetch(SERVER + "/active", getOptions);
    const res = await data.json();
    if (!res.success) throw Error("Error getting vehicles");
    vehicles = res.vehicles;
    vehicles = new Map(res.vehicles.map((i) => [i.beaconId, i]));
    return res.vehicles;
  }

  function renderRoute(route) {
    if (routeLine) map.removeLayer(routeLine);
    routeLine = L.geoJSON(route.geometry);
    map.addLayer(routeLine);
  }

  async function vehicleSelected(id) {
    currentVehicle = vehicles.get(id);
    markersDisplay.clearLayers();
    const route = routes.get(currentVehicle.routeId).route;
    renderRoute(route);
    for (let [index, cpId] of currentVehicle.routeSpec.entries()) {
      const cp = checkpoints.get(cpId);
      markersDisplay.addLayer(markers.get(cpId));
      if (index < currentVehicle.journey.length) {
        if (cpId == currentVehicle.journey[index].checkpoint) {
          markers
            .get(cpId)
            .setPopupContent(
              cp.name +
                "<br><span class='text-success'>Reached " +
                formatRelativeTime(currentVehicle.journey[index].reachedTime) +
                "</span>"
            );
        } else {
          let expectedTime =
            new Date(currentVehicle.journey[index - 1].reachedTime).getTime() +
            route.legs[index - 1].duration * 1000;
          markers
            .get(cpId)
            .setPopupContent(
              `${
                cp.name
              }<br><span class='text-warning'>Expected ${formatRelativeTime(
                expectedTime
              )}</span>`
            );
          markersDisplay.addLayer(
            markers.get(currentVehicle.journey[index].checkpoint)
          );
          markers
            .get(currentVehicle.journey[index].checkpoint)
            .setPopupContent(
              `${
                checkpoints.get(currentVehicle.journey[index].checkpoint).name
              }<br><span class='text-danger'>Restricted Checkpoint<br>Seen ${formatRelativeTime(
                currentVehicle.journey[index].reachedTime
              )}</span>`
            );
          markers.get(currentVehicle.journey[index].checkpoint).openPopup();
        }
      } else if (index == currentVehicle.journey.length) {
        let expectedTime =
          new Date(currentVehicle.journey[index - 1].reachedTime).getTime() +
          route.legs[index - 1].duration * 1000;
        markers
          .get(cpId)
          .setPopupContent(
            `${
              cp.name
            }<br><span class='text-warning'>Expected ${formatRelativeTime(
              expectedTime
            )}</span>`
          );
      } else {
        markers.get(cpId).setPopupContent(cp.name);
      }
      markers.get(cpId).openPopup();
    }
    map.fitBounds(markersDisplay.getBounds().pad(0.05));
  }
</script>

<style>
  .bg-teal {
    background-color: #009688;
  }
  #monitorMap {
    width: 100vw;
    height: 100vh;
  }
  .top-right {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
  }
  #collapseVehicles {
    position: fixed;
    top: 0;
    z-index: 1000;
    right: 0;
  }
  #vehicle-list {
    max-height: 360px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  #selectedVehicle {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />
  <div id="monitorMap" />
  {#if currentVehicle}
    <button
      class="card p-2"
      id="selectedVehicle"
      data-toggle="modal"
      data-target="#detailsModal">
      <h5 class="card-title">
        <strong>{currentVehicle.beaconId}</strong> - {currentVehicle.vehicleNo}
      </h5>
      <h6 class="card-subtitle">{currentVehicle.name}</h6>
    </button>

    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{currentVehicle.vehicleNo}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <strong>Driver Name:</strong>
            {currentVehicle.name}<br />
            <strong>Beacon ID:</strong>
            {currentVehicle.beaconId}<br />
            <strong>Contact:</strong>
            {currentVehicle.contact}<br />
            <strong>Entry Time:</strong>
            {formatDateTime(currentVehicle.entryTime)} ( {formatRelativeTime(currentVehicle.entryTime)}
            )<br />
            <strong>Last seen at</strong>
            {checkpoints.get(currentVehicle.journey[currentVehicle.journey.length - 1].checkpoint).name}
            on {formatDateTime(currentVehicle.journey[currentVehicle.journey.length - 1].reachedTime)}
            ( {formatRelativeTime(currentVehicle.journey[currentVehicle.journey.length - 1].reachedTime)}
            )
          </div>
        </div>
      </div>
    </div>
  {/if}
  <button
    class="btn bg-teal top-right text-white"
    type="button"
    data-toggle="collapse"
    data-target="#collapseVehicles">
    &#x1F441; &#x25BC;
  </button>
  <div class="collapse" id="collapseVehicles">
    <div class="list-group" id="vehicle-list">
      {#await vehiclePromise then vehicles}
        {#each vehicles as vehicle}
          <VehicleLi
            on:click={() => vehicleSelected(vehicle.beaconId)}
            vehicleNo={vehicle.vehicleNo}
            driverName={vehicle.name}
            beaconID={vehicle.beaconId} />
        {/each}
      {:catch err}
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Oops!</h4>
          <p>An error has occured :(</p>
          <hr />
          <a href="/logout" class="mb-0 alert-link">Go back to Login page</a>
        </div>
      {/await}
    </div>

    <button
      class="btn bg-teal text-white"
      type="button"
      data-toggle="collapse"
      data-target="#collapseVehicles">
      &#x25B2;
    </button>
  </div>
</main>

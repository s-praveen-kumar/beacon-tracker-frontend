<script>
  export let SERVER;
  const OSRM_SERVER = "https://routing.openstreetmap.de/routed-car";
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
  });

  async function getCheckPoints() {
    const getOptions = {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
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

  function displayCheckpoints() {
    const markerArray = [];
    if (!checkpoints) return;
    for (let [id, cp] of checkpoints.entries()) {
      let marker = L.marker([cp.location.lat, cp.location.lon]);
      marker.bindPopup(cp.name, {
        closeOnClick: false,
        autoClose: false,
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

  async function fetchOSRM(coordinates) {
    const data = await fetch(
      OSRM_SERVER +
        `/route/v1/car/${coordinates}?steps=false&geometries=geojson&overview=full&continue_straight=true`
    );
    const res = await data.json();
    if (routeLine) map.removeLayer(routeLine);
    routeLine = L.geoJSON(res.routes[0].geometry);
    map.addLayer(routeLine);
  }

  function vehicleSelected(id) {
    currentVehicle = vehicles.get(id);
    markersDisplay.clearLayers();
    let coordinates = "";
    for (let cpId of currentVehicle.routeSpec) {
      const cp = checkpoints.get(cpId);
      markersDisplay.addLayer(markers.get(cpId));
      coordinates += cp.location.lon + "," + cp.location.lat + ";";
    }
    fetchOSRM(coordinates.slice(0, -1)); //Slice to remove last ;
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
    <div class="list-group">
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

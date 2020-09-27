<script>
  export let SERVER;
  const OSRM_SERVER = "https://routing.openstreetmap.de/routed-car";
  import L from "leaflet";
  import { onMount } from "svelte";
  import VehicleLi from "./VehicleLi.svelte";
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
  let vehicles;

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
        `/route/v1/car/${coordinates}?steps=false&geometries=geojson&overview=full`
    );
    const res = await data.json();
    routeLine = L.geoJSON(res.routes[0].geometry);
    map.addLayer(routeLine);
  }

  function vehicleSelected(id) {
    markersDisplay.clearLayers();
    let coordinates = "";
    for (let cpId of vehicles.get(id).routeSpec) {
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
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />
  <div id="monitorMap" />

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

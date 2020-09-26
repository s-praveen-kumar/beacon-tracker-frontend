<script>
  export let SERVER;
  const OSRM_SERVER = "https://routing.openstreetmap.de/routed-car";
  import L from "leaflet";
  import { onMount } from "svelte";
  import CheckpointReg from "./CheckpointReg.svelte";
  import "./VehicleLi.svelte";
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
    markers = [];
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
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: wmflabs',
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
      fetchOSRM();
    } catch (err) {
      console.log(err);
      //Display Errors
    }
  }

  function displayCheckpoints() {
    markers = [];
    if (!checkpoints) return;
    for (let [id, cp] of checkpoints.entries()) {
      let marker = L.marker([cp.location.lat, cp.location.lon]);
      marker.addTo(map).bindPopup(cp.name, {
        closeOnClick: false,
        autoClose: false,
      });
      markers.push(marker);
    }
    const markerGroup = L.featureGroup(markers);
    map.fitBounds(markerGroup.getBounds().pad(0.05));
  }

  async function fetchVehicles() {
    const data = await fetch(SERVER + "/active", getOptions);
    const res = await data.json();
    if (!res.success) throw Error("Error getting vehicles");
    vehicles = res.vehicles;
    vehicles = new Map(res.vehicles.map((i) => [i.beaconId, i]));
    return res.vehicles;
  }

  async function fetchOSRM() {
    const data = await fetch(
      OSRM_SERVER +
        `/route/v1/car/${checkpoints.get("sbcolonysignal").location.lon},${
          checkpoints.get("sbcolonysignal").location.lat
        };${checkpoints.get("gnmills").location.lon},${
          checkpoints.get("gnmills").location.lat
        }?steps=false&geometries=geojson&overview=full`
    );
    const res = await data.json();
    L.geoJSON(res.routes[0].geometry).addTo(map);
  }

  function vehicleSelected(id) {
    console.log(vehicles.get(id));
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

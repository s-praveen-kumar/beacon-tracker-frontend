<script>
  export let SERVER;
  const OSRM_SERVER = "https://routing.openstreetmap.de/routed-car";
  import L from "leaflet";
  import { onMount } from "svelte";
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
    routeLine,
    routeName;
  let alert_msg,
    alert_class = "invisible";
  let routeSpec = [];

  onMount(() => {
    let options = {
      center: [0, 0],
      zoom: 2,
    };
    map = L.map("routeMap", options);
    map.addLayer(
      L.tileLayer("https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: wmflabs | Routing: <a href="https://routing.openstreetmap.de">OSRM</a>',
      })
    );
    getCheckPoints();
  });

  function displayCheckpoints() {
    const markerArray = [];
    if (!checkpoints) return;
    for (let [id, cp] of checkpoints.entries()) {
      let marker = L.marker([cp.location.lat, cp.location.lon]);
      marker._id = id;
      marker.bindPopup(cp.name, {
        closeOnClick: false,
        autoClose: false,
      });
      marker.on("click", handleMarkerClick);
      markers.set(cp._id, marker);
      markerArray.push(marker);
    }
    markersDisplay = L.featureGroup(markerArray);
    map.fitBounds(markersDisplay.getBounds().pad(0.05));
    map.addLayer(markersDisplay);
  }

  function handleMarkerClick(ev) {
    console.log(ev.target._id);
    if (
      routeSpec.length > 0 &&
      routeSpec[routeSpec.length - 1] == ev.target._id
    )
      routeSpec.pop();
    else routeSpec.push(ev.target._id);
    console.log(routeSpec);
    let coordinates = "";
    if (routeLine) map.removeLayer(routeLine);
    if (routeSpec.length > 1) {
      for (let cpId of routeSpec) {
        const cp = checkpoints.get(cpId);
        coordinates += cp.location.lon + "," + cp.location.lat + ";";
      }
      fetchOSRM(coordinates.slice(0, -1)); //Slice to remove last ;
      map.fitBounds(markersDisplay.getBounds().pad(0.05));
    }
    routeSpec = routeSpec;
  }

  async function fetchOSRM(coordinates) {
    const data = await fetch(
      OSRM_SERVER +
        `/route/v1/car/${coordinates}?steps=false&geometries=geojson&overview=full&continue_straight=true`
    );
    const res = await data.json();
    routeLine = L.geoJSON(res.routes[0].geometry);
    map.addLayer(routeLine);
  }

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
  async function submitRoute() {
    if (!routeName) {
      alert_class = "alert-danger";
      alert_msg = "Please enter name for route";
    } else if (routeSpec.length < 2) {
      alert_class = "alert-danger";
      alert_msg = "Please specify atleast 2 points";
    } else {
      try {
        alert_class = "alert-warning";
        alert_msg = "loading...";
        const data = await fetch(SERVER + "/route/create", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: routeName,
            path: routeSpec,
          }),
        });
        const res = await data.json();

        alert_msg = res.msg;
        if (res.success) {
          alert_class = "alert-success";
        } else {
          alert_class = "alert-danger";
        }
      } catch (err) {
        alert_msg = "An error occurred :(";
        alert_class = "alert-danger";
      }
    }
    setTimeout(() => {
      alert_class = "invisible";
    }, 3000);
  }
</script>

<style>
  .bg-teal {
    background-color: #009688;
  }
  #routeList {
    position: fixed;
    top: 0;
    z-index: 1000;
    right: 0;
  }
  #routeMap {
    width: 100vw;
    height: 100vh;
  }
  .list-group {
    max-height: 300px;
    margin-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />
  <div id="routeMap" />
  <div id="routeList" class="card p-2">
    <label for="routeName">Route Name:</label>
    <input bind:value={routeName} type="text" id="routeName" name="routeName" />
    <div class="list-group">
      {#each routeSpec as cp}
        <div class="list-group-item">{checkpoints.get(cp).name}</div>
      {/each}
    </div>
    <button
      on:click={submitRoute}
      class="btn bg-teal text-white">Submit</button>
    <div class="alert {alert_class} mt-2 mb-2" role="alert">{alert_msg}</div>
  </div>
</main>

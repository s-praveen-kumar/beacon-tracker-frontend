<script>
  export let SERVER;
  import L from "leaflet";
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  let map,
    checkpoints,
    markers = [];
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
      console.log(receivedCp);
      if (receivedCp.success) {
        checkpoints = receivedCp.checkpoints;
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
    markers = [];
    if (!checkpoints) return;
    for (let cp of checkpoints) {
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
</script>

<style>
  #monitorMap {
    width: 100vw;
    height: 100vh;
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />
  <div id="monitorMap" />
</main>

<script>
  export let SERVER;
  import L from "leaflet";
  import { onMount } from "svelte";
  let map;
  let latlng, name, id, pwd;
  let alert_msg,
    alert_class = "invisible";
  let marker = new L.marker();
  onMount(() => {
    let options = {
      center: [0, 0],
      zoom: 2,
    };
    map = L.map("map", options);
    L.tileLayer("https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: wmflabs',
    }).addTo(map);
    map.on("click", (e) => {
      latlng = e.latlng;
      marker.setLatLng(latlng);
      marker.addTo(map);
    });
  });

  async function submit() {
    if (!name) {
      alert_class = "alert-danger";
      alert_msg = "Please enter Name";
    } else if (!id) {
      alert_class = "alert-danger";
      alert_msg = "Please enter Id";
    } else if (!pwd) {
      alert_class = "alert-danger";
      alert_msg = "Please enter Password";
    } else if (!latlng) {
      alert_class = "alert-danger";
      alert_msg = "Please choose location on map";
    } else {
      try {
        alert_class = "alert-warning";
        alert_msg = "loading...";
        const data = await fetch(SERVER + "/cp/create", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: name,
            id: id,
            lat: latlng.lat,
            lon: latlng.lng,
            authSecret: pwd,
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
  }
</script>

<style>
  #map {
    width: 480px;
    height: 360px;
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />
  <div class="container">
    <div class="row">
      <div class="col-lg-6 p-3">
        <h2 class="text-white">Checkpoint</h2>
        <form>
          <div class="form-group">
            <label class="control-label text-white" for="name">Check-point Name:</label>
            <input
              bind:value={name}
              type="text"
              class="form-control"
              id="name"
              name="name" />
          </div>
          <div class="form-group">
            <label class="control-label text-white" for="id">Device Id:</label>
            <input
              bind:value={id}
              type="text"
              class="form-control"
              id="id"
              name="id" />
          </div>
          <div class="form-group">
            <label
              class="control-label text-white"
              for="password">Password:</label>
            <input
              bind:value={pwd}
              type="password"
              class="form-control"
              id="password"
              name="password" />
          </div>
        </form>
      </div>
      <div class="col-lg-6 p-3">
        <center>
          <div id="map" />
        </center>
      </div>
    </div>
    <center>
      <button on:click={submit} class="btn bg-white">Submit</button>
    </center>
    <div class="alert {alert_class} mt-2 mb-2" role="alert">{alert_msg}</div>
  </div>
</main>

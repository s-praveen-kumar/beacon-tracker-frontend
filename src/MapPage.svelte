<script>
  import "/leaflet/leaflet.css";
  import L from "leaflet";
  import { onMount } from "svelte";

  export let SERVER;
  onMount(() => {
    var mymap = L.map("mapid");
    L.tileLayer("https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: wmflabs',
    }).addTo(mymap);
    L.marker([11.081571, 76.989301])
      .addTo(mymap)
      .bindPopup("KCT<br>Expected in 2m - 5m", {
        closeOnClick: false,
        autoClose: false,
      })
      .openPopup();
    L.marker([11.0745423, 76.9411535])
      .addTo(mymap)
      .bindPopup("Thudiyalur", {
        closeOnClick: false,
        autoClose: false,
      })
      .openPopup();
    L.marker([11.0830425, 76.9837483])
      .addTo(mymap)
      .bindPopup("Athipalayam Rd junction<br>Crossed 5m ago", {
        closeOnClick: false,
        autoClose: false,
      })
      .openPopup();

    let lineString = {
      coordinates: [
        [76.983741, 11.083025],
        [76.983734, 11.083074],
        [76.983834, 11.08306],
        [76.984353, 11.082986],
        [76.985181, 11.082827],
        [76.985977, 11.082644],
        [76.987107, 11.082371],
        [76.987264, 11.08232],
        [76.987595, 11.082171],
        [76.988131, 11.081935],
        [76.988613, 11.081755],
        [76.988774, 11.081695],
        [76.989301, 11.081571],
      ],
      type: "LineString",
    };

    L.geoJSON(lineString).addTo(mymap);
    mymap.setView([11.0801962, 76.9889963], 18);

    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
    }
    mymap.on("click", onMapClick);
  });
</script>

<style>
  #mapid {
    height: 100vh;
    width: 1000px;
  }
</style>

<main>
  <link rel="stylesheet" href="/leaflet/leaflet.css" />

  <div id="mapid" />
</main>

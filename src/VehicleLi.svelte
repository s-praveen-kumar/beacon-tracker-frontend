<script>
  export let vehicleNo;
  export let driverName;
  export let beaconID;
</script>

<style>
  :global(.active) {
    background-color: #009688 !important;
  }
</style>

<button
  on:click
  data-toggle="list"
  class="card p-2 list-group-item list-group-item-action">
  <div class="card-body p-2">
    <h5 class="card-title"><strong>{beaconID}</strong> - {vehicleNo}</h5>
    <h6 class="card-subtitle">{driverName}</h6>
  </div>
</button>

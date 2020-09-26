<script>
  export let vehicleNo;
  export let driverName;
  export let beaconID;
</script>

<div class="card p-2">
  <div class="card-body p-2">
    <h5 class="card-title"><strong>{beaconID}</strong> - {vehicleNo}</h5>
    <h6 class="card-subtitle text-muted">{driverName}</h6>
  </div>
</div>

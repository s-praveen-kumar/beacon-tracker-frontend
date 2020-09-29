<script>
  export let SERVER;
  let checkpoints, beacons;
  let alert_class = "invisible",
    alert_msg;
  let selectedBeacon, selectedCP;
  const getOptions = {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function submit() {
    const data = await fetch(SERVER + "/track", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        beaconId: selectedBeacon,
        checkpoint: checkpoints[selectedCP]._id,
        authSecret: checkpoints[selectedCP].authSecret,
      }),
    });
    const res = await data.json();
    if (res.success) alert_class = "alert-success";
    else alert_class = "alert-danger";
    alert_msg = res.msg;
    setTimeout(() => (alert_class = "invisible"), 4000);
  }

  async function fetchEntries() {
    try {
      const data = await fetch(SERVER + "/test/get", getOptions);
      const res = await data.json();
      checkpoints = res.checkpoints;
      beacons = res.beacons;
      return res;
    } catch (err) {
      console.log(err);
      alert_class = "alert-danger";
      alert_msg = err;
      setTimeout(() => (alert_class = "invisible"), 4000);
    }
  }
  const promise = fetchEntries();
</script>

<main>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-3 pl-0 pr-0 offset-md-3 roundcorner">
        <h3 class="bg-teal p-3 text-white">Detector Simulator</h3>
        <h4 class="text-white pl-3 pr-3 pt-0">(For testing only)</h4>
        <form action="javascript:void(0)" class="p-3">
          {#await promise then res}
            <div class="form-group">
              <label class="text-white" for="beaconId"> Beacon Id: </label>
              <select
                bind:value={selectedBeacon}
                class="custom-select"
                id="beaconId">
                {#each res.beacons as beacon}
                  <option>{beacon._id}</option>
                {/each}
              </select>
              <div class="form-group">
                <label class="text-white" for="checkpointId">
                  Checkpoint Id:
                </label>
                <select
                  bind:value={selectedCP}
                  class="custom-select"
                  id="checkpointId">
                  {#each res.checkpoints as cp, index}
                    <option value={index}>{cp.name}</option>
                  {/each}
                </select>
              </div>
              <center>
                <button on:click={submit} class="btn bg-white">Simulate</button>
              </center>
            </div>
          {/await}
        </form>
        <div class="alert {alert_class}" role="alert">{alert_msg}</div>
      </div>
    </div>
  </div>
</main>

<script>
  let beaconId,
    aadharNo,
    name,
    vehicleNo,
    routeSpec = 0,
    contact,
    alert_visibility = "";
  let routesArray;
  export let SERVER;
  const getOptions = {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const routePromise = getRoutes();

  async function getRoutes() {
    const data = await fetch(SERVER + "/route/get", getOptions);
    const routes = await data.json();
    console.log(routes);
    if (!routes.success) throw Error("Error getting routes");
    routesArray = routes.routes;
    return routes;
  }

  let registerPromise;
  function handleSubmit() {
    registerPromise = registerVehicle();
  }

  async function registerVehicle() {
    const data = await fetch(SERVER + "/vehicle/register", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        beaconId,
        aadharNo,
        name,
        vehicleNo,
        routeId: routesArray[routeSpec]._id,
        routeSpec: routesArray[routeSpec].path,
        contact,
      }),
    });
    const res = await data.json();
    console.log(res);
    alert_visibility = "";
    setTimeout(() => (alert_visibility = "invisible"), 4000);
    return res;
  }
</script>

<style>
  .bg-teal {
    background-color: #009688;
  }
  .roundcorner {
    border-radius: 12px;
  }
  .teal {
    color: #009688;
  }
</style>

<main>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-3 pl-0 pr-0 offset-md-3 roundcorner">
        <h2 class="bg-teal p-3 text-white">Registration</h2>
        <form action="javascript:void(0)" class="p-3">
          <div class="form-group">
            <label class="text-white" for="beaconId"> Beacon Id: </label>
            <input
              bind:value={beaconId}
              type="number"
              id="beaconId"
              name="beaconId"
              class="form-control" />
          </div>
          <div class="form-group">
            <label class="text-white" for="name"> Name: </label>
            <input
              bind:value={name}
              type="text"
              id="name"
              name="name"
              class="form-control" />
          </div>
          <div class="form-group">
            <label class="text-white" for="aadharNo:"> Aadhar No: </label>
            <input
              bind:value={aadharNo}
              type="number"
              id="aadharNo"
              name="aadharNo"
              class="form-control" />
          </div>
          <div class="form-group">
            <label class="text-white" for="vehicle-no"> Vehicle No: </label>
            <input
              bind:value={vehicleNo}
              type="text"
              id="vehicle-no"
              name="vehicleNo"
              class="form-control" />
          </div>
          <div class="form-group">
            <label class="text-white" for="contact"> Contact: </label>
            <input
              bind:value={contact}
              type="number"
              id="contact"
              name="contact"
              class="form-control" />
          </div>
          <div class="form-group">
            <label class="text-white" for="routeSpec"> Route: </label>
            <select bind:value={routeSpec} class="custom-select" id="routeSpec">
              {#await routePromise}
                <option selected>Choose...</option>
              {:then res}
                {#each res.routes as route, index}
                  <option value={index}>{route.name}</option>
                {/each}
              {/await}
            </select>
          </div>
          <center>
            <button
              on:click={handleSubmit}
              type="submit"
              class="btn bg-white shadow">
              Submit
            </button>
          </center>
        </form>
        {#if registerPromise}
          {#await registerPromise}
            <div class="text-center">
              <div class="spinner-border text-info" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          {:then res}
            <div
              class="alert {res.success ? 'alert-success' : 'alert-danger'}
                  {alert_visibility}"
              role="alert">
              {res.msg}
            </div>
          {/await}
        {/if}
      </div>
    </div>
  </div>
</main>

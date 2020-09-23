<script>
  let beaconId,
    aadharNo,
    name,
    vehicleNo,
    routeSpec = 0,
    contact;
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
  //  const SERVER = "http://127.0.0.1:3000";
  const promise = getUserProfile();
  async function getUserProfile() {
    const data = await fetch(SERVER + "/user/get", getOptions);
    const user = await data.json();
    console.log(user);
    if (!user.success) throw Error("Authentication failed");
    return user;
  }

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
        routeSpec: routesArray[routeSpec].path,
        contact,
      }),
    });
    const res = await data.json();
    console.log(res);
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
  .teal{
    color: #009688;
  }
</style>


<main>
  {#await promise}
    <p>Loading...</p>
  {:then user}
    <div class="jumbotron jumbotron-fluid bg-white">
      <h1 class="display-4 teal p-2">Reenigne</h1>
      <div class="dropdown mr-2 float-sm-right">
        <button
          class="btn btn-lg bg-teal text-white dropdown-toggle"
          type="button"
          id="userDropdown"
          data-toggle="dropdown">
          {user.name}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="/logout">Logout</a>
        </div>
      </div>
    </div>
    <div class="container mt-3 pl-0 pr-0">
      <div class="row">
        <div class="col-md-4 offset-md-4 roundcorner bg-white shadow">
      <h2 class="bg-teal p-3 text-white shadow">Registration</h2>
      <form action="javascript:void(0)" class="p-3">
        <div class="form-group">
          <label for="beaconId"> Beacon Id: </label>
          <input
            bind:value={beaconId}
            type="text"
            id="beaconId"
            name="beaconId"
            class="form-control" />
        </div>
        <div class="form-group">
          <label for="name"> Name </label>
          <input
            bind:value={name}
            type="text"
            id="name"
            name="name"
            class="form-control" />
        </div>
        <div class="form-group">
          <label for="aadharNo:"> Aadhar No: </label>
          <input
            bind:value={aadharNo}
            type="text"
            id="aadharNo"
            name="aadharNo"
            class="form-control" />
        </div>
        <div class="form-group">
          <label for="vehicle-no"> Vehicle No: </label>
          <input
            bind:value={vehicleNo}
            type="text"
            id="vehicle-no"
            name="vehicleNo"
            class="form-control" />
        </div>
        <div class="form-group">
          <label for="contact"> Contact: </label>
          <input
            bind:value={contact}
            type="text"
            id="contact"
            name="contact"
            class="form-control" />
        </div>
        <div class="form-group">
          <label for="routeSpec"> Route: </label>
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
        <button
          on:click={handleSubmit}
          type="submit"
          class="text-white btn bg-teal shadow">
          Submit
        </button>
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
            class="alert {res.success ? 'alert-success' : 'alert-danger'}"
            role="alert">
            {res.msg}
          </div>
        {/await}
      {/if}
    </div>
    </div>
    </div>
  {:catch error}
    <div class="container">
      <div class="alert alert-danger mt-4" role="alert">
        <h4 class="alert-heading">Oops!</h4>
        <p>An error has occured :(</p>
        <hr />
        <a href="/logout" class="mb-0 alert-link">Go back to Login page</a>
      </div>
    </div>
  {/await}
</main>

<style>
  .bg-teal {
    background-color: #009688;
  }
  .roundcorner{
    border-radius: 12px;
  }
</style>

<main>
  {#await promise}
    <p>Loading...</p>
    {:then user}
    <div class="jumbotron jumbotron-fluid bg-teal">
      <h1 class="display-4 text-white p-2">Reenigne</h1>
      <div class="dropdown mr-2 float-sm-right">
        <button class="btn btn-lg bg-teal text-white dropdown-toggle" type="button" id="userDropdown" data-toggle="dropdown">
          {user.name}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="/logout">Logout</a>
        </div>
      </div>
    </div>
  <div class = "container mt-3 pl-0 pr-0 roundcorner bg-white shadow">
    <h2 class = "bg-teal p-3 text-white shadow">Registration </h2>
  <form class="p-3">
    <div class = "form-group">
      <label for="beaconId" >
        Beacon Id:
      </label>
      <input type = "text" id = "beaconId" name ="beaconId" class = "form-control">

    </div>
    <div class = "form-group">
      <label for="name" >
        Name
      </label>
      <input type = "text" id = "name" name ="name" class = "form-control">

    </div>
    <div class = "form-group">
      <label for="aadharNo:">
        Aadhar No:
      </label>
      <input type = "text" id = "aadharNo" name ="name" class = "form-control">

    </div>
    <div class = "form-group">
      <label for="vehicle-no" >
        Vehicle No:
      </label>
      <input type = "text" id = "vehicle-no" name ="vehicleNo" class = "form-control">

    </div>
    <div class = "form-group">
      <label for="contact" >
        Contact:
      </label>
      <input type = "text" id = "contact" name ="contact" class = "form-control">
    </div>
    <div class = "form-group">
      <label for="routeSpec" >
        Route:
      </label>
      <select class="custom-select"  id="routeSpec">
        {#await routePromise}
    <option selected>Choose...</option>
    {:then res}
    {#each res.routes as route}
    <option value="{route.name}">{route.name}</option>
    {/each}
    {/await}
  </select>
    </div>
     <button type="submit" class="text-white btn bg-teal shadow"> Submit </button>
  </form>
  </div>
  {:catch error}
  <div class="container">
  <div class="alert alert-danger mt-4" role="alert">
    <h4 class="alert-heading">Oops!</h4>
    <p>An error has occured :(</p>
    <hr>
    <a href="/logout" class="mb-0 alert-link">Go back to Login page</a>
  </div>
</div>
  {/await}
 </main>
<script>
  const getOptions = {
        method: "GET",
        mode: "cors",
        credentials: 'include',
        headers: {
          'Authorization': "Bearer "+localStorage.getItem("token")
        },
      }
  const SERVER = "http://127.0.0.1:3000";
  const promise = getUserProfile();
  async function getUserProfile(){
    const data = await fetch(SERVER + "/user", getOptions);
      const user =  await data.json();
      console.log(user);
      if(!user.success)
        throw Error("Authentication failed");
      return user;
  }

  const routePromise = getRoutes();

  async function getRoutes(){
    const data = await fetch(SERVER+"/routes",getOptions);
    const routes = await data.json();
    console.log(routes);
    if(!routes.success)
      throw Error("Error getting routes");
      return routes;
  }
  document.body.style.backgroundColor="#80cbc4"
</script>

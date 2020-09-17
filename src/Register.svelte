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
      <h5 class="float-right">{user.name}</h5>
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
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
    </div>
     <button type="submit" class="text-white btn bg-teal shadow"> Submit </button>
  </form>
  </div>
  {:catch error}
  {/await}
 </main>
<script>
  const SERVER = "http://127.0.0.1:3000";
  const promise = getUserProfile();
  async function getUserProfile(){
    const data = await fetch(SERVER + "/user", {
        method: "GET",
        mode: "cors",
        credentials: 'include',
        headers: {
          'Authorization': "Bearer "+localStorage.getItem("token")
        },
      });
      const user =  await data.json();
      console.log(user);
      return user;
  }
  document.body.style.backgroundColor="#80cbc4"
</script>

<style>
  .bg-teal {
    background-color: #009688;
  }
  .roundcorner{
    border-radius: 12px;
  }
</style>

<main>
  <div class = "container mt-3 p-3 roundcorner bg-white ">
    <h3 class = "bg-teal p-2 text-white display-5">Registration </h3>
  <form>
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
     <button type="submit" class="btn btn-primary"> Submit </button>
  </form>
  </div>
 </main>
<script>
  document.body.style.backgroundColor="#80cbc4"
</script>

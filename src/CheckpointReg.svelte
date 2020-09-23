<script>
  export let SERVER;
</script>

<style>
  .bg-teal {
    background-color: #009688;
  }
  .roundcorner {
    border-radius: 12px;
  }
  #map {
    width: 100%;
    height: 360px;
  }
</style>

<main>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 p-3">
        <h2 class="text-white">Checkpoint</h2>
        <form>
          <div class="form-group">
            <label class="control-label text-white" for="name">Check-point Name:</label>
            <input type="text" class="form-control" id="name" name="name" />
          </div>
          <div class="form-group">
            <label class="control-label text-white" for="id">Device Id:</label>
            <input type="text" class="form-control" id="id" name="id" />
          </div>
          <div class="form-group">
            <label
              class="control-label text-white"
              for="password">Password:</label>
            <input
              type="text"
              class="form-control"
              id="password"
              name="password" />
          </div>
        </form>
      </div>
      <div class="col-lg-6 p-3">
        <div class="form-group">
          <label
            class="control-label text-white"
            for="location">Location:</label>
          <div id="map" style="background-color:#ffffff;" />
        </div>
      </div>
    </div>
    <center><button class="btn bg-white">Submit</button></center>
  </div>
</main>

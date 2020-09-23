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
</style>
<main>
  <div class="jumbotron jumbotron-fluid bg-teal text-white">
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
      <h1 class="text-center"> Checkpoint </h1>
      <form>
        <div class="form-group">
          <label class= "control-label">Check-point Name:</label>
            <input type="text" class="form-control" name="name">
          </div>
          <div class="form-group">
            <label class= "control-label">Device Id:</label>
              <input type="text" class="form-control" name="id">
            </div>
            <div class="form-group">
              <label class= "control-label">Password:</label>
                <input type="text" class="form-control" name="password">
                <div class="form-group">
                  <label class= "control-label">Location:</label>
                    <input type="text" class="form-control" name="location">
                    <button on:click={Submit} class="form-control" text-white>
                      Submit
                    </button>
      </form>
      </div>
      </div>
      </div>
</main>

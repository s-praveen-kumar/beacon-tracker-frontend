<style>
  .bg-teal {
    background-color: #009688;
  }
</style>
<main>
  <div class="jumbotron jumbotron-fluid bg-teal">
    <h1 class="display-4 text-white p-2">Reenigne</h1>
  </div>
  <div class="container">
    <div class="row">
      <form class="col-md-6 offset-md-3 col-lg-4 offset-lg-4 shadow p-3">
        <div class="form-group">
          <label class="h5 font-weight-normal" for="username">Username</label>
          <input
            class="form-control"
            id="username"
            type="text"
            name="username"
          />
        </div>
        <div class="form-group">
          <label class="h5 font-weight-normal" for="password">Password</label>
          <input
            class="form-control"
            id="password"
            type="password"
            name="password"
          />
        </div>
        <input class="form-control btn-primary" type="submit" value="Login" />
      </form>
    </div>
  </div>
</main>

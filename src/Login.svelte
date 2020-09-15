<style>
  .bg-teal {
    background-color: #009688;
  }
</style>

<script>
  const SERVER = "http://localhost:3000";
  let username, password;

  function login() {
    fetch(SERVER + "/login", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => console.log(res))
      .catch((err) => console.log("ERROR:" + err));
  }
</script>

<main>
  <div class="jumbotron jumbotron-fluid bg-teal">
    <h1 class="display-4 text-white p-2">Reenigne</h1>
  </div>
  <div class="container">
    <div class="row">
      <form
        action="javascript:void(0);"
        class="col-md-6 offset-md-3 col-lg-4 offset-lg-4 shadow p-3"
      >
        <div class="form-group">
          <label class="h5 font-weight-normal" for="username">Username</label>
          <input
            bind:value="{username}"
            class="form-control"
            id="username"
            type="text"
            name="username"
          />
        </div>
        <div class="form-group">
          <label class="h5 font-weight-normal" for="password">Password</label>
          <input
            bind:value="{password}"
            class="form-control"
            id="password"
            type="password"
            name="password"
          />
        </div>
        <button on:click="{login}" class="form-control btn-primary">
          Login
        </button>
      </form>
    </div>
  </div>
</main>

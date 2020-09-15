<style>
  .bg-teal {
    background-color: #009688;
  }
</style>

<script>

  const SERVER = "http://localhost:3000";
  let username, password;
  let username_valid, password_valid, error_msg;
  function login() {
    if(!username){
      username_valid = "is-invalid";
    } else{
      username_valid = "";
    }
    if(!password){
      password_valid = "is-invalid";
    } else{
      password_valid = "";
    }
    if(username && password){
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
        .then((res) => {
          console.log(res)
          if(res.success){
            error_msg = "";
            //Go to main page
          } else {
            error_msg = res.msg;
          }
        })
        .catch((err) => error_msg = "Oops! Something went wrong");
    }
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
        class="col-md-6 offset-md-3 col-lg-4 offset-lg-4 shadow p-3 needs-validation"
      >
        <div class="form-group">
          <label class="h5 font-weight-normal" for="username">Username</label>
          <input
            bind:value="{username}"
            class="form-control {username_valid}"
            id="username"
            type="text"
            name="username"
          />
        <div class="invalid-feedback">Please enter username</div>
        </div>
        <div class="form-group">
          <label class="h5 font-weight-normal" for="password">Password</label>
          <input
            bind:value="{password}"
            class="form-control  {password_valid}"
            id="password"
            type="password"
            name="password"
          />
          <div class="invalid-feedback">Please enter password</div>
        </div>
        <button
          on:click="{login}"
          class="form-control btn-primary"
        >
          Login
        </button>
        {#if error_msg}
        <div class="alert alert-danger mt-3" role="alert">
          {error_msg}
        </div>
        {/if}
      </form>
    </div>
  </div>
</main>

<script>
  export let SERVER;
  let name, password,role,username;
  let alert_class="invisible";
  let alert_msg;

  async function submit(){
    try {
        alert_class = "alert-warning";
        alert_msg = "loading...";
        const data = await fetch(SERVER + "/user/create", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            username,name,password,role
          }),
        });
        const res = await data.json();

        alert_msg = res.msg;
        if (res.success) {
          alert_class = "alert-success";
        } else {
          alert_class = "alert-danger";
        }
      } catch (err) {
        alert_msg = "An error occurred :(";
        alert_class = "alert-danger";
      }
    setTimeout(() => {
      alert_class = "invisible";
    }, 3000);
  }
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
<div class="container">
  <div class="row">
    <div class="col-lg-4 offset-lg-4 p-2">
      <h2 class="text-white">User Registration</h2>
      <form action="javascript:void(0)">
        <div class="form-group">
          <label class="control-label text-white" for="name">Full Name:</label>
          <input
            bind:value={name}
            type="text"
            class="form-control"
            id="name"
            name="name" />
        </div>
        <div class="form-group">
          <label class="control-label text-white" for="id">User Name:</label>
          <input
            bind:value={username}
            type="text"
            class="form-control"
            id="username"
            name="username" />
        </div>
        <div class="form-group">
          <label
            class="control-label text-white"
            for="password">Password:</label>
          <input
            bind:value={password}
            type="password"
            class="form-control"
            id="password"
            name="password" />
        </div>
        <div class="form-group">
          <label class="control-label text-white" for="role">Role:</label>
          <input
            bind:value={role}
            type="text"
            class="form-control"
            id="role"
            name="role" />
        </div>
      </form>
    </div>
  </div>
  <center>
    <button on:click={submit} class="btn bg-white">Submit</button>
  </center>
  <div class="alert {alert_class} mt-2 mb-2" role="alert">{alert_msg}</div>
</div>
</main>

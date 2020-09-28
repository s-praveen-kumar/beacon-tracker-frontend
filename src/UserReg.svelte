<script>
  export let SERVER;
  let name, password,role,username;
  let alert_class;
  let alert_msg;
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
    <div class="col-lg-4 p-8">
      <h2 class="text-white">User Registration</h2>
      <form>
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

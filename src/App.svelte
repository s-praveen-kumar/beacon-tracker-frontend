<script>
  import page from "page";

  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import checkpointreg from "./CheckpointReg.svelte";
  import UserReg from "./UserReg.svelte";
  import Monitor from "./Monitor.svelte";
  import NewRoute from "./NewRoute.svelte";
  import CheckpointReg from "./CheckpointReg.svelte";

  const SERVER = "http://127.0.0.1:3000";
  let loggedIn;
  let userName = "";
  let userRole = "";
  let current = Login;

  document.body.style.backgroundColor = "#009688";
  isloggedin();
  if (loggedIn) getUserProfile();

  page("/", () => {
    current = Register;
  });

  page("/login", () => {
    isloggedin();
    current = Register;
    getUserProfile();
  });

  page("/register", () => {
    current = Register;
  });

  page("/logout", () => {
    localStorage.setItem("token", "");
    userName = "";
    loggedIn = false;
    current = Login;
  });
  page("/checkpointreg", () => {
    current = checkpointreg;
  });
  page("/UserReg", () => {
    current = UserReg;
  });
  page("/monitor", () => {
    current = Monitor;
  });
  page("/newRoute", () => {
    current = NewRoute;
  });

  page.start();

  async function getUserProfile() {
    const getOptions = {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const data = await fetch(SERVER + "/user/get", getOptions);
    const user = await data.json();
    console.log(user);
    if (!user.success) throw Error("Authentication failed");
    userName = user.name;
    userRole = user.role;
  }

  function isloggedin() {
    if (localStorage.getItem("token")) {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
    return loggedIn;
  }
</script>

<style>
  .bg-teal-dark {
    background-color: #00796b;
  }
</style>

{#if current == Login || !loggedIn}
  <svelte:component this={Login} {SERVER} />
{:else}
  {#if current != Monitor}
    <nav class="navbar navbar-expand-lg bg-teal-dark navbar-dark">
      <div class="navbar-brand">Beacon Tracker</div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item {current == Register ? 'active' : ''}">
            <a class="nav-link" href="/register">Register Vehicles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/monitor">Track</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle {userRole == 'admin' ? '' : 'disabled'}"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              ...
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a
                class="dropdown-item {current == UserReg ? 'active' : ''}"
                href="/userReg">Register Users</a>
              <a
                class="dropdown-item {current == CheckpointReg ? 'active' : ''}"
                href="/checkpointreg">Register Checkpoints</a>
              <a
                class="dropdown-item {current == NewRoute ? 'active' : ''}"
                href="/newRoute">Register Routes</a>
            </div>
          </li>
        </ul>
        <div class="dropdown mr-2 float-sm-right">
          <button
            class="btn btn-lg dropdown-toggle text-white"
            type="button"
            id="userDropdown"
            data-toggle="dropdown">
            {userName}
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="/logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  {/if}
  <svelte:component this={current} {SERVER} />
{/if}

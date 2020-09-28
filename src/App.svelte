<script>
  import page from 'page';

  import Login from "./Login.svelte"
  import Register from "./Register.svelte"
  import checkpointreg from "./CheckpointReg.svelte"
  import UserReg from "./UserReg.svelte"
  import Monitor from "./Monitor.svelte"
  import NewRoute from "./NewRoute.svelte"

  const SERVER = "http://127.0.0.1:3000";
  let current = Login;
  document.body.style.backgroundColor = "#009688";
  page('/', () => {
    if(localStorage.getItem("token"))
      current = Register;
    else
      current = Login
  });
  page('/register', () => {
    if(localStorage.getItem("token"))
      current = Register;
    else{
        current = Login;
        alert("Please Login to access");
      }
  });
  page('/logout',()=>{
    localStorage.setItem("token","");
    current = Login;
  });
  page('/checkpointreg', () => {

      current = checkpointreg;

  });
  page('/logout',()=>{
    localStorage.setItem("token","");
    current = Login;
  });
  page('/UserReg', () => {

      current = UserReg;

  });
  page('/monitor',()=>{
    current = Monitor;
  });
  page('/newroute',()=>{
    current = NewRoute;
  })
  page.start();
  const promise = getUserProfile();
  async function getUserProfile() {
    const data = await fetch(SERVER + "/user/get", getOptions);
    const user = await data.json();
    console.log(user);
    if (!user.success) throw Error("Authentication failed");
    return user;
  }
function isloggedin(){
  if(localStorage.getItem("token"))
    return true;
  else
  return false;

}
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#"> <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>

    </ul>

  </div>
</nav>

<div class="dropdown mr-2 float-sm-right">
  <button
    class="btn btn-lg bg-teal text-white dropdown-toggle"
    type="button"
    id="userDropdown"
    data-toggle="dropdown">
    {user.name}
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="/logout">Logout</a>
  </div>
</div>







  <svelte:component this={current} SERVER={SERVER}/>

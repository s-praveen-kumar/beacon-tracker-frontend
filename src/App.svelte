<script>
  import page from 'page';

  import Login from "./Login.svelte"
  import Register from "./Register.svelte"
  import checkpointreg from "./CheckpointReg.svelte"
  import UserReg from "./UserReg.svelte"
  import Monitor from "./Monitor.svelte"

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
  })
  page.start();
</script>

  <svelte:component this={current} SERVER={SERVER}/>

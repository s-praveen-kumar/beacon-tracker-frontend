<script>
  import page from 'page';

  import Login from "./Login.svelte"
  import Register from "./Register.svelte"

  const SERVER = "http://127.0.0.1:3000";
  let current = Login;

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
  })
  page.start();
</script>

  <svelte:component this={current} SERVER={SERVER}/>

<script>
  import page from 'page';

  import Login from "./Login.svelte"
  import Register from "./Register.svelte"

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
  page.start();
</script>

  <svelte:component this={current} />

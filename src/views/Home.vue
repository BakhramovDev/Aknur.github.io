<template>
     <div class="wrapper">
      <Logo />
      <p class="about_us">
        <b>Aknur</b> messenger bu itimoiy xabarlar ulashuv messenjeri bo'lib siz unda qulay tezkor xabarlaringizni almashinishingiz mumkun  
      </p>
      <nav>
        <router-link class="nav_link" to="/register">Register</router-link>
        <router-link class="nav_link" to="/login">Sign In</router-link>
        <!-- <router-link class="nav_link" ></router-link> -->
      </nav>  
     </div>

</template>

<script>
  import Logo from '@/components/logo.vue';

export default {
      components: {
        Logo ,
      }
}
</script>

<style scoped>
    .about_us{
        color: rgb(59, 59, 59);
        width: 281px;
        text-align: center;
        margin: 20px auto;
    }
    nav{
        display: flex;
        align-content: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        width: fit-content;
        margin: 10px auto;
        font-size: 20px;
      }
      nav .nav_link{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 281px;
        border-radius: 15px;
        background-color:rgb(59, 59, 59) ;
        color: white;
    }
    nav .nav_link:hover{
        color: rgb(232, 232, 232);
    }
    .log_out{
       background: none;
       border: none;
       font-size: 20px;

    }
</style>
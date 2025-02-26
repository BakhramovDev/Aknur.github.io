<template>
  <div class="all__wrapper">
      <!-- <Navbar /> -->

      <Messenger />


  </div>
  
</template>

<script>

import Navbar from '@/components/navbar.vue';
import Messenger from '@/components/chat.vue';


export default {
  components :{
    Navbar,
    Messenger 
  }
}
</script>


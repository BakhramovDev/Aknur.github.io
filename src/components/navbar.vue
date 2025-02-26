<template>



        <!-- <router-link class="nav_link" ></router-link> -->
        <button class="nav_link log_out" @click="handleSignOut">Log out</button>
 


</template>

<script setup>

    import {onMounted , ref} from "vue";
    import {getAuth , onAuthStateChanged, signOut } from "firebase/auth" ;
    import {useRouter} from 'vue-router' //import router

    const router = useRouter()
    const isLoggedIn = ref(false)

    let auth;
    onMounted(() => {
        auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isLoggedIn.value = true ;
            }else{
                isLoggedIn.value = false
            }
        });
    });

    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.push("/")
        });
    };

</script>


<style scoped>

    .log_out{
       background: none;
       border: none;
       font-size: 15px;
       color: white;
       padding: 5px 15px;
       background: crimson;
       border-radius: 5px;
    }
</style>
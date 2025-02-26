<template>
      <Logo />

    <h1>
        Sign In
    </h1>
    
    <div class="form">
        <p v-if="errMsg">
            {{ errMsg }}
        </p>
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
    <div class="btns">
        <button @click="register">Submit</button>
        <!-- <button @click="SignInWithGoogle">Google</button> -->
    </div>
    <router-link class="act_code" to="/register">I dont have account</router-link>
    </div>


</template>


<script setup>
  import Logo from '@/components/logo.vue';

    import {ref} from "vue";
    import { getAuth, signInWithEmailAndPassword} from "firebase/auth" ;
    import {useRouter} from 'vue-router' //import router

    const email = ref ("");
    const password = ref ("");
    const errMsg = ref()
    const router = useRouter()


    const register = () => {
        signInWithEmailAndPassword(getAuth() , email.value , password.value)
        .then((data) => {
            console.log("Succesfully sign in");
            router.push('/feed')
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Invalid Email" ;
                    break;
                    case "auth/user-not-found":
                    errMsg.value = "No account whit that amail was found" ;
                    break;
                    case "auth/wrong-password":
                    errMsg.value = "Incorrect password" ;
                    break;
                    default:
                    errMsg.value = "Email or password was incorrect" ;
                    break;
            }
     
            
        })
    };

    const SignInWithGoogle = () => {

    }
</script>

<style scoped>
    h1{
      font-size: 30px;
      text-align: center;
      color: rgb(59, 59, 59);
      margin: 30px;
    }
    .form{
        height: fit-content;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0 auto;
        gap: 20px;
    }
    .form input{
        height: 50px;
        width: 300px;
        border: 1px solid rgb(59, 59, 59);
        border-radius: 15px;
        font-size: 18px;
        padding-left: 10px;
    }
    .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    .btns button{
        height: 50px;
        width: 140px;
        background:rgb(59, 59, 59);
        color: white;
        outline: none;
        border:2px solid transparent;
        border-radius: 15px;
        font-size: 20px;
        font-weight: 600;
        padding-left: 10px;
        transition: all 0.1s ease;
        cursor: pointer;
    }
    .btns button:hover{
        background:rgb(255, 255, 255);
        border: 2px solid  rgb(59, 59, 59);
        color: rgb(59, 59, 59);
    }
    .act_code{
        color: rgb(59, 59, 59);
        font-size: 20px;
        text-decoration: underline;
    }
</style>


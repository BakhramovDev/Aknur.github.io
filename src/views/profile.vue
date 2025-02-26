
<template>
    <div class="profile_container">
        <div class="profile__nav">
            <router-link to="/feed" class="exit__btn"><i class="bi bi-arrow-left"></i></router-link>
            <Navbar />
        </div>
  
      <div class="edit_info">
        <input v-model="newUsername" type="text" placeholder="Enter new name" />
      <button @click="updateUsername">Save</button>
      </div>
    </div>
</template>


<script>
import { ref } from "vue";
import { getAuth, updateProfile } from "firebase/auth";

import Navbar from '@/components/navbar.vue';


export default {
    components :{
    Navbar,

    },
  setup() {
    const newUsername = ref("");
    const auth = getAuth();
    const user = auth.currentUser;

    // Foydalanuvchi ismini yangilash
    const updateUsername = async () => {
      if (!user) {
        console.error("Foydalanuvchi topilmadi!");
        return;
      }
      if (!newUsername.value.trim()) {
        console.error("Ism bo‘sh bo‘lishi mumkin emas!");
        return;
      }

      try {
        await updateProfile(user, { displayName: newUsername.value });
        console.log("Ism muvaffaqiyatli yangilandi:", newUsername.value);
        alert("Ismingiz muvaffaqiyatli yangilandi!");
      } catch (error) {
        console.error("Ismni yangilashda xatolik:", error);
        alert("Ismingizni yangilashda xatolik yuz berdi.");
      }
    };

    return {
      newUsername,
      updateUsername,
    };
  },
};
</script>


<style scoped>
    .profile_container{
        max-width: 500px;
        margin: 0 auto;
        background: #28292ff3;
        height: 100vh;
    }
    .profile__nav{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background: #1b1c20;

    }
    .exit__btn{
        color: white;
        font-size: 25px;
    }
    .edit_info{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 300px;
        gap: 10px;
    }
    .edit_info input{
        height: 50px;
        width: 300px;
        font-size: 20px;
        padding-left: 5px;
        border-radius: 10px;
        outline: none;
        border-radius: 10px;
    }
    .edit_info button{
        height: 50px;
        width: 300px;
        font-size: 20px;
        cursor: pointer;
        border: none;
        outline: none;
        border-radius: 10px;

    }

</style>
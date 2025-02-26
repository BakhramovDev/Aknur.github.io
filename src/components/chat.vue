<template>
  <div class="chat_container">
    <div class="chat_box">
      <!-- Chat sarlavhasi -->
      <div class="chat_nav">
        <h2>Aknur messenger</h2>
        <span class="menu_btn">
          <router-link to="/profile"><i class="bi bi-three-dots-vertical"></i></router-link>
        </span>
      </div>

      <!-- Xabarlar oynasi -->
      <div class="messages_scroller" ref="messagesScroller">
        <ul class="messages">
          <li class="message_bubble" v-for="(message, index) in messages" :key="index"
              @click="selectMessage(index)"
              :class="{ 'my-message': message.user === currentUser, 'friend-message': message.user !== currentUser }"
              :style="{ backgroundColor: getUserColor(message.user) }">
            
            <!-- Xabar sarlavhasi -->
            <div class="message_header">
              <strong class="message_user">{{ message.user }}:</strong>
              <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
            </div>

            <!-- Xabar matni -->
            <div class="main_message">
              <div v-if="message.reply" class="reply-box">
                <small>↪ {{ message.reply.user }}: {{ message.reply.text }}</small>
              </div>
              <p>{{ message.text }}</p>
            </div>

            <!-- Tahrirlangan xabar belgisi -->
            <span v-if="message.edited" class="edited-tag"><i class="bi bi-pencil"></i></span>

            <!-- Xabar ustida harakatlar tugmalari -->
            <div v-if="selectedMessageIndex === index" class="actions">
              <button @click.stop="editMessage(index, message.text)"><i class="bi bi-pencil"></i></button>
              <button @click.stop="deleteMessage(index)"><i class="bi bi-trash3"></i></button>
              <button @click.stop="replyTo(message)"><i class="bi bi-reply"></i></button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Pastga tushish tugmasi -->
      <button v-if="showScrollButton" class="scroll-bottom-btn" @click="scrollToBottom">
        <i class="bi bi-arrow-down-circle"></i>
      </button>

      <!-- Xabarga javob berish qismi -->
      <div v-if="replyMessage" class="replying_item">
        <div class="reply_header">
          Replying to: <strong>{{ replyMessage.user }}</strong>
        </div>
        <p class="replayed_item">- "{{ replyMessage.text }}"</p>
        <button @click="cancelReply"><i class="bi bi-x-square"></i></button>
      </div>

      <!-- Xabar jo‘natish qismi -->
      <div class="message_post">
        <input v-model="newMessage" placeholder="Xabar yozing..." @keyup.enter="sendMessage" />
        <button @click="sendMessage"><i class="bi bi-send"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import { db } from "@/firebase";
import { ref as dbRef, push, set, update, remove, onValue } from "firebase/database";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default {
  setup() {
    const messages = ref([]); // Xabarlar ro'yxati
    const newMessage = ref(""); // Yangi xabar matni
    const username = ref("Anonim"); // Foydalanuvchi nomi
    const currentUser = ref(""); // Joriy foydalanuvchi
    const replyMessage = ref(null); // Javob berilayotgan xabar
    const selectedMessageIndex = ref(null); // Tanlangan xabar indeksi
    const editingMessageIndex = ref(null); // Tahrirlanayotgan xabar indeksi
    const messagesRef = dbRef(db, "messages"); // Firebase ma'lumotlar bazasi
    const messagesScroller = ref(null); // Scroll qismi
    const showScrollButton = ref(false); // Pastga tushish tugmasi

    // Foydalanuvchi login bo‘lsa, uning ismini olish
    onAuthStateChanged(auth, (user) => {
      if (user) {
        username.value = user.displayName || "Husein";
        currentUser.value = user.displayName || "Husein";
      }
    });

    // Firebase-dan xabarlarni olish
    onMounted(() => {
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        messages.value = data ? Object.entries(data).map(([id, msg]) => ({ id, ...msg })) : [];
        
        // Xabarlar yuklangandan keyin pastga tushish
        nextTick(() => scrollToBottom());
      });
    });

    // Yangi xabar qo'shilganda avtomatik pastga tushish
    watch(messages, () => {
      nextTick(() => scrollToBottom());
    });

    // Yangi xabar jo‘natish yoki tahrirlash
    const sendMessage = () => {
      if (!newMessage.value.trim()) return;

      if (editingMessageIndex.value !== null) {
        update(dbRef(db, `messages/${messages.value[editingMessageIndex.value].id}`), {
          text: newMessage.value,
          edited: true,
        });
        editingMessageIndex.value = null;
      } else {
        set(push(messagesRef), {
          text: newMessage.value,
          user: username.value,
          timestamp: Date.now(),
          reply: replyMessage.value || null,
        });
      }

      newMessage.value = "";
      replyMessage.value = null;
    };

    // Xabar ustiga bosilganda tanlash
    const selectMessage = (index) => {
      selectedMessageIndex.value = selectedMessageIndex.value === index ? null : index;
    };

    // Xabarni tahrirlash
    const editMessage = (index, text) => {
      if (messages.value[index].user === currentUser.value) {
        newMessage.value = text;
        editingMessageIndex.value = index;
      } else {
        alert("Siz faqat o'z xabaringizni tahrirlashingiz mumkin!");
      }
    };

    // Xabarni o‘chirish
    const deleteMessage = (index) => {
      if (messages.value[index].user === currentUser.value) {
        remove(dbRef(db, `messages/${messages.value[index].id}`));
        selectedMessageIndex.value = null;
      } else {
        alert("Siz faqat o'z xabaringizni o'chirishingiz mumkin!");
      }
    };

    // Javob yozish
    const replyTo = (message) => (replyMessage.value = message);
    const cancelReply = () => (replyMessage.value = null);

    // Xabar vaqtini formatlash
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
    };

    // Har bir foydalanuvchiga rang belgilash
    const userColors = {};
    const getUserColor = (user) => {
      if (!userColors[user]) {
        const colors = ["#1f2937", "#374151", "#4b5563", "#6b7280"];
        userColors[user] = colors[user.length % colors.length];
      }
      return userColors[user];
    };

    // Xabarlar oynasini pastga scroll qilish
    const scrollToBottom = () => {
      if (messagesScroller.value) {
        messagesScroller.value.scrollTop = messagesScroller.value.scrollHeight;
        showScrollButton.value = false;
      }
    };

    return {
      messages, newMessage, sendMessage, formatTime, replyTo, replyMessage, cancelReply,
      selectMessage, selectedMessageIndex, editMessage, deleteMessage, currentUser,
      getUserColor, messagesScroller, scrollToBottom, showScrollButton
    };



  },
};
</script>


<style scoped>
  .chat_container{
    height: 100vh;
    max-width:500px ;
    margin: 0 auto;
    background-image: url(../assets/bcg-chat.jpg);
    background-position: center;
    background-size: cover;
    /* background: #1b1c20ae; */
    background-repeat: no-repeat;
  }
  .chat-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
  .chat_nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 70px;
    color: white;
    background-color: #1B1C20;
  }
  .menu_btn{
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .chat_nav i{
    font-size: 20px;
    font-weight: 300;
    color: white;

  }
  .message_post{
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    max-width: 500px;
    left: 0;
    right: 0;
    margin: 0 auto;
    gap: 20px;
    border-radius: 10px 10px 0 0 ;
    background: #1B1C20;
  }
  .message_post input{
    height: 100%;
    width: 80%;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-size: 20px;
  }
  .message_post button{
    height: 100%;
    width: 10%;
    border: none;
    outline: none;
    border-radius: inherit;
    background: transparent;
    cursor: pointer;
  }
  .message_post button i{
    color: white;
    font-size: 20px;
    transition: all 0.2s ;
  }
  .message_post button i:hover{
      font-size: 25px;
  }
  .messages_scroller {
  flex: 1;
  overflow-y: auto; /* Scroll qilishga ruxsat beradi */
  max-height: calc(100vh - 120px); /* Ekranning qolgan qismini egallaydi */
  padding-bottom: 10px;
}

  .messages_scroller::-webkit-scrollbar{
    display: none;
  }
  .messages{
    display: flex;
    align-items: start;
    justify-content: end;
    flex-direction: column;
    gap: 20px;
    /* height: 7; */
    width:100%;
    padding: 5px 10px;
  }
  .message_bubble{
    height: auto;
    max-width: 250px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    padding:  5px 10px;
    border-radius: 15px;
    gap: 8px;
    background: rgba(0, 0, 0, 0.375);
  }
  .reply-box{
    background:#70768e;
    padding: 3px 5px;
    border-radius:10px ;
  }
  .message_header{
    height:auto;
    min-width: 200px;
    padding: 2px 3px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

  }

  .message_header strong{
    font-size: 15px;
    flex-wrap: nowrap;
    display: flex;
    width: auto;
  }
  .message_header span{
    font-size: 10px;
  }
  .main_message{
    background-color: rgb(125, 0, 192);
    height: auto;
    width: 100%;
    padding: 5px 10px;
    border-radius: 12px 0 12px 12px;

  }
  .main_message p{
    width: 100%;
    flex-wrap: wrap;
    word-wrap: break-word; /* Uzun so'zlarni chiziqlar bo'ylab bo'lib ko'rsatish */
    overflow-wrap: break-word; /* Xuddi shu maqsadda */
  }

.my-message {
  background-color: #3b82f6; /* Moviy fon */
  align-self: flex-end; /* O‘ng tomonga chiqadi */
  text-align: right;
  border-top-right-radius: 0;
}
.friend-message {
  background-color: #374151; /* Kulrang fon */
  align-self: flex-start; /* Chap tomonga chiqadi */
  text-align: left;
  border-top-left-radius: 0;
}
.actions{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: #1b1c20a7;
  border-radius: 5px;
  width: 100%;
  height: 40px;
}
.actions button{
  height: 100%;
  width: 30%;
  border-radius: 3px;
  border: none;
  outline: none;
  background-color: white;
  cursor: pointer;
}
.edited-tag{
  width: 100%;
  display: flex;
  justify-content: start;
  color: #11121564;
}
.replying_item{
  position: fixed;
  bottom: 45px;
  background:#27292f;
  height: 50px;
  width: 48.5%;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  color: white;
}
.replying_item button{
    border: none;
    outline: none;
    font-size: 25px;
    color: white;
    background: transparent;
    cursor: pointer;
}
.repy_header{
  display: flex;
  flex-direction: column;
}
.replayed_item{
  white-space: nowrap; /* Matnni bitta qatorda saqlash */
  overflow: hidden; /* Uzun matnni yashirish */
  text-overflow: ellipsis;
  width: 200px;
}
    </style>

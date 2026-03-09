<template>
<div class="login-page">
    <div class="login-card">
        <h1>Log In</h1>

        <label>UserName</label>
        <input
          v-model="name"
          :class="{ 'error-input': errorMessage }"
          @input="errorMessage=''"
          @keyup.enter="loginUser"
          type="text"
          placeholder="Enter your name" />

        <label>Password</label>
        <input
          v-model="password"
          :class="{ 'error-input': errorMessage }"
          @input="errorMessage=''"
          @keyup.enter="loginUser"
          type="password"
          placeholder="Enter password" />

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button @click="loginUser">Log In</button>
    </div>
</div>
</template>

<script>
export default {
    name: 'LogInPage',

    data() {
        return {
            name: '',
            password: '',
            errorMessage: ''
        };
    },

    methods: {
        loginUser() {
            this.errorMessage = '';

            console.log(`Attempting login with name: ${this.name} and password: ${this.password}`);
            if (this.name.trim() === '' || this.password.trim() === '') {
                this.errorMessage = "Please enter username and password";
                return;
            }

            this.$store.commit('login',
                {
                    name: this.name,
                    password: this.password,
                });

                if(this.$store.getters.isLoggedIn){
                     this.$router.push('/dashboard');
                }else{
                    this.errorMessage = "User not found. Please sign up.";
                    return;
                }
           
        },
    },
};
</script>

<style scoped>

.login-page{
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#eef1f5;
  font-family: Arial, Helvetica, sans-serif;
}

.login-card{
  background:white;
  width:380px;
  padding:40px;
  border-radius:12px;
  box-shadow:0 20px 40px rgba(0,0,0,0.12);
}

h1{
  margin-bottom:25px;
  font-size:28px;
}

label{
  display:block;
  margin-top:15px;
  font-weight:600;
}

input{
  width:100%;
  padding:12px;
  margin-top:6px;
  border-radius:8px;
  border:1px solid #d1d5db;
  background:#f9fafb;
}

input:focus{
  outline:none;
  border-color:#4c7cf3;
}

.error{
  color:#ef4444;
  font-size:14px;
  margin-top:10px;
}

input.error-input{
  border-color:#ef4444;
}

button{
  width:100%;
  margin-top:25px;
  padding:12px;
  border:none;
  border-radius:10px;
  background:#2d6cdf;
  color:white;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
}

button:hover{
  background:#1f55b8;
}

</style>
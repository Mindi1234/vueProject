<template>
<div class="jira-login-container">
    <div class="background-illustration left"></div>
    <div class="background-illustration right"></div>

    <div class="login-wrapper">
      <div class="logo">
        <span class="logo-text">Jira</span>
      </div>
    <div class="login-card">
        <h2>Log in to your account</h2>

          <div class="form-group">
          <input
            v-model="name"
            :class="{ 'error-input': errorMessage }"
            @input="errorMessage=''"
            @keyup.enter="loginUser"
            type="text"
            placeholder="Enter name" />
        </div>

        <div class="form-group">
          <input
            v-model="password"
            :class="{ 'error-input': errorMessage }"
            @input="errorMessage=''"
            @keyup.enter="loginUser"
            type="password"
            placeholder="Enter password" />
        </div>

        <p v-if="errorMessage" class="error-message">
          <span class="error-icon">!</span> {{ errorMessage }}
        </p>

        <button class="primary-btn" @click="loginUser">Log in</button>
    </div>

    <div class="atlassian-footer">
        <p>Want to learn more about our software? <a href="https://www.atlassian.com/software">more</a>.</p>
      </div>
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

            if (this.name.trim() === '' || this.password.trim() === '') {
                this.errorMessage = "Please enter username and password";
                return;
            }

            const users = this.$store.getters.getUsers;

            const user = users.find(
                (u) => u.name === this.name &&
                u.password === this.password
            );

              if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                this.$router.push('/dashboard');
              } else {
                this.errorMessage = "Incorrect email address and/or password.";
              }
           
        },
    },
};
</script>

<style scoped>

.jira-login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #172B4D;
  overflow: hidden;
  position: relative;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  text-align: center;
  z-index: 2;
}

.login-card {
  background: #ffffff;
  padding: 32px 40px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
}

h2 {
  font-size: 16px;
  font-weight: 600;
  color: #5E6C84;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  background-color: #FAFBFC;
  border: 2px solid #DFE1E6;
  border-radius: 3px;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #4C9AFF;
}

input.error-input {
  border-color: #DE350B;
}

.primary-btn {
  width: 100%;
  background-color: #0052CC;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.1s ease;
}

.primary-btn:hover {
  background-color: #0065FF;
}

.error-message {
  color: #DE350B;
  font-size: 14px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  background: #DE350B;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-right: 8px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  gap: 8px;
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  color: #0052CC;
}

.footer-links {
  margin-top: 24px;
  font-size: 14px;
}

.footer-links a, .atlassian-footer a {
  color: #0052CC;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.dot {
  margin: 0 8px;
  color: #5E6C84;
}

.atlassian-footer {
  margin-top: 32px;
  font-size: 14px;
  color: #5E6C84;
}

.background-illustration {
  position: fixed;
  bottom: 40%;
  width: 300px;
  height: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1;
  pointer-events: none;
  animation: fadeIn 1s ease-out;
}

.left {
  left: 20px;
  background-image: url('../assets/left-illustration.svg');
  background-position: left center;
}

.right {
  right: 20px;
  background-image: url('../assets/right-illustration.svg');
  background-position: right center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .background-illustration {
    display: none;
  }
}
</style>
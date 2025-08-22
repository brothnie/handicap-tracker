<!-- Handicap Tracker Login Page -->
<script setup lang="ts">
    import { ref } from 'vue';
    import  axios  from 'axios';
    import { defineEmits } from 'vue';

    let showLogin = ref(true);
    let showRegister = ref(false);
    const emit = defineEmits(['userAuthenticated']);

    const switchToRegisterView = () => {
        showLogin.value = false;
        showRegister.value = true; 
    }

    const switchToLoginView = () => {
        showLogin.value = true;
        showRegister.value = false; 
    }

    // Values used for user registration.
    const usersRegisterName = ref('');
    const usersRegisterEmail = ref('');
    const usersRegisterPassword = ref('');
    const confirmPassword = ref('');

    const registerUser = async () => {
        if (!usersRegisterName.value || !usersRegisterEmail.value || !usersRegisterPassword.value || !confirmPassword.value) {
            alert('Please fill in all fields.');
            return;
        }

        if (usersRegisterPassword.value !== confirmPassword.value) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/handicapApi/CreateUser', {
                name: usersRegisterName.value,
                email: usersRegisterEmail.value,
                password: usersRegisterPassword.value
            });
            console.log('User registered:', response.data);
            alert('Registration successful!');
            switchToLoginView();
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Registration failed. Please try again.');
        }
    }

    const userEmail = ref('');
    const password = ref('');
    const userAuthenticated = ref(false);
    const userId = ref();
    const userName = ref();
    
    const authenticateUser = async () => {
        if (!userEmail.value || !password.value) {
            alert('Please enter your email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/handicapApi/authenticateUser', {
                email: userEmail.value,
                password: password.value
            });
            console.log('User authenticated:', response.data);
            userAuthenticated.value = response.data.authenticated;
            userId.value = response.data.userId;
            userName.value = response.data.userName;
            userEmail.value = response.data.userEmail;
            sendAuthenticatedUserData();

            // Handle successful authentication (e.g., redirect to main app)
        } catch (error) {
            console.error('Error authenticating user:', error);
            alert('Authentication failed. Please check your credentials.');
        }
    }

    const sendAuthenticatedUserData = () => {
        if (userAuthenticated.value) {
            emit('userAuthenticated', { 
                userAuthenticated: userAuthenticated.value,
                userId: userId.value,
                userName: userName.value,
                userEmail: userEmail.value
            });
        }
    }
</script>   

<template>
   <div v-show="showLogin">
        <img src="./icons/handicapTrackerLogo.png" alt="Handicap Tracker Logo" />
        <div class="registerForm">
            <input type="text" placeholder="Email" v-model="userEmail" />
            <input type="password" placeholder="Password" v-model="password" />
            <button class="primary" @click="authenticateUser">Login</button>
            <button class="secondary" style="margin-left: 25px; margin-right: 25px;" @click="switchToRegisterView">Register</button>
        </div>
   </div>
   <div v-show="showRegister">
        <img src="./icons/handicapTrackerLogo.png" alt="Handicap Tracker Logo" />
        <div class="registerForm">
            <h2>Create New User:</h2>
            <input type="text" placeholder="Enter Your Name" v-model="usersRegisterName" />
            <input type="text" placeholder="Enter Your Email" v-model="usersRegisterEmail" />
            <input type="password" placeholder="Enter Your Password" v-model="usersRegisterPassword" />
            <input type="password" placeholder="Confirm Your Password" v-model="confirmPassword" />
            <button class="primary" @click="registerUser">Register</button>
            <button class="secondary" @click="switchToLoginView">Login</button>
        </div>
   </div>
</template>

<style scoped>
    img {
        height: 60vh;
        width: 30vw;
        display: block;
        margin: 0 auto;
    }
    input {
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        padding: 10px;
        width: 75%;
        border-radius: 10px;
        border: 1px solid grey;
        max-width: 25vw;
    }
    button.primary {
        padding: 10px;
        margin: 0 auto;
        margin-bottom: 5px;
        width: 35%;
        border-radius: 10px;
        background-color: #889e75;
        border:none;
        color: white;
        cursor: pointer;
        max-width: 10vw;
        /* display: inline-block; */
    }
    button.secondary {
        padding: 10px;
        margin:0 auto;
        width: 35%;
        border-radius: 10px;
        background-color: grey;
        border: none;
        color: white;
        cursor: pointer;
        max-width: 10vw;
        /* display: inline-block; */
        
    }
    .registerForm {
        border-radius: 10px;
        border: 2px solid black;
        background-color: lightgrey;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 30vw;
        margin: 0 auto;
        padding: 20px;
    }
</style>
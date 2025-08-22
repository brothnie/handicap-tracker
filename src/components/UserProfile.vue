<script setup lang="ts">
import { defineProps } from 'vue';
import { ref } from 'vue';
import {defineEmits} from 'vue';
import axios from 'axios';

const props = defineProps({
    userId: String,
    userName: String, 
    userEmail: String
});

const emit = defineEmits(['userSignedOut']);

const showChangePassword = ref(false);

const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const updatePassword = () => {
    if (newPassword.value !== confirmNewPassword.value) {
        alert('New passwords do not match.');
        return;
    }
    
    axios.post('http://localhost:3000/handicapApi/changePassword', {
        userId: props.userId,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    }).then(response => {
        if (response.data.success) {
            alert('Password updated successfully.');
            showChangePassword.value = false;
        } else {
            alert('Error updating password: ' + response.data.message);
        }
    }).catch(error => {
        console.error('Error updating password:', error);
        alert('An error occurred while updating the password.');
    });
};

const logOutUser = () => {
    emit('userSignedOut');
};

</script>

<template>
    <div>
        <h1>{{ userName }}</h1>
        <p>{{ userEmail }}</p>
        <button class="primary" @click="showChangePassword = true">Change Password</button>
        <button class="cancel" v-on:click="logOutUser">Log Out</button>
        <div class="changePassword" v-show="showChangePassword">
            <input type="password" v-model="oldPassword" placeholder="Current Password" />
            <input type="password" v-model="newPassword" placeholder="New Password" />
            <input type="password" v-model="confirmNewPassword" placeholder="Confirm New Password" />
            <button class="primary" v-on:click="updatePassword">Update Password</button>
             <button class="cancel" @click="showChangePassword = false">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        align-items: center;
        text-align: center;
        width: 50vw;
        height: 50vh;
        margin: 0 auto;
        flex-direction: column;
        h1 {
            margin: 0 auto;
            margin-top: 15%;
        }
        p {
            margin: 0 auto;
        }
        button.primary {
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: #889e75;
            color: white;
            border: none;
            cursor: pointer;
        }
        button.cancel {
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: grey;
            color: white;
            border: none;
            cursor: pointer;
        }
        div.changePassword {
            border: 1px solid grey;
            border-radius: 10px;
            padding: 10px;
            background-color: lightgrey;
            height: 30vh;
            width: 30vw;
            margin-top: 1%;
            input {
                display: block;
                margin: 10px auto;
                padding: 10px;
                width: 80%;
                border-radius: 5px;
                border: 1px solid grey;
            }
        }
    }
</style>
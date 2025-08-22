<script setup lang="ts">
    import {defineEmits} from 'vue';
    import { defineProps } from 'vue';
    import ScoreCardFinder from './CourseFinder.vue';
    
    const emit = defineEmits(['sectionToShow']);
    const props = defineProps({
        userName: String
    });

    const handleSectionChange = (section: string) => {
        emit('sectionToShow', {
            sectionToShow: section
        });
    }
</script>

<template>
    <div class="menuBar">
        <img v-on:click="handleSectionChange('dataDashboard')" src="./icons/handicapTrackerLogo.png" alt="Handicap Tracker Logo" />
        <button v-on:click="handleSectionChange('enterRoundData')">Enter Round Data</button>
        <button v-on:click="handleSectionChange('handicapData')">Handicap Data</button>
        <button v-on:click="handleSectionChange('FirData')">FIR Data</button>
        <button v-on:click="handleSectionChange('GirData')">GIR Data</button>
        <button v-on:click="handleSectionChange('puttingData')">Putting Data</button>
        <button v-on:click="handleSectionChange('scoreCardFinder')">Get Course Score Card</button>
        <button v-on:click="handleSectionChange('userProfile')" class="profileButton">{{ props.userName || "Profile" }}</button>
    </div>
</template>

<style scoped>
    .menuBar {
        img {
            height: 100%;
            width: 3.5vw;
        }
        display: flex;
        background-color: grey;
        padding: 10px;
        height: 10vh;
        width: 100vw;
        button {
            color: white;
            background-color: transparent;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-size: large;
        }
        .profileButton {
            margin-left: auto;
            margin-right: 30px;
        }
    }
</style>
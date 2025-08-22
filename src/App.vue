<script setup lang="ts">
import HandicapTrackerLogin from './components/HandicapTrackerLogin.vue';
import MenuBar from './components/MenuBar.vue';
import DataDashboard from './components/DataDashboard.vue';
import EnterRoundData from './components/EnterRoundData.vue';
import GirData from './components/GirData.vue';
import FirData from './components/FirData.vue';
import PuttingData from './components/PuttingData.vue';
import HandiCapData from './components/HandiCapData.vue';
import UserProfile from './components/UserProfile.vue';
import { ref } from 'vue';
import _ from 'lodash';
import FindScoreCard from './components/FindScoreCard.vue';
  
  const userAuthenticated = ref(false);
  const userId = ref('');
  const userName = ref('');
  const userEmail = ref('');

  // Constants for showing/hiding components
  const showDataDashboard = ref(false);
  const showScoreCardFinder = ref(false);
  const showEnterRoundData = ref(false);
  const showHandicapData = ref(false);
  const showFirData = ref(false);
  const showGirData = ref(false);
  const showPuttingData = ref(false);
  const showUserProfile = ref(false);

  const handleAuthenticatedData = (data: any) => {
    userAuthenticated.value = data.userAuthenticated;
    showDataDashboard.value = true;

    if (userAuthenticated.value) {
      userId.value = data.userId;
      userName.value = data.userName;
      userEmail.value = data.userEmail;
    }
  }

  const logoutUser = () => {
    userAuthenticated.value = false;
    userId.value = '';
    userName.value = '';
    userEmail.value = '';
    showDataDashboard.value = false;
    showScoreCardFinder.value = false;
    showEnterRoundData.value = false;
    showHandicapData.value = false;
    showFirData.value = false;
    showGirData.value = false;
    showPuttingData.value = false;
    showUserProfile.value = false;
  };

  const handleSectionChange = (data: any) => {
    const section = data.sectionToShow;
    if (section === 'dataDashboard') {
      showDataDashboard.value = true;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'scoreCardFinder') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = true;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'enterRoundData') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = true;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'handicapData') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = true;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'FirData') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = true;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'GirData') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = true;
      showPuttingData.value = false;
      showUserProfile.value = false;
    } else if (section === 'puttingData') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = true;
      showUserProfile.value = false;
    } else if (section === 'userProfile') {
      showDataDashboard.value = false;
      showScoreCardFinder.value = false;
      showEnterRoundData.value = false;
      showHandicapData.value = false;
      showFirData.value = false;
      showGirData.value = false;
      showPuttingData.value = false;
      showUserProfile.value = true;
    } 
  }
</script>

<template>
  <main>
    <div v-show="!userAuthenticated">
      <HandicapTrackerLogin @user-authenticated="handleAuthenticatedData"/>
    </div>
    <div v-show="userAuthenticated">
      <MenuBar @sectionToShow="handleSectionChange" v-bind="{userName: userName}"/>
      <DataDashboard v-if="userId && showDataDashboard" v-bind="{userId}"/>
      <div v-show="showScoreCardFinder">
        <FindScoreCard />
      </div>
      <div v-show="showEnterRoundData">
        <EnterRoundData v-bind="{userId: userId}"/>  
      </div>  
      <div v-if="userId && showHandicapData">
        <HandiCapData v-bind="{userId, userName}"/>
      </div>
      <div v-if="userId && showFirData">
        <FirData v-bind="{userId, userName}"/>
      </div>
      <div v-if="userId && showGirData">
        <GirData v-bind="{userId, userName}"/>
      </div>
      <div v-if="userId && showPuttingData">
        <PuttingData v-bind="{userId, userName}"/>
      </div>
      <div v-show="showUserProfile">
        <UserProfile v-bind="{userId: userId, userName: userName, userEmail: userEmail}" @userSignedOut="logoutUser"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  div {
    height: 100vh;
    width: 100vw;
  }
}
</style>

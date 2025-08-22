<script setup lang="ts">
import CourseFinder from './CourseFinder.vue';
import ScoreCard from './ScoreCard.vue';
import {ref} from 'vue';

const showCourseFinder = ref(true);
const showScoreCard = ref(false);
let selectedCourse = {};
const userSelectedCourse = (courseData: any) => {
    selectedCourse = courseData.selectedCourse.value; 
    console.log('here is the selected course data: ', selectedCourse);
    showCourseFinder.value = false;
    showScoreCard.value = true;
}

</script>

<template>
    <CourseFinder v-if="showCourseFinder" @selectedCourseData="userSelectedCourse"/>
    <ScoreCard v-if="showScoreCard && selectedCourse" v-bind="{selectedCourse: selectedCourse}"/>
</template>

<style scoped>
</style>
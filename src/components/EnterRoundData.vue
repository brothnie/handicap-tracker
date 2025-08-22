<script setup lang="ts">
import { ref } from 'vue';
import {defineProps} from 'vue';
import CourseFinder from './CourseFinder.vue';

const props = defineProps({
    userId: String
});

interface TeeOption {
    tee_name: string;
    course_rating: number;
    slope_rating: number;
    total_yards: number;
}

interface CourseData {
    course_name: string;
    tees: {
        male: Record<string, TeeOption>;
        female: Record<string, TeeOption>;
    };
}

let courseData = ref<CourseData | undefined>(undefined);
const showCourseFinder = ref(true);
const showEnterCourseData = ref(false);
const genderTeeOptions = ['Male', 'Female'];
const selectedTeeGender = ref('');
const selectedTeePlayed = ref(undefined);
const maleTeeOptions = ref<TeeOption[]>([]);
const femaleTeeOptions = ref<TeeOption[]>([]);
const showCourseData = ref(false);
const selectedTeeData = ref();

const numberOfHolesPlayed = ref(18); // Default to 18 holes
const totalScore = ref(0); // Default to 0 total score
const firNumber = ref(0); // Default to 0 FIRs
const girNumber = ref(0); // Default to 0 GIRs
const totalNumberOfPutts = ref(0); // Default to 0 putts
const datePlayed = ref(new Date().toISOString().split('T')[0]); // Default to today's date

const userSelectedCourse = (selectedCourseData: any) => {
    courseData.value = selectedCourseData.selectedCourse.value;

    // Setup gender specific tee options.
    if (courseData) {
        for (let teeOption in courseData.value?.tees.male) {
            maleTeeOptions.value.push(courseData.value.tees.male[teeOption]);
        }

        for (let teeOption in courseData.value?.tees.female) {
            femaleTeeOptions.value.push(courseData.value.tees.female[teeOption]);
        }
    }

    console.log('course data: ', courseData.value);

    showCourseFinder.value = false;
    showEnterCourseData.value = true;
}

const gatherTeeData = () => {
    if (selectedTeeGender.value === 'Male'){
        const teeData = maleTeeOptions.value.find(tee => tee.tee_name === selectedTeePlayed.value);
        selectedTeeData.value = teeData;
    } else if (selectedTeeGender.value === 'Female') {
        const teeData = femaleTeeOptions.value.find(tee => tee.tee_name === selectedTeePlayed.value);
        selectedTeeData.value = teeData;
    }
}

const submitScore = async () => {
    if (!courseData.value || !selectedTeePlayed.value || !selectedTeeData.value) {
        alert('Please select a course and tee before submitting.');
        return;
    } else if (totalScore.value < 0 || totalScore.value > numberOfHolesPlayed.value * 10) {
        alert('Total score must be between 0 and ' + (numberOfHolesPlayed.value * 10));
        return;
    } else if (firNumber.value < 0 || firNumber.value > numberOfHolesPlayed.value) {
        alert('FIRs must be between 0 and ' + numberOfHolesPlayed.value);
        return;
    } else if (girNumber.value < 0 || girNumber.value > numberOfHolesPlayed.value) {
        alert('GIRs must be between 0 and ' + numberOfHolesPlayed.value);
        return;
    } else if (totalNumberOfPutts.value < 0 || totalNumberOfPutts.value > numberOfHolesPlayed.value * 10) {
        alert('Total putts must be between 0 and ' + (numberOfHolesPlayed.value * 10));
        return;
    }

    const roundData = {
        userId: props.userId,
        courseName: courseData.value.course_name,
        datePlayed: datePlayed.value,
        teePlayed: selectedTeePlayed.value,
        courseRating: selectedTeeData.value.course_rating,
        slopeRating: selectedTeeData.value.slope_rating,
        totalYards: selectedTeeData.value.total_yards,
        numberOfHolesPlayed: numberOfHolesPlayed.value,
        totalScore: totalScore.value,
        firNumber: firNumber.value,
        girNumber: girNumber.value,
        totalNumberOfPutts: totalNumberOfPutts.value
    };

    try {
        const response = await fetch('http://localhost:3000/handicapApi/submitRoundData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roundData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert('Round data submitted successfully!');
        resetForm();
    } catch (error) {
        console.error('Error submitting round data:', error);
        alert('Failed to submit round data. Please try again.');
    }
}

const resetForm = () => {
    showCourseFinder.value = true;
    showEnterCourseData.value = false;
    courseData.value = undefined;
    showCourseFinder.value = true;
    showEnterCourseData.value = false;
    selectedTeeGender.value = '';
    selectedTeePlayed.value = undefined;
    maleTeeOptions.value = [];
    femaleTeeOptions.value = [];
    showCourseData.value = false;
    selectedTeeData.value = {};
    numberOfHolesPlayed.value = 18;
    totalScore.value = 0;
    firNumber.value = 0;
    girNumber.value = 0;
    totalNumberOfPutts.value = 0;
}

const toggleShowCourseData = () => {
    if (selectedTeePlayed.value) {
        gatherTeeData();
        showCourseData.value = true;
    } else {
        showCourseData.value = false;
    }
}

</script>

<template>
    <div class="main">
        <h1>Enter Round Data</h1>
        <div>
            <div v-show="showCourseFinder">
                <CourseFinder @selectedCourseData="userSelectedCourse" />
            </div>
            <div v-show="showEnterCourseData">
                <h2>Selected Course:</h2>
                <h3 class="course_name" v-if="courseData">{{ courseData.course_name }}</h3>
                <h3>Select Tee Options:</h3>
                <select v-model="selectedTeeGender" v-on:change="gatherTeeData">
                    <option v-for="option in genderTeeOptions" :value="option">{{ option }}</option>
                </select>
                <h3 v-if="selectedTeeGender !== ''">Select Played Tee</h3>
                <select v-if="selectedTeeGender === 'Male'" v-model="selectedTeePlayed" v-on:change="toggleShowCourseData">
                    <option v-for="teeOption in maleTeeOptions" :value="teeOption.tee_name">{{ teeOption.tee_name }}</option>
                </select>
                <select v-if="selectedTeeGender === 'Female'" v-model="selectedTeePlayed" v-on:change="toggleShowCourseData">
                    <option v-for="teeOption in femaleTeeOptions" :value="teeOption.tee_name">{{ teeOption.tee_name }}</option>
                </select>
                <div v-if="showCourseData">
                    <h3>Course Data: </h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Tee Played</th>
                                <th>Course Rating</th>
                                <th>Slope Rating</th>
                                <th>Total Yards</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ selectedTeePlayed }}</td>
                                <td>{{ selectedTeeData.course_rating }}</td>
                                <td>{{ selectedTeeData.slope_rating }}</td>
                                <td>{{ selectedTeeData.total_yards}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="showCourseData">
                    <h3>Date Played:</h3>
                    <input type="date" v-model="datePlayed" />
                    <h3>Number of Holes Played:</h3>
                    <input type="number" v-model="numberOfHolesPlayed" min="9" max="18" step="9"/>
                    <h3>Round Score</h3>
                    <input type="number" v-model="totalScore" min="0" :max="numberOfHolesPlayed * 10"/>
                    <h3>Number of Fairways in Regulation</h3>
                    <input type="number" v-model="firNumber" min="0" :max="numberOfHolesPlayed"/>
                    <h3>Number of Greens in Regulation</h3>
                    <input type="number" v-model="girNumber" min="0" :max="numberOfHolesPlayed"/>
                    <h3>Total Number of Putts</h3>
                    <input type="number" v-model="totalNumberOfPutts" min="0" :max="numberOfHolesPlayed * 10"/>
                </div>
                <div>
                    <button class="primary" @click="submitScore">Submit Round Data</button>
                    <button v-on:click="resetForm">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    margin: 20px;
    padding: 20px;
    .course_name {
        font-style: italic;
    }
    table {
    background-color: white;
    color: black;
    padding: 10px;
    border: 1px solid grey;
    border-radius: 5px;
    tr {
      padding: 10px;
      border: 1px solid grey;
      td {
        padding: 10px;
        border: 1px solid grey;
        button {
          text-align: center;
          vertical-align: middle;

        } 
      }
    }
  }
}

</style>
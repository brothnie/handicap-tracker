<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { onMounted} from 'vue';

const props = defineProps({
    userId: String, 
    userName: String
});

const handicapData: any = ref([]);
const calculatedHandicap = ref(0);
const handicapLimitedDataErrorMessage = ref('Not enough data to calculate handicap index. Please enter more rounds.');
const showHandicapLimitedDataError = ref(false);    

onMounted(() => {
    getAllHandicapData();
    getCalculatedHandicap();
});

const getCalculatedHandicap = async () => {
  if (!props.userId) {
    alert('User ID is required to fetch handicap index.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/handicapApi/getPlayersHandicapIndex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: props.userId})
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data.errorCode && data.errorCode === 'notEnoughData') {
        showHandicapLimitedDataError.value = true;
    } else {
        showHandicapLimitedDataError.value = false;
        calculatedHandicap.value = data.handicapIndex;
    }
  } catch (error: any) {
    console.error('Error fetching handicap index:', error);
  }
};

const getAllHandicapData = async () => {
    if (!props.userId) {
        alert('User ID is required to fetch handicap data.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/handicapApi/getHandicapData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: props.userId})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        handicapData.value = await response.json();
        console.log('All handicap data:', handicapData.value);
    } catch (error) {
        console.error('Error fetching handicap data:', error);
    }
};
</script>

<template>
    <div class="main">
        <h2>Handicap Data for {{ props.userName }}</h2>
        <h4>Handicap: </h4>
        <p v-if="showHandicapLimitedDataError">{{ handicapLimitedDataErrorMessage }}</p>
        <p v-if="!showHandicapLimitedDataError">{{ calculatedHandicap }}</p>
        <h4>Recent Rounds</h4>
        <table v-if="handicapData.length > 0">
            <thead>
                <tr>
                    <th>Date Played</th>
                    <th>Course Name</th>
                    <th>Course Rating</th>
                    <th>Slope Rating</th>
                    <th>Total Yards</th>
                    <th>Number of Holes Played</th>
                    <th>Tee Played</th>
                    <th>Score</th>
                    <th>FIR</th>
                    <th>GIR</th>
                    <th>Total Putts</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="round in handicapData" :key="round.id">
                    <td>{{ round.datePlayed }}</td>
                    <td>{{ round.courseName }}</td>
                    <td>{{ round.courseRating }}</td>
                    <td>{{ round.slopeRating }}</td>
                    <td>{{ round.totalYards }}</td>
                    <td>{{ round.numberOfHolesPlayed }}</td>
                    <td>{{ round.teePlayed }}</td>
                    <td>{{ round.totalScore }}</td>
                    <td>{{ round.firNumber }}</td>
                    <td>{{ round.girNumber }}</td>
                    <td>{{ round.totalNumberOfPutts }}</td>
                </tr>
            </tbody>        
        </table>
        <p v-if="handicapData.length === 0">No rounds played yet.</p>
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
        margin:10px;
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
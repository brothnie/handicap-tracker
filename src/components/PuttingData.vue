<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { onMounted} from 'vue';

const props = defineProps({
    userId: String, 
    userName: String
});

const puttingData: any = ref([]);
const calculatedPuttingData = ref(0);

onMounted(() => {
    getAllPuttingData();
});

const getCalculatedPuttingData = () => {
    if (puttingData.value.length === 0) {
        calculatedPuttingData.value = 0;
        return;
    }
    let avgPuttsPerRound:any  = [];
    puttingData.value.forEach((round: any) => {
        avgPuttsPerRound.push(round.totalNumberOfPutts / round.numberOfHolesPlayed);
    });
    let totalPuttsAvg = 0;
    avgPuttsPerRound.forEach((putts: number) => {
        totalPuttsAvg += putts;
    });

    const roundedString = (totalPuttsAvg / avgPuttsPerRound.length).toFixed(2);
    calculatedPuttingData.value = parseFloat(roundedString);

}

const getAllPuttingData = async () => {
    if (!props.userId) {
        alert('User ID is required to fetch handicap data.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/handicapApi/getPuttingData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: props.userId})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        puttingData.value = await response.json();
        console.log('All handicap data:', puttingData.value);

        getCalculatedPuttingData();
    } catch (error) {
        console.error('Error fetching handicap data:', error);
        alert('Failed to fetch handicap data. Please try again.');
    }
};
</script>

<template>
    <div class="main">
        <h2>Putting  Data for {{ props.userName }}</h2>
        <h4>Average Number of Putts per Hole: </h4>
        <p>{{ calculatedPuttingData }}</p>
        <h4>Recent Rounds:</h4>
        <table v-if="puttingData.length > 0">
            <thead>
                <tr>
                    <th>Date Played</th>
                    <th>Total Number of Putts</th>
                    <th>Holes Played</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="round in puttingData" :key="round.id">
                    <td>{{ round.datePlayed }}</td>
                    <td>{{ round.totalNumberOfPutts }}</td>
                    <td>{{ round.numberOfHolesPlayed }}</td>
                </tr>
            </tbody>        
        </table>
        <p v-if="puttingData.length === 0">No rounds played yet.</p>
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
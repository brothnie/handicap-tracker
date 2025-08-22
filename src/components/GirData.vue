<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { onMounted} from 'vue';

const props = defineProps({
    userId: String, 
    userName: String
});

const girData: any = ref([]);
const calculatedGIRData = ref(0);

onMounted(() => {
    getAllGIRData();
});

const getCalculatedGIRData = () => {
    if (girData.value.length === 0) {
        calculatedGIRData.value = 0;
        return;
    }
    let totalGIR = 0;
    girData.value.forEach((round: any) => {
        totalGIR += round.girNumber;
    });
    calculatedGIRData.value = totalGIR / girData.value.length;  
}

const getAllGIRData = async () => {
    if (!props.userId) {
        alert('User ID is required to fetch handicap data.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/handicapApi/getGirData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: props.userId})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        girData.value = await response.json();
        console.log('All handicap data:', girData.value);

        getCalculatedGIRData();
    } catch (error) {
        console.error('Error fetching handicap data:', error);
        alert('Failed to fetch handicap data. Please try again.');
    }
};
</script>

<template>
    <div class="main">
        <h2>Greens in Regulation Data for {{ props.userName }}</h2>
        <h4>Greens in Regulation Average: </h4>
        <p>{{ calculatedGIRData }}</p>
        <h4>Recent Rounds:</h4>
        <table v-if="girData.length > 0">
            <thead>
                <tr>
                    <th>Date Played</th>
                    <th>Greens In Regulation</th>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="round in girData" :key="round.id">
                    <td>{{ round.datePlayed }}</td>
                    <td>{{ round.girNumber }}</td>
                </tr>
            </tbody>        
        </table>
        <p v-if="girData.length === 0">No rounds played yet.</p>
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
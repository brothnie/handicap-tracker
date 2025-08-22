<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { onMounted} from 'vue';

const props = defineProps({
    userId: String, 
    userName: String
});

const firData: any = ref([]);
const calculatedFIRData = ref(0);

onMounted(() => {
    getAllFIRData();
});

const getCalculatedFIRData = () => {
    if (firData.value.length === 0) {
        calculatedFIRData.value = 0;
        return;
    }
    let totalFIR = 0;
    firData.value.forEach((round: any) => {
        totalFIR += round.firNumber;
    });
    calculatedFIRData.value = totalFIR / firData.value.length;  
}

const getAllFIRData = async () => {
    if (!props.userId) {
        alert('User ID is required to fetch handicap data.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/handicapApi/getFirData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: props.userId})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        firData.value = await response.json();
        console.log('All handicap data:', firData.value);

        getCalculatedFIRData();
    } catch (error) {
        console.error('Error fetching handicap data:', error);
    }
};
</script>

<template>
    <div class="main">
        <h2>Fairways in Regulation Data for {{ props.userName }}</h2>
        <h4>Fairways in Regulation Average: </h4>
        <p>{{ calculatedFIRData }}</p>
        <h4>Recent Rounds:</h4>
        <table v-if="firData.length > 0">
            <thead>
                <tr>
                    <th>Date Played</th>
                    <th>Fairways In Regulation</th>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="round in firData" :key="round.id">
                    <td>{{ round.datePlayed }}</td>
                    <td>{{ round.firNumber }}</td>
                </tr>
            </tbody>        
        </table>
        <p v-if="firData.length === 0">No rounds played yet.</p>
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
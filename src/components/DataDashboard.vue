<script setup lang="ts">
    import SpeedometerGauge from './SpeedometerGauge.vue';
    import ClockGauge from './ClockGauge.vue';
    import ThermometerGauge from './ThermometerGauge.vue';
    import { onBeforeMount, ref, defineProps } from 'vue';

    const props = defineProps({
        userId: String,
    });
    onBeforeMount(async () => {
        await getAllFIRData(); 
        await getHandicapData();
        await getAllGIRData();
        await getPuttingData();

        allDataLoaded.value = true;
    });

    const allDataLoaded = ref(false);

    let firProps = ref({
        dataValue: 0, 
        gaugeTitle: 'FIR Percentage'
    });

    let handicapProps = ref({
        dataValue: 0, 
        gaugeTitle: 'Current Handicap'
    });

    let girProps = ref({
        dataValue: 0, 
        gaugeTitle: 'GIR Percentage'
    });

    let puttingProps = ref({
        dataValue: 0, 
        gaugeTitle: 'Average Putts per Round'
    });

    const puttingData: any = ref([]);
    const calculatedPuttingData = ref(0);

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
        puttingProps.value.dataValue = calculatedPuttingData.value;

    }

    const getPuttingData = async () => {
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
        }
    };

    const calculatedHandicap = ref(0);

    const getHandicapData = async () => {
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
      calculatedHandicap.value = data.handicapIndex;
      handicapProps.value.dataValue = calculatedHandicap.value;

    //   if (data.errorCode && data.errorCode === 'notEnoughData') {
    //       showHandicapLimitedDataError.value = true;
    //   } else {
    //       showHandicapLimitedDataError.value = false;
    //       calculatedHandicap.value = data.handicapIndex;
    //   }
    } catch (error: any) {
      console.error('Error fetching handicap index:', error);
    }
};
    const girData: any = ref([]);
    const calculatedGIRData = ref(0);

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
        girProps.value.dataValue = calculatedGIRData.value;  
    }

    const getAllGIRData = async () => {
        if (!props.userId) {
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
        }
    };

    const firData: any = ref([]);
    const calculatedFIRData = ref(0);

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
    firProps.value.dataValue = calculatedFIRData.value;  
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
    <div v-if="allDataLoaded">
        <SpeedometerGauge class="gauges" v-bind="handicapProps"/>
        <ClockGauge class="gauges" v-bind="firProps"/>
        <ClockGauge class="gauges" v-bind="girProps"/>
        <ThermometerGauge class="gauges" v-if="puttingProps.dataValue !== undefined" v-bind="puttingProps"/>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .gauges {
            height: 45%;
        }

    }
</style>
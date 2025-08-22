<script setup>
import { ref } from "vue";
import { VueUiSparkgauge } from "vue-data-ui";
import { defineProps } from "vue";

const props = defineProps({
    dataValue: Number, 
    gaugeTitle: String
});


const config = ref({
        theme: '',
        style: {
            fontFamily: 'inherit',
            background: '#FFFFFF',
            height: 84,
            basePosition: 72,
            animation: {
                show: true,
                speedMs: 150
            },
            title: {
                show: true,
                fontSize: 20,
                position: 'top',
                textAlign: 'center',
                bold: true,
                color: '#1A1A1Aff'
            },
            dataLabel: {
                fontSize: 20,
                autoColor: true,
                color: '#1A1A1Aff',
                offsetY: 0,
                bold: true,
                rounding: 0,
                prefix: '',
                suffix: '',
                formatter: null
            },
            colors: {
                min: 'rgba(51, 255, 87, 1)',
                max: 'rgba(255, 87, 51, 1)',
                showGradient: true
            },
            track: {
                autoColor: true,
                color: '#5f8beeff',
                strokeLinecap: 'round'
            },
            gutter: {
                color: '#e1e5e8ff',
                strokeLinecap: 'round'
            }
        }
    });

const dataset = ref({
    value: props.dataValue,
    min: 0,
    max: 55,
    title: props.gaugeTitle
});

</script>
<template>
    <!-- Using a wrapper is optional -->
    <div :style="{ width: '300px'}">
        <VueUiSparkgauge
            :config="config"
            :dataset="dataset"
        />
    </div>
</template>
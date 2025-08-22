<script setup>
import { ref } from "vue";
import { VueUiWheel } from "vue-data-ui";
import { defineProps } from "vue";

const props = defineProps({
    dataValue: Number, 
    gaugeTitle: String
})

const config = ref({
        responsive: false,
        theme: '',
        style: {
            fontFamily: 'inherit',
            chart: {
                backgroundColor: 'white',
                color: '#1A1A1Aff',
                animation: {
                    use: true,
                    speed: 0.5,
                    acceleration: 1
                },
                layout: {
                    wheel: {
                        ticks: {
                            type: 'classic',
                            rounded: true,
                            inactiveColor: '#e1e5e8',
                            activeColor: '#6376DD',
                            sizeRatio: 0.9,
                            quantity: 100,
                            strokeWidth: 5,
                            gradient: {
                                show: true,
                                shiftHueIntensity: 10
                            }
                        }
                    },
                    innerCircle: {
                        show: false,
                        stroke: '#e1e5e8ff',
                        strokeWidth: 1
                    },
                    percentage: {
                        show: true,
                        fontSize: 48,
                        rounding: 0,
                        bold: true,
                        formatter: null
                    }
                },
                title: {
                    text: props.gaugeTitle || 'Gauge Title',
                    color: '#1A1A1Aff',
                    fontSize: 20,
                    bold: true,
                    textAlign: 'center',
                    paddingLeft: 0,
                    paddingRight: 0,
                    subtitle: {
                        color: '#A1A1A1ff',
                        text: '',
                        fontSize: 16,
                        bold: false
                    }
                }
            }
        },
        userOptions: {
            show: false,
            showOnChartHover: false,
            keepStateOnChartLeave: true,
            position: 'right',
            buttons: {
                tooltip: false,
                pdf: true,
                csv: false,
                img: true,
                table: false,
                labels: false,
                fullscreen: true,
                sort: false,
                stack: false,
                animation: false,
                annotator: true
            },
            callbacks: {
                animation: null,
                annotator: null,
                csv: null,
                fullscreen: null,
                img: null,
                labels: null,
                pdf: null,
                sort: null,
                stack: null,
                table: null,
                tooltip: null
            },
            buttonTitles: {
                open: 'Open options',
                close: 'Close options',
                pdf: 'Download PDF',
                img: 'Download PNG',
                fullscreen: 'Toggle fullscreen',
                annotator: 'Toggle annotator'
            },
            print: {
                allowTaint: false,
                backgroundColor: '#FFFFFFff',
                useCORS: false,
                onclone: null,
                scale: 2,
                logging: false
            }
        }
    });

const dataset = ref({
    percentage: props.dataValue || 0
});

</script>
<template>
    <!-- Using a wrapper is optional -->
    <div :style="{ width: '300px'}">
        <VueUiWheel
            :config="config"
            :dataset="dataset"
        />
    </div>
</template>
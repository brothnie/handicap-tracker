<script setup>
import { ref } from "vue";
import { VueUiThermometer } from "vue-data-ui";
import { defineProps } from "vue";
import "vue-data-ui/style.css"; // If you are using multiple components, place this style import in your main

const props = defineProps({
    dataValue: Number,
    gaugeTitle: String
});

const config = ref({
        theme: '',
        customPalette: [],
        style: {
            fontFamily: 'inherit',
            chart: {
                backgroundColor: '#FFFFFFff',
                color: '#1A1A1Aff',
                height: 360,
                thermometer: {
                    width: 48
                },
                padding: {
                    top: 12,
                    right: 64,
                    bottom: 12,
                    left: 64
                },
                graduations: {
                    show: true,
                    sides: 'both',
                    height: 2,
                    stroke: '#e1e5e8ff',
                    strokeWidth: 1,
                    showIntermediate: true,
                    gradient: {
                        show: true,
                        intensity: 20
                    }
                },
                animation: {
                    use: true,
                    speedMs: 1000
                },
                label: {
                    fontSize: 20,
                    rounding: 1,
                    bold: true,
                    color: '#1A1A1Aff',
                    prefix: '',
                    suffix: '',
                    formatter: null
                }
            },
            title: {
                text: props.gaugeTitle,
                color: '#1A1A1Aff',
                fontSize: 20,
                bold: true,
                textAlign: 'center',
                paddingLeft: 0,
                paddingRight: 0,
                // subtitle: {
                //     color: '#A1A1A1ff',
                //     text: '(last 10 rounds)',
                //     fontSize: 12,
                //     bold: true
                // }
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
    value: props.dataValue,
    from: 1,
    to: 5,
    steps: 10,
    colors: {
        from: '#ff0019',
        to: '#5dee9c'
    }
});

</script>
<template>
    <!-- Using a wrapper is optional -->
    <div :style="{ width: '150px'}">
        <VueUiThermometer
            :config="config"
            :dataset="dataset"
        />
    </div>
</template>
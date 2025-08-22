<script setup lang="ts">
    import {ref} from 'vue';
    import {defineProps} from 'vue';
    import { onMounted } from 'vue';

    const props = defineProps({
        selectedCourse: {
            type: Object, 
            required: true, 
            default: null
        }
    });

    let maleTees = ref(props.selectedCourse.tees.male);
    let femaleTees = ref(props.selectedCourse.tees.felmale);

    const getTextColor = function(teeName: string) {
        let teeNameLower = teeName.split(' ')[0].toLocaleLowerCase();
        if (teeNameLower.toLocaleLowerCase() === 'white') {
          return 'grey';
        } else {
          return teeNameLower;
        }
  }
</script>

<template>
    <div class="courseHeader">
      <h3>{{ props.selectedCourse.course_name }}</h3>
      <h4>{{ props.selectedCourse.location.address }}</h4>
    </div>
    <div id="courseScoreCardDiv">
      <table>
        <tbody>
          <tr>
            <td><span>Hole</span></td>
            <td v-for="n in 18" :key=n>{{ n }}</td>
            <td>Total</td>
          </tr>
          <tr v-for="tee in maleTees" :key=tee.tee_name>
            <td> 
              <span :style="{color: getTextColor(tee.tee_name)}">{{ tee.tee_name }}</span>
            </td>
            <td v-for="hole in tee.holes">
              <span>{{ hole.yardage}}</span>
            </td>
            <td> {{ tee.total_yards }}</td>
          </tr>
          <tr>
            <td>Men's Hcp</td>
            <td v-for="hole in props.selectedCourse.tees.male[0].holes"><span>{{ hole.handicap }}</span></td>
          </tr>
          <tr>
            <td style="width: 100%; height: 20px; border: none;"></td>
          </tr>
          <tr>
            <td>Par</td>
            <td v-for="hole in maleTees[0].holes">
              <td style="border: none;"><span>{{ hole.par }}</span></td>
            </td>
            <td><span>{{ maleTees[0].par_total }}</span></td>
          </tr>
          <tr>
            <td style="width: 100%; height: 20px; border: none;"></td>
          </tr>
          <tr v-for="tee in femaleTees" :key="tee.tee_name">
            <td :style="{color: getTextColor(tee.tee_name)}">{{ tee.tee_name }}</td>
            <td v-for="hole in tee.holes">
              <span>{{ hole.yardage }}</span>
            </td>
            <td>{{ tee.total_yards }}</td>
          </tr>
          <tr>
            <td>Ladies' Hcp</td>
            <td v-for="hole in props.selectedCourse.tees.female[0].holes"><span>{{ hole.handicap }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<style scoped>
    #scoreCardDiv{
      margin-top: 15px;
    }
    .courseHeader {
    text-align: center;
    margin: 20px 0;
  }
  table {
    max-width: 100vw;
    min-width: 50vw;
    width: 50vw;
    margin: 0 auto;
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
</style>
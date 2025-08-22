<script setup lang="ts">
    import { ref } from 'vue';
    import { defineEmits } from 'vue';
    import _ from 'lodash';
    let courseName = '';
    let showCourseSelector = true;
    let showCourseList = false;
    let courseList = ref(<any>[]);
    let selectedCourse = ref({});
    

    const emit = defineEmits(['selectedCourseData']);
    
    const searchForCourse = async function (){
    const url = `https://api.golfcourseapi.com/v1/search/?search_query=${courseName}`
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Key IMWVZEJYOVZVVXF753HHZW5TGY'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filteredData = _.uniqBy(data.courses, 'course_name');
      courseList.value = filteredData;
      showCourseList = true;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }

  const selectCourse = function (courseId: number) {
    selectedCourse.value = courseList.value.find(course => course.id === courseId);
    emit('selectedCourseData', {
      selectedCourse
    });
  }

  
</script>

<template>
    <div id="scoreCardDiv" v-show="showCourseSelector">
      <label>Enter course name:</label>
      <input type="text" placeholder="Course Name" v-model="courseName"/>
      <button v-on:click="searchForCourse">Search</button>
    </div>
    <div id="courseListDiv" v-show="showCourseList">
      <table>
        <thead>
          <tr>
            <td>Course Name</td>
            <td>Course Address</td>
            <td>Select Course</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courseList" :key=course.id>
            <td>{{ course.course_name }}</td>
            <td>{{ course.location.address }}</td>
            <td><button v-on:click="selectCourse(course.id)">Select</button></td>
          </tr> 
        </tbody>
      </table>
    </div>
    
</template>

<style scoped>
  #courseListDiv {
    margin: 0 auto;
    width: 50vw;
    height: 100vh;
    padding: 20px;
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
<script setup lang="ts">
import { type Ref, ref, reactive, nextTick } from "vue";
import { type Course } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import { watch } from "vue";
const selected2 = ref("");
const selectedCourse = ref<Course>(); // 新增，用于存储选中的课程信息
let flag = ref(false);
//console.log(selectChange(1));
const loading = ref(true); // 添加加载状态
let courses: Ref<Course[]> = ref([]);
async function fetchData() {
  try {
    courses = await TeacherService.listCoursesService(); // 假设将课程的id作为value，name作为label来处理数据格式 //console.log(result.value) // result.value.forEach((element) => { //   courses.value.push({ id: element.id, name: element.name }); // });
    console.log("**********");
    console.log(courses.value);
    loading.value = false; // 数据加载完成，设置loading为false // 使用nextTick等待DOM更新完成后再查看情况 //await nextTick();
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchData(); // 调用函数
//回调
const selectChange = (val: any) => {
  console.log("selectChange:", val); //console.log(selected2.value); //const selectedId = val as number; // 假设传入的val是课程id，进行类型断言（根据实际情况调整）
  const foundCourse = courses.value.find((course) => course.id === val);
  selectedCourse.value = foundCourse;
  console.log(selectedCourse.value);

  return val;
};
// console.log("hhhhhhhh");
// console.log(courses.value);
let hour = ref();
async function getHours(id: any) {
  try {
    console.log("888888888");
    console.log(id);
    hour.value = await TeacherService.getCourseCountService(id);
    flag.value = true;
    console.log("6666666666");
    console.log("234" + hour.value);
  } catch (error) {
    console.error("Error:", error);
  }
}
watch(selected2, (newValue) => {
  if (newValue) {
    // console.log("sdfsd" + selected2.value);
    getHours(selected2.value);
  }
});
</script>
<template>
     
  <div style="width: 300px">
           
    <!-- <h3>动态下拉框（修改后使用课程数据）</h3> -->
           
    <el-select
      v-model="selected2"
      :loading="loading"
      @change="selectChange"
      placeholder="请选择你要预约的课程"
    >
                 
      <el-option
        v-for="item in courses"
        :value="item.id"
        :label="item.name"
        :key="item.id"
      />
             
    </el-select>
       
  </div>
     
  <div class="course" v-if="selected2 && flag">
           
    <h4>{{ selectedCourse?.name }}</h4>
           
    <p>班级：{{ selectedCourse?.clazz }}</p>
           
    <p>已选学时/实验学时：{{ hour }} / {{ selectedCourse?.experimentHour }}</p>
           
    <p>学期：{{ selectedCourse?.semester }}</p>
    <div>{{ flag }}</div>
    <!-- 根据实际的Course类型定义，添加更多要展示的课程信息 -->
       
  </div>
</template>

<style scoped></style>

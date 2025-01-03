<template>
  <div style="width: 300px">
    <!-- <h3>动态下拉框（修改后使用课程数据）</h3> -->
    <el-select
      v-model="selected2"
      :loading="loading"
      @change="handleSelectChange"
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
  <div class="course" v-if="selected2">
    <p>课程名称：{{ selectedCourse?.name }}</p>
    <p>班级：{{ selectedCourse?.clazz }}</p>
    <p>已选学时/实验学时：{{ hour }} / {{ selectedCourse?.experimentHour }}</p>
    <p>学期：{{ selectedCourse?.semester }}</p>
    <h3 v-if="hour && selectedCourse && hour === selectedCourse.experimentHour">
      该课程学时已预约完成，可到当前预约中查看预约记录，点击下方实验室标签可以查看该实验室的所有预约情况
    </h3>
    <h3 v-else>
      该课程学时未预约完成，点击下方实验室标签可以进行课程预约并查看该实验室的所有预约情况
    </h3>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, reactive, nextTick, onMounted } from "vue";
import { type Course } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";

const selected2 = ref("");
const selectedCourse = ref<Course>();

// 新增的函数，用于处理下拉框选择事件变化
const handleSelectChange = (val: any) => {
  selectChange(val);
  getHours(val);
  getLabs(val);
};

const loading = ref(true);
let courses: Ref<Course[]> = ref([]);
async function fetchData() {
  try {
    courses = await TeacherService.listCoursesService();
    console.log("**********");
    console.log(courses.value);
    loading.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
}
onMounted(() => {
  fetchData();
});

let hour = ref();
async function getHours(id: any) {
  try {
    console.log("888888888");
    console.log(id);
    const result = await TeacherService.getCourseCountService(id);
    hour.value = result !== null ? result : "0";
    console.log("6666666666");
    console.log(hour.value);
  } catch (error) {
    console.error("Error:", error);
  }
}
let goodlabs = ref();
let badlabs = ref();
async function getLabs(id: any) {
  try {
    let data = ref();
    data.value = await TeacherService.getLabs(id);
    console.log("777777777");
    console.log(data.value.value);
    let labs = data.value.value;
    const { 座位充足实验室, 座位不够实验室 } = labs;
    console.log(座位充足实验室);
    console.log(座位不够实验室);

    // 将座位充足实验室的值赋值给goodlabs数组
    if (data["座位充足实验室"]) {
      goodlabs.value = data["座位充足实验室"];
    }

    // 将座位不够实验室的值赋值给badlabs数组
    if (data["座位不够实验室"]) {
      badlabs.value = data["座位不够实验室"];
    }

    // 可以在这里添加后续逻辑，比如基于赋值后的数组进行渲染等操作
    // 例如，简单打印一下赋值后的数组（仅为示例）
    console.log("goodlabs:", goodlabs.value);
    console.log("badlabs:", badlabs.value);
  } catch (error) {
    console.error("Error:", error);
  }
}

const selectChange = (val: any) => {
  console.log("selectChange:", val);
  const foundCourse = courses.value.find((course) => course.id === val);
  selectedCourse.value = foundCourse;
  console.log(selectedCourse.value);
  console.log("11111111111");
  console.log(selected2.value);
};
</script>

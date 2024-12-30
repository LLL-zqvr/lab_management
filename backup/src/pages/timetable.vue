<template>
  <div class="timetable w100 h100">
    <div class="time-b w100">
      <div class="time-detail">{{ startTime }} - {{ endTime }}</div>
      <div class="time-controller">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            @click="changeCount(1), getWeek(count)"
          ></el-button>
          <el-button round class="date-btn">本周</el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            @click="changeCount(-1), getWeek(count)"
          ></el-button>
        </el-button-group>
      </div>
    </div>
    <div class="timetable-b w100">
      <table class="timetable-content w100">
        <thead>
          <tr>
            <th></th>
            <th v-for="(item1, index1) in weeks" :key="index1">
              {{ "周" + numberToChinease(item1 + 1, "week") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item2, index2) in maxCourseLength" :key="index2">
            <td>
              <p>{{ "第" + numberToChinease(item2) + "节" }}</p>
            </td>
            <template v-for="(item3, index3) in weeks">
              <td
                v-if="true"
                :key="index3"
                :rowspan="
                  showData(index3, index2 + 1).subject &&
                  showData(index3, index2).subject ===
                    showData(index3, index2 + 1).subject
                    ? 2
                    : ''
                "
                :style="[
                  {
                    display:
                      showData(index3, index2 - 1).subject &&
                      showData(index3, index2 - 1).subject ===
                        showData(index3, index2).subject
                        ? 'none'
                        : '',
                  },
                ]"
              >
                <div
                  class="dmsjandjs-b"
                  :style="[
                    {
                      background: showData(index3, index2).index
                        ? getRandomColor()
                        : '#FFFFFF',
                    },
                    { color: '#fff' },
                    { borderRadius: '15px' },
                    { padding: '12px' },
                    { height: '100%' },
                  ]"
                >
                  <p>
                    {{ showData(index3, index2).startTime }}
                    {{ showData(index3, index2).startTime ? "-" : "" }}
                    {{ showData(index3, index2).endTime }}
                  </p>
                  <p>{{ showData(index3, index2).subject }}</p>
                  <p>{{ showData(index3, index2).major }}</p>
                  <p>{{ showData(index3, index2).class }}</p>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import moment from "moment";
import { weekCourse, colorList } from "@/data/timeTable1";

const startTime = ref("2022.10.17");
const endTime = ref("2022.10.23");
const colorListRef = ref(colorList);
const weekCourseRef = ref(weekCourse);
const weeks = ref<number[]>([]);
const maxCourseLength = ref(0);
const count = ref(0);

const changeCount = (i: number) => {
  count.value += i;
};

const sortData = () => {
  weekCourseRef.value.sort((a, b) => a.week - b.week);
  weekCourseRef.value.forEach((item) => {
    item.courses.sort((a, b) => a.index - b.index);
  });
};

const init = () => {
  weeks.value = [];
  maxCourseLength.value = 0;

  weeks.value = weekCourseRef.value.map((item) => {
    let max = 0;

    item.courses.forEach((course) => {
      maxCourseLength.value = Math.max(maxCourseLength.value, course.index);
      max = Math.max(max, course.index);
    });

    if (item.courses.length < max) {
      for (let i = 0; i < max; i++) {
        if (!item.courses[i] || item.courses[i].index !== i + 1) {
          item.courses.splice(i, 0, {
            index: i + 1,
            subject: "",
            startTime: "",
            endTime: "",
            major: "",
            class: "",
          });
        }
      }
    }

    return item.week;
  });
};

const showData = (weekIndex: number, courseNum: number) => {
  const week = weekCourseRef.value[weekIndex];
  if (
    week &&
    week.courses[courseNum] &&
    week.courses[courseNum].index === courseNum + 1
  ) {
    return week.courses[courseNum];
  }
  return {
    index: "",
    subject: "",
    startTime: "",
    endTime: "",
    major: "",
    class: "",
  };
};

const numberToChinease = (n: number, identifier?: string) => {
  const chnArr = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二",
  ];
  return identifier === "week" && (n === 0 || n === 7) ? "日" : chnArr[n];
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorListRef.value.length);
  return colorListRef.value[randomIndex];
};

const getWeek = (i: number) => {
  const weekOfDay = parseInt(moment().format("E"));
  const lastMonday = moment()
    .subtract(weekOfDay + 7 * i - 1, "days")
    .format("YYYY-MM-DD");
  const lastSunday = moment()
    .subtract(weekOfDay + 7 * (i - 1), "days")
    .format("YYYY-MM-DD");
  startTime.value = lastMonday;
  endTime.value = lastSunday;
};

onMounted(() => {
  sortData();
  init();
  getWeek(0);
});
</script>

<style scoped lang="scss">
/* 样式保持不变 */
</style>

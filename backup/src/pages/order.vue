<template>
  <div class="timetable">
    <div class="timetable-controller">
      <el-button
        type="primary"
        size="large"
        style="margin-top: 20px; margin-left: 15px"
        v-for="number in 18"
        @click="chooseWeek(number)"
        :plain="selectButton"
      >
        第{{ number }}周
      </el-button>
    </div>
    <div class="timetable-contain">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(weekOfDay1, index) in weekofdays" :key="index">
              {{ "周" + numberToChinease(weekOfDay1 + 1, "week") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- section1,index1指的是最左边的第几节(写死的) -->
          <tr v-for="(section1, index1) in [1, 3, 5, 7, 9, 11]" :key="index1">
            <td>
              <p>
                {{
                  "第" +
                  numberToChinease(section1) +
                  numberToChinease(section1 + 1) +
                  "节"
                }}
              </p>
            </td>
            <template
              v-for="(section2, index2) in [1, 2, 3, 4, 5, 6, 7]"
              :key="section2"
            >
              <td class="course-box-background">
                {{ index1 }}
                {{ section2 }}
                <template v-for="(section3, index3) in weekSelectedRef">
                  <div
                    class="course-box"
                    v-if="
                      section2 &&
                      section2 == section3.weekofday &&
                      showData(index1 + 1, section3.weekofday) != null
                    "
                  >
                    <p>{{ showData(index1 + 1, section3.weekofday)?.name }}</p>
                    <p>{{ showData(index1 + 1, section3.weekofday)?.clazz }}</p>
                    <p>
                      {{ showData(index1 + 1, section3.weekofday)?.labName }}
                    </p>
                  </div>
                </template>
              </td>
            </template>

            <!-- section2,index2按列来算，如第一列都为0，第二列都为1 -->

            <!-- <template v-for="(section2, index2) in weekSelectedRef">
                  <td
                    class="course-box-background"
                    v-if="true"
                    :key="index2"
                    :rowspan="
                      showData(index2, index1 + 1).name &&
                      showData(index2, index1).name ===
                        showData(index2, index1 + 1).name
                        ? 2
                        : ''
                    "
                  >
                    <div class="course-box">
                      <p>
                        {{ showData(index2, index1).name }}
                      </p>
                      <p>
                        {{ showData(index2, index1).clazz }}
                      </p>
                      <p>
                        {{ showData(index2, index1).section }}
                      </p>
                    </div>
                  </td>
                </template> -->
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div v-for="(section2, index2) in weekSelectedRef" :key="index2">
        {{ section2 }}
      </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from "vue";
import moment from "moment";
import { weeks, weekofdays } from "@/data/timeTable2";
import type { Course, Week } from "@/data/interface";

//数据
let weeksWorked = ref<number[]>([]);
// 将数字123转成中文的一二三
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
let maxCourseLength = ref(0);
let weeksRef = ref(weeks);
let selectButton = ref(true);

// 选中的那一周,既week值相同

let weekSelected = weeks;
let weekSelectedRef = ref(weekSelected);
//方法

//选中哪一周
function chooseWeek(num: number) {
  selectButton.value = true;
  weekSelectedRef.value = [];

  weeksRef.value.forEach((item) => {
    if (item.week == num) {
      weekSelectedRef.value.push(item);
    }
  });
  // console.log(weekSelected);
  // console.log(weekSelectedRef);
}

//获取当前周
function getWeek() {
  //获得当前日期是第几周的方法
  var year = new Date().getFullYear();
  // +是将字符串转成数字
  var week = +moment(new Date()).format("E"); //获得今天是星期几
  var startweek = +moment(new Date(year + "-09-01")).format("E"); //获得今年的9月1号是星期几
  //今天到9月1号的时间戳之差
  var millisDiff =
    new Date(moment().format("yyyy-MM-DD")).getTime() -
    new Date(year + "-09-01").getTime();
  var days =
    (millisDiff -
      week * (24 * 60 * 60 * 1000) -
      (7 - startweek) * (24 * 60 * 60 * 1000)) /
    86400000;
  // console.log("现在是第" + days);
  return days / 7 + 2;
  //这里加的2代表的是本周和今年9月1号所在的那一周
}

//数据排序，方便后面的合并
function sortData() {
  // 这里表明的是降序排序
  weeksRef.value.sort((a, b) => a.weekofday - b.weekofday);

  weeksRef.value.forEach((item) => {
    item.courses.sort((a, b) => a.section - b.section);
  });
}

//showData
// 指定周（weekSelectedRef）,指定节(),看指定天有没有该节
const showData = (weekSection: number, weekOfDay: number) => {
  console.log(weekSection, weekOfDay);
  // 若该天是周二，则传来的weekOfDay是2；
  for (let i = 0; i < weekSelectedRef.value.length; i++) {
    if (weekSelectedRef.value[i].weekofday == weekOfDay) {
      let day = weekSelectedRef.value[i];
      for (let j = 0; j < day.courses.length; j++) {
        if (day.courses[j].section == weekSection) {
          return day.courses[j];
        }
      }
    }
  }

  return null;
};
function init(num: number) {
  if (num == getWeek()) {
    console.log(num, getWeek());
    selectButton.value = false;
  } else {
    console.log(num, getWeek());
    selectButton.value = true;
  }
}

// 挂载的时候就进行数据的排序和课表初始化
// onMounted(() => {
sortData();
chooseWeek(getWeek());
// });

//合并相邻列

//想实现的小设计：
//1.当检测到是本周时，按钮的文本为“本周”
</script>

<style scoped>
/* 样式保持不变 */
.time-controller .el-button {
  /* margin-left: 10px; */
  /* margin-top: 20px; */
}
.time-controller .el-button > span {
  size: 30px;
}
.course-box {
  background: blue;

  color: black;

  border-radius: 15px;

  padding: 12px;

  text-align: center;

  /* height: 20px; */
  /* width: 20px; */
}
.course-box-background {
  background: grey;
  width: 97px;
  height: 223px;
  padding: 15px;
}
.el-button:active {
  color: aquamarine;
}
.el-button:focus {
  background: #409eff;
  border-color: #409eff;
  color: aliceblue;
}
</style>

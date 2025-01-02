<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCalendarStore } from "@/stores/CalendarStore";
import { TeacherService } from "@/services/TeacherService";

// 数据与状态
const weekOfDays = [0, 1, 2, 3, 4, 5, 6]; // 一周天数
const data = ref([]); // 后端课程数据
const calendarStore = useCalendarStore();
const currentWeek = calendarStore.getWeek(); // 当前周次

const weeks: any = ref([]); // 所有周次数据
const weekSelected = ref([]); // 当前选中周的课程数据
const selectedButton = ref(currentWeek); // 当前选中的按钮

// 将数字转换为中文
const numberToChinese = (n: number, identifier?: string) => {
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

// 获取课程数据并整理
const fetchData = async () => {
  try {
    const response = await TeacherService.listCoursesByTid();
    const courses = response.value;

    // 整理课程数据到周次
    const weeksMap: Record<number, any[]> = {};

    courses.forEach(
      ({
        appointment: { week, dayofweek, labName, section },
        course: { clazz, name },
      }) => {
        if (!weeksMap[week]) {
          weeksMap[week] = [];
        }
        weeksMap[week].push({
          dayofweek,
          clazz,
          name,
          labName,
          section,
        });
      }
    );

    weeks.value = Object.entries(weeksMap).map(([week, courses]) => ({
      week: Number(week),
      courses,
    }));

    chooseWeek(currentWeek); // 默认选择当前周次
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

// 切换周次
const chooseWeek = (week: number) => {
  const selectedWeek = weeks.value.find((w: any) => w.week === week);
  weekSelected.value = selectedWeek ? selectedWeek.courses : [];
};

// 选择按钮
const selectButton = (number: number) => {
  selectedButton.value = number;
  chooseWeek(number);
};

// 根据周次和节次筛选课程
const showData = (weekSection: number, weekOfDay: number) => {
  return weekSelected.value.find(
    (course: any) =>
      course.dayofweek === weekOfDay && course.section === weekSection
  );
};

// 初始化数据
onMounted(fetchData);
</script>

<template>
  <div class="timetable">
    <div class="timetable-controller">
      <el-button
        v-for="number in 19"
        :key="number"
        class="el-button"
        size="large"
        style="margin-top: 20px; margin-left: 15px"
        :type="number === selectedButton ? 'primary' : 'default'"
        :plain="number !== selectedButton"
        @click="selectButton(number)"
      >
        {{ number === currentWeek ? "本周" : `第${number}周` }}
      </el-button>
    </div>

    <div class="timetable-contain">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(day, index) in weekOfDays" :key="index">
              {{ "周" + numberToChinese(day + 1, "week") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, index1) in [1, 3, 5, 7, 9, 11]" :key="index1">
            <td>
              {{
                "第" +
                numberToChinese(section) +
                numberToChinese(section + 1) +
                "节"
              }}
            </td>
            <td
              v-for="day in weekOfDays"
              :key="day"
              class="course-box-background"
            >
              <div v-if="showData(section, day + 1)" class="course-box">
                <p>{{ (showData(section, day + 1) as any)?.name }}</p>
                <p>{{ (showData(section, day + 1) as any)?.clazz }}</p>
                <p>{{ (showData(section, day + 1) as any)?.labName }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.timetable {
  padding: 10px;
  padding-top: 0;
  width: 1000px;
}
.timetable-controller .el-button {
  margin-left: 10px;
}
.timetable p,
td {
  font-size: 12px;
  text-align: center;
}
.timetable-contain {
  margin-top: 20px;
}
.course-box {
  display: inline-block;
  background: blue;
  width: 60%;
  height: 60%;
  color: black;
  border-radius: 15px;
  padding: 12px;
  text-align: center;
}
.course-box-background {
  text-align: center;
  background: grey;
  width: 75px;
  height: 140px;
  padding: 2px;
}
.el-button:focus {
  background: #409eff;
  border-color: #409eff;
  color: aliceblue;
}
</style>

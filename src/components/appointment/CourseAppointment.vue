<template>
  <div class="timetable">
    <table>
      <!-- 头部显示星期 -->
      <thead>
        <tr>
          <th>课程/星期</th>
          <th v-for="day in state.days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- 纵向课时（section） -->
        <tr v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <td>第{{ section}}节</td>
          <td v-for="(day, dayIndex) in state.days" :key="dayIndex">
            <div class="course-cell" :class="getCourseClass(sectionIndex, dayIndex)">
              {{ getCourse(sectionIndex, dayIndex) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive, } from 'vue';

    const state = reactive({
      days: ['一', '二', '三', '四', '五', '六', '日'], // 星期
      sections: [1, 2, 3, 4], // 课时（仅作为标识，实际使用带标签的数组）
      timetable: [
        // 课表数据：二维数组
        // 每个元素对应一个时间段 (section) 和一周的 7 天
        // 行是课时（section），列是星期（day）
        // 'Math', 'English' 表示课程名称，空字符串表示没有课
        ['Math', 'English', '', '', 'Physics', '', 'Computer'], // 第1节
        ['', 'Math', 'Chemistry', '', '', 'History', ''], // 第2节
        ['Biology', '', '', 'Computer', '', '', ''], // 第3节
        ['Physics', '', 'Math', 'English', '', 'Biology', ''] // 第4节
      ]
    });

    // 获取当前节次和星期对应的课程
    const getCourse = (sectionIndex:any, dayIndex:any) => {
      return state.timetable[sectionIndex][dayIndex] || ''; // 如果没有课程，则显示空
    };

    // 获取当前节次和星期对应的样式
    const getCourseClass = (sectionIndex:any, dayIndex:any) => {
      const course = getCourse(sectionIndex, dayIndex);
      return course ? 'has-course' : 'no-course'; // 有课与没课的样式区分
    };

</script>

<style scoped>
.timetable {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

table {
  width: 100%;
  border: 1px solid #ccc;
}

th, td {
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}

.course-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border: 1px solid #ccc;
}

.has-course {
  background-color: #8fc7ff;
}

.no-course {
  background-color: #f9f9f9;
}
</style>

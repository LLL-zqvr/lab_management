import { useDelete, useGet, usePost } from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { useCourseCountStore } from "@/stores/CoursesStore";
import { type Appointment, type Course } from "@/types/index";
import { StoreCache, ELLoading } from "./Decorators";
import { useCalendarStore } from "@/stores/CalendarStore";
import { useCoursesTableCountStore } from "@/stores/CoursesTableStore";
import { useLabsStore } from "@/stores/LabsStore";
import { useAllCoursesTableStore } from "@/stores/AllCoursesTableStore";
import { ElMessage } from "element-plus";
import axios from "@/axios";
const coursesStore = useCoursesStore();
const courseTableStore = useCoursesTableCountStore();
const courseCountStore = useCourseCountStore();
const labsStore = useLabsStore();
const allCoursesTableStore = useAllCoursesTableStore();
export class TeacherService {
  // 获取该老师本学期所有的课程
  @StoreCache(coursesStore.coursesS)
  @ELLoading()
  static async listCoursesService() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    console.log("你将要请求老师所有的课程数据");
    const data = await useGet(`teacher/courses/${semester}`);
    return data as unknown as Ref<Course[]>;
  }

  //根据老师id获取该老师本学期的所有课程(课表)
  @StoreCache(courseTableStore.coursesTable)
  @ELLoading()
  static async listCoursesByTid() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    const data = await useGet(`teacher/coursetable/${semester}`);
    return data as any;
  }
  @StoreCache(courseCountStore.count)
  @ELLoading()
  static async getCourseCountService(courseId: any) {
    console.log("你将要请求老师的指定课程已预约的学时");
    const hour = await useGet(`teacher/hours/${courseId}`);
    return hour as unknown as string;
  }

  @StoreCache(labsStore.labs)
  @ELLoading()
  static async getLabs(courseId: any) {
    try {
      const url = `teacher/labs/${courseId}`;
      console.log("即将发起请求的URL:", url);
      const lab = await useGet(url);
      return lab as unknown as object;
    } catch (error) {
      console.error("请求课程学时信息失败，错误信息:", error);
      throw error;
    }
  }

  //如果角色是老师，则可以看到本学期所有老师的所有课程(课表)
  @StoreCache(allCoursesTableStore.allCoursesTable)
  @ELLoading()
  static async listAllCourses() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    const data = await useGet(`teacher/allteacherstable`);
    return data as any;
  }

  static addAppointmentService = async (appointment: Appointment) => {
    try {
      const url = `teacher/appointment`;
      console.log("即将发起请求的URL:", url);
      const resp = await axios.post(url, appointment);
      if (resp.data.code < 300) {
        ElMessage.success("预约成功！");
      }
    } catch (error) {
      console.log("请求添加预约记录失败，错误信息:", error);
    }
  };
}

import { useDelete, useGet, usePost } from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { useCourseCountStore } from "@/stores/CoursesStore";
import { type Appointment, type Course } from "@/types/index";
import { StoreCache, ELLoading } from "./Decorators";
import { useCalendarStore } from "@/stores/CalendarStore";
const coursesStore = useCoursesStore();
const courseCountStore = useCourseCountStore();
export class TeacherService {
  // 获取该老师本学期所有的课程
  @StoreCache(coursesStore.coursesS)
  @ELLoading()
  static async listCoursesService() {
    console.log("你将要请求老师所有的课程数据");
    const data = await useGet(`teacher/courses`);
    return data as unknown as Ref<Course[]>;
  }

  //根据老师id获取该老师本学期的所有课程(课表)
  @StoreCache(coursesStore.coursesS)
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
}

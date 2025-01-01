import { useDelete, useGet, usePost } from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { type Course } from "@/types/index";
import { StoreCache, ELLoading } from "./Decorators";

const coursesStore = useCoursesStore();
export class TeacherService {
  // 获取该老师所有的课程
  @StoreCache(coursesStore.coursesS)
  @ELLoading()
  static async listCoursesService() {
    console.log("你将要请求老师所有的课程数据");
    const data = await useGet(`teacher/courses`);
    return data as unknown as Ref<Course[]>;
  }
}

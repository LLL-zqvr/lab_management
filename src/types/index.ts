// element-plus的校验规则
export interface RuleForm {
  account: string;
  password: string;
}

// 结果类型
export interface ResultVO<T> {
  code: number;
  message?: string;
  data: T;
}

// 用户
export interface User {
  id?: string;
  name?: string;
  account?: string;
  password?: string;
  telephone?: string;
  createTime?: string;
  updateTime?: string;
}

// 课程
export interface Course {
  section: number;
  name: string;
  clazz: string;
}

// 周
export interface Week {
  week: number;
  weekofday: number;
  course?: Course[];
}

export interface Course {
  section: number;
  name: string;
  clazz: string;
}
export interface Week {
  week: number;
  weekofday: number;
  course?: Course[];
}
export interface RuleForm {
  account: string;
  password: string;
}

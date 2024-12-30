<template>
  <div>
    <div id="bar-chart"></div>
    <div id="pie-chart"></div>
    <div id="bar-chart-academy"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import * as echarts from "echarts"; // 引入 ECharts
// import { r as Cl } from "../assets/js/request-BE1UvMV5.js";
/* empty css             */
// import { r as h2, a0 as v2, A as Dl, c as c2, a as Rt, t as Ml, o as p2 } from "../assets/js/index-HHlgu3jn.js";
export default {
  name: "DataAnalysis",
  setup() {
    // 响应式数据
    const leisureEquipment = ref(2537);
    const useEquipment = ref(146);
    const repairEquipment = ref(352);
    const labNumber = ref(128);
    const teacherNumber = ref(234);
    const user = ref(JSON.parse(sessionStorage.getItem("xm-user") || "{}"));

    // 配置图表的参数
    const barChartOptions = ref({
      title: {
        text: "各实验室不同状态设备数量柱状图",
        subtext: "",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["空闲中", "使用中", "维修中"],
        left: "left",
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: [], // 实际数据需要动态加载
          name: "实验室名称",
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "设备数量(个)",
        },
      ],
      series: [
        {
          name: "空闲中",
          type: "bar",
          label: "空闲中",
          emphasis: { focus: "series" },
          data: [1000, 1200], // 这些数据应该是动态的
        },
        {
          name: "使用中",
          type: "bar",
          label: "使用中",
          emphasis: { focus: "series" },
          data: [220, 182],
        },
        {
          name: "维修中",
          type: "bar",
          label: "维修中",
          emphasis: { focus: "series" },
          data: [150, 232],
        },
      ],
    });

    const pieChartOptions = ref({
      title: {
        text: "各实验室不同状态设备分布饼状图",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          label: {
            show: true,
            position: "inner",
            formatter: "{d}%",
          },
          data: [
            {
              value: 1048,
              name: "空闲中",
            },
            {
              value: 735,
              name: "使用中",
            },
            {
              value: 580,
              name: "维修中",
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

    const academyBarChartOptions = ref({
      title: {
        text: "各学院设备数量柱状图",
        subtext: "",
        left: "center",
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        name: "学院名称",
      },
      yAxis: {
        type: "value",
        name: "设备数量(个)",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
          itemStyle: {
            normal: {
              color: function () {
                return (
                  "#" +
                  Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                );
              },
            },
          },
        },
      ],
    });

    // 获取数据
    const fetchData = async () => {
      try {
        const response = await fetch(`/admin/getData/${user.value.id}`);
        const data = await response.json();
        if (data.code === "200") {
          leisureEquipment.value = data.data.leisureEquipment;
          useEquipment.value = data.data.useEquipment;
          repairEquipment.value = data.data.repairEquipment;
          labNumber.value = data.data.labNumber;
          teacherNumber.value = data.data.teacherNumber;
        } else {
          console.error("获取数据错误");
        }
      } catch (error) {
        console.error("请求数据失败", error);
      }
    };

    // 初始化 ECharts 图表
    const initCharts = () => {
      const barChart = echarts.init(document.getElementById("bar-chart"));
      barChart.setOption(barChartOptions.value);

      const pieChart = echarts.init(document.getElementById("pie-chart"));
      pieChart.setOption(pieChartOptions.value);

      const academyBarChart = echarts.init(
        document.getElementById("bar-chart-academy")
      );
      academyBarChart.setOption(academyBarChartOptions.value);
    };

    // 生命周期钩子
    onMounted(() => {
      fetchData();
      initCharts();
    });

    return {
      leisureEquipment,
      useEquipment,
      repairEquipment,
      labNumber,
      teacherNumber,
      barChartOptions,
      pieChartOptions,
      academyBarChartOptions,
    };
  },
};
</script>

<style scoped>
/* 样式 */
#bar-chart,
#pie-chart,
#bar-chart-academy {
  width: 1200px;
  height: 400px;
}
</style>

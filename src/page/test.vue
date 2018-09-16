<template>
  <el-date-picker v-model="selectDate" :blur="changeData()" type="daterange" align="right" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
  </el-date-picker>
</template>
<script>
export default {
  data() {
    return {
      selectDate: ["", ""],
      //快捷日期
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    changeData: function() {
      console.log("123");
    }
  }
};
</script>

<template>
  <div>
    <head-top></head-top>
    <el-row :gutter="20" style="padding:20px;">
      <el-col :span="12" style="display:flex;align-items:center;">
        <el-tooltip class="item" effect="dark" content="周期选择" placement="top">
          <el-date-picker v-model="selectDate" :blur="changeData()" type="daterange" align="right" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-tooltip>
      </el-col>
      <el-col :span="8" style="display:flex;align-items:center;">
        <el-tooltip class="item" effect="dark" content="VIP1" placement="top">
          <el-select v-model="vip1" placeholder="VIP1">
            <el-option v-for="item in vipValue" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="VIP2" placement="top">
          <el-select v-model="vip2" placeholder="VIP2">
            <el-option v-for="item in vipValue" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-col>
      <el-col :span="4" style="display:flex;justify-content:flex-end;">
        <el-button type="primary" @click="submit()" round>提交</el-button>
      </el-col>
    </el-row>
    <graph :userInfo="userInfo" :processing_value="processing_value" :date="selectDate" :day_datas="day_datas"></graph>

    <el-row :gutter="20" style="padding:20px;">
      <el-col :span="12">
        <div class="block">
          <span class="demonstration"></span>
          <!-- <el-date-picker v-model="ovulate" :blur="changeData()" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker> -->
        </div>
      </el-col>
      <el-col :span="12" class="bottom_btn">
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" @click="pageNext(1)">上一页</el-button>
          <el-button type="primary" @click="pageNext(2)">下一页
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import graph from "@/components/graph";
import dtime from "time-formatter";
import { physiologicals, advancedQuery, vipDataQuery } from "@/api/getData";
import { formatDate, compatibility_ios } from "@/util/common";
import { localData } from "@/util/local";
import { advancedQuerys } from "@/util/advancedQuery";
import { vip } from "@/util/vip2";
export default {
  data() {
    return {
      //折线图配置
      option: {},
      //日期参数
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
      },
      //vip选择
      vipValue: [
        {
          value: "1.1",
          label: "1.1"
        },
        {
          value: "1.2",
          label: "1.2"
        },
        {
          value: "1.3",
          label: "1.3"
        },
        {
          value: "1.4",
          label: "1.4"
        },
        {
          value: "1.5",
          label: "1.5"
        },
        {
          value: "1.6",
          label: "1.6"
        },
        {
          value: "1.7",
          label: "1.7"
        },
        {
          value: "1.8",
          label: "1.8"
        },
        {
          value: "1.9",
          label: "1.9"
        },
        {
          value: "2.0",
          label: "2.0"
        },
        {
          value: "2.1",
          label: "2.2"
        },
        {
          value: "2.3",
          label: "2.3"
        },
        {
          value: "2.4",
          label: "2.4"
        },
        {
          value: "2.5",
          label: "2.5"
        },
        {
          value: "2.6",
          label: "2.6"
        },
        {
          value: "2.7",
          label: "2.7"
        },
        {
          value: "2.8",
          label: "2.8"
        },
        {
          value: "2.9",
          label: "2.9"
        },
        {
          value: "3.0",
          label: "3.0"
        }
      ],
      //vip参数
      vip1: "2.2",
      vip2: "1.4",
      //是否显示
      flag: false,
      //处理值
      processing_value: "",
      //advancedQuery用户返回数据
      userInfo: "",
      //白天数据
      day_datas: "",
      //用户ID
      routeUserID: "",
      //排卵期
      ovulate: "",
      start: "",
      end: ""
    };
  },
  components: {
    headTop,
    graph
  },
  mounted() {
    this.initData();
    this.routeUserID = this.$route.query.userId;
  },
  methods: {
    async initData() {
      //获取默认例假周期
      const phyData = await physiologicals({
        userId: this.$route.query.userId
      });
      if (phyData) {
        const new_data = new Date();
        const selection_cycle = phyData.menstruationHistory.split(",");
        let allCases = [];
        for (let i = 0; i < selection_cycle.length; i++) {
          let startTime = [];
          startTime.push(selection_cycle[i].split(":")[0].substr(0, 4));
          startTime.push(selection_cycle[i].split(":")[0].substr(4, 2));
          startTime.push(selection_cycle[i].split(":")[0].substr(6, 2));
          allCases.push(startTime.join("-"));
        }

        let pushData = [];
        //日历默认选择最近一次周期&遍历快捷选择
        for (var i = 0; i < allCases.length; i++) {
          if (i == allCases.length - 1) {
            pushData = [allCases[i], formatDate(new_data)];
          }

          const stop =
            new Date(allCases[i + 1]).getTime() - 1000 * 60 * 60 * 24;
          let stop_time = formatDate(stop);
          const start_time = allCases[i];
          if (allCases[i + 1] == undefined) {
            stop_time = formatDate(new_data);
          }
          const alltime = {
            text: allCases[i] + "至" + stop_time,
            onClick(picker) {
              const end = stop_time;
              const start = start_time;
              picker.$emit("pick", [start, end]);
            }
          };
          this.pickerOptions.shortcuts.push(alltime);
        }
        this.selectDate = pushData;
        this.advanced();
      }
    },
    //获取白天数据
    async advanced() {
      const advanced = await advancedQuery({
        userId: this.$route.query.userId,
        beginDate: this.selectDate[0],
        endDate: this.selectDate[1],
        beginHour: "05",
        endHour: "15",
        isNormal: this.flag
      });
      if (advanced) {
        this.day_datas = advanced.dtos;
        this.userInfo = {};
        this.userInfo.nickName = advanced.nickName;
        this.userInfo.age = advanced.age;
        this.userInfo.count = advanced.count;
        this.userInfo.cycleFloatingDays = advanced.cycleFloatingDays;
        this.userInfo.menstruationHistory = advanced.menstruationHistory;
        this.userInfo.physiologicalLength = advanced.physiologicalLength;
        this.vipData();
      }
    },
    //vip值
    async vipData() {
      const vipData = await vipDataQuery({
        userId: this.$route.query.userId,
        dataVip: this.vip1,
        dataVip2: this.vip2
      });
      if (vipData.status == "200") {
        this.processing_value = vipData.data.peakDataDtos;
      }
    },
    submit() {
      this.advanced();
    },
    changeData() {},
    pageNext(p) {
      if (p == 1) {
        this.routeUserID = Number(this.routeUserID) - 1;
      } else {
        this.routeUserID = Number(this.routeUserID) + 1;
      }

      this.$router.push({
        path: "pregnancyEcharts",
        query: { userId: this.routeUserID }
      });
    }
  }
  // watch: {
  //   $route(to, from) {
  //     if (this.routeUserID) {
  //       console.log("123");
  //       this.$router.go(0);
  //     }
  //   }
  // }
};
</script>

<style lang="less">
@import "../style/mixin";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}
.bottom_btn {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
}
</style>

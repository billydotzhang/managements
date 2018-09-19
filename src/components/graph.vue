<template>
  <div class="line1">
    <div id="line1" class="" style="width: 90%;height:450px;"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import {
  getDays,
  getDate,
  GetDateStr,
  compatibility_ios,
  formatDate,
  formatDateTime,
  unique,
  isInteger,
  dateAdd
} from "@/util/common";
// 引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/custom";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/dataZoom";
export default {
  data() {
    return {
      //白天参数
      day_filter: [],
      //处理值
      processing_values: [],
      //用户信息
      user: "",
      ovulationDate2: [],
      source: [],
      option: {}
    };
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  props: ["userInfo", "processing_value", "date", "day_datas"],
  methods: {
    initData() {
      //折线图配置
      this.option = {
        title: {
          text: "佑蜜值曲线图"
        },
        grid: {
          bottom: "25%"
        },
        dataZoom: [
          {
            show: true,
            bottom: "10%"
          },
          {
            type: "inside"
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            if (
              params[0].seriesName == "处理值" ||
              params[0].seriesName == "递进方差值"
            ) {
              return [
                echarts.format.formatTime("yyyy-MM-dd", params[0].value[0]) +
                  " " +
                  echarts.format.formatTime("hh:mm", params[0].value[0]),
                "【佑蜜值】" + params[0].value[4],
                "【处理值】" + params[0].value[1],
                "【VIP参数】" + params[0].value[2],
                "【非例假期天数】" + params[0].value[3],
                "【递进方差值】" + params[0].value[5]
              ].join("<br>");
            } else if (params[0].value[4] !== null) {
              return [
                echarts.format.formatTime("yyyy-MM-dd", params[0].value[0]) +
                  " " +
                  echarts.format.formatTime("hh:mm", params[0].value[0]),
                "【佑蜜值】" + params[0].value[1],
                "【原始值】" + params[0].value[2],
                "【温度】" + params[0].value[3],
                '<span style="color:yellow">' + params[0].value[4] + "</span>"
              ].join("<br>");
            } else {
              return [
                echarts.format.formatTime("yyyy-MM-dd", params[0].value[0]) +
                  " " +
                  echarts.format.formatTime("hh:mm", params[0].value[0]),
                "【佑蜜值】" + params[0].value[1],
                "【原始值】" + params[0].value[2],
                "【温度】" + params[0].value[3]
              ].join("<br>");
            }
          },
          textStyle: {
            align: "left"
          }
        },
        legend: {
          orient: "horizontal",
          bottom: 0,
          data: [
            "处理值",
            "递进方差值",
            "早上曲线",
            "晚上曲线",
            "排卵时间",
            "例假期",
            "易排卵期"
          ]
        },
        axisPointer: {
          link: {
            xAxisIndex: "all"
          }
        },
        calculable: true,
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              readOnly: true
            },
            restore: {
              show: true,
              title: "刷新"
            },
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            lineStyle: {
              color: "#ddd"
            }
          },
          axisLabel: {
            interval: "auto"
          }
        },
        yAxis: [
          {
            type: "value",
            min: null,
            max: null,
            splitNumber: null
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 30,
            interval: 5,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        label: {
          normal: {
            show: true
          }
        },
        series: [
          {
            name: "处理值",
            type: "line",
            smooth: true,
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            data: []
          },
          {
            name: "递进方差值",
            type: "line",
            smooth: true,
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            data: []
          },
          {
            name: "早上曲线",
            type: "line",
            smooth: true,
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            data: []
          },
          // {
          //   name: "晚上曲线",
          //   type: "line",
          //   smooth: true,
          //   label: {
          //     normal: {
          //       show: true,
          //       position: "top"
          //     }
          //   },
          //   data: []
          // },
          {
            type: "custom",
            renderItem: this.renderItem,
            name: "易排卵期",
            stack: "sum",
            tooltip: {
              show: false
            },
            barCategoryGap: "20%",
            itemStyle: {
              normal: {
                color: "rgba(241,122,82,0.5)"
              }
            },
            smooth: true,
            data: []
          },
          {
            type: "custom",
            renderItem: this.renderItem,
            name: "例假期",
            stack: "sum",
            tooltip: {
              show: false
            },
            barCategoryGap: "20%",
            itemStyle: {
              normal: {
                color: "rgba(79,154,255,0.5)"
              }
            },
            smooth: true,
            data: []
          },
          {
            type: "custom",
            renderItem: this.renderItem,
            name: "排卵时间",
            stack: "sum",
            tooltip: {
              show: false
            },
            barCategoryGap: "20%",
            itemStyle: {
              normal: {
                color: "#9400D3",
                opacity: 0.5,
                label: {
                  show: true,
                  formatter: function(param) {
                    return [param.data[0], param.data[1]];
                  },
                  position: "top"
                }
              }
            },
            smooth: true,
            data: []
          }
        ],
        //修改数据视图
        optionToContent: function(opt) {
          var axisData1 = opt.series;
          var header =
            '<div id="parents_height" style="width:100%;height:30px;position:absolute;background:#fff"><table class="table-thead" style="float:left;width:49%;"><thead><tr><th class="a1">早上时间</th><th class="a2">佑蜜值</th><th class="a3">原始值</th><th class="a4">温度</th></tr></thead></table><table class="table-thead" style="float:right;width:51%;"><thead><tr><th class="a1">晚上时间</th><th class="a2">佑蜜值</th><th class="a3">原始值</th><th class="a4">温度</th><th style="width:17px;"></th></tr></thead></table></div>';
          var table1 =
            '<div style="width:100%;height:322px;"><div style="height:320px;float:left;width:50%;"><table class="datas" style="width:100%;margin-top:30px;"><tbody>';
          for (var i = 0, l = axisData1[2].data.length; i < l; i++) {
            table1 +=
              "<tr>" +
              '<td class="a1">' +
              axisData1[2].data[i][0] +
              "</td>" +
              '<td class="a2">' +
              axisData1[2].data[i][1] +
              "</td>" +
              '<td class="a3">' +
              axisData1[2].data[i][2] +
              "</td>" +
              '<td class="a4">' +
              axisData1[2].data[i][3] +
              "</td>" +
              "</tr>";
          }
          table1 += "</tbody></table></div>";
          var axisData2 = opt.series[2].data;
          var table2 =
            '<div style="height:320px; float:right;width:50%;"><table class="datas" style="width:100%;margin-top:30px;"><tbody>';
          for (var i = 0, l = axisData1[3].data.length; i < l; i++) {
            table2 +=
              "<tr>" +
              '<td class="times a1">' +
              axisData1[3].data[i][0] +
              "</td>" +
              '<td class="a2">' +
              axisData1[3].data[i][1] +
              "</td>" +
              '<td class="a3">' +
              axisData1[3].data[i][2] +
              "</td>" +
              '<td class="a4">' +
              axisData1[3].data[i][3] +
              "</td>" +
              "</tr>";
          }
          table2 += "</tbody></table></div></div>";
          return header + table1 + table2;
        }
      };
      this.myChart.setOption(this.option);

      this.render1(
        this.userInfo,
        this.processing_value,
        this.date[0],
        this.date[1],
        this.day_datas
      );
    },
    renderItem(params, api) {
      var yValue = api.value(2);
      var start = api.coord([api.value(0), yValue]);
      var size = api.size([api.value(1) - api.value(0), yValue]);
      var style = api.style();
      return {
        type: "rect",
        shape: {
          x: start[0] + 1,
          y: start[1],
          width: size[0] - 2,
          height: size[1]
        },
        style: style
      };
    },
    //获取数据图标渲染
    render1(info, processing_value, begin_date, end_date, day_datas, add_ovuo) {
      this.myChart.showLoading();
      let ovulationWeek = [];
      let menstrual = [];
      if (info.nickName) {
        const cases = info.menstruationHistory.split(",");

        /**
         * 获取所有的例假时间，根据开始例假时间和结束把中间的例假时间补充完整
         */
        let all_cases = []; //所有的例假时间
        let cases_start = []; //开始例假期
        for (var i = 0; i < cases.length; i++) {
          const time1 = cases[i].split(":");
          const time2 =
            time1[0].substr(0, 4) +
            "-" +
            time1[0].substr(4, 2) +
            "-" +
            time1[0].substr(6, 2);
          const time3 =
            time1[1].substr(0, 4) +
            "-" +
            time1[1].substr(4, 2) +
            "-" +
            time1[1].substr(6, 2);
          let time4 = [];
          time4.push(time2);
          time4.push(time3);
          all_cases.push(getDays(time4[0], time4[1]).split(","));
          cases_start.push(time4[0]);
        }
        let time_data = [].concat.apply([], all_cases); //所有的例假期时间
        /**
         * 前端根据公式计算易排卵期
         *（例假开始日期时间+生理周期长度-14）的+-3天，共7天
         */
        const cycleLength = info.physiologicalLength;
        const num = cycleLength - 14; //天数
        const ovulation_week = [];
        for (var i = 0; i < cases_start.length; i++) {
          var ovulate_data2 = getDate(cases_start[i], num); //易排卵当天
          ovulation_week.push(GetDateStr(-3, compatibility_ios(ovulate_data2)));
          ovulation_week.push(GetDateStr(-2, compatibility_ios(ovulate_data2)));
          ovulation_week.push(GetDateStr(-1, compatibility_ios(ovulate_data2)));
          ovulation_week.push(ovulate_data2);
          ovulation_week.push(GetDateStr(1, compatibility_ios(ovulate_data2)));
          ovulation_week.push(GetDateStr(2, compatibility_ios(ovulate_data2)));
          ovulation_week.push(GetDateStr(3, compatibility_ios(ovulate_data2)));
        }
        // 用户的基本信息
        this.user =
          info.nickName +
          "/年龄" +
          info.age +
          "/周期长度" +
          info.physiologicalLength +
          "/浮动天数" +
          info.cycleFloatingDays +
          "/检测次数" +
          info.count;
        /**
         * 白天，晚上 把需要的数据从后台返回的数据个过滤出来，检测时间、佑蜜值、原始值等
         */
        //白天
        this.day_filter = echarts.util.map(day_datas, function(entry) {
          return [
            formatDateTime(entry.detectionTime),
            entry.waterContent,
            entry.preWaterContent,
            entry.temperature,
            entry.testRecord
          ];
        });

        this.day_filter = unique(this.day_filter);

        //晚上
        // night_filter = echarts.util.map(night_datas, function(entry) {
        //   return [
        //     formatDateTime(entry.detectionTime),
        //     entry.waterContent,
        //     entry.preWaterContent,
        //     entry.temperature,
        //     entry.testRecord
        //   ];
        // });

        /**
         *判断是否有处理值，再根据条件做展示处理
         */
        if (processing_value) {
          //处理值
          this.processing_values = echarts.util.map(processing_value, function(
            entry
          ) {
            if (
              entry.detectionTime >=
                new Date(compatibility_ios(begin_date)).getTime() &&
              entry.detectionTime <=
                new Date(compatibility_ios(end_date)).getTime() +
                  1000 * 60 * 60 * 24
            ) {
              return [
                formatDateTime(entry.detectionTime),
                entry.peakValue,
                entry.dataVip,
                entry.noOvuDays,
                entry.waterContent,
                entry.stdev
              ];
            }
          });

          this.processing_values = this.processing_values.filter(function(v) {
            if (v !== undefined) {
              return v;
            }
          });

          const filter_surge = processing_value.filter(function(value, index) {
            if (processing_value[index].ovulation == true) {
              return processing_value[index];
            }
          });
          const surge = echarts.util.map(filter_surge, function(entry) {
            if (
              entry.detectionTime >=
                new Date(compatibility_ios(begin_date)).getTime() &&
              entry.detectionTime <=
                new Date(compatibility_ios(end_date)).getTime()
            ) {
              return [entry.detectionTime, entry.peakValue];
            } else {
              return false;
            }
          });
          if (surge) {
            for (var i = 0; i < surge.length; i++) {
              this.source.push({
                name: "激增",
                value: "激增",
                xAxis: surge[i][0],
                yAxis: surge[i][1]
              });
            }
          }
        }

        /**
         * 获取y轴最大值，首先要获取早上晚上曲线的最大值，处理值跟递进方差值的最大值
         */
        let y_data1 = day_datas.map(function(v, i) {
          return v.waterContent;
        });
        // var y_data2 = night_datas.map(function(v) {
        //   return v.waterContent;
        // });

        if (y_data1.length > 0) {
          y_data1 = Math.max.apply(null, y_data1);
        } else {
          y_data1;
        }
        // if (y_data2.length > 0) {
        //   y_data2 = Math.max.apply(null, y_data2);
        // } else {
        //   y_data2;
        // }

        let y_datas;
        // if (y_data1 > y_data2) {
        y_datas = y_data1;
        // } else {
        //   y_datas = y_data2;
        // }
        y_data1 = null;

        let concat_values;
        if (this.processing_values) {
          let peakValue1 = this.processing_values.map(function(v) {
            return v[1];
          });
          let peakValue2 = this.processing_values.map(function(v) {
            return v[5];
          });
          peakValue1 = Math.max.apply(null, peakValue1);
          peakValue2 = Math.max.apply(null, peakValue2);
          if (peakValue1 > peakValue2) {
            concat_values = peakValue1;
          } else {
            concat_values = peakValue2;
          }
          peakValue1 = peakValue2 = null;
        }

        let max_value;
        if (y_datas > concat_values) {
          max_value = y_datas;
        } else {
          max_value = concat_values;
        }
        y_datas = concat_values = null;
        const max_ceil_value = Math.ceil(max_value);
        const splitNumber = Math.ceil(max_ceil_value / 50);
        let max_ceil_values = "";
        if (isInteger(max_ceil_value / 50)) {
          max_ceil_values = Math.ceil(max_value);
        } else {
          max_ceil_values = 50 * splitNumber;
        }

        // 如果max_ceil_values为0就设置默认值400
        if (max_ceil_values === 0) {
          max_ceil_values = 400;
        }

        /**
         * 根据检测的数据取早晚中取最小的时间跟最大的时间
         */
        let day_left_confine;
        let day_right_confine;
        let night_left_confine;
        let night_right_confine;
        let start_confine; //取白天晚上的中的最小时间，左边的边界
        let end_confine; //取白天晚上的中的最大时间，右边的边界
        if (this.day_filter.length > 0) {
          day_left_confine = this.day_filter[0][0];
          day_right_confine = this.day_filter[this.day_filter.length - 1][0];

          day_left_confine = new Date(
            compatibility_ios(day_left_confine.split(" ")[0])
          ).getTime();
          day_right_confine = new Date(
            compatibility_ios(day_right_confine.split(" ")[0])
          ).getTime();
        }
        // if (night_filter.length > 0) {
        //   night_left_confine = night_filter[0][0];
        //   night_right_confine = night_filter[night_filter.length - 1][0];
        //   night_left_confine = new Date(
        //     compatibility_ios(night_left_confine.split(" ")[0])
        //   ).getTime();
        //   night_right_confine = new Date(
        //     compatibility_ios(night_right_confine.split(" ")[0])
        //   ).getTime();
        // }
        // if (day_left_confine > night_left_confine) {
        start_confine = day_left_confine;

        // } else {
        //   start_confine = night_left_confine;
        // }
        // if (day_right_confine > night_right_confine) {
        end_confine = day_right_confine;
        // } else {
        //   end_confine = night_right_confine;
        // }

        /**
         * 根据左边右边的边界时间把例假期跟易排卵期过滤出来
         */
        let fillter_time_data = time_data.filter(function(v) {
          if (
            new Date(compatibility_ios(v)).getTime() >=
              start_confine - 1000 * 60 * 60 * 24 &&
            new Date(compatibility_ios(v)).getTime() <=
              end_confine + 1000 * 60 * 60 * 24
          ) {
            return v;
          }
        });

        //如果易排卵时间超过就近的一次检测的值时，就把易排乱时间的截止显示在最新的检测
        var ovulation_week1 = ovulation_week.filter(function(v, index) {
          var filter_time = new Date(compatibility_ios(v));
          if (
            filter_time.getTime() >= start_confine - 1000 * 60 * 60 * 24 &&
            filter_time.getTime() <= end_confine + 1000 * 60 * 60 * 24
          ) {
            return v;
          }
        });

        let compatibility;

        // 例假期
        fillter_time_data.forEach(function(v, i) {
          var arr = v.split(/[- : \/]/);
          compatibility = new Date(arr[0], arr[1] - 1, arr[2]);
          menstrual[i] = [];
          menstrual[i][0] = v;
          menstrual[i][1] = dateAdd(compatibility);
          menstrual[i][2] = max_ceil_values;
        });
        //易排卵
        ovulation_week1.forEach(function(v, i) {
          var arr = v.split(/[- : \/]/);
          compatibility = new Date(arr[0], arr[1] - 1, arr[2]);
          ovulationWeek[i] = [];
          ovulationWeek[i][0] = v;
          ovulationWeek[i][1] = dateAdd(compatibility);
          ovulationWeek[i][2] = max_ceil_values;
        });
        /**
         * add_ovuo是排卵时间
         */

        if (add_ovuo !== undefined) {
          var ovulation_date = [];
          for (var i = 0; i < add_ovuo.length; i++) {
            ovulation_date.push(add_ovuo[i].split(" ~ "));
          }
          var ovulationDate1 = [];
          ovulation_date.forEach(function(v, i) {
            ovulationDate1[i] = [];
            if (
              new Date(compatibility_ios(v[0])).getTime() >=
                new Date(compatibility_ios(begin_date)).getTime() &&
              new Date(compatibility_ios(v[0])).getTime() <=
                new Date(compatibility_ios(end_date)).getTime()
            ) {
              ovulationDate1[i] = v;
            }
            ovulationDate1[i][2] = max_ceil_values;
          });
          this.ovulationDate2 = ovulationDate1;
        }

        /**
         * 获取最后一个时间  处理值，递进方差，早上曲线，晚上曲线，易排卵期;图表默认展示10天
         */
        var x_time = [];
        if (this.processing_values.length > 0) {
          var x_processing_values = this.processing_values[
            this.processing_values.length - 1
          ][0];
          x_time.push(
            new Date(compatibility_ios(x_processing_values)).getTime()
          );
        }
        if (this.day_filter.length > 0) {
          var x_day_filter = this.day_filter[this.day_filter.length - 1][0];
          x_time.push(new Date(compatibility_ios(x_day_filter)).getTime());
        }
        // if (night_filter.length > 0) {
        //   var x_night_filter = night_filter[night_filter.length - 1][0];
        //   x_time.push(new Date(compatibility_ios(x_night_filter)).getTime());
        // }
        if (ovulationWeek.length > 0) {
          var x_ovulationWeek = ovulationWeek[ovulationWeek.length - 1][1];
          x_time.push(new Date(compatibility_ios(x_ovulationWeek)).getTime());
        }
        x_time = Math.max.apply(null, x_time);
        var x_ago_time = x_time - 10 * 1000 * 60 * 60 * 24;

        x_time = formatDateTime(x_time);
        x_ago_time = formatDate(x_ago_time);

        this.myChart.hideLoading();
        this.myChart.clear();
        this.myChart.setOption(this.option);
        this.myChart.setOption({
          //载入数据
          title: {
            subtext: this.user
          },
          yAxis: [
            {
              type: "value",
              min: 0,
              max: max_ceil_values,
              splitNumber: splitNumber
            }
          ],
          series: [
            //填入系列（内容）数据
            {
              name: "处理值",
              encode: {
                x: 0,
                y: 1
              },
              data: this.processing_values,
              markPoint: {
                data: this.source
              },
              smooth: true
            },
            {
              name: "递进方差值",
              encode: {
                x: 0,
                y: 5
              },
              data: this.processing_values,
              smooth: true
            },
            {
              name: "早上曲线",
              encode: {
                x: 0,
                y: 1
              },
              data: this.day_filter,
              smooth: true
            },
            // {
            //   name: "晚上曲线",
            //   encode: {
            //     x: 0,
            //     y: 1
            //   },
            //   data: night_filter
            // },
            {
              name: "易排卵期",
              encode: {
                x: [0, 1],
                y: 2
              },
              data: ovulationWeek
            },
            {
              name: "例假期",
              encode: {
                x: [0, 1],
                y: 2
              },
              data: menstrual
            },
            {
              name: "排卵时间",
              encode: {
                x: [0, 1],
                y: 2
              },
              data: this.ovulationDate2
            }
          ]
        });
        //半年
        const dataLength = getDays(begin_date, end_date).split(",").length;
        if (dataLength >= 180) {
          this.myChart.setOption({
            series: [
              //填入系列（内容）数据
              {
                name: "处理值",
                label: {
                  normal: {
                    show: false,
                    position: "top"
                  }
                }
              },
              {
                name: "递进方差值",
                label: {
                  normal: {
                    show: false,
                    position: "top"
                  }
                }
              },
              {
                name: "早上曲线",
                label: {
                  normal: {
                    show: false,
                    position: "top"
                  }
                }
              }
              // {
              //   name: "晚上曲线",
              //   label: {
              //     normal: {
              //       show: false,
              //       position: "top"
              //     }
              //   }
              // }
            ]
          });
        } else {
          if (this.day_filter.length >= 20) {
            this.myChart.setOption({
              xAxis: {
                maxInterval: 3600 * 1000 * 24
              },
              dataZoom: [
                {
                  startValue: x_time,
                  endValue: x_ago_time
                }
              ]
            });
          }
        }
      }
    }
  },

  watch: {
    userInfo: function() {
      this.initData();
    },
    processing_value: function() {
      this.initData();
    },
    date: function() {
      this.initData();
    },
    day_datas: function() {
      this.initData();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.line1 {
  display: flex;
  justify-content: center;
}
</style>

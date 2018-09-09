<template>
  <div class="line1">
    <div id="line1" class="" style="width: 90%;height:450px;"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
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
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  props: ["sevenDate", "sevenDay"],
  methods: {
    initData() {
      // const colors = ["#5793f3", "#675bba", "#d14a61"];

      //数据初始化
      const option = {
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
                "【处理值】" + params[0].value[1],
                "【VIP参数】" + params[0].value[2],
                "【非例假期天数】" + params[0].value[3],
                "【佑蜜值】" + params[0].value[4],
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
          {
            name: "晚上曲线",
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
      this.myChart.setOption(option);
    }
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
  }
  // watch: {
  //   sevenDate: function() {
  //     this.initData();
  //   },
  //   sevenDay: function() {
  //     this.initData();
  //   }
  // }
};
</script>

<style lang="less">
@import "../style/mixin";
.line1 {
  display: flex;
  justify-content: center;
}
</style>

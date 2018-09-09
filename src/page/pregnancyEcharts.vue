<template>
  <div>
    <head-top></head-top>

    <graph :sevenDate='sevenDate' :sevenDay='sevenDay'></graph>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import graph from "@/components/graph";
import dtime from "time-formatter";
import { physiologicals } from "@/api/getData";
import { formatDate } from "@/util/common";
export default {
  data() {
    return {
      userCount: null,
      orderCount: null,
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []]
    };
  },
  components: {
    headTop,
    graph
  },
  mounted() {
    this.initData();
    // for (let i = 6; i > -1; i--) {
    //   const date = dtime(new Date().getTime() - 86400000 * i).format(
    //     "YYYY-MM-DD"
    //   );
    //   this.sevenDay.push(date);
    // }
    this.getSevenData();
  },
  computed: {},
  methods: {
    async initData() {
      //   const today = dtime().format("YYYY-MM-DD");
      //   Promise.all([
      //     userCount(today),
      //     orderCount(today),
      //     adminDayCount(today),
      //     getUserCount(),
      //     getOrderCount(),
      //     adminCount()
      //   ])
      //     .then(res => {
      //       this.userCount = res[0].count;
      //       this.orderCount = res[1].count;
      //       this.adminCount = res[2].count;
      //       this.allUserCount = res[3].count;
      //       this.allOrderCount = res[4].count;
      //       this.allAdminCount = res[5].count;
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      const phyData = await physiologicals({
        userId: this.$route.query.userId
      });

      this.sevenDay.push(phyData.dtos);
      console.log(this.sevenDay);
    },
    async getSevenData() {}
  }
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
</style>

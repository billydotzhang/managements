<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="search_box">
      <div class="search_box_1">
        <!-- <el-input v-model="searchInpt" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="searchUser()" icon="el-icon-search" :loading="searchLoading" plain>搜索</el-button> -->
      </div>
      <div class="search_box_1">
      </div>
      <div class="search_box_1">
      </div>
      <div class="search_box_1">
      </div>
    </div>
    <div class="table_container">
      <el-table v-loading="tableloading" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column property="userId" label="id" align="center" fixed>
        </el-table-column>
        <el-table-column property="nickName" label="用户昵称" align="center">
        </el-table-column>
        <el-table-column property="userName" label="手机号" width="150" align="center">
        </el-table-column>
        <el-table-column property="detectionTime" :formatter="formatterTime" label="最后检测时间" width="200" align="center">
        </el-table-column>
        <el-table-column property="prePregnant" label="客服操作" align="center">
          <template slot-scope="scope">
            <el-button @click="customerHandle(scope.row)" type="success" size="small" v-if="scope.row.customerServiceHandle == '0' ">是</el-button>
            <el-button @click="customerHandle(scope.row)" type="danger" size="small" v-else>否</el-button>
          </template>
        </el-table-column>
        <el-table-column property="prePregnant" label="千人计划" align="center">
          <template slot-scope="scope">
            <el-button @click="planStatus(scope.row)" type="success" size="small" v-if="scope.row.status == '0'">是</el-button>
            <el-button @click="planStatus(scope.row)" type="danger" size="small" v-else>否</el-button>
          </template>
        </el-table-column>
        <el-table-column property="city" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="goGraph(scope.row)" type="text" size="small">早晚</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column property="city" label="历史记录" align="center">
          <template slot-scope="scope">
            <el-button @click="download(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column property="city" label="添加记录" align="center">
          <template slot-scope="scope">
            <el-button @click="download(scope.row)" type="text" size="small">添加</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  getUnusualInfo,
  delMac,
  searchUser,
  thousandPlanStatus,
  customerStatus
} from "@/api/getData";
import { ip1Conf } from "@/config/env";
import { formatDateTime } from "@/util/common";
export default {
  data() {
    return {
      tableData: [
        {
          userId: 818,
          userName: null,
          nickName: "mary娜",
          detectionTime: 1535931067000,
          customerServiceHandle: 2,
          backgroundHandle: 2,
          remark: null
        },
        {
          userId: 780,
          userName: null,
          nickName: " 敏",
          detectionTime: 1535929120000,
          customerServiceHandle: 2,
          backgroundHandle: 2,
          remark: null
        }
      ],
      count: 0,
      offset: 1,
      limit: 20,
      currentPage: 1,
      searchInpt: "",
      searchLoading: false,
      tableloading: true
    };
  },
  components: {
    headTop
  },
  created() {
    this.getUnusualInfo();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = val;
      this.getUnusualInfo();
    },
    async getUnusualInfo() {
      this.tableloading = true;
      const Users = await getUnusualInfo({
        pageSize: this.limit,
        pageNo: this.offset
      });
      this.tableloading = false;
      this.tableData = [];
      this.count = Users.total;
      Users.ovulationTimeManualHandlingDos.forEach(item => {
        const tableData = {};
        tableData.userId = item.userId;
        tableData.userName = item.userName;
        tableData.nickName = item.nickName;
        tableData.detectionTime = item.detectionTime;
        tableData.prePregnant = item.prePregnant;
        tableData.count = item.count;
        tableData.physiologicalDataId = item.physiologicalDataId;
        tableData.status = item.status;
        tableData.customerServiceHandle = item.customerServiceHandle;
        this.tableData.push(tableData);
      });
    },
    download(data) {
      location.href = ip1Conf + "/users/excel?userId=" + e.id;
    },
    async customerHandleData(data) {
      let customer;
      if (data.customerServiceHandle == 0) {
        customer = 1;
      } else {
        customer = 0;
      }
      const res = await customerStatus({
        physiologicalDataId: data.physiologicalDataId,
        customerStatus: customer
      });
      if (res.status == 200) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.getUnusualInfo();
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    customerHandle(data) {
      this.$confirm("是否操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.customerHandleData(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    async planStatusData(data) {
      let statusData;
      if (data.status == null || data.status == 0) {
        statusData = 1;
      } else {
        statusData = 0;
      }
      const res = await thousandPlanStatus({
        status: statusData,
        userId: data.userId
      });

      if (res.status == 200) {
        this.$message({
          type: "success",
          message: "已修改!"
        });
        this.getUnusualInfo();
      } else {
        this.$message({
          type: "info",
          message: "修改失败!"
        });
      }
    },
    planStatus(data) {
      this.$confirm("修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.planStatusData(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    goGraph(data) {
      this.$router.push({
        path: "pregnancyEcharts",
        query: { userId: data.userId }
      });
    },
    formatterTime(row) {
      return formatDateTime(row.detectionTime);
    }
  },
  watch: {
    tableData: function() {
      // this.getUnusualInfo();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
.search_box {
  display: flex;
  display: -webkit-flex;
  padding: 20px;
}
.search_box_1 {
  display: flex;
  flex: 1;
}
</style>

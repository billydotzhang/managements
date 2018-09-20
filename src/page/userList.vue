<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="search_box">
      <div class="search_box_1">
        <el-input v-model="searchInpt" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="searchUser()" icon="el-icon-search" :loading="searchLoading" plain>搜索</el-button>
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
        <el-table-column property="id" label="id">
        </el-table-column>
        <el-table-column property="nickName" label="用户昵称">
        </el-table-column>
        <el-table-column property="userName" label="手机号" width="150">
        </el-table-column>
        <el-table-column property="hardwareEquipment" label="绑定设备" width="150">
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="removeMac(scope.row,tableData[scope.$index])" type="danger" size="small" v-show="scope.row.hardwareEquipment">解绑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="bindingTime" :formatter="formatterTime" label="绑定时间" width="150">
        </el-table-column>
        <el-table-column property="count" style="" label="检测次数">
        </el-table-column>
        <el-table-column property="prePregnant" label="是否备孕">
          <template slot-scope="scope">
            <el-button @click="prePregnant(scope.row)" type="success" size="small" v-if="scope.row.pregnantInfo">是</el-button>
            <el-button @click="prePregnant(scope.row)" type="danger" size="small" v-else>否</el-button>
          </template>
        </el-table-column>
        <el-table-column property="city" label="操作">
          <template slot-scope="scope">
            <el-button @click="goGraph(scope.row)" type="text" size="small">全部</el-button>
            <el-button @click="goGraph(scope.row)" type="text" size="small">早晚</el-button>
          </template>
        </el-table-column>
        <el-table-column property="city" label="导出">
          <template slot-scope="scope">
            <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
          </template>
        </el-table-column>
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
import { getUserList, delMac, searchUser } from "@/api/getData";
import { ip1Conf } from "@/config/env";
import { formatDate } from "@/util/common";
export default {
  data() {
    return {
      tableData: [
        {
          id: 971,
          userName: "13888888888",
          nickName: "测试1",
          hardwareEquipment: "F0:B5:D1:81:47:17",
          bindingTime: 1536227107000,
          count: 59,
          detectionHeadChangeTime: 1536227107000,
          prePregnant: false
        }
      ],
      count: 0,
      offset: 1,
      limit: 20,
      currentPage: 1,
      searchInpt: "",
      searchLoading: false,
      tableloading: false
    };
  },
  components: {
    headTop
  },
  created() {
    this.getUsers();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = val;
      this.getUsers();
    },
    async getUsers() {
      this.tableloading = true;
      const Users = await getUserList({
        pageSize: this.limit,
        pageNo: this.offset
      });
      this.tableData = [];
      this.count = Users.total;
      this.tableloading = false;
      Users.dtos.forEach(item => {
        const tableData = {};
        tableData.id = item.id;
        tableData.userName = item.userName;
        tableData.nickName = item.nickName;
        tableData.hardwareEquipment = item.hardwareEquipment;
        tableData.bindingTime = item.bindingTime;
        tableData.detectionHeadChangeTime = item.detectionHeadChangeTime;
        tableData.prePregnant = item.prePregnant;
        tableData.count = item.count;
        tableData.pregnantInfo = true;
        this.tableData.push(tableData);
      });
    },
    download(data) {
      location.href = ip1Conf + "/users/excel?userId=" + data.id;
    },
    async delMac(data) {
      const res = await delMac({
        userId: data.id,
        hardwareEquipment: data.hardwareEquipment
      });
      if (res.status == 200) {
        this.getUsers();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async pregnant(data) {
      data.pregnantInfo = !data.pregnantInfo;
      this.$message({
        type: "success",
        message: "已修改!"
      });
    },

    removeMac(data) {
      this.$confirm("解除设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delMac(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    prePregnant(data) {
      this.$confirm("修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.pregnant(data);
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
        query: { userId: data.id }
      });
    },
    formatterTime(row) {
      return formatDate(row.bindingTime);
    },
    async searchUser() {
      this.searchLoading = true;
      this.tableloading = true;
      const searchUserInfo = await searchUser({
        pageSize: this.limit,
        pageNo: this.offset,
        key: this.searchInpt
      });
      this.searchLoading = false;
      this.tableData = [];
      this.count = searchUserInfo.total;
      this.tableloading = false;
      if (searchUserInfo.total > 0) {
        searchUserInfo.dtos.forEach(item => {
          const tableData = {};
          tableData.id = item.id;
          tableData.userName = item.userName;
          tableData.nickName = item.nickName;
          tableData.hardwareEquipment = item.hardwareEquipment;
          tableData.bindingTime = item.bindingTime;
          tableData.detectionHeadChangeTime = item.detectionHeadChangeTime;
          tableData.prePregnant = item.prePregnant;
          tableData.count = item.count;
          tableData.pregnantInfo = true;
          this.tableData.push(tableData);
        });
      } else {
        this.$message({
          type: "info",
          message: "暂无数据"
        });
      }
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

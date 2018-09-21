<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="search_box">
      <div class="search_box_1">
        <el-input v-model="searchInpt" placeholder="请输入内容" clearable></el-input>
        <el-button type="primary" @click="searchUser()" icon="el-icon-search" :loading="searchLoading" plain>搜索</el-button>
      </div>
      <div class="search_box_1">
        <el-select v-model="thousandPlanStatusValue" placeholder="请选择" @change="changeThousandPlanStatusValue()">
          <el-option v-for="item in thousandPlanStatus" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
        <el-table-column label="客服操作" align="center">
          <template slot-scope="scope">
            <el-button @click="customerHandle(scope.row)" type="primary" size="small" v-if="scope.row.customerServiceHandle == '0' ">未操作</el-button>
            <el-button @click="customerHandle(scope.row)" type="success" size="small" v-else-if="scope.row.customerServiceHandle == '1'">无异常</el-button>
            <el-button @click="customerHandle(scope.row)" type="danger" size="small" v-else-if="scope.row.customerServiceHandle == '2'">已电话</el-button>
            <el-button @click="customerHandle(scope.row)" type="danger" size="small" v-else-if="scope.row.customerServiceHandle == '3'">已app</el-button>
            <el-button @click="customerHandle(scope.row)" type="danger" size="small" v-else-if="scope.row.customerServiceHandle == '4'">已短信</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="thousandPlan" label="千人计划" align="center">
          <template slot-scope="scope">
            <el-button @click="planStatus(scope.row)" type="danger" size="small" v-if="scope.row.status == '0'">取消</el-button>
            <el-button @click="planStatus(scope.row)" type="success" size="small" v-else>参加</el-button>
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="修改状态" :visible.sync="customerHandleDialog" width="40%" center>
      <p>
        <el-radio v-model="customerHandleRadio" label="1">无异常</el-radio>
      </p>
      <p>
        <el-radio v-model="customerHandleRadio" label="5">未操作</el-radio>
      </p>
      <p v-show="customerHandleDialogData.status =='0'">
        <el-radio v-model="customerHandleRadio" label="2">已电话通知</el-radio>
      </p>
      <div v-show="customerHandleDialogData.status =='1'">
        <p>
          <el-radio v-model="customerHandleRadio" label="3">已APP消息推送通知</el-radio>
        </p>
        <p>
          <el-radio v-model="customerHandleRadio" label="4">已短信通知</el-radio>
        </p>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customerHandleDialog = false">取 消</el-button>
        <el-button type="primary" @click="doCustomerHandleRadio">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  getUnusualInfo,
  delMac,
  searchUser,
  thousandPlanStatus,
  customerStatus,
  customerFind
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
      limit: 20,
      currentPage: 1,
      searchInpt: "",
      searchLoading: false,
      tableloading: true,
      thousandPlanStatus: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "已参加"
        },
        {
          value: "1",
          label: "未参加"
        }
      ],
      thousandPlanStatusValue: "",
      customerHandleDialog: false,
      customerHandleRadio: "1",
      customerHandleDialogData: ""
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
      if (this.searchInpt !== "") {
        const page = "1";
        this.searchUser(page);
      } else {
        this.getUnusualInfo();
      }
    },
    async getUnusualInfo() {
      this.tableloading = true;
      const Users = await getUnusualInfo({
        pageSize: this.limit,
        pageNo: this.currentPage,
        thousandPlanStatus: this.thousandPlanStatusValue
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
    async customerHandleData() {
      let radioStatus = "";
      if (this.customerHandleRadio == "5") {
        radioStatus = "0";
      } else {
        radioStatus = this.customerHandleRadio;
      }
      const res = await customerStatus({
        physiologicalDataId: this.customerHandleDialogData.physiologicalDataId,
        customerStatus: radioStatus
      });
      if (res.status == 200) {
        this.$message({
          type: "success",
          message: "修改成功"
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
      this.customerHandleRadio = data.customerServiceHandle;
      this.customerHandleDialogData = data;
      this.customerHandleDialog = true;
    },
    doCustomerHandleRadio() {
      this.customerHandleDialog = false;
      this.customerHandleData();
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
      this.$confirm("确认将此用户改为未参加千人计划状态？", "提示", {
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
            message: "已取消"
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
    },
    thousandStatus(value, row) {
      return row.status == value;
    },
    async searchUser(page) {
      if (page !== "1") {
        this.currentPage = 1;
      }
      this.searchLoading = true;
      this.tableloading = true;
      const searchUserInfo = await customerFind({
        pageSize: this.limit,
        pageNo: this.currentPage,
        key: this.searchInpt
      });
      this.searchLoading = false;
      this.tableloading = false;
      this.tableData = [];
      this.count = searchUserInfo.total;
      if (searchUserInfo.ovulationTimeManualHandlingDos) {
        searchUserInfo.ovulationTimeManualHandlingDos.forEach(item => {
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
      }
    },
    changeThousandPlanStatusValue() {
      this.getUnusualInfo();
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
  padding: 0 10px;
}
</style>

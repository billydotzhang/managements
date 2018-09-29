<template>
  <div>
    <head-top></head-top>

    <el-tabs v-model="activeTab" class="sendMsgBox">
      <el-tab-pane label="友盟推送" name="one">
        <el-row>
          <el-col :span="8" class="sendMsg">
            <el-form ref="sendData" :rules="rules" :model="sendData" label-width="100px">
              <el-form-item label="任务描述：" prop="describe">
                <el-input v-model="sendData.describe"></el-input>
              </el-form-item>
              <el-form-item label="主标题：" prop="mainTitle">
                <el-input v-model="sendData.mainTitle"></el-input>
              </el-form-item>
              <el-form-item label="内容：" prop="msgContent">
                <el-input type="textarea" v-model="sendData.msgContent"></el-input>
              </el-form-item>
              <el-form-item label="目标人群：">
                <el-radio-group v-model="sendData.userType">
                  <!-- <el-radio :label="1">全部</el-radio> -->
                  <el-radio :label="2">特定用户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="手机号:" v-if="sendData.userType == 2" prop="userPhone">
                <el-input v-model="sendData.userPhone"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doSendMsg('sendData')">发送消息</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="16" class="flex-middle">

            <el-tabs type="border-card">
              <el-tab-pane label="苹果">
                <div class="preview-image-ios10">
                  <div class="preview-text">
                    <div class="app-name">App Name</div>
                    <div class="msg_text">{{sendData.mainTitle}}</div>
                    <div class="msg_text">{{sendData.subTitle}}</div>
                    <div class="msg_text">{{sendData.msgContent}}</div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="安卓">
                <div class="preview-image-andriod">
                  <div class="preview-title">
                    {{sendData.mainTitle}}
                  </div>
                  <div class="preview-content">
                    {{sendData.msgContent}}
                  </div>
                </div>
              </el-tab-pane>

            </el-tabs>

            <div style="text-align:center;">
              *预览图仅供参考，请以真机显示效果为准。
            </div>

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="短信推送" name="two">
        <el-form ref="sendSMSdt" :rules="rules" :model="sendSMSdt" label-width="100px" class="sendSMS">
          <el-form-item label="模板信息：" required>
            <el-radio-group v-model="sendSMSdt.code" v-for="(item,index) in SMStemplate" :key="item.code" @change="chooseSendSMS()">
              <ul class="SMS-ul">
                <li>
                  <el-radio :label="item.code">{{index+1}}、{{item.text}}</el-radio>
                </li>
              </ul>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号:" prop="userPhone">
            <el-input v-model="sendSMSdt.userPhone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSendSMS('sendSMSdt')">发送消息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="添加短信模板" name="three">
        <el-form ref="editSMSData" :rules="rules" :model="editSMSData" label-width="100px" class="sendSMS">
          <el-form-item label="模板信息：">
            <el-radio-group v-model="editSMSData.code" v-for="(item,index) in SMStemplate" :key="item.code" @change="chooseEditSMS()">
              <ul class="SMS-ul">
                <li>
                  <el-radio :label="item.code">{{index+1}}、{{item.text}}</el-radio>
                </li>
              </ul>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="doDeleteSMS()">删除</el-button>
          </el-form-item>
          <el-form-item label="模板名称:" prop="name">
            <el-input v-model="editSMSData.name"></el-input>
          </el-form-item>
          <el-form-item label="模板CODE:" prop="code">
            <el-input v-model="editSMSData.code"></el-input>
          </el-form-item>
          <el-form-item label="模板内容:">
            <el-input type="textarea" v-model="editSMSData.text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doNewSMS('editSMSData')">创建</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import headTop from "@/components/headTop";
import {
  sendUMsg,
  fetchSendSMS,
  fetchGetSMSTemplate,
  fetchDeleteSMSTemplate,
  fetchNewSMSTemplate
} from "@/api/getData";
export default {
  data() {
    return {
      sendData: {
        describe: "",
        mainTitle: "",
        msgContent: "",
        subTitle: "",
        userPhone: "",
        userType: 2
      },
      sendSMSdt: {
        code: "",
        text: "",
        userPhone: ""
      },
      editSMSData: {
        code: "",
        text: "",
        name: ""
      },
      physiologicalDataId: "",
      rules: {
        describe: [
          { required: true, message: "描述不能为空", trigger: "blur" }
        ],
        msgContent: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          { min: 5, max: 1500, message: "长度在5到1500个字符", trigger: "blur" }
        ],
        userPhone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        mainTitle: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "模板名称不能为空", trigger: "blur" },
          {
            max: 20,
            message: "请输入小于20个字内的名称",
            trigger: "blur"
          }
        ],
        code: [{ required: true, message: "CODE不能为空", trigger: "blur" }]
      },
      activeTab: "one",
      SMStemplate: [
        {
          code: "",
          text: ""
        }
      ],
      checked: true
    };
  },
  mounted() {
    this.initData();
  },
  components: {
    headTop
  },
  methods: {
    initData() {
      this.getSMStemplate();
      if (this.$route.query.userId && this.$route.query.userName) {
        this.sendData.userPhone = this.$route.query.userName;
        this.sendSMSdt.userPhone = this.$route.query.userName;
        this.physiologicalDataId = this.$route.query.userId;
      }
    },
    doSendMsg(sendFormData) {
      this.$refs[sendFormData].validate(valid => {
        if (valid) {
          this.sendMsgData();
        }
      });
    },
    doSendSMS(sendSMS) {
      this.$refs[sendSMS].validate(valid => {
        if (valid) {
          this.sendSMSData();
        }
      });
    },
    doNewSMS(editSMSData) {
      console.log(this.editSMSData);
      this.$refs[editSMSData].validate(valid => {
        if (valid) {
          this.newSMStemplate();
        }
      });
    },
    doDeleteSMS() {
      if (this.editSMSData.code) {
        this.$confirm("删除模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteSMSTemplate();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    chooseSendSMS() {
      for (let i = 0; i < this.SMStemplate.length; i++) {
        if (this.sendSMSdt.code == this.SMStemplate[i].code) {
          this.sendSMSdt.text = this.SMStemplate[i].text;
        }
      }
    },
    chooseEditSMS() {
      for (let i = 0; i < this.SMStemplate.length; i++) {
        if (this.editSMSData.code == this.SMStemplate[i].code) {
          this.editSMSData.text = this.SMStemplate[i].text;
        }
      }
    },
    async deleteSMSTemplate() {
      const res = await fetchDeleteSMSTemplate({
        templateCode: this.editSMSData.code
      });
      if (res.status == "200") {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.getSMStemplate();
      }
    },
    async newSMStemplate() {
      const res = await fetchNewSMSTemplate({
        templateName: this.editSMSData.name,
        templateCode: this.editSMSData.code,
        templateContext: this.editSMSData.text
      });
      if (res.status == "200") {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.getSMStemplate();
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async getSMStemplate() {
      const res = await fetchGetSMSTemplate();
      if (res.status == "200") {
        this.SMStemplate = [];
        res.data.forEach(item => {
          const template = {};
          template.code = item.templateCode;
          template.text = item.templateContext;
          this.SMStemplate.push(template);
        });
      }
    },
    async sendSMSData() {
      if (this.checked) {
        this.checked = false;
        const res = await fetchSendSMS({
          physiologicalDataId: this.physiologicalDataId,
          recNum: this.sendSMSdt.userPhone,
          templateCode: this.sendSMSdt.code
        });
        this.checked = true;
        if (res.status == "200") {
          this.$message({
            type: "success",
            message: res.msg
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      }
    },
    async sendMsgData() {
      if (this.checked) {
        this.checked = false;
        const res = await sendUMsg({
          ticker: this.sendData.describe,
          title: this.sendData.mainTitle,
          text: this.sendData.msgContent,
          physiologicalDataId: this.physiologicalDataId,
          userName: this.sendData.userPhone
        });
        this.checked = true;
        if (res.status == "200") {
          this.$message({
            type: "success",
            message: res.msg
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      }
    }
  },
  watch: {
    $route() {
      if (this.$route.query.userId && this.$route.query.userName) {
        this.sendData.userPhone = this.$route.query.userName;
        this.sendSMSdt.userPhone = this.$route.query.userName;
        this.physiologicalDataId = this.$route.query.userId;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.sendMsgBox {
  padding: 20px;
}
.preview-image-ios10 {
  width: 360px;
  height: 391px;
  margin: 0 auto;
  position: relative;
  background: url("~@/assets/image/preview-image-ios10.png");
}
.preview-text {
  width: 340px;
  height: 105px;
  padding: 0 12px;
  position: absolute;
  top: 243px;
  left: 10px;
  box-sizing: border-box;
  color: #000;
  line-height: 18px;
  font-family: PingFangSC-Light, HanHei SC, Helvetica Neue, Helvetica,
    STHeitiSC-Light, Arial, Microsoft YaHei, sans-serif;
  overflow: hidden;
}
.app-name {
  margin-bottom: 16px;
  color: #4487a0;
  font-weight: 700;
  font-size: 13px;
  text-indent: 27px;
  word-break: break-word;
}
.msg_text {
  color: #444;
  font-size: 13px;
  word-break: break-word;
}
.flex-middle {
  padding: 0 20px;
}
.preview-image-andriod {
  width: 360px;
  height: 391px;
  margin: 0 auto;
  position: relative;
  background: url("~@/assets/image/preview-andriod.png");
}
.preview-title {
  width: 262px;
  height: 22px;
  top: 129px;
  left: 80px;
  color: #000;
  font-size: 18px;
  position: absolute;
  overflow: hidden;
  word-break: break-all;
}
.preview-content {
  width: 262px;
  height: 20px;
  top: 151px;
  left: 80px;
  color: #000;
  position: absolute;
  overflow: hidden;
  word-break: break-all;
}
.sendSMS {
  width: 460px;
}
.SMS-ul {
  li {
    width: 400px;
    margin: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>


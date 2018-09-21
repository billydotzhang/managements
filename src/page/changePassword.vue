<template>
  <div>
    <head-top></head-top>
    <el-form :model="changePassword" status-icon :rules="rules2" ref="changePassword" label-width="100px" class="formChangePwd">
      <el-form-item label="用户名" prop="userName">
        <el-input type="text" v-model="changePassword.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" v-model="changePassword.oldPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="changePassword.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="changePassword.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('changePassword')">提交</el-button>
        <el-button @click="resetForm('changePassword')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { changePwd } from "@/api/getData";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.changePassword.checkPass !== "") {
          this.$refs.changePassword.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changePassword.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      changePassword: {
        userName: "",
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules2: {
        userName: [{ validator: validatePass3, trigger: "blur" }],
        oldPass: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  components: {
    headTop
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.takePwd();
        } else {
          this.$message({
            type: "error",
            message: "错误"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async takePwd() {
      const res = await changePwd({
        userName: this.changePassword.userName,
        oldPassword: this.changePassword.oldPass,
        newPassword: this.changePassword.pass
      });
      if (res.status == "200") {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.$router.push("/");
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    }
  }
};
</script>
<style lan="less" scoped>
.formChangePwd {
  width: 500px;
  margin: 50px auto;
}
</style>


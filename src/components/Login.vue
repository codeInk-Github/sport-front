<template>
  <div id="login">
    <div class="loginContainer">
      <div class="loginBox">
        <div class="avatarBox">
          <img src="../assets/logo.png" alt=""/>
        </div>
        <el-form class="loginFrom" :rules="loginRules" ref="loginFormRef" :model="loginForm" label-width="0">

          <el-form-item prop="username">
            <el-input v-model="loginForm.username"
                      placeholder="请输入用户名"
                      prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="iconfont icon-password"></el-input>
          </el-form-item>

          <el-form-item class="mb-4 loginBtn">
            <el-button type="primary" v-on:click="login">登录</el-button>
            <el-button type="info" @click="resetLoginFrom">重置</el-button>
            <el-button type="info" >忘记密码？</el-button>
          </el-form-item>
        </el-form>


      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",

  data(){
    return{
      loginForm:{
        username:"zucker",
        password:"123456"
      },
      loginRules: {
        username: [
          {
            required: true, message:"请输入用户名", trigger: "blur"
          },
          {
            min: 5,max:12, message: "长度为3 ~ 12和字符",trigger: "blur"
          }
        ],
        password: [
          {
            required: true, message:"请输入密码", trigger: "blur"
          },
          {
            min: 6,max:12, message: "长度为6 ~ 12和字符",trigger: "blur"
          }
        ],
      },
    };
  },

  methods: {
    // 重置表单内容
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录方法
    login() {
      // return 验证是否成功
      this.$refs.loginFormRef.validate(async valid =>{
        // console.log(valid);
        if(!valid) return 0;
        // 访问后台
        let {data:res} = await this.$http.post("login",
            this.loginForm);
        // console.log(res)

        if(res.flag === "ok"){
          console.log("success!!");
          // this.$message.success("success!!");
          console.log(res.user);
          window.sessionStorage.setItem("user",res.user);
          // 路由跳转
          await this.$router.push({path: "/home"});
          // 存储user对象
        }else {
          // this.$message.error("登录失败！请检查用户名和密码")
          console.log("登录失败！请检查用户名和密码")
        }
      })
    },
  },
}


</script>

<style lang="less" scoped>

.loginBox {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 1px #2c3e50;
  .avatarBox {
    width: 100px;
    height: 100px;
    border: 0 solid;
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 0 4px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.loginBtn {
  display: flex;
  justify-content: flex-end;
}
.loginFrom{
  position: absolute;
  bottom: 10%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
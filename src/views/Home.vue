<template>
  <div class="home-div">
    <!--引入container 布局-->
    <el-container class="home-container">
      <!--头部-->
      <el-header>
        <div >
          <img id="logo-img" src="../assets/logo.png" alt/>
        </div>
        <span>
          个人运动平台
        </span>
        <el-button type="info" @click="logout">安全退出</el-button>
      </el-header>
      <!--主体-->
      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse?'64px':'160px'">
          <div class="toggle-button" @click="toggleCollapse">
            |||
          </div>
          <el-menu
              background-color = "#d3dce6"
              text-color="#black"
              unique-opened="unique-opened"
              :collapse="isCollapse"
              :collapse-transition="false"
              :router="true"
              :default-active="activePath"
          >
            <el-submenu :index="mainItem.id+''"
                        style="text-align: left"
                        v-for="mainItem in menuList"
                        :key="mainItem.id">
              <template #title>
                <i :class="iconsObject[mainItem.id]"></i>
                <span>{{mainItem.title}}</span>
              </template>
                <el-menu-item :index="subItem.path"
                              v-for="subItem in mainItem.sList"
                              :key="subItem.id"
                              @click="saveNavState(subItem.path+'')"
                >
                  <i :class="iconsObject[subItem.id]"></i>
                  <span>{{subItem.title}}</span>
                </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <!--主体内容-->
        <el-main>
          <router-view>

          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data(){
    return{
      menuList:[ ],
      iconsObject: {
        '100':'iconfont icon-guanliyuan',
        '200':'iconfont icon-yundong',
        '101':'iconfont icon-denglu',
        '102':'iconfont icon-mima',
        '103':'iconfont icon-yundong',
        '104':'iconfont icon-shangpin',
        '201':'iconfont icon-shu',
        '202':'iconfont icon-qialuli',
        '203':'iconfont icon-shiwu',
        '204':'iconfont icon-denglu',
      },
      isCollapse:false,
      activePath:'',
    }
  },
  // onload
  created() {
    // 查询menuList
    this.getMenuList();
    this.activePath=sessionStorage.getItem("activePath");
  },
  methods: {
    // 安全退出
    logout(){
      sessionStorage.clear()
      this.$router.push("login");
    },
    // 获取导航菜单方法
    async getMenuList(){
      // console.log("getMenuList");
      const {data:res}=await this.$http.get("menu");
      console.log(res);
      if(res.status===200){
        this.menuList = res.data;
        return console.log("got menu !");
      }else {
        return this.$message.error("用户异常，无法获取菜单列表");
      }
    },
    // 控制伸缩
    toggleCollapse(){
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath){
      sessionStorage.setItem("activePath",activePath)
      this.activePath=activePath;
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  text-align: center;

}
.home-div{
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  font-size: 20px;
  align-items: center;
  span{
   margin-left: 15px;
  }
}
.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);

}
//侧边栏
.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  .el-menu{
    border-right: none;
  }
}
#logo-img {
  width: 50px;
  height: 50px;
}
.toggle-button {
  background-color:#d3dce6;
  font-size: 10px;
  line-height: 24px;
  color:#000;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;// 显示鼠标指针为：小手
}
</style>
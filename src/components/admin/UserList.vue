<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <!--
    gutter:
    span:
    -->
    <el-row :gutter="25">
      <!-- 搜索 -->
      <el-col :span="10">
        <el-input placeholder="请输入搜索内容"
                  v-model="queryInfo.query"
                  clearable @clear="getUserList"
        >
          <template #append>
            <el-button  icon="iconfont icon-search" @click="getUserList" />
          </template>
        </el-input>
      </el-col>

      <!--添加用户-->
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-table :data="userList" border >
      <!--索引列-->
      <el-table-column type="index" width="30px" align="center">
      </el-table-column>
      <!--label代表内容描述    prop 代表 对应的属性-->
      <el-table-column label="姓名" prop="username"   sortable></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="密码" prop="password"  ></el-table-column>
      <el-table-column label="角色" prop="role" align="center"></el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template #default="{row}">
          <!--{{row}}-->
          <el-switch v-model="row.state" @change="userStateChange(row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <!-- 修改 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)"></el-button>
          <!-- 删除 -->
          <!-- 删除有两种方法可以达到该效果 ：
                1. 使用popConfirm 气泡确认框
                2. 在@click方法中直接使用 confirm 确认消息
          -->
          <!--<el-popconfirm title="你确定要删除该用户吗？" @confirm="deleteUser(row.id)">-->
          <!--  <template #reference>-->
          <!--    <el-button type="danger" icon="el-icon-delete" size="mini"  ></el-button>-->
          <!--  </template>-->
          <!--</el-popconfirm>-->
          <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteUser(row.id)"></el-button>

          <!-- 权限 -->
          <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件 size-change 每页最大变化 current-change 当前最大变化 -->
    <div class="demo-pagination-block">
      <div class="demonstration">分页</div>
      <el-pagination
          v-model:currentPage="queryInfo.pageNum"
          v-model:page-size="queryInfo.pageSize"
          :page-sizes="[1, 2, 5, 10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-card>
  <!--新增用户区域-->
  <el-dialog title="添加用户"
             width="50%"
             :model-value = "addDialogVisible"
             @close="addDialogClosed">
    <el-form :model="addUserForm"
             :rules="addFormRules"
             ref="addFormRef"
             label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"/>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible=false">取消</el-button>
      <el-button type="primary" @click="addUser">确定</el-button>
    </span>
  </el-dialog>

  <!-- 修改用户对话框 -->
  <el-dialog title="修改用户信息"
             :model-value="editDialogVisible"
             width="50%"
             @close="editDialogClosed">
    <el-form :model="editUserForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editUserForm.username" disabled></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="editUserForm.password"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
  </el-dialog>

</template>

<script>
export default {
  name: "UserList",
  data(){
    return {
      // 查询信息实体
      queryInfo:{
        query:"",
        pageNum:1,
        pageSize:5
      },
      //用户列表
      userList:[],
      total:0,
      addDialogVisible:false,
      addUserForm:{
        username:'',
        password:'',
        email:'',
      },
      editDialogVisible:false,
      // 控制修改用户对话
      editUserForm:{},
      // 验证规则
      addFormRules:{
        username:[
          {
            required:true,message:"请输入用户名",trigger:"blur"
          },
          {
            min:6,max:10,message: "长度在 6 到 10 个字符", trigger: "blur"
          }
        ],
        password:[
          {
            required: true, message: "请输入密码", trigger: "blur"
          },
          {
            min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur"
          }
        ],
        email:[
          {
            required: true, message: "请输入邮箱", trigger: "blur"
          },
          {
            min: 8, max: 15, message: "请输入正确邮箱地址", trigger: "blur"
          }
        ],
      },
      // 修改用户表单验证规则
      editFormRules:{
        password:[
          {
            required:true,message:"请输入密码",trigger:"blur"
          },
          {
            min:6,max:8,message: "长度在 6 到 8 个字符", trigger: "blur"
          }
        ],
        email:[
          {
            required:true,message:"请输入邮箱",trigger:"blur"
          },
          {
            min:5,max:10,message: "请输入正确邮箱地址",trigger: "blur"
          }
        ],
      }
    }
  },
  created() {
    this.getUserList();
  },
  methods:{
    async getUserList(){
      const {data:res}=await this.$http.get("allUser",{
        params:this.queryInfo
      });
      // const {data:res}=await this.$http.post("allUser",
      //     this.queryInfo
      // );
      console.log(res.data);
      this.userList=res.data;
      this.total=res.number;
    },
    // 改变当前页码
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getUserList();
    },
    // 改变每页数量
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getUserList();

    },
    // 改变用户状态
    async userStateChange(userInfo){
      const {data:res} = await this.$http.put(`userState?id=${userInfo.id}&state=${userInfo.state}`)
      console.log(res);
      if(res!=='success'){
        userInfo.state = !userInfo.state;
        console.log('State 更新失败');
      }else {
        console.log("state 更新成功");
      }
    },
    // 关闭新增用户区域
    addDialogClosed(){
      this.addDialogVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        // console.log(valid);
        if (!valid) return;
        const {data:res} = await this.$http.post("addUser",this.addUserForm);
        if(res!=="success"){
            return this.$message.error("添加失败");
        }
        await this.getUserList();
        this.addDialogVisible=false;

      })
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        console.log(valid);
        if(! valid) return;
        const { data : res } = await this.$http.put("editUser",this.editUserForm);
        console.log(res);
        if( res === 'error') return console.error("操作失败");
        this.editDialogVisible = false;
        this.$message.success("修改成功！")
        await this.getUserList();
      })
    },
    async showEditDialog(id){
      // 获取用户信息有两种方式
      // 第一种，从userList中寻找
      let i =0;
      for(i =0; i<this.userList.length ;i++ ){
        if (this.userList[i].id === id) break;
      }
      console.log(i);
      console.log(this.userList[i]);
      //第二种，单独请求该用户
      // const { data:res } = await this.$http.get(`getUser/${id}`);
      this.editUserForm = this.userList[i];
      this.editDialogVisible=true;
    },
    editDialogClosed(){
      this.editDialogVisible = false;
      this.$refs.editFormRef.resetFields();
    },
    // 第一种 删除的方式
    // async deleteUser(id){
    //   // console.log(id);
    //   const {data:res} = await this.$http.get(`deleteUser/${id}`);
    //   await console.log(res);
    //   this.$message.success("已删除该用户");
    //   await this.getUserList();
    // },
    // 第二种 删除的方式
    async deleteUser(id){
      // 弹框
      const confirmResult = await this.$confirm('是否确认删除该用户?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!=='confirm'){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete(`deleteUser/${id}`);
      if (res !== "success") {
        return console.error("操作失败！！！");
      }
      this.console.success("操作成功！！！");
      await this.getUserList();
    },
  },

}
</script>

<style lang="less" scoped>

</style>
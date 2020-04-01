<template>
  <div>
    <!--面包屑导航1111111-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加-->
      <el-row gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>

        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--作用域插槽接收Scope,change状态改变了v-model跟着变化了-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="设置" placement="top" enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">
      <!--n内容主体区-->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <!--n内容主体区-->
      <el-form :model="editForm" :rules="editFormRules"
               ref="editFormRef" label-width="70px" @close="editDialogClosed">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @click="setRoleDialogClosed">
      <!--n内容主体区-->

      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selsectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {

    data () {

      //验证规则
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value) == true) {
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      }
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value) == true) {
          return cb()
        }
        cb(new Error('请输入合法手机'))
      }
      return {
        selsectedRoleId:'',
        //s所有角色的数据列表
        rolesList: [],
        userInfo: {},
        editFormRules: {
          email: [
            {
              required: true,
              message: '请输入email',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入mobile',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        addFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户名长度在3到10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '用户名长度在6到15个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入email',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入mobile',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },//验证规则
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },//表单数据
        editForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },//xiugai表单数据
        addDialogVisible: false,//对话框显示与隐藏
        setRoleDialogVisible: false,//
        editDialogVisible: false,//
        queryInfo: {
          //获取用户列表的参数对象
          query: '',
          pagenum: 1,
          pagesize: 2//当前每页显示几条
        },
        userlist: '',
        total: 0
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      //分配角色对话框关闭
      setRoleDialogClosed(){
        this.selsectedRoleId = ''
        this.userInfo = {}
      },
      //点击按钮，分配角色
     async saveRoleInfo(){
        if (!this.selsectedRoleId) {
          return this.$message.error('请选择要分配的角色')
        }
       const { data: res } = await this.$http.put(
         `users/${this.userInfo.id}/role`,
         {
           rid: this.selsectedRoleId
         }
       )
        // const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        //   rid: this.selsectedRoleId
        // })
       if (res.meta.status !== 200) {

         return this.$message.error('更新用户角色失败')
       }
        this.getUserList();
       this.setRoleDialogVisible = false
      },
      async setRole (userInfo) {
        //需要被分配角色的用户信息
        this.userInfo = userInfo
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色失败')
        }
        this.rolesList = res.data

        this.setRoleDialogVisible = true
      },
      // 根据Id删除对应的用户信息
      async removeUserById (id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
      },
      editUserInfo () {

        //预验证
        this.$refs.editFormRef.validate(async valid => {

          if (!valid) return
          const { data: res } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('验证成功')
        })
      },
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },

      async showEditDialog (id) {
        const { data: res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('查询失败')
        this.editForm = res.data
        this.editDialogVisible = true
      },
      addUser () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //预校验没错误，网络请求
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.getUserList()
        })
      },
      addDialogClose () {
        this.$refs.addFormRef.resetFields()
      },
      async getUserList () {
        const { data: res } = await this.$http.get('users', { params: this.queryInfo })
        //推荐把get参数定义在data私有数据中
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        }
        this.userlist = res.data.users
        this.total = res.data.total
      },
      handleSizeChange (newsize) {
        //console.log(newsize)
        this.queryInfo.pagesize = newsize
        this.getUserList()
      },
      handleCurrentChange (newpage) {
        //  console.log(newpage)
        this.queryInfo.pagenum = newpage
        this.getUserList()
      },
      async userStateChanged (userinfo) {
       // console.log(userinfo)
        const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新数据失败')
        }
        this.$message.success('更新数据成功')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

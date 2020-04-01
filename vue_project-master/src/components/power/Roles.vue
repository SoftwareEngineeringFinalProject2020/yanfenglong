<template>
    <div>
        <!--面包屑导航1111111-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1, i1) in scope.row.children" id="item1.id" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2, i2) in item1.children" id="item2.id" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable
                                                @close="removeRightById(scope.row,item2.id)"
                                        >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="13">
                                        <el-tag type="warning" closable
                                                @close="removeRightById(scope.row,item3.id)"
                                                v-for="(item3, i3) in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                    <el-button type="warning" size="mini" icon="el-icon-setting"
                    @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>


            </el-table>
        </el-card>
        <el-dialog
                title="分配权限"
                :visible.sync="showSetRightDialogVisible"
                width="50%"
                @close="showSetRightDialogClose"
        >
        <el-tree :data="rightList" :props="treeProps" node-key="id" default-expand-all show-checkbox
        :default-checked-keys="defKeys"
        ></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return {
                roleList:[],
                rightList:[],
                roleId:'',
                showSetRightDialogVisible:false,
                defKeys:[],
                treeProps:{
                    label:'authName',
                    children:'children'
                }
            }
        },
        created() {
            this.getRolesList();
        },
        methods:{
            allotRights(){},
            showSetRightDialogClose(){},
            async  showSetRightDialog(role){
                this.roleId = role.id
                const {data:res} = await this.$http.get(`rights/tree`)
                role.rightsList = res.data
                this.getLeafKeys(role,this.defKeys)
                this.showSetRightDialogVisible = true
            },
            getLeafKeys(node,arr){
                if (!node.children){return arr.push(node.id)}
                node.children.forEach(item =>{ this.getLeafKeys(item,arr)})
            },
           async removeRightById(role,rightId){
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
               role.children = res.data
            },
            async getRolesList(){
               const {data:res} = await this.$http.get('roles')
                if (res.meta.status !== 200){return this.$message.error("获取角色失败")}
               //
               this.roleList = res.data
                console.log(this.roleList)
            }
        }
    }
</script>

<style scoped>
.el-card{
    margin-top: 20px;
}
</style>

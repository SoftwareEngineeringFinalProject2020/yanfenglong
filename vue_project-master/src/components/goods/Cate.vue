<template>
    <div>
        <!--面包屑导航1111111-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-row>
            <el-button type="primary"  @click="showAddCateDialog">添加分类</el-button>
            </el-row>
            <!--表格区-->
            <tree-table :data ="cateList" :columns = "columns"
            show-index border index-text ="#" :expand-type = "false"
                        :selection-type = "false" :show-row-hover="false"
            >
                <template slot-scope="scope" slot="isok">
                    <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted ===false"></i>
                    <i class="el-icon-error" style="color:lightgreen" v-else="scope.row.cat_deleted ===true"></i>
                </template>
                <template slot-scope="scope" slot="order">
                   <el-tag type="primary" size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
                   <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level ===1">二级</el-tag>
                   <el-tag type="success" size="mini" v-else="scope.row.cat_level ===2">三级</el-tag>
                </template>
                <template slot-scope="scope" slot="operate">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
        </el-card>
        <el-dialog
                title="分配权限"
                :visible.sync="showAddCateDialogVisible"
                width="50%"
        >
            <el-form :model="addCateForm" :rules="addCateFormRules"
                     ref="addCateFormRef" label-width="70px">
                <el-form-item label="用户名" prop="cate_name">
                    <el-input v-model="addCateForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                            :v-model="selectKeys"

                    >

                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                selectKeys:[],
                showAddCateDialogVisible:false,
                addCateForm:{
                    cate_name:'',
                    cat_pid:0,
                    cat_level:0
                },
                cateList:[],
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                total:0,
                columns:[
                   {label:'分类名称',prop:'cat_name'},
                   {label:'是否有效',type:'template',template:'isok'},
                   {label:'排序',type:'template',template:'order'},
                   {label:'操作',type:'template',template:'operate'},
                ],
                parentCateList:[]
            }
        },
        created() {
            this.getCateList();
        },
        methods:{
            addCate(){
                this.showAddCateDialogVisible = false
            },
            //获取父级级联菜单数据
            async  getParentCateList(){
                const {data:res} = await this.$http.get('categories',{params:{type:2}})
                if (res.meta.status !== 200){return this.$message.error("获取父级分类失败")}
              //  console.log(res)
                this.parentCateList = res.data
            },
            showAddCateDialog(){
                this.getParentCateList()
                this.showAddCateDialogVisible = true
            },
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
                if (res.meta.status !== 200){return this.$message.error("获取商品分类失败")}
               // console.log(res)
               this.cateList =  res.data.result
                this.total   =  res.data.total
                console.log(this.cateList)
            }
        }
    }
</script>

<style scoped>

</style>

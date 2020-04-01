<template>
    <div>
        <!--面包屑导航1111111-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <el-table :data="rightsList" border stripe>

            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Rights",
        data(){
            return {
            rightsList:[]
            }
        },
        created() {
            this.getRightList();
        },
        methods:{
            async getRightList(){
               const {data:res} = await this.$http.get('rights/list')
                if (res.meta.status !== 200){return this.$message.error("获取权限失败")}
              //  console.log(res)
                this.rightsList = res.data

            }
        }
    }
</script>

<style scoped>
.el-card{
    margin-top: 20px;
}
</style>

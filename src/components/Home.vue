<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/logo.png" style="width: 50px; height: 50px">
                <span>Management System</span>
            </div>
            <el-button type="info">Logout</el-button>
        </el-header>
        <el-container>

            <el-aside :width= "isCollapse ? '50px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
          return {
              isCollapse:false
          }
        },
        methods:{
            toggleCollapse(){
             this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style scoped>
    .toggle-button{
        background: #4A5064;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 0.2em;
        text-align: center;
        color: #FFF;
    }
.el-container{
    height: 100%;
}
    .el-header{
        background: #373d41;
        display: flex;
        justify-content: space-between;
        color: #FFF;
        font-size: 20px;
        align-items: center;
        padding-left: 0px;
    }
    .el-header div{
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    .el-aside{
        background: #333744;
    }
    .el-main{
        background: #eaedf1;
    }
</style>

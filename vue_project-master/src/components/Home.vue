<template>
    <el-container class="home-container">
        <el-header >
            <div style="margin-left: 20px">
                <img src="../assets/logo.png" style="width:32px;height: 32px;">
                <span>ManageMent System</span></div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container >
            <el-aside :width="isCollapse ?'64px': '200px'">
                <!--侧边栏菜单区-->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu :collapse="isCollapse" :collapse-transition="false"
                         background-color="#333744"
                         text-color="#fff"
                         active-text-color="#ffd04b" :unique-opened="isCollapse"
                         :router="true"
                         :default-active="activePath"
                >
                    <!--:router为侧边栏开启路由模式-->
                    <!--一级菜单-->
                    <el-submenu :index="item.id+' '" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span style="margin-left: 10px">{{item.authName}}</span>
                        </template>
                        <!--&lt;!&ndash;二级菜单&ndash;&gt;-->
                        <el-menu-item
                                :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                                @click="saveNavState('/' + subItem.path)">
                            <template slot="title" >
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                        <!-- 二级菜单 -->

                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data(){
            return {
                //cai dan shuju
                menuList:[],
                iconsObj:{
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                isCollapse:false,
                activePath:''
            }
        },
        created(){
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods:{
            //行为区
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            //获取菜单使用的是get，返回的是promise，为了简化使用async
            async getMenuList(){
                const {data:res} = await this.$http.get('menus');
                if (res.meta.status !== 200){ return this.$message.error(res.meta.msg)}
                this.menuList = res.data
                //console.log(res)
            },
            toggleCollapse(){
                this.isCollapse= !this.isCollapse
            },
            saveNavState(activePath){
                //  console.log("activePath按钮点击"+activePath)
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<style scoped>
    .toggle-button{
        background-color: #4A5064 ;
        font-size: 10px;
        line-height: 24px;
        color: #FFF;
        letter-spacing: 0.2em;
        text-align: center;
        cursor: pointer;
    }
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41 ;
        display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
        color: #FFF;
        font-size: 20px;
    }
    .el-header div{
        display: flex;
        align-items: center;
    }
    .el-aside{
        background-color: #333744;

    }
    .el-aside .el-menu{
        border-right: none;
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>

<template>
    <div class="login_container">
        <div class="login_box">
            <div class="inner_box">
                <img src="../assets/logo.png" >
            </div>
            <el-form class="login_form" :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
                <el-form-item prop="username" >
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" >
                    <el-input prefix-icon="el-icon-key" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetloginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                loginForm:{
                    username:'admin',
                    password:"123456"
                },
                loginFormRules:{
                    username:[
                        {required:true,message:"请输入内容",trigger:'blur'}
                    ],
                    password:[
                        {required:true,message:"请输入password",trigger:'blur'}
                    ],
                }
            }
        },
        methods:{
            login(){
                this.$refs.loginFormRef.validate(async valid => {
                    console.log("1111111")
                    if (!valid){return}
                    //send username&password request to the server赋值assignment
                    const  {data:res} = await this.$http.post('login',this.loginForm) //async function
                    //And get response from server
                    console.log(res)
                    //jump to another page
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')
                })
            },
            resetloginForm(){
                this.$refs.loginFormRef.resetFields()
            }
        }
    }
</script>
<style>
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .inner_box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #FFF;
    }
    .inner_box{
        width: 130px;
        height: 130px;
        background: #FFF;
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 50%;
        box-shadow: 0 0 10px #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .login_container{
        background: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background: #FFF;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>

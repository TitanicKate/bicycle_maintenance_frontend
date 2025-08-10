<script setup lang="ts">

import {ref} from "vue";
import {loginService, registerService} from '../api/user.js'
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from 'vue-router'
import {useTokenStore} from '../stores/token.js'

// 是否为注册
const isRegister = ref(false)
const route = useRoute()
const router = useRouter()
const tokenStore = useTokenStore()

// 登录数据模型
const loginData = ref({
  username: '',
  password: '',

  confirmPassword: ''
})

// 验证注册数据
const validateRegister = () => {
  // 校验用户名
  if (!loginData.value.username) {
    ElMessage.error('请输入用户名')
    return false
  }

  if (loginData.value.username.length < 3 || loginData.value.username.length > 20) {
    ElMessage.error('用户名长度必须在 3 到 20 个字符之间')
    return false
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(loginData.value.username)) {
    ElMessage.error('用户名只能以字母开头，可包含字母、数字、下划线或短横线')
    return false
  }

  // 校验密码
  if (!loginData.value.password) {
    ElMessage.error('请输入密码')
    return false
  }

  if (loginData.value.password.length < 6 || loginData.value.password.length > 20) {
    ElMessage.error('密码长度必须在 6 到 20 个字符之间')
    return false
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(loginData.value.password)) {
    ElMessage.error('密码必须包含大小写字母、数字和特殊字符(!@#$%^&*)')
    return false
  }

  // 校验确认密码
  if (!loginData.value.confirmPassword) {
    ElMessage.error('请再次输入密码')
    return false
  }

  if (loginData.value.password !== loginData.value.confirmPassword) {
    ElMessage.error('两次输入密码不一致!')
    return false
  }

  return true
}

// 提交注册
const handleRegister = async () => {
  let isValid = validateRegister()
  if (!isValid) {
    return
  }
  try {
    let result = await registerService(loginData.value);
    if (result.status === 200) {
      if (result.data.code === 200) {
        ElMessage.success(result.data.msg);
        isRegister.value = false;
      } else {
        ElMessage.error(result.data.msg);
      }
    } else {
      ElMessage.error(result.data.msg);
    }
  } catch (e) {
    ElMessage.error(e.message)
  }
}

// 提交登录
const handleLogin = async () => {
  if (!loginData.value.username || !loginData.value.password) {
    ElMessage.error("请填写用户名和密码");
    return;
  }
  try {
    let result = await loginService(loginData.value);
    if (result.status === 200) {
      if (result.data.code === 200) {
        ElMessage.success(result.data.msg);

        tokenStore.setToken(result.data.token.tokenValue);

        await router.push("/");
      } else {
        ElMessage.error(result.data.msg);
      }
    } else {
      ElMessage.error("服务器错误");
    }
  } catch (e) {
  }
}
</script>

<template>
  <div class="body">
    <div class="wrapper">

      <!--注册表单-->
      <form v-if="isRegister">
        <h1>注册</h1>

        <div class="input-box">
          <i class="fas fa-envelope icon"></i>
          <input id="usernameInput" type="username" v-model="loginData.username" required/>
          <label>用户名</label>
        </div>

        <div class="input-box">
          <i class="fas fa-lock icon"></i>
          <input id="passwordInput" type="password" v-model="loginData.password" required/>
          <label>密码</label>
        </div>

        <div class="input-box">
          <i class="fas fa-lock icon"></i>
          <input id="passwordInput" type="password" v-model="loginData.confirmPassword" required/>
          <label>确认密码</label>
        </div>

        <el-button class="btn" @click="handleRegister">注册</el-button>

        <div class="signup-link">
          <p>已有账号？
            <el-button @click="isRegister = false">登录</el-button>
          </p>
        </div>
      </form>

      <!--登陆表单-->
      <form v-if="!isRegister">
        <h1>登录</h1>

        <div class="input-box">
          <i class="fas fa-envelope icon"></i>
          <input id="usernameInput" type="username" v-model="loginData.username" required/>
          <label>用户名</label>
        </div>

        <div class="input-box">
          <i class="fas fa-lock icon"></i>
          <input id="passwordInput" type="password" v-model="loginData.password" required/>
          <label>密码</label>
        </div>

        <div class="row">
          <a onclick="forgotman()" href="#">忘记密码？</a>
        </div>

        <el-button class="btn" @click="handleLogin">登录</el-button>

        <div class="signup-link">
          <p>没有账号？
            <el-button @click="isRegister = true, loginData.password = '', loginData.confirmPassword = ''">创建一个
            </el-button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

.body {
  height: 1050px;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../assets/Family-country-road.jpg');
  background-size: cover;
  background-position: center;
}

.wrapper {
  position: relative;
  width: 400px;
  height: 480px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.wrapper:hover {
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(50px);
}

.wrapper h1 {
  font-size: 2em;
  color: #fff;
  text-align: center;
  font-weight: 600;
}

.wrapper .input-box {
  position: relative;
  width: 310px;
  margin: 30px 0;
  border-bottom: 2px solid #fff;
}

.wrapper .input-box input {
  width: 100%;
  height: 50px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 1em;
  color: #fff;
  padding: 0 40px 0 5px;
}

.wrapper .input-box label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 1em;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.wrapper .input-box input:focus ~ label,
.wrapper .input-box input:valid ~ label {
  top: -5px;
}

.wrapper .input-box .icon {
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 1.2em;
  line-height: 57px;
}

.wrapper .row {
  margin: -15px 0 15px;
  font-size: 0.9em;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.wrapper .row label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.wrapper .row a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  padding: 5px 5px 5px 12px;
}

.wrapper .options a:hover {
  text-decoration: underline;
}

.wrapper .btn {
  width: 100%;
  height: 40px;
  background: #fff;
  outline: none;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  color: #000;
  margin-top: 10px;
}

.btn:hover {
  background: #f7f7c1;
}

.wrapper .signup-link {
  font-size: 1em;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.signup-link button {
  color: #ffffff;
  text-decoration: none;
  padding: 2px 8px 2px 8px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0);
}

.signup-link button:hover {
  text-decoration: underline;
}

</style>
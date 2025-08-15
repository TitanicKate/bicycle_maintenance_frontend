<template>
  <div class="container">
    <el-card class="content-container">
      <h1>个人主页设置</h1>

      <!-- 头像上传区域 -->
      <el-upload
          class="avatar-uploader"
          action="/upload/image"
          :show-file-list="false"
          :auto-upload="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
      >
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar"/>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
      <p class="avatar-hint">支持JPG格式，大小不超过2MB</p>

      <!-- 个人信息表单 -->
      <el-form
          ref="formRef"
          :model="userinfo"
          label-width="100px"
          class="form"
          :rules="formRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userinfo.username" placeholder="请输入用姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
              v-model="userinfo.phone"
              placeholder="请输入手机号"
              maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="userinfo.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="button-group">
            <el-button type="success" @click="handleModifyPassword">修改密码</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码弹窗 -->
    <el-dialog
        v-model="passwordDialogVisible"
        title="修改密码"
        width="400px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          label-width="100px"
          :rules="passwordRules"
          class="password-form"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSave">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage, ElLoading} from 'element-plus'
import type {UploadProps} from 'element-plus'
import useUserStore from '../../stores/user'
import {
  modifyPassword,
  updateUserService
} from '../../api/user'

const userStore = useUserStore()

let avatarUrl = ref(userStore.userInfo.avatar)

// 用户信息表单数据
const userinfo = reactive({
  id: userStore.userInfo.id,
  username: userStore.userInfo.username,
  name: userStore.userInfo.name,
  phone: userStore.userInfo.phone
})

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 状态控制
const passwordDialogVisible = ref(false)
const formRef = ref()
const passwordFormRef = ref()

// 表单验证规则
const formRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入真实姓名', trigger: 'blur'},
    {min: 2, max: 10, message: '姓名长度在2-10个字符之间', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur'}
  ]
}

// 密码验证规则
const passwordRules = {
  oldPassword: [
    {required: true, message: '请输入原密码', trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur'},
    // 新密码和旧密码不能相同
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value === passwordForm.oldPassword) {
          callback(new Error('新密码和旧密码不能一致'))
        } else {
          callback()
        }
      },
    }
  ],
  confirmPassword: [
    {required: true, message: '请确认新密码', trigger: 'blur'},
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 头像上传成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = async (response, uploadFile) => {
  try {
    // 先更新视图显示的头像
    avatarUrl.value = response;

    // 再调用接口更新数据库
    const result = await updateUserService({
      id: userStore.userInfo.id,
      avatar: response
    });

    if (result.data.code === 200) {
      // 接口成功后再更新用户存储
      userStore.setUserInfo(result.data.data);
      ElMessage.success('头像上传成功');
    } else {
      ElMessage.error(result.data.message || '头像更新失败');
      // 接口失败时回滚显示
      avatarUrl.value = userStore.userInfo.avatar;
    }
  } catch (error) {
    ElMessage.error('头像更新失败，请重试');
    // 出错时回滚显示
    avatarUrl.value = userStore.userInfo.avatar;
  }
}

// 头像上传前校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 校验文件类型
  if (!rawFile.type.startsWith('image/')) {
    ElMessage.error('请上传图片格式的文件')
    return false
  }
  // 校验文件大小
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }

  return true
}

// 头像上传失败回调
const handleAvatarError = () => {
  ElMessage.error('头像上传失败，请重试')
}

// 打开修改密码弹窗
const handleModifyPassword = () => {
  passwordDialogVisible.value = true
  // 重置密码表单
  passwordFormRef.value?.resetFields()
}

// 保存个人信息
const handleSave = async () => {
  // 表单验证
  let isValid = await formRef.value.validate()
  if (!isValid) {
    ElMessage.error('请填写正确的表单信息')
    return false
  }
  try {
    let result = await updateUserService(userinfo)
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '更新成功')
      userStore.setUserInfo(result.data.data)
    } else {
      ElMessage.error(result.data.message || '更新失败')
    }
  } catch (error) {
    // 表单验证失败不做处理
    ElMessage.error(error.message)
  }
}

import {useRouter} from "vue-router";

const router = useRouter()

// 保存密码修改
const handlePasswordSave = async () => {
  try {
    // 密码表单验证
    await passwordFormRef.value.validate()

    const modifyForm = {
      id: userStore.userInfo.id,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    }
    let result = await modifyPassword(modifyForm)
    if (result.status === 200) {
      if (result.data.code === 200) {
        ElMessage.success(result.data.message + "，请重新登录");
        userStore.logout();
        await router.push('/login');
      } else {
        ElMessage.error(result.data.message);
      }
    } else {
      ElMessage.error(result.data.message);
    }
  } catch (error) {
    // 表单验证失败不做处理
    ElMessage.error(error.message)
  }
}
</script>

<style scoped>
.container {
  padding: 30px;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
}

.content-container {
  width: 600px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

/* 头像样式 */
.avatar-uploader {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f2f5;
}

.avatar-uploader-icon {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  line-height: 150px;
  background-color: #f0f2f5;
}

.avatar-hint {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-bottom: 30px;
}

/* 表单样式 */
.form {
  margin-top: 20px;
}

.form .el-form-item {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

/* 密码弹窗样式 */
.password-form {
  margin-top: 10px;
}

.password-form .el-form-item {
  margin-bottom: 15px;
}
</style>

<style>
/* 全局样式补充 */
.avatar-uploader .el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>
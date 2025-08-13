<script setup lang="ts">
import {ArrowDown} from '@element-plus/icons-vue';

import {useRouter, useRoute} from "vue-router";
import useTokenStore from '../stores/token';
import {ElMessage} from "element-plus";

const router = useRouter();
const route = useRoute();
const token = useTokenStore();

const currentRoutePath = route.path

const logout = () => {
  // 模拟登出操作
  token.clearToken()
  localStorage.removeItem('token');
  router.push('/login');
  ElMessage.success('退出成功')
};
</script>

<template>
  <el-container class="layout_container">
    <!-- 左侧菜单栏 -->
    <el-aside class="layout_aside">
      <div class="logo">
        <img src="../assets/logo.png" class="bms-logo"> <!-- 注意调整 logo 实际路径 -->
        <span>BMS</span>
      </div>
      <el-menu router :default-active="currentRoutePath" class="custom_menu">
        <el-menu-item index="/home">
          <el-icon><House/></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Bicycle/></el-icon>
          <span>维修单管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User/></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/announcement">
          <el-icon><ChatLineRound /></el-icon>
          <span>公告管理</span>
        </el-menu-item>
        <el-menu-item index="/resources">
          <el-icon><Tools/></el-icon>
          <span>资源管理</span>
        </el-menu-item>
        <el-menu-item index="/evaluation">
          <el-icon><Star/></el-icon>
          <span>评价信息</span>
        </el-menu-item>
        <el-menu-item index="/market">
          <el-icon><Place/></el-icon>
          <span>交易市场</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container class="right_area">
      <!-- 头部区域 -->
      <el-header class="header_area">
        <div>当前用户：<strong>管理员</strong></div>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar src="https://picsum.photos/id/1005/200/200" style="margin-right: 20px"/>
            <span>设置</span>
            <el-icon><arrow-down/></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人设置</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 中间内容区域 -->
      <el-main class="main_area">
        <router-view></router-view>
      </el-main>

      <!-- 底部区域 -->
      <el-footer class="footer_area">
        <div>Copyright © 2025 <strong>Campus Bicycle Maintenance System</strong></div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.custom_menu {
  /* 菜单容器样式（可选） */
  width: 100%;
}

/* 选中状态的菜单项 */
::v-deep .el-menu-item.is-active {
  background-color: #409eff !important; /* 自定义蓝色背景 */
  color: white !important; /* 选中时文字颜色 */
}

/* 鼠标悬停未选中状态（可选） */
::v-deep .el-menu-item:not(.is-active):hover {
  background-color: #e6f7ff !important; /* 浅蓝背景 */
}

.layout_container {
  padding: 0;
  margin: -10px;
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.layout_aside {
  width: 160px;
  background: #f9f9f9;
  border-right: 1px solid #e5e7eb;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
}

.logo .bms-logo {
  margin-left: 30px;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}

.right_area {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header_area {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header_area .el-avatar {
  width: 36px;
  height: 36px;
  margin-right: 8px;
  vertical-align: middle;
}

.main_area {
  background: #f5f7fa;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.footer_area {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  color: #666;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.card-header h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}
</style>
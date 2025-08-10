<script setup lang="ts">
import {ref} from 'vue';
import {
  ArrowUp, ArrowDown, Warning, Check, User, Clock,
  // Tool, BarChart3, PieChart, TrendingUp, Users,
  // Settings, Download, AlertCircle, RefreshCw
} from '@element-plus/icons-vue';

// 模拟数据
const systemStats = ref({
  repairOrders: {
    today: 28,
    todayGrowth: 5,
    week: 156,
    weekGrowth: -3,
    month: 689,
    monthGrowth: 12,
    total: 5432
  },
  pendingOrders: {
    count: 12,
    unassigned: 5,
    repairing: 7
  },
  completedOrders: {
    today: 22,
    week: 134,
    month: 520,
    rate: 92
  },
  activeUsers: {
    today: 89,
    week: 452,
    studentRatio: 87,
    staffRatio: 13
  },
  avgRepairTime: {
    current: 4.2,
    previous: 4.8,
    unit: '小时'
  }
});

// 待处理事项
const pendingTasks = ref({
  unassigned: [
    {id: 'RO-20230512-001', user: '张三', type: '爆胎', time: '1小时前'},
    {id: 'RO-20230512-002', user: '李四', type: '刹车失灵', time: '3小时前', isOverdue: true},
    {id: 'RO-20230512-003', user: '王五', type: '链条脱落', time: '1.5小时前'},
  ],
  overdue: [
    {id: 'RO-20230511-087', repairman: '赵六', reason: '配件不足', time: '30小时前'},
    {id: 'RO-20230511-076', repairman: '钱七', reason: '复杂故障', time: '26小时前'},
  ],
  complaints: [
    {id: 'CP-20230512-001', content: '维修不彻底，问题再次出现', time: '2小时前'},
    {id: 'CP-20230512-002', content: '维修员态度恶劣', time: '5小时前'},
  ]
});

// 最近完成的维修单
const recentCompleted = ref([
  {id: 'RO-20230512-004', user: '孙八', type: '车座松动', repairman: '周九', time: '2小时前', rating: 5},
  {id: 'RO-20230512-005', user: '吴十', type: '变速故障', repairman: '郑一', time: '3小时前', rating: 4},
  {id: 'RO-20230512-006', user: '王二', type: '爆胎', repairman: '赵六', time: '5小时前', rating: 5},
]);

// 配件库存预警
const lowStockParts = ref([
  {name: '内胎', stock: 8, threshold: 15, status: 'warning'},
  {name: '刹车皮', stock: 5, threshold: 10, status: 'danger'},
  {name: '链条油', stock: 12, threshold: 20, status: 'warning'},
]);

// 快捷操作
const quickActions = [
  {name: '维修员管理', icon: User},
  // {name: '配件库存管理', icon: Tool},
  // {name: '系统设置', icon: Settings},
  // {name: '数据导出', icon: Download},
];

import {useRouter} from "vue-router";
import useTokenStore from '../stores/token';
import {ElMessage} from "element-plus";
const router = useRouter();
const token = useTokenStore();

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
    <el-aside width="200px" class="layout_aside">
      <div class="logo">
        <img src="../assets/logo.png" class="bms-logo"> <!-- 注意调整 logo 实际路径 -->
        <span>BMS</span>
      </div>
      <el-menu router>
        <el-menu-item index="/home">
          <el-icon>
            <icon-home/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon>
            <icon-list/>
          </el-icon>
          <span>维修单管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon>
            <users/>
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/resources">
          <el-icon>
            <tool/>
          </el-icon>
          <span>资源管理</span>
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
            <el-avatar src="https://picsum.photos/id/1005/200/200"/>
            <el-icon>
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
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
.layout_container {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
}

.layout_aside {
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
  margin-left: 50px;
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

/* Dashboard Styles */
.dashboard-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #1890ff;
  margin-right: 8px;
  border-radius: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}

.stat-value {
  margin-bottom: 15px;
}

.main-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.sub-value {
  color: #666;
  font-size: 14px;
}

.stat-details {
  font-size: 13px;
}

.stat-item {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.growth.up {
  color: #52c41a;
}

.growth.down {
  color: #f5222d;
}

.warning-card {
  border-left: 4px solid #faad14;
}

.pending {
  color: #f5222d;
}

.refresh-icon {
  color: #1890ff;
  cursor: pointer;
}

.warning-icon {
  color: #faad14;
}

.check-icon {
  color: #52c41a;
}

.user-icon {
  color: #1890ff;
}

.clock-icon {
  color: #722ed1;
}

.section-card {
  border-radius: 20px;
  margin-bottom: 20px;
  background-color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.badge {
  background-color: #f5222d;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.task-section {
  margin-bottom: 20px;
}

.task-section h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #666;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.half-width {
  width: 100%;
}

.third-width {
  width: 100%;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
}

.status-gauge {
  width: 160px;
  height: 160px;
}

.status-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.color-dot.unassigned {
  background-color: #faad14;
}

.color-dot.repairing {
  background-color: #1890ff;
}

.color-dot.waiting {
  background-color: #722ed1;
}

.color-dot.completed {
  background-color: #52c41a;
}

.color-dot.cancelled {
  background-color: #f5222d;
}

.stars {
  color: #faad14;
}

.star-filled {
  fill: currentColor;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 20px;
}

.chart-icon {
  font-size: 40px;
  color: #ccc;
  margin-bottom: 10px;
}

.top-users {
  margin-top: 20px;
}

.resource-section {
  margin-bottom: 20px;
}

.resource-section:last-child {
  margin-bottom: 0;
}

.tool-status {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.status-item {
  text-align: center;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.status-item.warning {
  background-color: #fff7e6;
  color: #faad14;
}

.status-item.danger {
  background-color: #fff1f0;
  color: #f5222d;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

.action-icon {
  font-size: 16px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .three-columns {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 992px) {
  .two-columns {
    grid-template-columns: 1fr;
  }

  .three-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
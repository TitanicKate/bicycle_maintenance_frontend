<script setup lang="ts">
import {ref} from 'vue';
import {
  ArrowUp, ArrowDown, Warning, Check, User, Clock
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
</script>

<template>
  <el-main class="main_area">
    <!-- 一、系统概览（顶部核心指标区） -->
    <section class="dashboard-section">
      <h2 class="section-title">系统概览</h2>
      <div class="stats-grid">
        <!-- 维修单总量 -->
        <el-card class="stat-card">
          <div class="stat-header">
            <span>维修单总量</span>
            <el-icon class="refresh-icon">
              <refresh-cw/>
            </el-icon>
          </div>
          <div class="stat-value">
            <span class="main-value">{{ systemStats.repairOrders.total }}</span>
            <span class="sub-value">累计总单量</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>今日: {{ systemStats.repairOrders.today }}</span>
              <span class="growth up" v-if="systemStats.repairOrders.todayGrowth > 0">
                    <arrow-up/> {{ systemStats.repairOrders.todayGrowth }}%
                  </span>
              <span class="growth down" v-else>
                    <arrow-down/> {{ Math.abs(systemStats.repairOrders.todayGrowth) }}%
                  </span>
            </div>
            <div class="stat-item">
              <span>本周: {{ systemStats.repairOrders.week }}</span>
              <span class="growth up" v-if="systemStats.repairOrders.weekGrowth > 0">
                    <arrow-up/> {{ systemStats.repairOrders.weekGrowth }}%
                  </span>
              <span class="growth down" v-else>
                    <arrow-down/> {{ Math.abs(systemStats.repairOrders.weekGrowth) }}%
                  </span>
            </div>
            <div class="stat-item">
              <span>本月: {{ systemStats.repairOrders.month }}</span>
              <span class="growth up" v-if="systemStats.repairOrders.monthGrowth > 0">
                    <arrow-up/> {{ systemStats.repairOrders.monthGrowth }}%
                  </span>
              <span class="growth down" v-else>
                    <arrow-down/> {{ Math.abs(systemStats.repairOrders.monthGrowth) }}%
                  </span>
            </div>
          </div>
        </el-card>

        <!-- 待处理维修单 -->
        <el-card class="stat-card warning-card">
          <div class="stat-header">
            <span>待处理维修单</span>
            <el-icon class="warning-icon">
              <warning/>
            </el-icon>
          </div>
          <div class="stat-value">
            <span class="main-value pending">{{ systemStats.pendingOrders.count }}</span>
            <span class="sub-value">当前待处理</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>未接单: {{ systemStats.pendingOrders.unassigned }}</span>
            </div>
            <div class="stat-item">
              <span>待维修: {{ systemStats.pendingOrders.repairing }}</span>
            </div>
          </div>
        </el-card>

        <!-- 已完成维修单 -->
        <el-card class="stat-card">
          <div class="stat-header">
            <span>已完成维修单</span>
            <el-icon class="check-icon">
              <check/>
            </el-icon>
          </div>
          <div class="stat-value">
            <span class="main-value">{{ systemStats.completedOrders.month }}</span>
            <span class="sub-value">本月完成</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>今日: {{ systemStats.completedOrders.today }}</span>
            </div>
            <div class="stat-item">
              <span>本周: {{ systemStats.completedOrders.week }}</span>
            </div>
            <div class="stat-item">
              <span>完成率: {{ systemStats.completedOrders.rate }}%</span>
            </div>
          </div>
        </el-card>

        <!-- 活跃用户数 -->
        <el-card class="stat-card">
          <div class="stat-header">
            <span>活跃用户数</span>
            <el-icon class="user-icon">
              <users/>
            </el-icon>
          </div>
          <div class="stat-value">
            <span class="main-value">{{ systemStats.activeUsers.week }}</span>
            <span class="sub-value">本周活跃</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>今日: {{ systemStats.activeUsers.today }}</span>
            </div>
            <div class="stat-item">
              <el-tooltip
                  content="学生: {{ systemStats.activeUsers.studentRatio }}% 教职工: {{ systemStats.activeUsers.staffRatio }}%">
                <span>用户占比: 学生 {{ systemStats.activeUsers.studentRatio }}%</span>
              </el-tooltip>
            </div>
          </div>
        </el-card>

        <!-- 平均维修时长 -->
        <el-card class="stat-card">
          <div class="stat-header">
            <span>平均维修时长</span>
            <el-icon class="clock-icon">
              <clock/>
            </el-icon>
          </div>
          <div class="stat-value">
                <span class="main-value">{{ systemStats.avgRepairTime.current }}{{
                    systemStats.avgRepairTime.unit
                  }}</span>
            <span class="sub-value">本月平均</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>上月: {{ systemStats.avgRepairTime.previous }}{{ systemStats.avgRepairTime.unit }}</span>
            </div>
            <div class="stat-item growth up"
                 v-if="systemStats.avgRepairTime.current < systemStats.avgRepairTime.previous">
              <arrow-down/>
              提升 {{
                (systemStats.avgRepairTime.previous - systemStats.avgRepairTime.current).toFixed(1)
              }}{{ systemStats.avgRepairTime.unit }}
            </div>
            <div class="stat-item growth down" v-else>
              <arrow-up/>
              下降 {{
                (systemStats.avgRepairTime.current - systemStats.avgRepairTime.previous).toFixed(1)
              }}{{ systemStats.avgRepairTime.unit }}
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 二、维修单动态（中部核心业务区） -->
    <section class="dashboard-section">
      <h2 class="section-title">维修单动态</h2>

      <!-- 1. 待处理事项列表 -->
      <el-card class="section-card">
        <div class="card-header">
          <h3>待处理事项</h3>
          <span class="badge">{{
              pendingTasks.unassigned.length + pendingTasks.overdue.length + pendingTasks.complaints.length
            }}</span>
        </div>

        <!-- 未分配的维修单 -->
        <div class="task-section">
          <h4>未分配的维修单</h4>
          <el-table :data="pendingTasks.unassigned" border>
            <el-table-column prop="id" label="订单ID" width="140"></el-table-column>
            <el-table-column prop="user" label="用户姓名"></el-table-column>
            <el-table-column prop="type" label="故障类型"></el-table-column>
            <el-table-column prop="time" label="提交时间">
              <template #default="scope">
                <span :class="{ 'text-danger': scope.row.isOverdue }">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button size="small" type="primary">分配维修员</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 超时未完成的订单 -->
        <div class="task-section">
          <h4>超时未完成的订单</h4>
          <el-table :data="pendingTasks.overdue" border>
            <el-table-column prop="id" label="订单ID" width="140"></el-table-column>
            <el-table-column prop="repairman" label="维修员"></el-table-column>
            <el-table-column prop="reason" label="超时原因"></el-table-column>
            <el-table-column prop="time" label="超时时间"></el-table-column>
            <el-table-column label="操作" width="200">
              <template #default>
                <el-button size="small" type="warning">催促维修</el-button>
                <el-button size="small" type="danger">强制转接</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 用户投诉 / 异常反馈 -->
        <div class="task-section">
          <h4>用户投诉 / 异常反馈</h4>
          <el-table :data="pendingTasks.complaints" border>
            <el-table-column prop="id" label="投诉ID" width="140"></el-table-column>
            <el-table-column prop="content" label="投诉内容"></el-table-column>
            <el-table-column prop="time" label="提交时间"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button size="small" type="primary">处理投诉</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 2. 维修单状态分布和3. 最近完成的维修单 -->
      <div class="two-columns">
        <!-- 维修单状态分布 -->
        <el-card class="section-card half-width">
          <div class="card-header">
            <h3>维修单状态分布</h3>
          </div>
          <div class="chart-container">
            <el-progress type="dashboard" percentage="30" class="status-gauge"/>
            <div class="status-legend">
              <div class="legend-item"><span class="color-dot unassigned"></span>未接单: 30%</div>
              <div class="legend-item"><span class="color-dot repairing"></span>维修中: 25%</div>
              <div class="legend-item"><span class="color-dot waiting"></span>待取车: 15%</div>
              <div class="legend-item"><span class="color-dot completed"></span>已完成: 25%</div>
              <div class="legend-item"><span class="color-dot cancelled"></span>已取消: 5%</div>
            </div>
          </div>
        </el-card>

        <!-- 最近完成的维修单 -->
        <el-card class="section-card half-width">
          <div class="card-header">
            <h3>最近完成的维修单（近24小时）</h3>
          </div>
          <el-table :data="recentCompleted" border>
            <el-table-column prop="id" label="订单ID" width="140"></el-table-column>
            <el-table-column prop="user" label="用户姓名"></el-table-column>
            <el-table-column prop="type" label="故障类型"></el-table-column>
            <el-table-column prop="repairman" label="维修员"></el-table-column>
            <el-table-column prop="time" label="完成时间"></el-table-column>
            <el-table-column prop="rating" label="评分">
              <template #default="scope">
                <div class="stars">
                  <el-icon v-for="i in 5" :key="i" :class="{ 'star-filled': i <= scope.row.rating }">
                    <star/>
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </section>

    <!-- 三、故障与资源分析 -->
    <section class="dashboard-section">
      <h2 class="section-title">故障与资源分析</h2>
      <div class="three-columns">
        <!-- 1. 故障类型分布 -->
        <el-card class="section-card third-width">
          <div class="card-header">
            <h3>故障类型分布（近30天）</h3>
          </div>
          <div class="chart-placeholder">
            <bar-chart3 class="chart-icon"/>
            <span>柱状图/饼图区域</span>
          </div>
        </el-card>

        <!-- 2. 维修量趋势 -->
        <el-card class="section-card third-width">
          <div class="card-header">
            <h3>维修量趋势（近30天）</h3>
          </div>
          <div class="chart-placeholder">
            <trending-up class="chart-icon"/>
            <span>折线图区域</span>
          </div>
        </el-card>

        <!-- 3. 维修员工作量与效率 -->
        <el-card class="section-card third-width">
          <div class="card-header">
            <h3>维修员工作量与效率（近7天）</h3>
          </div>
          <div class="chart-placeholder">
            <bar-chart3 class="chart-icon"/>
            <span>横向条形图区域</span>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 四、用户与资源管理 -->
    <section class="dashboard-section">
      <h2 class="section-title">用户与资源管理</h2>
      <div class="two-columns">
        <!-- 1. 用户数据 -->
        <el-card class="section-card half-width">
          <div class="card-header">
            <h3>用户数据</h3>
          </div>
          <div class="chart-placeholder">
            <users class="chart-icon"/>
            <span>用户增长趋势图表</span>
          </div>
          <div class="top-users">
            <h4>高频用户 TOP5</h4>
            <el-list>
              <el-list-item>张三 - 计算机学院（5次）</el-list-item>
              <el-list-item>李四 - 机械工程系（4次）</el-list-item>
              <el-list-item>王五 - 商学院（3次）</el-list-item>
            </el-list>
          </div>
        </el-card>

        <!-- 2. 维修资源状态 -->
        <el-card class="section-card half-width">
          <div class="card-header">
            <h3>维修资源状态</h3>
          </div>
          <div class="resource-section">
            <h4>配件库存预警</h4>
            <el-table :data="lowStockParts" border>
              <el-table-column prop="name" label="配件名称"></el-table-column>
              <el-table-column prop="stock" label="当前库存">
                <template #default="scope">
                      <span :class="scope.row.status === 'danger' ? 'text-danger' : 'text-warning'">
                        {{ scope.row.stock }}
                      </span>
                </template>
              </el-table-column>
              <el-table-column prop="threshold" label="警戒线"></el-table-column>
              <el-table-column label="操作" width="120">
                <template #default>
                  <el-button size="small" type="primary">补充库存</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="resource-section">
            <h4>维修工具状态</h4>
            <div class="tool-status">
              <div class="status-item">
                <span>正常: 12</span>
              </div>
              <div class="status-item warning">
                <span>待维修: 3</span>
              </div>
              <div class="status-item danger">
                <span>已报废: 1</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 五、快捷操作入口 -->
    <section class="dashboard-section">
      <h2 class="section-title">快捷操作</h2>
      <div class="quick-actions">
        <el-button
            v-for="(action, index) in quickActions"
            :key="index"
            class="action-button"
            type="primary"
            icon="action.icon"
        >
          <component :is="action.icon" class="action-icon"/>
          {{ action.name }}
        </el-button>
      </div>
    </section>
  </el-main>
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
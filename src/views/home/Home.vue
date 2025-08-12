<script setup lang="ts">
import {ref} from 'vue';
import {
  ArrowUp, ArrowDown, Warning, Check, User, Clock
} from '@element-plus/icons-vue';
import Echarts from "../../echarts/Echarts.vue";

// 饼图配置
const pieChartOptions = ref({
  title: {
    text: '维修单状态',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '状态',
      type: 'pie',
      radius: '70%',
      data: [
        {value: 1048, name: '未接单'},
        {value: 735, name: '维修中'},
        {value: 580, name: '已完成'},
        {value: 484, name: '已取消'},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 生成近30天的模拟日期，格式如 '01-01' 等（可根据实际需求调整）
const generateDates = () => {
  const dates = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    dates.push(`${month}-${day}`);
  }
  return dates;
};

// 生成模拟维修量数据
const generateRepairData = () => {
  return Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 10);
};

const lineChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: generateDates(),
    axisLabel: {
      // 若日期显示拥挤，可设置旋转角度
      rotate: 30,
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    name: '维修量'
  },
  series: [
    {
      name: '维修量',
      type: 'line',
      data: generateRepairData(),
      smooth: true, // 让折线更平滑
      lineStyle: {
        color: '#409EFF' // 自定义折线颜色
      },
      itemStyle: {
        color: '#409EFF' // 自定义折点颜色
      }
    }
  ]
});

// 柱状图配置
const barChartOptions = ref({
  title: {
    text: '故障类型',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['其他故障', '爆胎故障', '刹车故障', '链条故障', '车轮故障']
  },
  yAxis: {
    type: 'value',
    name: '数量'
  },
  series: [
      {
        name: '数量',
        type: 'bar',
        data: [12, 25, 18, 30, 22],
        barWidth: '40%'
      }
  ]
})

// 2. 模拟近30天用户数据（可替换为接口数据）
const generateMockData = () => {
  const data = []
  let base = 100 // 初始用户数
  const trend = [1, 2, 3, 2, 4, 3, 5, 4, 6, 5] // 每日波动趋势

  for (let i = 0; i < 30; i++) {
    // 模拟用户增长（带波动）
    const growth = Math.floor(Math.random() * 5) + trend[i % 10]
    base += growth
    data.push(base)
  }
  return data
}

const userChartOptions = ref({
  title: {
    text: '用户数量',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    axisLabel: {
      color: '#666',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    name: '用户数',
    axisLabel: {
      color: '#666',
      fontSize: 12
    }
  },
  series: [
    {
      name: '用户增长',
      type: 'line',
      data: generateMockData(),
      smooth: true, // 平滑曲线
      lineStyle: {
        color: '#409EFF',
        width: 2
      },
      itemStyle: {
        color: '#409EFF',
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.2)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0)' }
          ]
        }
      },
      label: {
        show: true,
        position: 'top',
        color: '#333'
      }
    }
  ],
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  }
})

// 2. 模拟维修员数据（可替换为接口数据）
const generateWorkManData = () => {
  return [
    { name: '维修员A', work: 28, efficiency: 92 },
    { name: '维修员B', work: 22, efficiency: 85 },
    { name: '维修员C', work: 35, efficiency: 95 },
  ]
}

// 3. 图表配置
const workManChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  xAxis: {
    type: 'value',
    name: '数量/效率',
    axisLabel: {
      color: '#666',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'category',
    data: generateWorkManData().map(item => item.name),
    axisLabel: {
      color: '#333',
      fontSize: 14
    }
  },
  series: [
    {
      name: '工作量',
      type: 'bar',
      data: generateWorkManData().map(item => item.work),
      barCategoryGap: '20%',
      itemStyle: {
        color: '#5189E6',
        borderRadius: [6, 0, 0, 6]
      },
      label: {
        show: true,
        position: 'right',
        color: '#333'
      }
    },
    {
      name: '效率',
      type: 'bar',
      data: generateWorkManData().map(item => item.efficiency),
      barCategoryGap: '20%',
      itemStyle: {
        color: '#E65189',
        borderRadius: [6, 0, 0, 6]
      },
      label: {
        show: true,
        position: 'right',
        color: '#333'
      }
    }
  ],
  grid: {
    left: '10%',
    right: '15%',
    bottom: '5%',
    containLabel: true
  }
})

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
            <Echarts :options="pieChartOptions" height="300px"/>
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
          <Echarts :options="barChartOptions" height="300px"/>
        </el-card>

        <!-- 2. 维修量趋势 -->
        <el-card class="section-card third-width">
          <div class="card-header">
            <h3>维修量趋势（近30天）</h3>
          </div>
          <Echarts :options="lineChartOption" height="300px"/>
        </el-card>

        <!-- 3. 维修员工作量与效率 -->
        <el-card class="section-card third-width">
          <div class="card-header">
            <h3>维修员工作量与效率（近7天）</h3>
          </div>
          <Echarts :options="workManChartOption" height="300px"/>
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
          <Echarts :options="userChartOptions"/>
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
.logo .bms-logo {
  margin-left: 50px;
  margin-right: 10px;
  width: 30px;
  height: 30px;
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

.stars {
  color: #faad14;
}

.star-filled {
  fill: currentColor;
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
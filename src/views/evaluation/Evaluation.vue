<template>
  <el-card class="evaluation-manage">
    <!-- 查询区域 -->
    <el-form :model="searchForm" inline label-width="80px" class="search-form">
      <el-form-item label="评价内容">
        <el-input v-model="searchForm.content" placeholder="输入评价内容查询"></el-input>
      </el-form-item>
<!--      <el-form-item label="订单ID">-->
<!--        <el-input v-model="searchForm.orderId" placeholder="输入订单ID查询"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="用户ID">
        <el-input v-model="searchForm.userId" placeholder="输入用户ID查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :loading="searchLoading">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 评价表格 -->
    <el-table
        :data="filterData"
        border
        style="width: 100%"
        v-loading="tableLoading"
        element-loading-text="加载中..."
    >
      <el-table-column prop="id" label="评价ID" width="100" align="center"></el-table-column>
      <el-table-column prop="content" label="评价内容" align="center"></el-table-column>
      <el-table-column
          prop="createTime"
          label="评价时间"
          align="center"
          width="240"
          :formatter="formatTime"
      ></el-table-column>
      <el-table-column prop="orderId" label="订单ID" width="100" align="center"></el-table-column>
      <el-table-column prop="score" label="评分" width="80" align="center"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100" align="center"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right"
    ></el-pagination>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElPagination
} from 'element-plus';
import { ElMessage, ElLoading } from 'element-plus';

// 引入评价API服务
import {
  getAllEvaluationService
} from "../../api/evaluation.js";

// 响应式数据
const filterData = ref([]); // 表格展示数据
const allEvaluationData = ref([]); // 全量数据缓存
const searchForm = reactive({
  content: '',
  // orderId: '',
  userId: ''
}); // 查询表单
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const tableLoading = ref(false); // 表格加载状态
const searchLoading = ref(false); // 查询按钮加载状态
const searchTimer = ref(null); // 防抖计时器

onMounted(() => {
  handleGetAllEvaluationList();
});

// 获取全量评价数据
const handleGetAllEvaluationList = async () => {
  tableLoading.value = true;
  try {
    const result = await getAllEvaluationService();
    if (result.data.code === 200) {
      allEvaluationData.value = result.data.data || [];
      handleLocalSearch(); // 触发本地筛选
    } else {
      ElMessage.error(result.data.message || '获取评价列表失败');
    }
  } catch (error) {
    ElMessage.error('获取评价列表失败，请重试');
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

// 本地筛选处理
const handleLocalSearch = () => {
  // 基础筛选逻辑
  let filtered = allEvaluationData.value.filter(item => {
    const contentMatch = searchForm.content
        ? item.content.includes(searchForm.content)
        : true;
    // const orderIdMatch = searchForm.orderId
    //     ? item.orderId.toString().includes(searchForm.orderId.toString())
    //     : true;
    const userIdMatch = searchForm.userId
        ? item.userId.toString().includes(searchForm.userId.toString())
        : true;
    return contentMatch && userIdMatch;
  });

  // 更新总条数
  total.value = filtered.length;

  // 处理分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  filterData.value = filtered.slice(startIndex, endIndex);
};

// 查询
const handleSearch = () => {
  searchLoading.value = true;
  currentPage.value = 1; // 查询时重置页码
  handleLocalSearch();
  searchLoading.value = false;
};

// 重置查询条件
const resetSearch = () => {
  searchForm.content = '';
  searchForm.orderId = '';
  searchForm.userId = '';
  handleSearch();
};

// 每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  handleLocalSearch();
};

// 当前页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val;
  handleLocalSearch();
};

// 格式化时间
const formatTime = (row, column) => {
  const timeValue = row[column.property]
  if (!timeValue) return '';

  const date = new Date(timeValue);
  // 处理无效日期的情况
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
.evaluation-manage {
  border-radius: 20px;
  padding: 20px;
}

.search-form {
  margin-bottom: 16px;
}
</style>
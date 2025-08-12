<template>
  <el-card class="evaluation-manage">
    <!-- 查询区域，简单示例，可扩展按时间、订单等查询 -->
    <el-form :model="searchForm" inline label-width="80px" class="search-form">
      <el-form-item label="内容">
        <el-input v-model="searchForm.content" placeholder="输入评价内容查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 评价表格 -->
    <el-table :data="tableData" border style="width: 100%" :loading="loading">
      <el-table-column prop="id" label="评价ID" width="100" align="center"></el-table-column>
      <el-table-column prop="content" label="评价内容" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center" width="200">
        <template #default="scope">
          {{ formatDateTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单ID" width="100" align="center"></el-table-column>
      <el-table-column prop="score" label="评分" width="80" align="center"></el-table-column>
      <el-table-column prop="user_id" label="用户ID" width="100" align="center"></el-table-column>
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
import {ref, reactive, onMounted, computed} from 'vue';
import {ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElLoading} from 'element-plus';
// 模拟接口请求，实际项目中替换为真实的接口调用（比如 axios 请求后端接口）
const mockApi = {
  getEvaluations: (params) => {
    return new Promise((resolve) => {
      // 模拟返回数据，这里简单构造，实际根据后端接口返回调整
      const mockData = {
        total: 50,
        list: Array.from({length: params.pageSize}).map((_, index) => {
          const baseIndex = (params.page - 1) * params.pageSize + index + 1;
          return {
            id: baseIndex,
            content: `这是第${baseIndex}条评价内容`,
            create_time: new Date().getTime() - (Math.random() * 1000 * 60 * 60 * 24 * 7), // 模拟一周内的时间
            order_id: baseIndex,
            score: Math.floor(Math.random() * 6), // 0 - 5 随机评分
            user_id: baseIndex
          };
        })
      };
      resolve(mockData);
    });
  }
};

const tableData = ref([]);
const searchForm = reactive({
  content: ''
});
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);

onMounted(() => {
  fetchData();
});

// 获取评价数据
const fetchData = async () => {
  loading.value = true;
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    content: searchForm.content
  };
  const res = await mockApi.getEvaluations(params);
  tableData.value = res.list;
  total.value = res.total;
  loading.value = false;
};

// 查询
const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

// 重置查询条件
const resetSearch = () => {
  searchForm.content = '';
  handleSearch();
};

// 每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData();
};

// 当前页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

// 格式化时间，将时间戳转为可读的日期时间格式，这里假设 create_time 是时间戳（如果是数据库的 datetime ，后端返回时注意处理）
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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
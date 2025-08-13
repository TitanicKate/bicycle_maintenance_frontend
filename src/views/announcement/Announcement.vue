<template>
  <el-card class="announcement-manage-container">
    <!-- 查询区域 -->
    <el-form :model="searchForm" inline label-width="100px" class="search-form">
      <el-form-item label="公告标题">
        <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            style="width: 200px"
            @input="handleInputDebounce"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-select
            v-model="searchForm.isTop"
            placeholder="选择是否置顶"
            style="width: 150px"
        >
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :loading="searchLoading">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="success" @click="openAddDialog">新增公告</el-button>
      <el-button type="danger" @click="handleDeleteBatch" :disabled="selectedRows.length === 0">批量删除</el-button>
    </div>

    <!-- 公告表格 -->
    <el-table
        :data="filterData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
        element-loading-text="加载中..."
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <el-table-column prop="authorId" label="作者ID" align="center"></el-table-column>
      <el-table-column
          prop="isTop"
          label="是否置顶"
          align="center"
          :formatter="formatIsTop"
      ></el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="240"
          :formatter="formatTime"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
              type="primary"
              :icon="Edit"
              size="mini"
              circle
              @click="openEditDialog(scope.row)"
          ></el-button>
          <el-button
              type="danger"
              :icon="Delete"
              size="mini"
              circle
              @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        title="公告信息"
        v-model="dialogVisible"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          :model="form"
          label-width="120px"
          class="dialog-form"
          :rules="formRules"
          ref="formRef"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
              v-model="form.content"
              placeholder="请输入公告内容"
              type="textarea"
              rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者ID" prop="authorId">
          <el-input v-model="form.authorId" placeholder="请输入作者ID"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
              v-model="form.createTime"
              type="datetime"
              placeholder="选择创建时间"
              style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-select v-model="form.isTop" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  ElMessageBox,
  ElMessage,
  ElLoading
} from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'

// 引入公告API服务（需创建对应api文件）
import {
  getAllAnnouncementService,
  addAnnouncementService,
  updateAnnouncementService,
  deleteAnnouncementService,
  deleteBatchAnnouncementService
} from "../../api/announcement.js";

// 响应式数据
const allAnnouncementData = ref([]) // 全量数据
const filterData = ref([]) // 筛选后的数据
const searchForm = reactive({
  title: '',
  isTop: null
})
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const form = reactive({
  id: '',
  authorId: '',
  content: '',
  createTime: null,
  isTop: '0',
  title: ''
})
const selectedRows = ref([])
const tableLoading = ref(false)
const searchLoading = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const searchTimer = ref(null)

// 表单验证规则
const formRules = reactive({
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { max: 50, message: '标题不能超过50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { max: 500, message: '内容不能超过500个字符', trigger: 'blur' }
  ],
  author_id: [
    { required: true, message: '请输入作者ID', trigger: 'blur' }
  ],
  create_time: [
    { required: true, message: '请选择创建时间', trigger: 'change' }
  ]
})

// 初始化加载数据
onMounted(() => {
  handleGetAllAnnouncementList()
})

// 获取全量公告数据
const handleGetAllAnnouncementList = async () => {
  tableLoading.value = true
  try {
    const result = await getAllAnnouncementService()
    if (result.data.code === 200) {
      allAnnouncementData.value = result.data.data || []
      handleLocalSearch()
    } else {
      ElMessage.error(result.data.message || '获取公告列表失败')
    }
  } catch (error) {
    ElMessage.error('获取公告列表失败，请重试')
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

// 本地筛选
const handleLocalSearch = () => {
  let filtered = allAnnouncementData.value.filter(item => {
    const titleMatch = searchForm.title
        ? item.title.includes(searchForm.title)
        : true
    const isTopMatch = searchForm.isTop !== null
        ? item.is_top === searchForm.isTop
        : true
    return titleMatch && isTopMatch
  })

  total.value = filtered.length
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  filterData.value = filtered.slice(startIndex, endIndex)
}

// 搜索处理
const handleSearch = () => {
  searchLoading.value = true
  currentPage.value = 1
  handleLocalSearch()
  searchLoading.value = false
}

// 输入防抖
const handleInputDebounce = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    currentPage.value = 1
    handleLocalSearch()
  }, 300)
}

// 重置搜索
const resetSearch = () => {
  searchForm.title = ''
  searchForm.isTop = null
  handleSearch()
}

// 保存公告（新增/编辑）
const handleSave = async () => {
  await formRef.value.validate().catch(err => {
    ElMessage.error(err.message)
    return Promise.reject(err)
  })

  submitLoading.value = true
  try {
    if (form.id) {
      // 编辑操作
      const result = await updateAnnouncementService(form)
      if (result.data.code === 200) {
        ElMessage.success('更新成功')
      } else {
        ElMessage.error(result.data.message || '更新失败')
      }
    } else {
      // 新增操作
      const result = await addAnnouncementService(form)
      if (result.data.code === 200) {
        ElMessage.success('新增成功')
      } else {
        ElMessage.error(result.data.message || '新增失败')
      }
    }
    dialogVisible.value = false
    handleGetAllAnnouncementList()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 批量删除
const handleDeleteBatch = async () => {
  if (selectedRows.value.length === 0) return

  try {
    await ElMessageBox.confirm(
        `确定删除选中的${selectedRows.value.length}条公告？`,
        '提示',
        { type: 'warning' }
    )

    const loading = ElLoading.service({ text: '删除中...' })
    const ids = selectedRows.value.map(item => item.id)
    const result = await deleteBatchAnnouncementService(ids)

    if (result.data.code === 200) {
      ElMessage.success('批量删除成功')
      handleGetAllAnnouncementList()
    } else {
      ElMessage.error(result.data.message || '批量删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 单条删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        '确定删除这条公告？',
        '提示',
        { type: 'warning' }
    )

    const loading = ElLoading.service({ text: '删除中...' })
    const result = await deleteAnnouncementService(row.id)

    if (result.data.code === 200) {
      ElMessage.success('删除成功')
      handleGetAllAnnouncementList()
    } else {
      ElMessage.error(result.data.message || '删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogVisible.value = true
  formRef.value.resetFields()
  form.id = ''
  form.is_top = '0'
}

// 打开编辑弹窗
const openEditDialog = (row) => {
  dialogVisible.value = true
  formRef.value.resetFields()
  Object.assign(form, row)
  form.create_time = row.create_time ? new Date(row.create_time) : null
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value.resetFields()
}

// 格式化是否置顶
const formatIsTop = (row) => {
  return row.isTop === 1 ? '是' : '否'
}

// 格式化时间显示
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

// 分页相关
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  handleLocalSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleLocalSearch()
}

// 选择事件
const handleSelectionChange = (val) => {
  selectedRows.value = val
}
</script>

<style scoped>
.announcement-manage-container {
  border-radius: 20px;
  padding: 20px;
}

.search-form {
  margin-bottom: 16px;
}

.button-group {
  margin-bottom: 16px;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-footer {
  text-align: right;
}
</style>
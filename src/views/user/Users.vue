<template>
  <el-card class="user-manage-container">
    <!-- 查询区域 -->
    <el-form :model="searchForm" inline label-width="80px" class="search-form">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone" placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :loading="searchLoading">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="success" @click="openAddDialog">新增用户</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
        :data="filterData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
        element-loading-text="加载中..."
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="name" label="真实姓名" align="center"></el-table-column>
      <el-table-column prop="role" label="角色" align="center" :formatter="formatRole"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleUserStatusChange(scope.row)"
              :loading="scope.row.loading"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" circle @click="openEditDialog(scope.row)"/>
          <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.row)"/>
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
    <el-dialog title="用户信息" v-model="dialogVisible" width="500px" @close="handleDialogClose">
      <el-form
          :model="form"
          label-width="100px"
          class="dialog-form"
          :rules="formRules"
          ref="formRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="!form.id">
          <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              :show-password="true"
              maxlength="20"
          ></el-input>
          <template #help>
            <span v-if="form.id" class="text-xs text-gray-500">不输入则不修改密码</span>
          </template>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option v-for="(role, index) in roleOptions" :key="index" :label="role.label" :value="role.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddOrUpdateUser" :loading="submitLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, reactive, onMounted, computed, getCurrentInstance} from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElPagination,
  ElDialog,
  ElSwitch,
  ElSelect,
  ElOption,
  ElMessageBox,
  ElMessage,
  ElLoading
} from 'element-plus'

import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'

// 模拟角色枚举（可根据实际接口返回调整）
const roleOptions = [
  {label: '普通用户', value: 3},
  {label: '维修员', value: 2},
  {label: '管理员', value: 1}
]

// 响应式数据
const filterData = ref([]) // 表格数据
const searchForm = reactive({
  username: '',
  phone: ''
}) // 查询表单
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const dialogVisible = ref(false) // 弹窗显隐
const form = reactive({
  id: '',
  username: '',
  password: '',
  phone: '',
  name: '',
  role: 3
}) // 弹窗表单
const selectedRows = ref([]) // 选中行数据
const tableLoading = ref(false) // 表格加载状态
const searchLoading = ref(false) // 查询按钮加载状态
const submitLoading = ref(false) // 提交按钮加载状态
const formRef = ref(null) // 表单引用
// 新增：存储全量用户数据
const allUserData = ref([])
// 新增：防抖计时器
const searchTimer = ref(null)

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { max: 10, message: '真实姓名不能超过10个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 获取用户列表 - 改为后端分页
import {
  getAllUserService,
  addUserService,
  deleteUserService,
  updateUserService,
  deleteBatchUserService
} from "../../api/user.js";

const handleGetAllUserList = async () => {
  tableLoading.value = true
  try {
    // 仅请求一次全量数据（忽略分页参数）
    const params = {
      page: 1,
      pageSize: 9999,  // 足够大的数值获取所有数据
      username: '',
      phone: ''
    }
    let result = await getAllUserService(params);
    if (result.data.code === 200) {
      allUserData.value = result.data.data || []  // 缓存全量数据
      handleLocalSearch()  // 触发本地筛选
    } else {
      ElMessage.error(result.data.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败，请重试')
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

// 新增：本地筛选逻辑
const handleLocalSearch = () => {
  // 1. 基础筛选
  let filtered = allUserData.value.filter(item => {
    const usernameMatch = searchForm.username
        ? item.username.toLowerCase().includes(searchForm.username.toLowerCase())
        : true
    const phoneMatch = searchForm.phone
        ? item.phone.includes(searchForm.phone)
        : true
    return usernameMatch && phoneMatch
  })

  // 2. 更新总条数
  total.value = filtered.length

  // 3. 处理分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  filterData.value = filtered.slice(startIndex, endIndex)
}

// 新增：输入防抖处理
const handleInputDebounce = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    currentPage.value = 1  // 重置页码
    handleLocalSearch()
  }, 300)
}

const handleAddOrUpdateUser = async () => {
  // 表单验证
  await formRef.value.validate().catch(err => {
    console.error(err)
    return Promise.reject(err)
  })

  submitLoading.value = true
  try {
    if (form.id) {
      // 更新用户
      const updateData = { ...form }
      // 不修改密码时删除密码字段
      if (!updateData.password) delete updateData.password

      let result = await updateUserService(updateData);
      if (result.data.code === 200) {
        dialogVisible.value = false
        ElMessage.success(result.data.message || '更新成功')
        handleGetAllUserList() // 重新获取当前页数据
      } else {
        ElMessage.error(result.data.message || '更新失败')
      }
    } else {
      // 新增用户
      let result = await addUserService(form);
      if (result.data.code === 200) {
        dialogVisible.value = false
        ElMessage.success(result.data.message || '新增成功')
        // 新增成功后跳转到最后一页
        currentPage.value = Math.ceil((total.value + 1) / pageSize.value)
        handleGetAllUserList()
      } else {
        ElMessage.error(result.data.message || '新增失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 删除用户（单条）
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const loading = ElLoading.service({
      lock: true,
      text: '删除中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    let result = await deleteUserService(row.id);
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '删除成功')
      // 处理删除后分页逻辑
      if (filterData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      handleGetAllUserList()
    } else {
      ElMessage.error(result.data.message || '删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') { // 排除取消操作
      ElMessage.error('删除失败，请重试')
      console.error(error)
    }
  }
}

// 状态切换
const handleUserStatusChange = async (row) => {
  row.loading = true;
  try {
    let result = await updateUserService({
      id: row.id,
      status: row.status
    });
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '状态更新成功')
    } else {
      // 接口返回失败时回滚状态
      row.status = row.status === 1 ? 0 : 1;
      ElMessage.error(result.data.message || '状态更新失败')
    }
  } catch (error) {
    // 接口失败时回滚状态
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error('状态更新失败，请重试');
    console.error(error)
  } finally {
    row.loading = false;
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }

  try {
    await ElMessageBox.confirm(
        `此操作将永久删除选中的${selectedRows.value.length}个用户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const loading = ElLoading.service({
      lock: true,
      text: '删除中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const ids = selectedRows.value.map(item => item.id)
    let result = await deleteBatchUserService(ids)
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '批量删除成功')
      // 处理删除后分页逻辑
      if (filterData.value.length === selectedRows.value.length && currentPage.value > 1) {
        currentPage.value--
      }
      handleGetAllUserList()
      selectedRows.value = [] // 清空选择
    } else {
      ElMessage.error(result.data.message || '批量删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') { // 排除取消操作
      ElMessage.error('批量删除失败，请重试')
      console.error(error)
    }
  }
}

// 初始化加载数据
onMounted(() => {
  handleGetAllUserList()
})

// 修改：查询按钮事件
const handleSearch = () => {
  searchLoading.value = true
  currentPage.value = 1
  handleLocalSearch()  // 本地筛选
  searchLoading.value = false
}

// 修改：分页事件（基于本地数据分页）
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  handleLocalSearch()  // 替换原接口请求
}

// 重置查询
const resetSearch = () => {
  searchForm.username = ''
  searchForm.phone = ''
  handleSearch()
}

// 分页-当前页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleGetAllUserList()
}

// 多选事件
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogVisible.value = true
  // 重置表单
  formRef.value.resetFields()
  form.id = ''
  form.role = 3 // 默认普通用户
}

// 打开编辑弹窗
const openEditDialog = (row) => {
  dialogVisible.value = true
  // 重置表单验证
  formRef.value.resetFields()
  // 赋值表单（密码不回显）
  form.id = row.id
  form.username = row.username
  form.password = ''
  form.phone = row.phone
  form.name = row.name
  form.role = row.role
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value.resetFields()
}

// 格式化角色显示
const formatRole = (row) => {
  const roleMap = {
    3: '普通用户',
    2: '维修员',
    1: '管理员'
  }
  return roleMap[row.role] || '未知角色'
}

// 格式化时间显示
const formatTime = (row) => {
  if (!row.createTime) return '';

  const date = new Date(row.createTime);
  // 处理无效日期的情况
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补零
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
.user-manage-container {
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
}

.dialog-footer {
  text-align: right;
}
</style>
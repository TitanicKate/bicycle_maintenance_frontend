<template>
  <div
      ref="chartRef"
      :style="{ width: width, height: height }"
      class="echarts-container"
  />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 接收父组件传递的参数
const props = defineProps({
  // 图表宽度
  width: {
    type: String,
    default: '100%'
  },
  // 图表高度
  height: {
    type: String,
    default: '400px'
  },
  // 图表配置项
  options: {
    type: Object,
    required: true
  },
  // 图表主题
  theme: {
    type: [String, Object],
    default: null
  }
})

// 图表实例
const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  // 确保DOM已挂载
  if (!chartRef.value) return

  // 销毁已存在的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value, props.theme)

  // 设置图表配置
  chartInstance.setOption(props.options)
}

// 监听窗口大小变化，自动调整图表
const handleResize = () => {
  chartInstance && chartInstance.resize()
}

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听配置项变化，更新图表
watch(
    () => props.options,
    (newOptions) => {
      if (chartInstance) {
        chartInstance.setOption(newOptions, true)
      }
    },
    { deep: true }
)

// 监听主题变化，重新初始化图表
watch(
    () => props.theme,
    () => {
      initChart()
    }
)

// 暴露方法让父组件可以主动调用
defineExpose({
  resize: () => chartInstance && chartInstance.resize(),
  getInstance: () => chartInstance
})
</script>

<style scoped>
.echarts-container {
  transition: all 0.3s ease;
}
</style>

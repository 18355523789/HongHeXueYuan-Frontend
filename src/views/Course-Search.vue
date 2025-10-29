<template>
  <div class="search-bar">
    <el-input
      v-model.trim="keyword"
      placeholder="请输入关键词"
      clearable
      @keyup.enter.native="searchCourse">
      <template #append>
        <el-button @click="searchCourse">搜索</el-button>
      </template>
    </el-input>
  </div>
  <el-row v-if="courses && courses.length > 0" :gutter="20">
    <el-col v-for="course in courses" :xs="24" :sm="6" class="course-card">
      <router-link :to="{ name: 'Course-Content', params: { id: course.id }}">
        <el-card :body-style="{ 'padding': '0px', 'min-height': '275px' }">
          <el-image :src="course.coverPicture" class="card-cover-picture"/>
          <div class="card-text">
            <div class="card-course-name">
              {{ course.name }}
            </div>
          </div>
        </el-card>
      </router-link>
    </el-col>
  </el-row>
  <el-empty v-else/>
  <div class="pagination">
    <el-pagination background layout="prev, pager, next" :pager-count="5" :total="size" :page-size="20"
                   :hide-on-single-page="true" @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
import {searchCourse} from '../utils/api'

export default {
  name: 'Course-Search',
  data() {
    return {
      keyword: '',
      courses: [],
      size: 0,
      pageNum: 1
    }
  },
  created() {
    const q = this.$route.query && this.$route.query.q
    if (q) {
      this.keyword = q
      this.searchCourse()
    }
  },
  methods: {
    searchCourse() {
      if (!this.keyword) {
        this.courses = []
        this.size = 0
        return
      }
      // 後端分頁為0基，前端為1基，這裡轉換
      searchCourse({ keyword: this.keyword, pageNum: Math.max(0, this.pageNum - 1) }).then(result => {
        if (result.code === '0000') {
          const data = result.data || {}
          this.courses = data.list || []
          this.size = data.size || data.total || this.courses.length || 0
        }
      })
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum
      this.searchCourse()
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin: 10px 0 20px 0;
}
</style>
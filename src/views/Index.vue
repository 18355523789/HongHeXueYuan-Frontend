<template>
    <!-- 公司宣傳輪播（位於頂部導航與搜尋欄之間） -->
    <div class="promo-wrapper" v-if="banners && banners.length">
        <el-carousel height="500px" indicator-position="outside" trigger="hover" :interval="4000">
            <el-carousel-item v-for="(b, idx) in banners" :key="idx">
                <a v-if="b.link" :href="b.link" target="_blank" rel="noopener">
                    <el-image :src="b.url" fit="cover" class="promo-image"/>
                </a>
                <template v-else>
                    <el-image :src="b.url" fit="cover" class="promo-image"/>
                </template>
            </el-carousel-item>
        </el-carousel>
    </div>

    <!-- 公司通知/諮詢模組 -->
    <div class="notice-section" v-if="(popularNotices || []).length > 0 || (latestNotices || []).length > 0">
        <div class="notice-header">
            <h3 class="notice-title">
                <el-icon><Bell /></el-icon>
                网校动态
            </h3>
        </div>
        <div class="notice-content">
            <!-- 左側：熱門通知 -->
            <div class="notice-column">
                <div class="notice-column-header">
                    <h4 class="column-title">
                        <el-icon><Star /></el-icon>
                        熱門通知
                    </h4>
                </div>
                <div class="notice-list">
                    <div 
                        v-for="notice in (popularNotices || [])" 
                        :key="'popular-' + notice.id"
                        class="notice-item"
                        @click="viewNotice(notice)">
                        <div class="notice-item-content">
                            <div class="notice-item-title">{{ notice.title }}</div>
                            <div class="notice-item-summary">{{ notice.summary }}</div>
                            <div class="notice-item-meta">
                                <span class="notice-date">{{ formatDate(notice.createTime) }}</span>
                                <span class="notice-views">
                                    <el-icon><View /></el-icon>
                                    {{ notice.viewCount || 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 右側：最新通知 -->
            <div class="notice-column">
                <div class="notice-column-header">
                    <h4 class="column-title">
                        <el-icon><Clock /></el-icon>
                        最新通知
                    </h4>
                </div>
                <div class="notice-list">
                    <div 
                        v-for="notice in (latestNotices || [])" 
                        :key="'latest-' + notice.id"
                        class="notice-item"
                        @click="viewNotice(notice)">
                        <div class="notice-item-content">
                            <div class="notice-item-title">{{ notice.title }}</div>
                            <div class="notice-item-summary">{{ notice.summary }}</div>
                            <div class="notice-item-meta">
                                <span class="notice-date">{{ formatDate(notice.createTime) }}</span>
                                <span class="notice-type" :class="'type-' + notice.type">
                                    {{ getNoticeTypeText(notice.type) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 頂部搜尋欄 -->
    <div class="home-search">
        <el-input
            v-model.trim="searchKeyword"
            placeholder="搜索課程關鍵詞"
            clearable
            @keyup.enter.native="goSearch">
            <template #append>
                <el-button @click="goSearch">搜索</el-button>
            </template>
        </el-input>
    </div>

    <el-carousel ref="carousel" type="card" height="400px">
        <el-carousel-item v-for="course in (carousel || [])">
            <router-link :to="{ name: 'Course-Content', params: { id: course.id }}">
                <el-image :src="course.coverPicture" class="carousel-picture"/>
            </router-link>
        </el-carousel-item>
    </el-carousel>
    <div class="text-center recommend-title">
        推荐课程
    </div>
    <el-tabs class="category-list">
        <el-tab-pane label="全部">
            <el-button size="small" @click="onChangeCategory()">
                全部
            </el-button>
        </el-tab-pane>
        <el-tab-pane v-for="category in (categories || [])" :label="category.name">
            <el-button size="small" v-for="child in (category.children || [])" @click="onChangeCategory(child.id)">
                {{ child.name }}
            </el-button>
        </el-tab-pane>
    </el-tabs>
    <el-row :gutter="20">
        <el-col v-for="course in (courses || [])" :xs="24" :sm="6" class="course-card">
            <router-link :to="{ name: 'Course-Content', params: { id: course.id }}">
                <el-card :body-style="{ 'padding': '0px', 'min-height': '300px' }">
                    <el-image :src="course.coverPicture" class="card-cover-picture"/>
                    <div class="card-text">
                        <div class="card-course-name">
                            {{ course.name }}
                        </div>
                        <div class="card-course-price" v-if="course.price !== 0">
                            ￥{{ course.price }}
                        </div>
                        <div class="card-course-price free" v-else>
                            免费
                        </div>
                    </div>
                </el-card>
            </router-link>
        </el-col>
    </el-row>

    <!-- 推薦班級模組 -->
    <div class="class-section" v-if="(classes || []).length > 0">
        <div class="class-header">
            <h3 class="class-title">
                <el-icon><Collection /></el-icon>
                推薦班級
            </h3>
        </div>
        <el-row :gutter="20">
            <el-col v-for="classItem in (classes || [])" :xs="24" :sm="8" :md="6" class="class-card">
                <router-link :to="{ name: 'Class-Content', params: { id: classItem.id }}">
                    <el-card :body-style="{ 'padding': '0px', 'min-height': '320px' }">
                        <el-image :src="classItem.coverPicture" class="card-cover-picture"/>
                        <div class="card-text">
                            <div class="card-class-name">
                                {{ classItem.name }}
                            </div>
                            <div class="card-class-description">
                                {{ classItem.description }}
                            </div>
                            <div class="card-class-meta">
                                <span class="course-count">
                                    <el-icon><Document /></el-icon>
                                    {{ classItem.courseCount || 0 }} 門課程
                                </span>
                                <span class="student-count">
                                    <el-icon><User /></el-icon>
                                    {{ classItem.studentCount || 0 }} 人學習
                                </span>
                            </div>
                            <div class="card-class-price" v-if="classItem.price !== 0">
                                ￥{{ classItem.price }}
                            </div>
                            <div class="card-class-price free" v-else>
                                免费
                            </div>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getCategories, getCourses, getBanners, getNoticesByPopularity, getNoticesByTime, getClasses} from '../utils/api'
import {buildTree} from '../utils/processing'
import {Bell, Star, Clock, View, Collection, Document, User} from '@element-plus/icons-vue'

export default {
    name: 'Index',
    components: {
        Bell, Star, Clock, View, Collection, Document, User
    },
    data() {
        return {
            value: 0,
            categories: [],
            courses: [],
            carousel: [],
            searchKeyword: '',
            banners: [],
            notices: [],
            popularNotices: [],
            latestNotices: [],
            classes: []
        }
    },
    async created() {
        try {
            await Promise.all([
                this.getCategories(),
                this.getCourses(),
                this.getBanners(),
                this.getNotices(),
                this.getClasses()
            ])
        } catch (error) {
            console.error('首頁初始化失敗:', error)
        }
    },
    methods: {
        getCategories() {
            return getCategories().then(result => {
                this.categories = buildTree(result.data || [])
            }).catch(error => {
                console.error('載入分類失敗:', error)
            })
        },
        getCourses(categoryId) {
            return getCourses({pageSize: 8, categoryId, orderBy: 'average_score'}).then(result => {
                if (result.code === '0000') {
                    this.courses = result.data?.list || []
                    if ((this.carousel || []).length === 0) {
                        this.carousel = this.courses.slice(0, 5)
                        if (this.$refs['carousel']) {
                            this.$refs['carousel'].setActiveItem(0)
                        }
                    }
                }
            }).catch(error => {
                console.error('載入課程失敗:', error)
            })
        },
        onChangeCategory(categoryId) {
            this.getCourses(categoryId)
        },
        // 跳轉到搜索頁
        goSearch() {
            if (!this.searchKeyword) {
                return
            }
            this.$router.push({ name: 'Course-Search', query: { q: this.searchKeyword } })
        },
        // 後端讀取宣傳圖（僅啟用）
        getBanners() {
            return getBanners({ enabled: true }).then(result => {
                if (result.code === '0000') {
                    this.banners = result.data || []
                }
            }).catch(error => {
                console.error('載入宣傳圖失敗:', error)
            })
        },
        // 獲取通知/諮詢數據
        getNotices() {
            return Promise.all([
                // 獲取熱門通知
                getNoticesByPopularity({ pageSize: 5 }).then(result => {
                    if (result.code === '0000') {
                        this.popularNotices = result.data?.list || []
                    }
                }).catch(() => {
                    // 如果 API 不存在，使用模擬數據
                    this.popularNotices = this.getMockNotices().slice(0, 5)
                }),
                
                // 獲取最新通知
                getNoticesByTime({ pageSize: 5 }).then(result => {
                    if (result.code === '0000') {
                        this.latestNotices = result.data?.list || []
                    }
                }).catch(() => {
                    // 如果 API 不存在，使用模擬數據
                    this.latestNotices = this.getMockNotices().slice(0, 5)
                })
            ])
        },
        // 模擬通知數據（用於演示）
        getMockNotices() {
            return [
                {
                    id: 1,
                    title: '公司年度培訓計劃發布',
                    summary: '2024年度員工培訓計劃已正式發布，包含多個專業技能提升課程...',
                    createTime: '2024-01-15',
                    viewCount: 1250,
                    type: 'notice'
                },
                {
                    id: 2,
                    title: '新員工入職指南',
                    summary: '歡迎新同事加入！請查看入職指南了解公司文化、制度和工作流程...',
                    createTime: '2024-01-12',
                    viewCount: 890,
                    type: 'guide'
                },
                {
                    id: 3,
                    title: '技術分享會通知',
                    summary: '本週五下午2點將舉行技術分享會，主題：前端開發最佳實踐...',
                    createTime: '2024-01-10',
                    viewCount: 567,
                    type: 'event'
                },
                {
                    id: 4,
                    title: '系統維護公告',
                    summary: '本週末系統將進行例行維護，預計停機時間：週六晚10點至週日凌晨2點...',
                    createTime: '2024-01-08',
                    viewCount: 234,
                    type: 'maintenance'
                },
                {
                    id: 5,
                    title: '員工福利政策更新',
                    summary: '公司員工福利政策已更新，新增多項福利項目，詳情請查看內部通知...',
                    createTime: '2024-01-05',
                    viewCount: 678,
                    type: 'policy'
                }
            ]
        },
        // 查看通知詳情
        viewNotice(notice) {
            this.$message.info(`查看通知：${notice.title}`)
            // 這裡可以跳轉到通知詳情頁面
            // this.$router.push({ name: 'Notice-Detail', params: { id: notice.id } })
        },
        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        },
        // 獲取通知類型文字
        getNoticeTypeText(type) {
            const typeMap = {
                'notice': '通知',
                'guide': '指南',
                'event': '活動',
                'maintenance': '維護',
                'policy': '政策'
            }
            return typeMap[type] || '通知'
        },
        // 獲取班級數據
        getClasses() {
            return getClasses({ pageSize: 8, orderBy: 'average_score' }).then(result => {
                if (result.code === '0000') {
                    this.classes = result.data?.list || []
                }
            }).catch(() => {
                // 如果 API 不存在，使用模擬數據
                this.classes = this.getMockClasses()
            })
        },
        // 模擬班級數據（用於演示）
        getMockClasses() {
            return [
                {
                    id: 1,
                    name: '前端開發入門班',
                    description: '從零開始學習前端開發，包含HTML、CSS、JavaScript基礎知識',
                    coverPicture: '/static/banners/banner1.jpg',
                    price: 299,
                    courseCount: 12,
                    studentCount: 1250,
                    averageScore: 4.8
                },
                {
                    id: 2,
                    name: 'Vue.js 實戰班',
                    description: '深入學習Vue.js框架，掌握現代前端開發技能',
                    coverPicture: '/static/banners/banner2.jpg',
                    price: 0,
                    courseCount: 8,
                    studentCount: 890,
                    averageScore: 4.9
                },
                {
                    id: 3,
                    name: '全棧開發班',
                    description: '學習前後端開發，成為全棧工程師',
                    coverPicture: '/static/banners/banner3.jpg',
                    price: 599,
                    courseCount: 20,
                    studentCount: 567,
                    averageScore: 4.7
                },
                {
                    id: 4,
                    name: 'Python 數據分析班',
                    description: '學習Python進行數據分析和機器學習',
                    coverPicture: '/static/banners/banner4.jpg',
                    price: 399,
                    courseCount: 15,
                    studentCount: 678,
                    averageScore: 4.6
                }
            ]
        }
    }
}
</script>

<style>
.home-search {
    margin: 12px 0 18px 0;
}

.category-list {
    margin-top: 30px;
    margin-bottom: 15px;
}

.carousel-picture {
    height: 100%;
    width: 100%;
}

.recommend-title {
    font-size: 20px;
    margin-top: 30px
}

/* 宣傳輪播樣式 */
.promo-wrapper {
    margin: 12px 0 10px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}
.promo-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
}

/* 卡片輕量UI優化 */
.course-card .el-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.course-card .el-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* 班級模組樣式 */
.class-section {
    margin: 40px 0;
}

.class-header {
    margin-bottom: 20px;
    text-align: center;
}

.class-title {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.class-title .el-icon {
    color: #667eea;
    font-size: 26px;
}

.class-card {
    margin-top: 20px;
}

.class-card .el-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    border: 1px solid #e2e8f0;
}

.class-card .el-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: #667eea;
}

.card-class-name {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-class-description {
    font-size: 13px;
    color: #718096;
    margin-bottom: 12px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-class-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 12px;
    color: #a0aec0;
}

.course-count,
.student-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
}

.course-count .el-icon,
.student-count .el-icon {
    font-size: 14px;
    color: #667eea;
}

.card-class-price {
    font-size: 18px;
    font-weight: 700;
    color: #e53e3e;
    text-align: right;
}

.card-class-price.free {
    color: #38a169;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .class-section {
        margin: 30px 0;
    }
    
    .class-title {
        font-size: 20px;
    }
    
    .card-class-name {
        font-size: 15px;
    }
    
    .card-class-description {
        font-size: 12px;
    }
    
    .card-class-meta {
        font-size: 11px;
    }
    
    .card-class-price {
        font-size: 16px;
    }
}

/* 通知模組樣式 */
.notice-section {
    margin: 20px 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.8);
}

.notice-header {
    margin-bottom: 20px;
    text-align: center;
}

.notice-title {
    font-size: 22px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.notice-title .el-icon {
    color: #4299e1;
    font-size: 24px;
}

.notice-content {
    margin-top: 20px;
    display: flex;
    gap: 16px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

.notice-column {
    background: rgba(255,255,255,0.7);
    border-radius: 8px;
    padding: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.3);
    flex: 1;
    min-width: 0;
}

.notice-column-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
}

.column-title {
    font-size: 16px;
    font-weight: 600;
    color: #4a5568;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
}

.column-title .el-icon {
    font-size: 18px;
}

.column-title .el-icon:first-child {
    color: #f6ad55;
}

.column-title .el-icon:last-child {
    color: #68d391;
}

.notice-list {
    max-height: 300px;
    overflow-y: auto;
}

.notice-item {
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
}

.notice-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #4299e1, #63b3ed);
    transform: scaleY(0);
    transition: transform 0.2s ease;
}

.notice-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: rgba(255,255,255,1);
}

.notice-item:hover::before {
    transform: scaleY(1);
}

.notice-item-content {
    padding-left: 8px;
}

.notice-item-title {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 6px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.notice-item-summary {
    font-size: 12px;
    color: #718096;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.notice-item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #a0aec0;
}

.notice-date {
    font-weight: 500;
}

.notice-views {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
}

.notice-views .el-icon {
    font-size: 12px;
}

.notice-type {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.type-notice {
    background: #bee3f8;
    color: #2b6cb0;
}

.type-guide {
    background: #c6f6d5;
    color: #276749;
}

.type-event {
    background: #fbb6ce;
    color: #97266d;
}

.type-maintenance {
    background: #fed7d7;
    color: #c53030;
}

.type-policy {
    background: #e9d8fd;
    color: #6b46c1;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .notice-section {
        margin: 16px 0;
        padding: 16px;
    }
    
    .notice-title {
        font-size: 18px;
    }
    
    .notice-content {
        flex-direction: column;
        max-width: 100%;
        gap: 12px;
    }
    
    .notice-column {
        margin-bottom: 0;
    }
    
    .notice-item {
        padding: 10px;
    }
    
    .notice-item-title {
        font-size: 13px;
    }
    
    .notice-item-summary {
        font-size: 11px;
    }
}

/* 滾動條樣式 */
.notice-list::-webkit-scrollbar {
    width: 4px;
}

.notice-list::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 2px;
}

.notice-list::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 2px;
}

.notice-list::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.3);
}
</style>
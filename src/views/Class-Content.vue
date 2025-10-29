<template>
    <div class="class-content">
        <!-- 班级基本信息 -->
        <div class="class-header">
            <div class="class-info">
                <el-image :src="classData.coverPicture" class="class-cover" fit="cover"/>
                <div class="class-details">
                    <h1 class="class-name">{{ classData.name }}</h1>
                    <p class="class-description">{{ classData.description }}</p>
                    <div class="class-meta">
                        <span class="meta-item">
                            <el-icon><Document /></el-icon>
                            {{ classData.courseCount || 0 }} 门课程
                        </span>
                        <span class="meta-item">
                            <el-icon><User /></el-icon>
                            {{ classData.studentCount || 0 }} 人学习
                        </span>
                        <span class="meta-item">
                            <el-icon><Star /></el-icon>
                            {{ classData.averageScore || 0 }} 分
                        </span>
                    </div>
                    <div class="class-price">
                        <span v-if="classData.price !== 0" class="price-paid">￥{{ classData.price }}</span>
                        <span v-else class="price-free">免费</span>
                    </div>
                    <div class="class-actions">
                        <el-button 
                            v-if="!isMember" 
                            type="primary" 
                            size="large" 
                            @click="handleJoinClass"
                            :loading="joining"
                            round>
                            <el-icon><Plus /></el-icon>
                            加入班级
                        </el-button>
                        <el-button 
                            v-else 
                            type="danger" 
                            size="large" 
                            @click="handleExitClass"
                            :loading="exiting"
                            round>
                            <el-icon><Minus /></el-icon>
                            退出班级
                        </el-button>
                        <el-button 
                            type="info" 
                            size="large" 
                            @click="showMembersDialog"
                            round>
                            <el-icon><User /></el-icon>
                            查看成员 ({{ memberCount }})
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 功能标签页 -->
        <el-tabs v-model="activeTab" class="class-tabs">
            <!-- 学习目录 -->
            <el-tab-pane label="学习目录" name="courses">
                <div class="tab-content">
                    <div class="courses-header">
                        <h3>课程列表</h3>
                        <p>点击课程进入学习</p>
                    </div>
                    <el-row :gutter="20">
                        <el-col v-for="classCourse in courses" :key="classCourse.id" :xs="24" :sm="12" :md="8" class="course-item">
                            <router-link :to="{ name: 'Course-Content', params: { id: classCourse.course.id }}">
                                <el-card class="course-card">
                                    <el-image :src="classCourse.course.coverPicture" class="course-cover" fit="cover"/>
                                    <div class="course-info">
                                        <h4 class="course-name">{{ classCourse.course.name }}</h4>
                                        <p class="course-summary">{{ classCourse.course.description }}</p>
                                        <div class="course-meta">
                                            <span class="course-price" v-if="classCourse.course.price !== 0">￥{{ classCourse.course.price }}</span>
                                            <span class="course-price free" v-else>免费</span>
                                            <span class="course-score">{{ classCourse.course.averageScore || '0' }}分</span>
                                        </div>
                                    </div>
                                </el-card>
                            </router-link>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>

            <!-- 评价 -->
            <el-tab-pane label="评价" name="evaluations">
                <div class="tab-content">
                    <div class="evaluations-header">
                        <h3>学员评价</h3>
                        <div class="evaluation-stats">
                            <span class="average-score">平均评分：{{ classData.averageScore || 0 }}</span>
                            <span class="total-evaluations">共 {{ evaluations.length }} 条评价</span>
                        </div>
                    </div>
                    <div class="evaluations-list">
                        <div v-for="evaluation in evaluations" :key="evaluation.id" class="evaluation-item">
                            <div class="evaluation-header">
                                <div class="user-info">
                                    <el-avatar :size="40" :src="evaluation.userAvatar">{{ evaluation.username?.charAt(0) }}</el-avatar>
                                    <div class="user-details">
                                        <span class="username">{{ evaluation.username }}</span>
                                        <div class="rating">
                                            <el-rate v-model="evaluation.score" disabled show-score/>
                                        </div>
                                    </div>
                                </div>
                                <span class="evaluation-date">{{ formatDate(evaluation.createTime) }}</span>
                            </div>
                            <div class="evaluation-content">
                                <p>{{ evaluation.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

            <!-- 刷题 -->
            <el-tab-pane label="刷题" name="quiz">
                <div class="tab-content">
                    <div class="quiz-header">
                        <h3>班级测试</h3>
                        <p>通过测试检验学习成果</p>
                    </div>
                    <div class="quiz-list">
                        <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
                            <div class="quiz-info">
                                <h4 class="quiz-title">{{ quiz.title }}</h4>
                                <p class="quiz-description">{{ quiz.description }}</p>
                                <div class="quiz-meta">
                                    <span class="quiz-questions">{{ quiz.questionCount || 0 }} 题</span>
                                    <span class="quiz-duration">{{ quiz.duration || 0 }} 分钟</span>
                                    <span class="quiz-attempts">{{ quiz.attemptCount || 0 }} 次尝试</span>
                                </div>
                            </div>
                            <div class="quiz-actions">
                                <el-button type="primary" @click="startQuiz(quiz)">开始测试</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 成员列表对话框 -->
        <el-dialog 
            v-model="showMembers" 
            title="班级成员" 
            width="600px"
            center>
            <div class="members-list">
                <div v-if="members.length === 0" class="no-members">
                    <el-empty description="暂无成员" />
                </div>
                <div v-else>
                    <div v-for="member in members" :key="member.id" class="member-item">
                        <el-avatar class="member-avatar">
                            {{ member.userName?.charAt(0) || '用' }}
                        </el-avatar>
                        <div class="member-info">
                            <div class="member-name">{{ member.userName }}</div>
                            <div class="member-join-time">加入时间：{{ formatTime(member.joinTime) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="showMembers = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {getClass, getClassCourses, getClassEvaluations, getClassQuiz, checkMemberStatus, joinClass, exitClass, getClassMembers, getClassMemberCount} from '../utils/api'
import {Document, User, Star, Plus, Minus} from '@element-plus/icons-vue'
import {mapState} from 'vuex'

export default {
    name: 'Class-Content',
    components: {
        Document, User, Star, Plus, Minus
    },
    data() {
        return {
            activeTab: 'courses',
            classData: {},
            courses: [],
            evaluations: [],
            quizzes: [],
            isMember: false,
            memberCount: 0,
            members: [],
            showMembers: false,
            joining: false,
            exiting: false
        }
    },
    computed: {
        ...mapState(['auth'])
    },
    created() {
        this.getClassData()
        this.getCourses()
        this.getEvaluations()
        this.getQuizzes()
        this.checkMemberStatus()
        this.getMemberCount()
    },
    methods: {
        // 獲取班級數據
        getClassData() {
            const classId = this.$route.params.id
            getClass(classId).then(result => {
                if (result.code === '0000') {
                    this.classData = result.data
                }
            }).catch(() => {
                // 使用模擬數據
                this.classData = this.getMockClassData()
            })
        },
        // 獲取課程列表
        getCourses() {
            const classId = this.$route.params.id
            getClassCourses(classId).then(result => {
                if (result.code === '0000') {
                    this.courses = result.data?.list || []
                }
            }).catch(() => {
                // 使用模擬數據
                this.courses = this.getMockCourses()
            })
        },
        // 獲取評價列表
        getEvaluations() {
            const classId = this.$route.params.id
            getClassEvaluations(classId).then(result => {
                if (result.code === '0000') {
                    this.evaluations = result.data?.list || []
                }
            }).catch(() => {
                // 使用模擬數據
                this.evaluations = this.getMockEvaluations()
            })
        },
        // 獲取測試列表
        getQuizzes() {
            const classId = this.$route.params.id
            getClassQuiz(classId).then(result => {
                if (result.code === '0000') {
                    this.quizzes = result.data?.list || []
                }
            }).catch(() => {
                // 使用模擬數據
                this.quizzes = this.getMockQuizzes()
            })
        },
        // 開始測試
        startQuiz(quiz) {
            this.$message.info(`開始測試：${quiz.title}`)
            // 這裡可以跳轉到測試頁面
            // this.$router.push({ name: 'Quiz-Content', params: { id: quiz.id } })
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
        // 檢查成員狀態
        checkMemberStatus() {
            if (!this.auth) return
            
            const classId = this.$route.params.id
            checkMemberStatus(classId, this.auth.username).then(result => {
                if (result.code === '0000') {
                    this.isMember = result.data && result.data.status === 1
                }
            }).catch(() => {
                this.isMember = false
            })
        },
        // 獲取成員數量
        getMemberCount() {
            const classId = this.$route.params.id
            getClassMemberCount(classId).then(result => {
                if (result.code === '0000') {
                    this.memberCount = result.data || 0
                }
            }).catch(() => {
                this.memberCount = 0
            })
        },
        // 獲取成員列表
        getMembers() {
            const classId = this.$route.params.id
            getClassMembers(classId, {pageSize: 100}).then(result => {
                if (result.code === '0000') {
                    this.members = result.data?.list || []
                }
            }).catch(() => {
                this.members = []
            })
        },
        // 加入班級
        handleJoinClass() {
            if (!this.auth) {
                this.$message.warning('請先登錄')
                this.$router.push({name: 'Login'})
                return
            }
            
            this.joining = true
            const classId = this.$route.params.id
            joinClass(classId).then(result => {
                if (result.code === '0000') {
                    this.$message.success('加入班級成功！')
                    this.isMember = true
                    this.memberCount++
                }
            }).catch(error => {
                this.$message.error('加入班級失敗')
            }).finally(() => {
                this.joining = false
            })
        },
        // 退出班級
        handleExitClass() {
            this.$confirm('確定要退出班級嗎？', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exiting = true
                const classId = this.$route.params.id
                exitClass(classId).then(result => {
                    if (result.code === '0000') {
                        this.$message.success('退出班級成功')
                        this.isMember = false
                        this.memberCount = Math.max(0, this.memberCount - 1)
                    }
                }).catch(error => {
                    this.$message.error('退出班級失敗')
                }).finally(() => {
                    this.exiting = false
                })
            })
        },
        // 顯示成員對話框
        showMembersDialog() {
            this.showMembers = true
            this.getMembers()
        },
        // 格式化時間
        formatTime(time) {
            if (!time) return ''
            return new Date(time).toLocaleString('zh-CN')
        },
        // 模擬班級數據
        getMockClassData() {
            return {
                id: this.$route.params.id,
                name: '前端開發入門班',
                description: '從零開始學習前端開發，包含HTML、CSS、JavaScript基礎知識，適合初學者入門學習。',
                coverPicture: '/static/banners/banner1.jpg',
                price: 299,
                courseCount: 12,
                studentCount: 1250,
                averageScore: 4.8
            }
        },
        // 模擬課程數據
        getMockCourses() {
            return [
                {
                    id: 1,
                    name: 'HTML基礎入門',
                    description: '學習HTML標籤和語法基礎',
                    coverPicture: '/static/banners/banner1.jpg',
                    price: 0,
                    averageScore: 4.5
                },
                {
                    id: 2,
                    name: 'CSS樣式設計',
                    description: '掌握CSS樣式設計技巧',
                    coverPicture: '/static/banners/banner2.jpg',
                    price: 0,
                    averageScore: 4.3
                },
                {
                    id: 3,
                    name: 'JavaScript基礎',
                    description: '學習JavaScript編程基礎',
                    coverPicture: '/static/banners/banner3.jpg',
                    price: 0,
                    averageScore: 4.7
                }
            ]
        },
        // 模擬評價數據
        getMockEvaluations() {
            return [
                {
                    id: 1,
                    username: '張三',
                    userAvatar: '',
                    score: 5,
                    content: '課程內容很豐富，老師講解詳細，適合初學者學習。',
                    createTime: '2024-01-15'
                },
                {
                    id: 2,
                    username: '李四',
                    userAvatar: '',
                    score: 4,
                    content: '整體不錯，但希望能增加更多實戰項目。',
                    createTime: '2024-01-10'
                }
            ]
        },
        // 模擬測試數據
        getMockQuizzes() {
            return [
                {
                    id: 1,
                    title: 'HTML基礎測試',
                    description: '測試HTML基礎知識掌握程度',
                    questionCount: 20,
                    duration: 30,
                    attemptCount: 156
                },
                {
                    id: 2,
                    title: 'CSS樣式測試',
                    description: '測試CSS樣式設計能力',
                    questionCount: 25,
                    duration: 45,
                    attemptCount: 134
                }
            ]
        }
    }
}
</script>

<style scoped>
.class-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 班級頭部信息 */
.class-header {
    margin-bottom: 30px;
}

.class-info {
    display: flex;
    gap: 20px;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.class-cover {
    width: 200px;
    height: 150px;
    border-radius: 8px;
    flex-shrink: 0;
}

.class-details {
    flex: 1;
}

.class-name {
    font-size: 28px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 12px 0;
}

.class-description {
    font-size: 16px;
    color: #718096;
    line-height: 1.6;
    margin: 0 0 20px 0;
}

.class-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #718096;
    font-weight: 500;
}

.meta-item .el-icon {
    color: #667eea;
}

.class-price {
    font-size: 24px;
    font-weight: 700;
}

.price-paid {
    color: #e53e3e;
}

.price-free {
    color: #38a169;
}

/* 標籤頁樣式 */
.class-tabs {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.tab-content {
    margin-top: 20px;
}

/* 課程列表樣式 */
.courses-header {
    margin-bottom: 24px;
    text-align: center;
}

.courses-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
}

.courses-header p {
    color: #718096;
    margin: 0;
}

.course-item {
    margin-bottom: 20px;
}

.course-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    border: 1px solid #e2e8f0;
}

.course-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.course-cover {
    width: 100%;
    height: 120px;
}

.course-info {
    padding: 16px;
}

.course-name {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
    line-height: 1.4;
}

.course-summary {
    font-size: 13px;
    color: #718096;
    margin: 0 0 12px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.course-price {
    font-weight: 600;
    color: #e53e3e;
}

.course-price.free {
    color: #38a169;
}

.course-score {
    color: #a0aec0;
}

/* 評價樣式 */
.evaluations-header {
    margin-bottom: 24px;
    text-align: center;
}

.evaluations-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 12px 0;
}

.evaluation-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 14px;
    color: #718096;
}

.evaluations-list {
    max-height: 500px;
    overflow-y: auto;
}

.evaluation-item {
    border-bottom: 1px solid #e2e8f0;
    padding: 20px 0;
}

.evaluation-item:last-child {
    border-bottom: none;
}

.evaluation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.username {
    font-weight: 600;
    color: #2d3748;
}

.evaluation-date {
    font-size: 12px;
    color: #a0aec0;
}

.evaluation-content p {
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
}

/* 測試樣式 */
.quiz-header {
    margin-bottom: 24px;
    text-align: center;
}

.quiz-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
}

.quiz-header p {
    color: #718096;
    margin: 0;
}

.quiz-list {
    max-height: 500px;
    overflow-y: auto;
}

.quiz-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    transition: border-color 0.15s ease;
}

.quiz-item:hover {
    border-color: #667eea;
}

.quiz-info {
    flex: 1;
}

.quiz-title {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
}

.quiz-description {
    font-size: 14px;
    color: #718096;
    margin: 0 0 12px 0;
}

.quiz-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #a0aec0;
}

/* 班級操作按鈕樣式 */
.class-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.class-actions .el-button {
    min-width: 120px;
}

/* 成員列表樣式 */
.members-list {
    max-height: 400px;
    overflow-y: auto;
}

.member-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.member-item:last-child {
    border-bottom: none;
}

.member-avatar {
    margin-right: 12px;
}

.member-info {
    flex: 1;
}

.member-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
}

.member-join-time {
    font-size: 12px;
    color: #909399;
}

.no-members {
    text-align: center;
    padding: 40px 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .class-content {
        padding: 16px;
    }
    
    .class-info {
        flex-direction: column;
        gap: 16px;
    }
    
    .class-cover {
        width: 100%;
        height: 200px;
    }
    
    .class-name {
        font-size: 24px;
    }
    
    .class-meta {
        flex-direction: column;
        gap: 12px;
    }
    
    .quiz-item {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }
    
    .quiz-meta {
        flex-direction: column;
        gap: 8px;
    }
    
    .class-actions {
        flex-direction: column;
    }
    
    .class-actions .el-button {
        width: 100%;
    }
}
</style>

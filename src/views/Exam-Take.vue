<template>
    <div class="exam-container" v-loading="loading">
        <div class="exam-header">
            <div class="user-info">
                <el-icon><User /></el-icon>
                <span class="username">{{ auth?.fullName || auth?.username || '未登录用户' }}</span>
            </div>
            <div class="exam-timer" :class="{ danger: remainingSeconds <= 60 }">
                <el-icon><Timer /></el-icon>
                <span>{{ formattedTime }}</span>
            </div>
            <div class="exam-actions">
                <el-button size="small" type="danger" @click="confirmSubmit" :disabled="submitted">交卷</el-button>
            </div>
        </div>

        <div class="exam-body">
            <div class="question-panel" v-if="currentQuestion">
                <div class="q-title">
                    <el-tag type="info" class="q-no">第 {{ currentIndex + 1 }} 题</el-tag>
                    <el-tag :type="getTypeTagType(currentQuestion.questionType)" class="q-type">{{ getTypeText(currentQuestion.questionType) }}</el-tag>
                </div>
                <div class="q-text">{{ currentQuestion.questionText }}</div>

                <div v-if="currentQuestion.questionType === 'single'" class="options">
                    <el-radio-group v-model="answers[currentQuestion.id]">
                        <el-radio v-for="opt in currentQuestion.options" :key="opt.id" :label="opt.optionKey">
                            {{ opt.optionKey }}. {{ opt.optionText }}
                        </el-radio>
                    </el-radio-group>
                </div>

                <div v-if="currentQuestion.questionType === 'multiple'" class="options">
                    <el-checkbox-group v-model="multiAnswers[currentQuestion.id]">
                        <el-checkbox v-for="opt in currentQuestion.options" :key="opt.id" :label="opt.optionKey">
                            {{ opt.optionKey }}. {{ opt.optionText }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>

                <div v-if="currentQuestion.questionType === 'judge'" class="options">
                    <el-radio-group v-model="answers[currentQuestion.id]">
                        <el-radio label="true">正确</el-radio>
                        <el-radio label="false">错误</el-radio>
                    </el-radio-group>
                </div>

                <div class="q-actions">
                    <el-button @click="prev" :disabled="currentIndex===0">上一题</el-button>
                    <el-button type="primary" @click="next" :disabled="currentIndex>=questions.length-1">下一题</el-button>
                </div>
            </div>

            <div class="navigator">
                <div class="nav-header">
                    <span>题目导航</span>
                    <el-tag size="small">{{ completedCount }}/{{ questions.length }}</el-tag>
                </div>
                <div class="nav-grid">
                    <el-button
                        v-for="(q, idx) in questions"
                        :key="q.id"
                        size="small"
                        :type="isAnswered(q) ? 'success' : 'info'"
                        :plain="!isAnswered(q)"
                        :class="{ 'is-current': idx===currentIndex && !isAnswered(q) }"
                        @click="jump(idx)"
                    >{{ idx+1 }}</el-button>
                </div>
            </div>
        </div>

        <el-dialog v-model="submitted" title="考试结果" width="700px" :show-close="false">
            <div class="result-summary">
                <div class="score">得分：{{ score }}</div>
                <div class="detail">正确 {{ correctCount }} 题，错误 {{ wrongCount }} 题</div>
            </div>
            <el-divider/>
            <div class="result-list">
                <div v-for="(q, idx) in questions" :key="q.id" class="result-item">
                    <div class="res-title">
                        <el-tag :type="getTypeTagType(q.questionType)">{{ getTypeText(q.questionType) }}</el-tag>
                        <strong>第 {{ idx+1 }} 题</strong>
                        <el-tag :type="isQuestionCorrect(q) ? 'success':'danger'" class="ml-1">
                            {{ isQuestionCorrect(q) ? '正确' : '错误' }}
                        </el-tag>
                    </div>
                    <div class="res-text">{{ q.questionText }}</div>
                    <div class="res-answers">
                        <div>你的答案：{{ displayUserAnswer(q) || '-' }}</div>
                        <div>正确答案：{{ q.correctAnswer }}</div>
                        <div v-if="q.explanation" class="explain">解析：{{ q.explanation }}</div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button type="primary" @click="$router.back()">返回</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getQuizQuestionsByCourse} from '../utils/api'

export default {
    name: 'Exam-Take',
    data() {
        return {
            loading: false,
            courseId: this.$route.params.id || this.$route.query.courseId || null,
            examId: this.$route.query.examId || null,
            duration: Number(this.$route.query.duration || 60),
            questions: [],
            currentIndex: 0,
            answers: {},
            multiAnswers: {},
            remainingSeconds: 0,
            timer: null,
            submitted: false,
            score: 0
        }
    },
    computed: {
        ...mapState(['auth']),
        currentQuestion() {
            return this.questions[this.currentIndex] || null
        },
        formattedTime() {
            const m = Math.floor(this.remainingSeconds / 60)
            const s = this.remainingSeconds % 60
            return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
        },
        completedCount() {
            return this.questions.reduce((acc, q) => acc + (this.isAnswered(q) ? 1 : 0), 0)
        },
        correctCount() {
            return this.questions.reduce((acc, q) => acc + (this.isQuestionCorrect(q) ? 1 : 0), 0)
        },
        wrongCount() {
            return this.questions.length - this.correctCount
        }
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            this.remainingSeconds = this.duration * 60
            await this.loadQuestions()
            this.startTimer()
        },
        async loadQuestions() {
            this.loading = true
            try {
                let result = null
                if (this.courseId) {
                    console.log('Loading questions for course:', this.courseId)
                    result = await getQuizQuestionsByCourse(this.courseId, {})
                    console.log('API result:', result)
                }
                if (result && result.code === '0000' && Array.isArray(result.data) && result.data.length) {
                    console.log('Loaded', result.data.length, 'questions from API')
                    this.questions = this.normalizeQuestions(result.data)
                } else {
                    console.log('No API data or empty, using mock questions')
                    // 如果课程没有题目，使用模拟数据
                    this.questions = this.getMockExamQuestions()
                }
            } catch (e) {
                console.error('加载题目失败:', e)
                // API失败时使用模拟数据
                this.questions = this.getMockExamQuestions()
            } finally {
                this.loading = false
            }
        },
        normalizeQuestions(list) {
            return (list || []).map(q => ({
                id: q.id,
                questionText: q.questionText || '',
                questionType: q.questionType || 'single',
                options: Array.isArray(q.options) ? q.options : [],
                correctAnswer: q.correctAnswer || '',
                explanation: q.explanation || ''
            }))
        },
        getMockExamQuestions() {
            // 简化的模拟题目
            const makeOptions = (texts) => texts.map((t, i) => ({ id: `${Date.now()}-${i}`, optionKey: String.fromCharCode(65+i), optionText: t }))
                return [
                    { id: 'q1', questionText: '单选：HTML 的超文本标记是？', questionType: 'single', options: makeOptions(['Hyper Transfer Markup Language','Hyper Text Markup Language','High Text Makeup Language','None']), correctAnswer: 'B' },
                    { id: 'q2', questionText: '多选：以下哪些是 CSS 布局方式？', questionType: 'multiple', options: makeOptions(['Flex','Grid','Float','Thread']), correctAnswer: 'A,B,C' },
                    { id: 'q3', questionText: '判断：HTTP 是有状态协议。', questionType: 'judge', options: [], correctAnswer: 'false' },
                ]
        },
        startTimer() {
            if (this.timer) clearInterval(this.timer)
            this.timer = setInterval(() => {
                if (this.remainingSeconds <= 0) {
                    clearInterval(this.timer)
                    this.autoSubmit()
                } else {
                    this.remainingSeconds -= 1
                }
            }, 1000)
        },
        isAnswered(q) {
            if (q.questionType === 'multiple') return (this.multiAnswers[q.id] || []).length > 0
            return !!this.answers[q.id]
        },
        displayUserAnswer(q) {
            if (q.questionType === 'multiple') {
                const arr = this.multiAnswers[q.id] || []
                return arr.length ? arr.sort().join(',') : ''
            }
            return this.answers[q.id] || ''
        },
        isQuestionCorrect(q) {
            return (this.displayUserAnswer(q) || '') === (q.correctAnswer || '')
        },
        prev() { if (this.currentIndex > 0) this.currentIndex -= 1 },
        next() { if (this.currentIndex < this.questions.length - 1) this.currentIndex += 1 },
        jump(idx) { this.currentIndex = idx },
        computeScore() {
            const per = Math.round(100 / (this.questions.length || 1))
            this.score = this.correctCount * per
        },
        confirmSubmit() {
            this.$confirm('确认交卷？', '提示', { type: 'warning' }).then(() => this.submit())
        },
        submit() {
            clearInterval(this.timer)
            this.computeScore()
            this.submitted = true
        },
        autoSubmit() {
            this.$message.warning('时间已到，自动交卷')
            this.submit()
        },
        getTypeText(type) {
            const types = {single: '单选', multiple: '多选', judge: '判断'}
            return types[type] || '未知'
        },
        getTypeTagType(type) {
            const types = {single: 'primary', multiple: 'success', judge: 'warning'}
            return types[type] || 'info'
        }
    },
    unmounted() {
        if (this.timer) clearInterval(this.timer)
    }
}
</script>

<style scoped>
.exam-container { padding: 10px; }
.exam-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; }
.user-info { display: flex; align-items: center; gap: 6px; }
.username { font-weight: 600; }
.exam-timer { font-weight: 700; color: #303133; }
.exam-timer.danger { color: #F56C6C; }
.exam-body { display: grid; grid-template-columns: 1fr 240px; gap: 14px; }
.question-panel { background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.q-title { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.q-text { font-size: 16px; line-height: 1.7; margin-bottom: 14px; }
.options :deep(.el-radio), .options :deep(.el-checkbox) { display: block; margin: 8px 0; }
.q-actions { margin-top: 12px; display: flex; justify-content: space-between; }
.navigator { background: #fff; border-radius: 8px; padding: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.nav-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.nav-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
/* 统一题号按钮尺寸与内边距，消除 plain/非 plain 的微小差异 */
.nav-grid :deep(.el-button) {
    width: 100%;
    min-width: auto;
    height: 32px; /* 和 size="small" 接近的固定高度，确保一致 */
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    justify-content: center;
}
/* 当前未作答题目的轻量高亮，避免与已作答(success)样式冲突 */
.nav-grid :deep(.is-current) {
    border-color: #409EFF;
    color: #409EFF;
}
.result-summary { text-align: center; font-size: 16px; }
.score { font-size: 24px; font-weight: 700; color: #409EFF; margin-bottom: 4px; }
.result-item { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #e4e7ed; }
.res-title { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.res-answers { color: #606266; line-height: 1.6; }
.explain { color: #909399; }
@media (max-width: 768px) {
  .exam-body { grid-template-columns: 1fr; }
}
</style>


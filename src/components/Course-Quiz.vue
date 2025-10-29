<template>
    <div class="quiz-container">
        <!-- 題目選擇區域 -->
        <div class="quiz-selection" v-if="!quizStarted">
            <div class="selection-header">
                <h3>選擇刷題模式</h3>
                <p>請選擇您想要練習的題目類型和難度</p>
            </div>
            <div class="selection-options">
                <el-form :model="quizConfig" label-width="100px">
                    <el-form-item label="題目數量">
                        <el-select v-model="quizConfig.limit" placeholder="請選擇題目數量">
                            <el-option label="5題" :value="5"></el-option>
                            <el-option label="10題" :value="10"></el-option>
                            <el-option label="20題" :value="20"></el-option>
                            <el-option label="30題" :value="30"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="難度等級">
                        <el-select v-model="quizConfig.difficultyLevel" placeholder="請選擇難度等級" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option label="簡單" :value="1"></el-option>
                            <el-option label="中等" :value="2"></el-option>
                            <el-option label="困難" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="start-button">
                    <el-button type="primary" size="large" @click="startQuiz" :loading="loading">
                        開始刷題
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 答題區域 -->
        <div class="quiz-content" v-if="quizStarted && currentQuestion">
            <div class="quiz-header">
                <div class="progress-info">
                    <span>第 {{ currentIndex + 1 }} 題 / 共 {{ questions.length }} 題</span>
                    <el-progress :percentage="progressPercentage" :show-text="false"></el-progress>
                </div>
                <div class="quiz-stats">
                    <span class="correct-count">正確: {{ correctCount }}</span>
                    <span class="wrong-count">錯誤: {{ wrongCount }}</span>
                </div>
            </div>

            <div class="question-card">
                <div class="question-header">
                    <el-tag :type="getDifficultyTagType(currentQuestion.difficultyLevel)">
                        {{ getDifficultyText(currentQuestion.difficultyLevel) }}
                    </el-tag>
                    <el-tag :type="getTypeTagType(currentQuestion.questionType)">
                        {{ getTypeText(currentQuestion.questionType) }}
                    </el-tag>
                </div>
                
                <div class="question-text">
                    {{ currentQuestion.questionText }}
                </div>

                <!-- 單選題 -->
                <div v-if="currentQuestion.questionType === 'single'" class="options-container">
                    <el-radio-group v-model="userAnswer" @change="handleAnswerChange">
                        <el-radio 
                            v-for="option in currentQuestion.options" 
                            :key="option.id" 
                            :label="option.optionKey"
                            class="option-item"
                        >
                            {{ option.optionKey }}. {{ option.optionText }}
                        </el-radio>
                    </el-radio-group>
                </div>

                <!-- 多選題 -->
                <div v-if="currentQuestion.questionType === 'multiple'" class="options-container">
                    <el-checkbox-group v-model="userAnswerArray" @change="handleAnswerChange">
                        <el-checkbox 
                            v-for="option in currentQuestion.options" 
                            :key="option.id" 
                            :label="option.optionKey"
                            class="option-item"
                        >
                            {{ option.optionKey }}. {{ option.optionText }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>

                <!-- 判斷題 -->
                <div v-if="currentQuestion.questionType === 'judge'" class="options-container">
                    <el-radio-group v-model="userAnswer" @change="handleAnswerChange">
                        <el-radio label="true" class="option-item">正確</el-radio>
                        <el-radio label="false" class="option-item">錯誤</el-radio>
                    </el-radio-group>
                </div>

                <!-- 答案反饋 -->
                <div v-if="answerSubmitted" class="answer-feedback">
                    <div class="feedback-header">
                        <el-icon v-if="isCurrentAnswerCorrect" class="correct-icon">
                            <check/>
                        </el-icon>
                        <el-icon v-else class="wrong-icon">
                            <close/>
                        </el-icon>
                        <span class="feedback-text">
                            {{ isCurrentAnswerCorrect ? '回答正確！' : '回答錯誤！' }}
                        </span>
                    </div>
                    <div v-if="!isCurrentAnswerCorrect" class="correct-answer">
                        <strong>正確答案：</strong>{{ currentQuestion.correctAnswer }}
                    </div>
                    <div v-if="currentQuestion.explanation" class="explanation">
                        <strong>解析：</strong>{{ currentQuestion.explanation }}
                    </div>
                </div>

                <div class="question-actions">
                    <el-button 
                        v-if="!answerSubmitted" 
                        type="primary" 
                        @click="submitAnswer"
                        :disabled="!userAnswer && !userAnswerArray.length"
                    >
                        提交答案
                    </el-button>
                    <el-button 
                        v-if="answerSubmitted" 
                        type="primary" 
                        @click="nextQuestion"
                        :disabled="currentIndex >= questions.length - 1"
                    >
                        {{ currentIndex >= questions.length - 1 ? '完成' : '下一題' }}
                    </el-button>
                    <el-button v-if="answerSubmitted && currentIndex >= questions.length - 1" @click="finishQuiz">
                        查看結果
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 結果展示 -->
        <div class="quiz-result" v-if="quizFinished">
            <div class="result-header">
                <h3>刷題完成！</h3>
            </div>
            <div class="result-stats">
                <div class="stat-item">
                    <div class="stat-number">{{ correctCount }}</div>
                    <div class="stat-label">正確題數</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ wrongCount }}</div>
                    <div class="stat-label">錯誤題數</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ accuracyPercentage }}%</div>
                    <div class="stat-label">正確率</div>
                </div>
            </div>
            <div class="result-actions">
                <el-button type="primary" @click="restartQuiz">重新刷題</el-button>
                <el-button @click="backToSelection">返回選擇</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getRandomQuizQuestionsOfCourse, submitQuizAnswer} from '../utils/api'

export default {
    name: "Course-Quiz",
    data() {
        return {
            courseId: this.$route.params.id,
            questions: [],
            currentIndex: 0,
            userAnswer: '',
            userAnswerArray: [],
            answerSubmitted: false,
            quizStarted: false,
            quizFinished: false,
            loading: false,
            correctCount: 0,
            wrongCount: 0,
            quizConfig: {
                limit: 10,
                difficultyLevel: ''
            }
        }
    },
    computed: {
        ...mapState(['auth']),
        currentQuestion() {
            return this.questions[this.currentIndex] || null
        },
        progressPercentage() {
            return Math.round((this.currentIndex + 1) / this.questions.length * 100)
        },
        isCurrentAnswerCorrect() {
            if (!this.currentQuestion || !this.answerSubmitted) return false
            return this.currentQuestion.correctAnswer === this.getFormattedAnswer()
        },
        accuracyPercentage() {
            const total = this.correctCount + this.wrongCount
            return total > 0 ? Math.round(this.correctCount / total * 100) : 0
        }
    },
    methods: {
        async loadQuestions() {
            this.loading = true
            try {
                // 處理參數，將空字符串轉換為null
                const params = {
                    limit: this.quizConfig.limit,
                    difficultyLevel: this.quizConfig.difficultyLevel || null
                }
                const result = await getRandomQuizQuestionsOfCourse(this.courseId, params)
                if (result.code === '0000') {
                    this.questions = result.data
                } else {
                    this.$message.error('載入題目失敗')
                }
            } catch (error) {
                this.$message.error('載入題目失敗')
            } finally {
                this.loading = false
            }
        },
        async startQuiz() {
            if (!this.auth) {
                this.$router.push({name: 'Login'})
                return
            }
            await this.loadQuestions()
            if (this.questions.length > 0) {
                this.quizStarted = true
                this.currentIndex = 0
                this.userAnswer = ''
                this.userAnswerArray = []
                this.answerSubmitted = false
                this.correctCount = 0
                this.wrongCount = 0
            }
        },
        handleAnswerChange() {
            // 答案改變時重置提交狀態
            this.answerSubmitted = false
        },
        getFormattedAnswer() {
            if (this.currentQuestion.questionType === 'multiple') {
                return this.userAnswerArray.sort().join(',')
            }
            return this.userAnswer
        },
        async submitAnswer() {
            if (!this.userAnswer && !this.userAnswerArray.length) {
                this.$message.warning('請選擇答案')
                return
            }
            
            try {
                const answer = this.getFormattedAnswer()
                const result = await submitQuizAnswer(this.currentQuestion.id, {answer})
                if (result.code === '0000') {
                    this.answerSubmitted = true
                    if (result.data.isCorrect === 1) {
                        this.correctCount++
                        this.$message.success('回答正確！')
                    } else {
                        this.wrongCount++
                        this.$message.error('回答錯誤！')
                    }
                }
            } catch (error) {
                this.$message.error('提交答案失敗')
            }
        },
        nextQuestion() {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++
                this.userAnswer = ''
                this.userAnswerArray = []
                this.answerSubmitted = false
            }
        },
        finishQuiz() {
            this.quizFinished = true
            this.quizStarted = false
        },
        restartQuiz() {
            this.quizFinished = false
            this.quizStarted = false
            this.currentIndex = 0
            this.userAnswer = ''
            this.userAnswerArray = []
            this.answerSubmitted = false
            this.correctCount = 0
            this.wrongCount = 0
        },
        backToSelection() {
            this.quizFinished = false
            this.quizStarted = false
        },
        getDifficultyText(level) {
            const levels = {1: '簡單', 2: '中等', 3: '困難'}
            return levels[level] || '未知'
        },
        getDifficultyTagType(level) {
            const types = {1: 'success', 2: 'warning', 3: 'danger'}
            return types[level] || 'info'
        },
        getTypeText(type) {
            const types = {single: '單選', multiple: '多選', judge: '判斷'}
            return types[type] || '未知'
        },
        getTypeTagType(type) {
            const types = {single: 'primary', multiple: 'success', judge: 'warning'}
            return types[type] || 'info'
        }
    }
}
</script>

<style scoped>
.quiz-container {
    padding: 20px;
}

.quiz-selection {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
}

.selection-header h3 {
    margin-bottom: 10px;
    color: #303133;
}

.selection-header p {
    color: #606266;
    margin-bottom: 30px;
}

.selection-options {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
}

.start-button {
    margin-top: 20px;
}

.quiz-content {
    max-width: 800px;
    margin: 0 auto;
}

.quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.progress-info {
    flex: 1;
}

.progress-info span {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.quiz-stats {
    display: flex;
    gap: 20px;
}

.correct-count {
    color: #67C23A;
    font-weight: bold;
}

.wrong-count {
    color: #F56C6C;
    font-weight: bold;
}

.question-card {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.question-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.question-text {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 30px;
    color: #303133;
}

.options-container {
    margin-bottom: 30px;
}

.option-item {
    display: block;
    margin-bottom: 15px;
    font-size: 16px;
}

.answer-feedback {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.feedback-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.correct-icon {
    color: #67C23A;
    font-size: 20px;
    margin-right: 10px;
}

.wrong-icon {
    color: #F56C6C;
    font-size: 20px;
    margin-right: 10px;
}

.feedback-text {
    font-size: 16px;
    font-weight: bold;
}

.correct-answer {
    margin-bottom: 10px;
    color: #67C23A;
}

.explanation {
    color: #606266;
}

.question-actions {
    margin-top: 30px;
    text-align: center;
}

.quiz-result {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
}

.result-header h3 {
    margin-bottom: 30px;
    color: #303133;
}

.result-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 36px;
    font-weight: bold;
    color: #409EFF;
}

.stat-label {
    color: #606266;
    margin-top: 5px;
}

.result-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}
</style>

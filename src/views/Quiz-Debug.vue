<template>
    <div class="debug-container">
        <h2>刷題功能調試頁面</h2>
        
        <div class="debug-section">
            <h3>1. 測試API連接</h3>
            <el-button @click="testApiConnection" :loading="testing">測試API連接</el-button>
            <el-button @click="testHealthCheck" :loading="testingHealth">測試健康檢查</el-button>
            <div v-if="apiResult" class="result">
                <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
            </div>
            <div v-if="healthResult" class="result">
                <h4>健康檢查結果：</h4>
                <pre>{{ JSON.stringify(healthResult, null, 2) }}</pre>
            </div>
        </div>

        <div class="debug-section">
            <h3>2. 測試獲取題目</h3>
            <el-form inline>
                <el-form-item label="課程ID">
                    <el-input v-model="courseId" placeholder="課程ID" style="width: 100px"></el-input>
                </el-form-item>
                <el-form-item label="題目數量">
                    <el-input v-model="limit" placeholder="數量" style="width: 100px"></el-input>
                </el-form-item>
                <el-form-item label="難度">
                    <el-select v-model="difficulty" placeholder="難度" style="width: 100px">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="簡單" :value="1"></el-option>
                        <el-option label="中等" :value="2"></el-option>
                        <el-option label="困難" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="testGetQuestions" :loading="loadingQuestions">獲取題目</el-button>
                </el-form-item>
            </el-form>
            <div v-if="questionsResult" class="result">
                <h4>題目數據：</h4>
                <pre>{{ JSON.stringify(questionsResult, null, 2) }}</pre>
            </div>
        </div>

        <div class="debug-section">
            <h3>3. 網絡請求詳情</h3>
            <div class="network-info">
                <p><strong>請求URL:</strong> {{ requestUrl }}</p>
                <p><strong>請求參數:</strong> {{ requestParams }}</p>
                <p><strong>響應狀態:</strong> {{ responseStatus }}</p>
                <p><strong>錯誤信息:</strong> {{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import {getRandomQuizQuestionsOfCourse} from '../utils/api'

export default {
    name: "QuizDebug",
    data() {
        return {
            courseId: '1',
            limit: '5',
            difficulty: '',
            testing: false,
            testingHealth: false,
            loadingQuestions: false,
            apiResult: null,
            healthResult: null,
            questionsResult: null,
            requestUrl: '',
            requestParams: '',
            responseStatus: '',
            errorMessage: ''
        }
    },
    methods: {
        async testApiConnection() {
            this.testing = true
            this.apiResult = null
            this.errorMessage = ''
            
            try {
                // 測試基本連接
                const response = await fetch('/api/oauth/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + (localStorage.getItem('token') || 'test-token')
                    }
                })
                
                this.apiResult = {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    url: response.url
                }
                
                this.responseStatus = response.status
            } catch (error) {
                this.errorMessage = error.message
                this.apiResult = { error: error.message }
            } finally {
                this.testing = false
            }
        },
        
        async testHealthCheck() {
            this.testingHealth = true
            this.healthResult = null
            this.errorMessage = ''
            
            try {
                const response = await fetch('/api/health', {
                    method: 'GET'
                })
                
                const data = await response.json()
                this.healthResult = {
                    status: response.status,
                    data: data
                }
                
            } catch (error) {
                this.errorMessage = error.message
                this.healthResult = { error: error.message }
            } finally {
                this.testingHealth = false
            }
        },
        
        async testGetQuestions() {
            this.loadingQuestions = true
            this.questionsResult = null
            this.errorMessage = ''
            
            try {
                const params = {
                    limit: parseInt(this.limit),
                    difficultyLevel: this.difficulty || null
                }
                
                this.requestUrl = `/api/quiz/course/${this.courseId}/random`
                this.requestParams = JSON.stringify(params)
                
                const result = await getRandomQuizQuestionsOfCourse(this.courseId, params)
                
                this.questionsResult = result
                this.responseStatus = '200'
                
            } catch (error) {
                this.errorMessage = error.message
                this.questionsResult = { error: error.message }
                this.responseStatus = error.response?.status || 'Error'
                
                // 記錄詳細錯誤信息
                if (error.response) {
                    console.error('Response error:', error.response)
                }
                if (error.request) {
                    console.error('Request error:', error.request)
                }
            } finally {
                this.loadingQuestions = false
            }
        }
    }
}
</script>

<style scoped>
.debug-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.debug-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.debug-section h3 {
    margin-top: 0;
    color: #409EFF;
}

.result {
    margin-top: 15px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
}

.result pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
}

.network-info {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
}

.network-info p {
    margin: 5px 0;
}

.network-info strong {
    color: #606266;
}
</style>

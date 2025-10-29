<template>
    <div class="quiz-manage">
        <!-- 題庫管理表格 -->
        <div class="table-container">
            <div class="table-header">
                <div class="header-left">
                    <h3>題庫管理</h3>
                    <el-button type="primary" @click="createQuiz" icon="Plus">
                        新增題目
                    </el-button>
                </div>
                <div class="header-right">
                    <el-select v-model="selectedCourseId" placeholder="選擇課程" @change="handleFilterChange" clearable>
                        <el-option
                            v-for="course in courses"
                            :key="course.id"
                            :label="course.name"
                            :value="course.id">
                        </el-option>
                    </el-select>
                    <el-checkbox-group v-model="selectedDifficulties" @change="handleFilterChange">
                        <el-checkbox :label="1">簡單</el-checkbox>
                        <el-checkbox :label="2">中等</el-checkbox>
                        <el-checkbox :label="3">困難</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="selectedTypes" @change="handleFilterChange">
                        <el-checkbox label="single">單選</el-checkbox>
                        <el-checkbox label="multiple">多選</el-checkbox>
                        <el-checkbox label="judge">判斷</el-checkbox>
                    </el-checkbox-group>
                    <el-button @click="resetFilters">重置</el-button>
                </div>
            </div>

            <el-table :data="quizQuestions" style="width: 100%" border v-loading="loading" @sort-change="handleSortChange">
                <el-table-column prop="id" label="ID" width="100" align="center" sortable="custom"/>
                <el-table-column prop="courseId" label="課程ID" width="100" align="center"/>
                <el-table-column label="課程名稱" min-width="80" align="center">
                    <template #default="scope">
                        {{ getCourseName(scope.row.courseId) }}
                    </template>
                </el-table-column>
                <el-table-column label="題目內容" min-width="200">
                    <template #default="scope">
                        <div class="question-content">
                            {{ scope.row.questionText }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="questionType" label="題型" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="getTypeTagType(scope.row.questionType)">
                            {{ getTypeText(scope.row.questionType) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="difficultyLevel" label="難度" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="getDifficultyTagType(scope.row.difficultyLevel)">
                            {{ getDifficultyText(scope.row.difficultyLevel) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="correctAnswer" label="正確答案" width="120" align="center"/>
                <el-table-column prop="createTime" label="創建時間" width="180" align="center" sortable="custom"/>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button size="small" @click="editQuiz(scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="deleteQuiz(scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :pager-count="5"
                    :total="total"
                    :page-size="pageSize"
                    :hide-on-single-page="true"
                    @current-change="handlePageChange">
                </el-pagination>
            </div>
        </div>

        <!-- 新增/編輯題目對話框 -->
        <el-dialog 
            :title="dialogTitle" 
            v-model="dialogVisible" 
            width="800px" 
            center
            destroy-on-close>
            <el-form ref="quizForm" :model="quizForm" :rules="rules" label-width="100px">
                <el-form-item label="課程" prop="courseId">
                    <el-select v-model="quizForm.courseId" placeholder="請選擇課程" style="width: 100%">
                        <el-option
                            v-for="course in courses"
                            :key="course.id"
                            :label="course.name"
                            :value="course.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="題目內容" prop="questionText">
                    <el-input 
                        type="textarea" 
                        v-model="quizForm.questionText" 
                        placeholder="請輸入題目內容"
                        :rows="3">
                    </el-input>
                </el-form-item>
                
                <el-form-item label="題型" prop="questionType">
                    <el-radio-group v-model="quizForm.questionType" @change="handleTypeChange">
                        <el-radio label="single">單選題</el-radio>
                        <el-radio label="multiple">多選題</el-radio>
                        <el-radio label="judge">判斷題</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="難度等級" prop="difficultyLevel">
                    <el-radio-group v-model="quizForm.difficultyLevel">
                        <el-radio :label="1">簡單</el-radio>
                        <el-radio :label="2">中等</el-radio>
                        <el-radio :label="3">困難</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <!-- 選項區域 -->
                <div v-if="quizForm.questionType !== 'judge'">
                    <el-form-item label="選項設置">
                        <div class="options-container">
                            <div v-for="(option, index) in quizForm.options" :key="index" class="option-item">
                                <el-input 
                                    v-model="option.optionText" 
                                    placeholder="選項內容"
                                    style="width: 60%">
                                    <template #prepend>{{ option.optionKey }}</template>
                                </el-input>
                                <el-checkbox 
                                    v-model="option.isCorrect" 
                                    :true-label="1" 
                                    :false-label="0"
                                    style="margin-left: 10px">
                                    正確答案
                                </el-checkbox>
                                <el-button 
                                    size="small" 
                                    type="danger" 
                                    @click="removeOption(index)"
                                    style="margin-left: 10px">
                                    刪除
                                </el-button>
                            </div>
                            <el-button 
                                type="primary" 
                                size="small" 
                                @click="addOption"
                                v-if="quizForm.options.length < 6">
                                添加選項
                            </el-button>
                        </div>
                    </el-form-item>
                </div>
                
                <!-- 判斷題答案 -->
                <el-form-item v-if="quizForm.questionType === 'judge'" label="正確答案" prop="correctAnswer">
                    <el-radio-group v-model="quizForm.correctAnswer">
                        <el-radio label="true">正確</el-radio>
                        <el-radio label="false">錯誤</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <!-- 其他題型答案 -->
                <el-form-item v-else label="正確答案" prop="correctAnswer">
                    <el-input 
                        v-model="quizForm.correctAnswer" 
                        placeholder="請輸入正確答案（如：A 或 A,B,C）"
                        readonly>
                    </el-input>
                </el-form-item>
                
                <el-form-item label="答案解析" prop="explanation">
                    <el-input 
                        type="textarea" 
                        v-model="quizForm.explanation" 
                        placeholder="請輸入答案解析"
                        :rows="2">
                    </el-input>
                </el-form-item>
            </el-form>
            
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveQuiz" :loading="saving">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {getCourses} from '../../utils/api'
import {getAllQuizQuestions, getQuizQuestionsByCourse, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion} from '../../utils/api'

export default {
    name: "Quiz-Manage",
    data() {
        return {
            loading: false,
            saving: false,
            quizQuestions: [],
            courses: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            
            // 篩選條件
            selectedCourseId: null,
            selectedDifficulties: [],
            selectedTypes: [],
            
            // 對話框
            dialogVisible: false,
            dialogTitle: '新增題目',
            editMode: 'create',
            
            // 表單數據
            quizForm: {
                id: null,
                courseId: null,
                questionText: '',
                questionType: 'single',
                difficultyLevel: 1,
                correctAnswer: '',
                explanation: '',
                options: []
            },
            
            // 原始數據與排序
            rawQuestions: [],
            sortProp: 'id',
            sortOrder: null, // ascending | descending | null

            // 表單驗證規則
            rules: {
                courseId: [
                    {required: true, message: '請選擇課程', trigger: 'change'}
                ],
                questionText: [
                    {required: true, message: '請輸入題目內容', trigger: 'blur'},
                    {min: 5, max: 500, message: '題目內容長度在5到500個字符', trigger: 'blur'}
                ],
                questionType: [
                    {required: true, message: '請選擇題型', trigger: 'change'}
                ],
                difficultyLevel: [
                    {required: true, message: '請選擇難度等級', trigger: 'change'}
                ],
                correctAnswer: [
                    {required: true, message: '請設置正確答案', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.loadCourses()
        this.loadQuizQuestions()
    },
    methods: {
        // 載入課程列表
        async loadCourses() {
            try {
                const result = await getCourses()
                if (result.code === '0000') {
                    this.courses = result.data.list || result.data
                }
            } catch (error) {
                this.$message.error('載入課程列表失敗')
            }
        },
        
        // 載入題目列表
        async loadQuizQuestions() {
            this.loading = true
            try {
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    courseId: this.selectedCourseId || null,
                    // 多選情況下不傳difficulty/type，改為前端本地篩選
                }
                let result
                if (!this.selectedCourseId) {
                    // 查詢所有課程題目
                    result = await getAllQuizQuestions(params)
                } else {
                    // 查詢指定課程題目
                    result = await getQuizQuestionsByCourse(this.selectedCourseId, params)
                }
                if (result && result.code === '0000') {
                    this.rawQuestions = result.data.list || result.data || []
                    this.applyFiltersAndSort()
                }
            } catch (error) {
                this.$message.error('載入題目列表失敗')
            } finally {
                this.loading = false
            }
        },

        // 篩選處理（任一條件變更觸發）
        handleFilterChange() {
            this.currentPage = 1
            // 若更換課程，優先從後端重新拉取，否則本地重算
            if (this.selectedCourseIdChangedOnce === undefined) {
                this.selectedCourseIdChangedOnce = true
            }
            if (this.selectedCourseIdChangedOnce) {
                this.loadQuizQuestions()
            } else {
                this.applyFiltersAndSort()
            }
        },

        resetFilters() {
            this.selectedCourseId = null
            this.selectedDifficulties = []
            this.selectedTypes = []
            this.sortProp = 'id'
            this.sortOrder = null
            this.currentPage = 1
            this.loadQuizQuestions()
        },
        
        // 分頁處理
        handlePageChange(page) {
            this.currentPage = page
            this.applyFiltersAndSort()
        },
        
        // 新增題目
        createQuiz() {
            this.editMode = 'create'
            this.dialogTitle = '新增題目'
            this.quizForm = {
                id: null,
                courseId: null,
                questionText: '',
                questionType: 'single',
                difficultyLevel: 1,
                correctAnswer: '',
                explanation: '',
                options: []
            }
            this.addOption() // 添加默認選項
            this.dialogVisible = true
        },
        
        // 編輯題目
        editQuiz(row) {
            this.editMode = 'update'
            this.dialogTitle = '編輯題目'
            this.quizForm = {
                id: row.id,
                courseId: row.courseId,
                questionText: row.questionText,
                questionType: row.questionType,
                difficultyLevel: row.difficultyLevel,
                correctAnswer: row.correctAnswer,
                explanation: row.explanation || '',
                options: row.options || []
            }
            
            // 如果是判斷題且沒有選項，添加默認選項
            if (this.quizForm.questionType !== 'judge' && this.quizForm.options.length === 0) {
                this.addOption()
            }
            
            this.dialogVisible = true
        },
        
        // 刪除題目
        async deleteQuiz(row) {
            try {
                await this.$confirm('確定要刪除這道題目嗎？', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                
                const result = await deleteQuizQuestion(row.id)
                if (result.code === '0000') {
                    this.$message.success('刪除成功')
                    this.loadQuizQuestions()
                } else {
                    this.$message.error('刪除失敗')
                }
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error('刪除失敗')
                }
            }
        },
        
        // 保存題目
        async saveQuiz() {
            try {
                await this.$refs.quizForm.validate()
                
                // 處理正確答案
                if (this.quizForm.questionType !== 'judge') {
                    const correctOptions = this.quizForm.options
                        .filter(option => option.isCorrect === 1)
                        .map(option => option.optionKey)
                        .sort()
                    this.quizForm.correctAnswer = correctOptions.join(',')
                }
                
                this.saving = true
                
                let result
                if (this.editMode === 'create') {
                    result = await createQuizQuestion(this.quizForm)
                } else {
                    result = await updateQuizQuestion(this.quizForm)
                }
                
                if (result.code === '0000') {
                    this.$message.success('保存成功')
                    this.dialogVisible = false
                    this.loadQuizQuestions()
                } else {
                    this.$message.error('保存失敗')
                }
            } catch (error) {
                if (error !== false) { // 表單驗證失敗
                    this.$message.error('請檢查表單內容')
                }
            } finally {
                this.saving = false
            }
        },

        // 排序變更
        handleSortChange({ prop, order }) {
            this.sortProp = prop
            this.sortOrder = order // 'ascending' | 'descending' | null
            this.applyFiltersAndSort()
        },

        // 本地篩選 + 排序 + 分頁
        applyFiltersAndSort() {
            let data = Array.isArray(this.rawQuestions) ? [...this.rawQuestions] : []

            // 多條件篩選（課程ID已在後端可選，這裡保險再過濾一次）
            if (this.selectedCourseId) {
                data = data.filter(q => String(q.courseId) === String(this.selectedCourseId))
            }
            if (this.selectedDifficulties && this.selectedDifficulties.length > 0) {
                const set = new Set(this.selectedDifficulties)
                data = data.filter(q => set.has(q.difficultyLevel))
            }
            if (this.selectedTypes && this.selectedTypes.length > 0) {
                const set = new Set(this.selectedTypes)
                data = data.filter(q => set.has(q.questionType))
            }

            // 排序
            if (this.sortProp && this.sortOrder) {
                const multiplier = this.sortOrder === 'ascending' ? 1 : -1
                data.sort((a, b) => {
                    let va = a[this.sortProp]
                    let vb = b[this.sortProp]
                    // 日期與數字處理
                    if (this.sortProp === 'createTime') {
                        va = va ? new Date(va).getTime() : 0
                        vb = vb ? new Date(vb).getTime() : 0
                    }
                    if (typeof va === 'string' && typeof vb === 'string') {
                        return va.localeCompare(vb) * multiplier
                    }
                    return ((va || 0) - (vb || 0)) * multiplier
                })
            }

            // 總數與分頁（簡單處理，後續可改為後端分頁）
            this.total = data.length
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            this.quizQuestions = data.slice(start, end)
        },
        
        // 添加選項
        addOption() {
            const optionKeys = ['A', 'B', 'C', 'D', 'E', 'F']
            const nextKey = optionKeys[this.quizForm.options.length]
            this.quizForm.options.push({
                optionKey: nextKey,
                optionText: '',
                isCorrect: 0
            })
        },
        
        // 刪除選項
        removeOption(index) {
            this.quizForm.options.splice(index, 1)
            // 重新排列選項標識
            const optionKeys = ['A', 'B', 'C', 'D', 'E', 'F']
            this.quizForm.options.forEach((option, index) => {
                option.optionKey = optionKeys[index]
            })
        },
        
        // 題型變化處理
        handleTypeChange() {
            if (this.quizForm.questionType === 'judge') {
                this.quizForm.options = []
                this.quizForm.correctAnswer = 'true'
            } else {
                if (this.quizForm.options.length === 0) {
                    this.addOption()
                }
            }
        },
        
        // 工具方法
        getTypeText(type) {
            const types = {single: '單選', multiple: '多選', judge: '判斷'}
            return types[type] || '未知'
        },
        
        getTypeTagType(type) {
            const types = {single: 'primary', multiple: 'success', judge: 'warning'}
            return types[type] || 'info'
        },
        
        getDifficultyText(level) {
            const levels = {1: '簡單', 2: '中等', 3: '困難'}
            return levels[level] || '未知'
        },
        
        getDifficultyTagType(level) {
            const types = {1: 'success', 2: 'warning', 3: 'danger'}
            return types[level] || 'info'
        },

        // 根據courseId獲取課程名稱
        getCourseName(courseId) {
            if (!this.courses || this.courses.length === 0) return ''
            const course = this.courses.find(c => String(c.id) === String(courseId))
            return course ? course.name : ''
        }
    }
}
</script>

<style scoped>
.quiz-manage {
    padding: 20px;
}

.table-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-left h3 {
    margin: 0;
    color: #303133;
}

.header-right {
    display: flex;
    gap: 10px;
}

.question-content {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.options-container {
    width: 100%;
}

.option-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.pagination {
    margin-top: 20px;
    text-align: center;
}
</style>

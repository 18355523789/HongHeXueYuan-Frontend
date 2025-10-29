<template>
    <div class="class-manage">
        <div class="page-header">
            <h2>班級管理</h2>
            <el-button type="primary" @click="showCreateDialog">
                <el-icon><Plus /></el-icon>
                新增班級
            </el-button>
        </div>

        <!-- 搜索和篩選 -->
        <div class="search-section">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索班級名稱"
                        clearable
                        @input="handleSearch">
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="statusFilter" placeholder="狀態" clearable @change="handleSearch">
                        <el-option label="全部" value=""/>
                        <el-option label="啟用" value="true"/>
                        <el-option label="禁用" value="false"/>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="priceFilter" placeholder="價格類型" clearable @change="handleSearch">
                        <el-option label="全部" value=""/>
                        <el-option label="免費" value="free"/>
                        <el-option label="付費" value="paid"/>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button @click="resetSearch">重置</el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 班級列表 -->
        <el-table
            :data="filteredClasses"
            v-loading="loading"
            stripe
            border
            style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column label="封面" width="100">
                <template #default="scope">
                    <el-image
                        :src="scope.row.coverPicture"
                        style="width: 60px; height: 40px"
                        fit="cover"
                        :preview-src-list="[scope.row.coverPicture]">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="班級名稱" min-width="200"/>
            <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip/>
            <el-table-column label="價格" width="100">
                <template #default="scope">
                    <span v-if="scope.row.price === 0" class="price-free">免費</span>
                    <span v-else class="price-paid">￥{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="courseCount" label="課程數" width="80"/>
            <el-table-column prop="studentCount" label="學員數" width="80"/>
            <el-table-column label="評分" width="100">
                <template #default="scope">
                    <el-rate v-model="scope.row.averageScore" disabled show-score/>
                </template>
            </el-table-column>
            <el-table-column label="狀態" width="80">
                <template #default="scope">
                    <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
                        {{ scope.row.enabled ? '啟用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="創建時間" width="150">
                <template #default="scope">
                    {{ formatDate(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                    <el-button size="small" @click="editClass(scope.row)">編輯</el-button>
                    <el-button 
                        size="small" 
                        :type="scope.row.enabled ? 'warning' : 'success'"
                        @click="toggleStatus(scope.row)">
                        {{ scope.row.enabled ? '禁用' : '啟用' }}
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteClass(scope.row)">刪除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分頁 -->
        <div class="pagination">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <!-- 新增/編輯對話框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="isEdit ? '編輯班級' : '新增班級'"
            width="600px"
            @close="resetForm">
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="100px">
                <el-form-item label="班級名稱" prop="name">
                    <el-input v-model="form.name" placeholder="請輸入班級名稱"/>
                </el-form-item>
                <el-form-item label="班級描述" prop="description">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        :rows="3"
                        placeholder="請輸入班級描述"/>
                </el-form-item>
                <el-form-item label="封面圖片" prop="coverPicture">
                    <el-input v-model="form.coverPicture" placeholder="請輸入圖片URL"/>
                    <div v-if="form.coverPicture" class="image-preview">
                        <el-image
                            :src="form.coverPicture"
                            style="width: 200px; height: 120px"
                            fit="cover">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item label="價格" prop="price">
                    <el-input-number
                        v-model="form.price"
                        :min="0"
                        :precision="2"
                        style="width: 200px"/>
                    <span class="form-tip">設置為0表示免費班級</span>
                </el-form-item>
                <el-form-item label="選擇課程" prop="selectedCourses">
                    <el-select
                        v-model="form.selectedCourses"
                        multiple
                        placeholder="請選擇課程"
                        style="width: 100%"
                        @change="updateCourseCount">
                        <el-option
                            v-for="course in (allCourses || [])"
                            :key="course.id"
                            :label="course.name"
                            :value="course.id">
                            <span style="float: left">{{ course.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ course.price === 0 ? '免費' : '￥' + course.price }}
                            </span>
                        </el-option>
                    </el-select>
                    <div class="form-tip">已選擇 {{ (form.selectedCourses || []).length }} 門課程</div>
                </el-form-item>
                <el-form-item label="狀態" prop="enabled">
                    <el-switch v-model="form.enabled"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitting">
                    {{ isEdit ? '更新' : '創建' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {getClasses, createClass, updateClass, deleteClass, getAllCourses, getClassCourses, updateClassCourses} from '../../utils/api'
import {Plus, Search, Picture} from '@element-plus/icons-vue'

export default {
    name: 'Class-Manage',
    components: {
        Plus, Search, Picture
    },
    data() {
        return {
            loading: false,
            submitting: false,
            classes: [],
            filteredClasses: [],
            searchKeyword: '',
            statusFilter: '',
            priceFilter: '',
            currentPage: 1,
            pageSize: 20,
            total: 0,
            dialogVisible: false,
            isEdit: false,
            form: {
                id: null,
                name: '',
                description: '',
                coverPicture: '',
                price: 0,
                courseCount: 0,
                selectedCourses: [],
                enabled: true
            },
            allCourses: [],
            rules: {
                name: [
                    {required: true, message: '請輸入班級名稱', trigger: 'blur'},
                    {min: 2, max: 100, message: '長度在 2 到 100 個字符', trigger: 'blur'}
                ],
                description: [
                    {required: true, message: '請輸入班級描述', trigger: 'blur'},
                    {min: 10, max: 500, message: '長度在 10 到 500 個字符', trigger: 'blur'}
                ],
                coverPicture: [
                    {required: true, message: '請輸入封面圖片URL', trigger: 'blur'}
                ],
                price: [
                    {required: true, message: '請輸入價格', trigger: 'blur'},
                    {type: 'number', min: 0, message: '價格不能為負數', trigger: 'blur'}
                ],
                selectedCourses: [
                    {required: true, message: '請至少選擇一門課程', trigger: 'change'}
                ]
            }
        }
    },
    async created() {
        try {
            await Promise.all([
                this.loadClasses(),
                this.loadAllCourses()
            ])
        } catch (error) {
            console.error('初始化失敗:', error)
        }
    },
    methods: {
        // 載入班級列表
        async loadClasses() {
            this.loading = true
            try {
                const result = await getClasses({
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                })
                if (result && result.code === '0000') {
                    this.classes = result.data?.list || []
                    this.total = result.data?.size || 0
                    this.filterClasses()
                } else {
                    // API調用失敗，使用模擬數據
                    this.classes = this.getMockClasses()
                    this.total = this.classes.length
                    this.filterClasses()
                }
            } catch (error) {
                console.error('載入班級列表失敗:', error)
                // 使用模擬數據
                this.classes = this.getMockClasses()
                this.total = this.classes.length
                this.filterClasses()
            } finally {
                this.loading = false
            }
        },
        // 載入所有課程
        async loadAllCourses() {
            try {
                const result = await getAllCourses()
                if (result && result.code === '0000') {
                    this.allCourses = result.data?.list || []
                } else {
                    // API調用失敗，使用模擬數據
                    this.allCourses = this.getMockCourses()
                }
            } catch (error) {
                console.error('載入課程列表失敗:', error)
                // 使用模擬數據
                this.allCourses = this.getMockCourses()
            }
        },
        // 更新課程數量
        updateCourseCount() {
            this.form.courseCount = (this.form.selectedCourses || []).length
        },
        // 篩選班級
        filterClasses() {
            let filtered = [...this.classes]
            
            // 關鍵字搜索
            if (this.searchKeyword) {
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                    item.description.toLowerCase().includes(this.searchKeyword.toLowerCase())
                )
            }
            
            // 狀態篩選
            if (this.statusFilter !== '') {
                const enabled = this.statusFilter === 'true'
                filtered = filtered.filter(item => item.enabled === enabled)
            }
            
            // 價格篩選
            if (this.priceFilter === 'free') {
                filtered = filtered.filter(item => item.price === 0)
            } else if (this.priceFilter === 'paid') {
                filtered = filtered.filter(item => item.price > 0)
            }
            
            this.filteredClasses = filtered
        },
        // 搜索處理
        handleSearch() {
            this.filterClasses()
        },
        // 重置搜索
        resetSearch() {
            this.searchKeyword = ''
            this.statusFilter = ''
            this.priceFilter = ''
            this.filterClasses()
        },
        // 分頁處理
        handleSizeChange(size) {
            this.pageSize = size
            this.loadClasses()
        },
        handleCurrentChange(page) {
            this.currentPage = page
            this.loadClasses()
        },
        // 顯示新增對話框
        showCreateDialog() {
            this.isEdit = false
            this.dialogVisible = true
            this.resetForm()
        },
        // 編輯班級
        async editClass(classItem) {
            this.isEdit = true
            this.dialogVisible = true
            this.form = {
                id: classItem.id,
                name: classItem.name,
                description: classItem.description,
                coverPicture: classItem.coverPicture,
                price: classItem.price,
                courseCount: classItem.courseCount,
                selectedCourses: [],
                enabled: classItem.enabled
            }
            // 載入班級的課程
            await this.loadClassCourses(classItem.id)
        },
        // 載入班級課程
        async loadClassCourses(classId) {
            try {
                const result = await getClassCourses(classId)
                if (result.code === '0000') {
                    // 處理數據結構，確保正確提取課程ID
                    const courses = result.data?.list || result.data || []
                    this.form.selectedCourses = courses.map(item => {
                        // 如果item有course屬性，取course.id，否則直接取id
                        return item.course ? item.course.id : item.id
                    }).filter(id => id != null)
                    this.updateCourseCount()
                }
            } catch (error) {
                console.error('載入班級課程失敗:', error)
                // 使用模擬數據
                this.form.selectedCourses = [1, 2, 3] // 模擬選中的課程ID
                this.updateCourseCount()
            }
        },
        // 提交表單
        async submitForm() {
            try {
                await this.$refs.formRef.validate()
                this.submitting = true
                
                // 準備班級數據（不包含課程關聯）
                const classData = {
                    id: this.form.id,
                    name: this.form.name,
                    description: this.form.description,
                    coverPicture: this.form.coverPicture,
                    price: this.form.price,
                    courseCount: (this.form.selectedCourses || []).length,
                    enabled: this.form.enabled
                }
                
                if (this.isEdit) {
                    await updateClass(classData)
                    // 更新班級課程關聯
                    await updateClassCourses(this.form.id, {
                        courseIds: this.form.selectedCourses || []
                    })
                    this.$message.success('班級更新成功')
                } else {
                    const result = await createClass(classData)
                    // 創建班級課程關聯
                    const classId = result.data?.id || result.data
                    if (classId) {
                        await updateClassCourses(classId, {
                            courseIds: this.form.selectedCourses || []
                        })
                    }
                    this.$message.success('班級創建成功')
                }
                
                this.dialogVisible = false
                this.loadClasses()
            } catch (error) {
                this.$message.error(this.isEdit ? '班級更新失敗' : '班級創建失敗')
            } finally {
                this.submitting = false
            }
        },
        // 切換狀態
        async toggleStatus(classItem) {
            try {
                const newStatus = !classItem.enabled
                await updateClass({
                    id: classItem.id,
                    enabled: newStatus
                })
                classItem.enabled = newStatus
                this.$message.success(`班級已${newStatus ? '啟用' : '禁用'}`)
            } catch (error) {
                this.$message.error('狀態更新失敗')
            }
        },
        // 刪除班級
        async deleteClass(classItem) {
            try {
                await this.$confirm(`確定要刪除班級"${classItem.name}"嗎？`, '確認刪除', {
                    type: 'warning'
                })
                
                await deleteClass(classItem.id)
                this.$message.success('班級刪除成功')
                this.loadClasses()
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error('班級刪除失敗')
                }
            }
        },
        // 重置表單
        resetForm() {
            this.form = {
                id: null,
                name: '',
                description: '',
                coverPicture: '',
                price: 0,
                courseCount: 0,
                selectedCourses: [],
                enabled: true
            }
            if (this.$refs.formRef) {
                this.$refs.formRef.resetFields()
            }
        },
        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        // 模擬課程數據
        getMockCourses() {
            return [
                {
                    id: 1,
                    name: 'HTML基礎',
                    description: '學習HTML標記語言基礎',
                    coverPicture: '/static/banners/banner1.jpg',
                    price: 0,
                    averageScore: 4.5
                },
                {
                    id: 2,
                    name: 'CSS樣式',
                    description: '學習CSS樣式設計',
                    coverPicture: '/static/banners/banner2.jpg',
                    price: 99,
                    averageScore: 4.3
                },
                {
                    id: 3,
                    name: 'JavaScript基礎',
                    description: '學習JavaScript編程基礎',
                    coverPicture: '/static/banners/banner3.jpg',
                    price: 199,
                    averageScore: 4.7
                },
                {
                    id: 4,
                    name: 'Vue.js入門',
                    description: '學習Vue.js框架基礎',
                    coverPicture: '/static/banners/banner1.jpg',
                    price: 299,
                    averageScore: 4.8
                },
                {
                    id: 5,
                    name: 'React基礎',
                    description: '學習React框架基礎',
                    coverPicture: '/static/banners/banner2.jpg',
                    price: 299,
                    averageScore: 4.6
                }
            ]
        },
        // 模擬班級數據
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
                    averageScore: 4.8,
                    enabled: true,
                    createTime: '2024-01-15T10:00:00'
                },
                {
                    id: 2,
                    name: 'Vue.js 實戰班',
                    description: '深入學習Vue.js框架，掌握現代前端開發技能',
                    coverPicture: '/static/banners/banner2.jpg',
                    price: 0,
                    courseCount: 8,
                    studentCount: 890,
                    averageScore: 4.9,
                    enabled: true,
                    createTime: '2024-01-12T14:30:00'
                },
                {
                    id: 3,
                    name: '全棧開發班',
                    description: '學習前後端開發，成為全棧工程師',
                    coverPicture: '/static/banners/banner3.jpg',
                    price: 599,
                    courseCount: 20,
                    studentCount: 567,
                    averageScore: 4.7,
                    enabled: false,
                    createTime: '2024-01-10T09:15:00'
                }
            ]
        }
    }
}
</script>

<style scoped>
.class-manage {
    padding: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    color: #2d3748;
}

.search-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
}

.image-preview {
    margin-top: 10px;
}

.form-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
}

.price-free {
    color: #67c23a;
    font-weight: 600;
}

.price-paid {
    color: #f56c6c;
    font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .class-manage {
        padding: 16px;
    }
    
    .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }
    
    .search-section .el-row {
        flex-direction: column;
        gap: 12px;
    }
    
    .search-section .el-col {
        width: 100%;
    }
}
</style>

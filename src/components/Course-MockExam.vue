<template>
	<div class="mock-exam-container">
		<div class="header">
			<h3>模拟考试</h3>
			<p>请选择试卷并设置考试时间，然后开始答题。</p>
		</div>

		<el-row :gutter="20" class="controls">
			<el-col :xs="24" :sm="12">
				<el-form label-width="100px">
					<el-form-item label="选择试卷">
						<el-select v-model="selectedExamId" placeholder="请选择试卷" filterable>
							<el-option
								v-for="exam in exams"
								:key="exam.id"
								:label="exam.title"
								:value="exam.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="考试时长">
						<el-input-number v-model="durationMinutes" :min="5" :max="240" />
						<span class="suffix">分钟</span>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :xs="24" :sm="12" class="exam-brief" v-if="currentExam">
				<el-card shadow="never">
					<div class="exam-title">{{ currentExam.title }}</div>
					<div class="exam-meta">
						<span>题目数：{{ (currentExam.questionCount || mockQuestionsCount(currentExam.id)) }}</span>
						<el-divider direction="vertical" />
						<span>建议时长：{{ currentExam.suggestedMinutes || 60 }} 分钟</span>
					</div>
					<div class="exam-desc">{{ currentExam.description }}</div>
				</el-card>
			</el-col>
		</el-row>

		<div class="actions">
			<el-button type="primary" :disabled="!selectedExamId" @click="startExam">开始考试</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Course-MockExam',
	props: {
		courseId: {
			type: [String, Number],
			required: false
		}
	},
	data() {
		return {
			exams: [],
			selectedExamId: null,
			durationMinutes: 60
		}
	},
	computed: {
		currentExam() {
			return (this.exams || []).find(e => e.id === this.selectedExamId) || null
		}
	},
	created() {
		this.loadExams()
	},
	methods: {
		async loadExams() {
			// 预留：可改为从后端拉取试卷列表
			this.exams = this.getMockExams()
			if (this.exams.length > 0) {
				this.selectedExamId = this.exams[0].id
			}
		},
		getMockExams() {
			return [
				{ id: 'exam-101', title: '入门基础模拟卷', description: '覆盖课程基础知识点，题型包含单选/多选/判断', questionCount: 20, suggestedMinutes: 40 },
				{ id: 'exam-201', title: '综合提升模拟卷', description: '难度中等，涵盖核心知识与常见考点', questionCount: 40, suggestedMinutes: 80 },
				{ id: 'exam-301', title: '进阶挑战模拟卷', description: '难度较高，适合查缺补漏与冲刺提升', questionCount: 60, suggestedMinutes: 120 }
			]
		},
		mockQuestionsCount(examId) {
			const exam = (this.exams || []).find(e => e.id === examId)
			return (exam && exam.questionCount) || 0
		},
        startExam() {
            this.$router.push({
                name: 'Exam-Take',
                query: { 
                    examId: this.selectedExamId, 
                    duration: this.durationMinutes,
                    courseId: this.courseId
                }
            })
        }
	}
}
</script>

<style scoped>
.mock-exam-container { padding: 10px; }
.header { margin-bottom: 10px; }
.header h3 { margin: 0 0 8px; }
.controls .suffix { margin-left: 8px; color: #909399; }
.exam-brief { margin-top: 10px; }
.exam-title { font-weight: 700; font-size: 16px; margin-bottom: 6px; }
.exam-meta { color: #606266; font-size: 13px; margin-bottom: 8px; }
.exam-desc { color: #606266; line-height: 1.6; }
.actions { margin-top: 14px; }
</style>

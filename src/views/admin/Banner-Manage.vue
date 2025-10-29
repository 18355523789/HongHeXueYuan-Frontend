<template>
    <div class="banner-manage">
        <div class="toolbar">
            <el-button type="primary" @click="openCreate">新增宣傳圖</el-button>
            <el-switch v-model="onlyEnabled" active-text="僅顯示啟用" @change="loadData"/>
        </div>
        <el-table :data="banners" border style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" align="center" sortable="custom"/>
            <el-table-column label="預覽" width="160" align="center">
                <template #default="scope">
                    <el-image :src="scope.row.url" style="width: 140px; height: 70px; object-fit: cover"/>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="標題" min-width="160"/>
            <el-table-column prop="link" label="跳轉鏈接" min-width="200"/>
            <el-table-column prop="sort" label="排序" width="90" align="center" sortable="custom"/>
            <el-table-column prop="enabled" label="啟用" width="90" align="center">
                <template #default="scope">
                    <el-switch v-model="scope.row.enabled" @change="toggleEnabled(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button size="small" @click="openEdit(scope.row)">編輯</el-button>
                    <el-button size="small" type="danger" @click="remove(scope.row)">刪除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" center destroy-on-close>
            <el-form :model="form" label-width="90px">
                <el-form-item label="圖片URL">
                    <el-input v-model="form.url" placeholder="/banners/banner1.jpg 或完整URL"/>
                </el-form-item>
                <el-form-item label="跳轉鏈接">
                    <el-input v-model="form.link" placeholder="可選，點擊圖片跳轉的地址"/>
                </el-form-item>
                <el-form-item label="標題">
                    <el-input v-model="form.title" placeholder="可選，顯示用標題/描述"/>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sort" :min="0"/>
                </el-form-item>
                <el-form-item label="啟用">
                    <el-switch v-model="form.enabled"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" @click="save">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../utils/api'

export default {
    name: 'Banner-Manage',
    data() {
        return {
            loading: false,
            saving: false,
            onlyEnabled: false,
            banners: [],
            dialogVisible: false,
            dialogTitle: '新增宣傳圖',
            editMode: 'create',
            form: {
                id: null,
                url: '',
                link: '',
                title: '',
                sort: 0,
                enabled: true
            }
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        async loadData() {
            this.loading = true
            try {
                const result = await getBanners({ enabled: this.onlyEnabled ? true : null })
                if (result.code === '0000') {
                    this.banners = result.data || []
                }
            } finally {
                this.loading = false
            }
        },
        openCreate() {
            this.editMode = 'create'
            this.dialogTitle = '新增宣傳圖'
            this.form = { id: null, url: '', link: '', title: '', sort: 0, enabled: true }
            this.dialogVisible = true
        },
        openEdit(row) {
            this.editMode = 'update'
            this.dialogTitle = '編輯宣傳圖'
            this.form = { ...row }
            this.dialogVisible = true
        },
        async save() {
            this.saving = true
            try {
                let result
                if (this.editMode === 'create') {
                    result = await createBanner(this.form)
                } else {
                    result = await updateBanner(this.form)
                }
                if (result.code === '0000') {
                    this.$message.success('保存成功')
                    this.dialogVisible = false
                    this.loadData()
                }
            } finally {
                this.saving = false
            }
        },
        async remove(row) {
            await this.$confirm('確定刪除該宣傳圖？', '提示')
            const result = await deleteBanner(row.id)
            if (result.code === '0000') {
                this.$message.success('刪除成功')
                this.loadData()
            }
        },
        async toggleEnabled(row) {
            await updateBanner({ id: row.id, enabled: row.enabled })
        }
    }
}
</script>

<style scoped>
.banner-manage {
    padding: 20px;
}
.toolbar {
    margin-bottom: 12px;
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>



<template>
    <div class="flex-between mb-1">
        <el-radio-group v-model="orderBy" size="small" @change="handleOrderChange">
            <el-radio-button label="create_time">最新</el-radio-button>
            <el-radio-button label="average_score">推荐</el-radio-button>
        </el-radio-group>
        <el-pagination :page-size="20" layout="sizes" @size-change="handleSizeChange"/>
    </div>
    <el-row :gutter="20">
        <el-col v-for="classItem in classes" :xs="24" :sm="6" class="class-card">
            <router-link :to="{ name: 'Class-Content', params: { id: classItem.id }}">
                <el-card :body-style="{ 'padding': '0px', 'min-height': '300px' }">
                    <el-image :src="classItem.coverPicture" class="card-cover-picture"/>
                    <div class="card-text">
                        <div class="card-class-name">
                            {{ classItem.name }}
                        </div>
                        <div class="card-class-price" v-if="classItem.price !== 0">
                            ￥{{ classItem.price }}
                        </div>
                        <div class="card-class-price free" v-else>
                            免费
                        </div>
                        <div class="card-class-meta">
                            <span class="meta-info">
                                <el-icon><Document /></el-icon>
                                {{ classItem.courseCount || 0 }} 门课程
                            </span>
                            <span class="meta-info">
                                <el-icon><User /></el-icon>
                                {{ classItem.studentCount || 0 }} 人学习
                            </span>
                        </div>
                    </div>
                </el-card>
            </router-link>
        </el-col>
    </el-row>
    <div class="pagination">
        <el-pagination background layout="prev, pager, next" :pager-count="5" :total="size" :page-size="20"
                       :hide-on-single-page="true" @current-change="handlePageChange">
        </el-pagination>
    </div>
</template>

<script>
import {getClasses} from '../utils/api'

export default {
    name: "Class-List",
    data() {
        return {
            classes: [],
            size: 0,
            pageNum: null,
            pageSize: 20,
            orderBy: 'create_time'
        }
    },
    created() {
        this.getClasses()
    },
    methods: {
        getClasses() {
            getClasses({
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                orderBy: this.orderBy
            }).then(result => {
                if (result.code === '0000') {
                    this.classes = result.data.list
                    this.size = result.data.size
                }
            })
        },
        handleOrderChange(orderBy) {
            this.orderBy = orderBy
            this.getClasses()
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.getClasses()
        },
        handlePageChange(pageNum) {
            this.pageNum = pageNum
            this.getClasses()
        }
    }
}
</script>

<style scoped>
.class-card {
    margin-top: 20px;
}

.card-text {
    margin: 10px;
}

.card-cover-picture {
    height: 200px;
    width: 100%;
}

.card-class-name {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

.card-class-price {
    font-size: 14px;
    color: #f56c6c;
    margin-bottom: 8px;
}

.card-class-price.free {
    color: #67C23A;
}

.card-class-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
    margin-top: 8px;
}

.meta-info {
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-info .el-icon {
    font-size: 14px;
}
</style>


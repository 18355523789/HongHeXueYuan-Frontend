<template>
	<!-- 外层容器：应用渐变背景与内边距 -->
	<header class="app-header">
		<el-row type="flex" justify="space-between" class="header-row">
			<el-col :span="12">
				<el-row type="flex" class="left-nav" align="middle">
					<router-link class="logo" :to="{name: 'Index'}">
						鸿鹤学院
					</router-link>
					<router-link class="nav-link" :to="{name: 'Index'}">
						<el-icon class="nav-icon"><house/></el-icon>
						<span>首  页</span>
					</router-link>
					<router-link class="nav-link" :to="{name: 'Course-List'}">
						<el-icon class="nav-icon"><files/></el-icon>
						<span>全部课程</span>
					</router-link>
					<router-link class="nav-link" :to="{name: 'Class-List'}">
						<el-icon class="nav-icon"><collection/></el-icon>
						<span>全部班级</span>
					</router-link>
				</el-row>
			</el-col>
			<el-col :span="12">
				<!-- 右侧保持原有逻辑，只加类名以便样式美化 -->
				<el-row v-if="auth" type="flex" justify="end" class="right-nav" align="middle">
					<router-link class="nav-link" :to="{name: 'Course-Search'}">
						<el-icon class="nav-icon"><search/></el-icon>
						<span>搜  索</span>
					</router-link>
					<router-link v-if="auth.role.name !== '学生'" class="nav-link" :to="{name: 'Teaching-Course-List'}">
						<el-icon class="nav-icon"><suitcase/></el-icon>
						<span>教学管理</span>
					</router-link>
					<router-link v-if="auth.role.name === '管理员'" class="nav-link" :to="{name: 'Admin-Index'}">
						<el-icon class="nav-icon"><monitor/></el-icon>
						<span>后台管理</span>
					</router-link>
					<el-popover placement="bottom-end" :width="220">
						<template #reference>
							<el-button type="text" class="avatar-btn">
								<el-avatar :src="auth.profilePicture" :size="36" class="profile-picture">
								</el-avatar>
							</el-button>
						</template>
						<div class="user-popover">
							<el-avatar :src="auth.profilePicture" :size="64" class="popover-avatar">
								{{ auth.fullName }}
							</el-avatar>
							<div class="mt-1 name">{{ auth.fullName }}</div>
							<div class="mt-2 pop-actions">
								<router-link class="pop-link" :to="{ name: 'User-Homepage', params: { username: auth.username }}">
									<el-icon><user/></el-icon>
									<span>个人主页</span>
								</router-link>
								<el-divider direction="vertical"/>
								<router-link class="pop-link" :to="{ name: 'User-Setting', params: { username: auth.username }}">
									<el-icon><setting/></el-icon>
									<span>个人设置</span>
								</router-link>
								<el-divider/>
								<el-button type="text" class="logout-btn" @click="logout">安全退出</el-button>
							</div>
						</div>
					</el-popover>
				</el-row>
				<el-row v-else type="flex" justify="end" class="right-nav" align="middle">
					<router-link class="nav-link" :to="{name: 'Course-Search'}">
						<el-icon class="nav-icon"><search/></el-icon>
						<span>搜索</span>
					</router-link>
					<router-link class="nav-link" :to="{name: 'Login'}">
						<el-icon class="nav-icon"><user/></el-icon>
						<span>登录</span>
					</router-link>
				</el-row>
			</el-col>
		</el-row>
	</header>
</template>

<script>
import {mapState} from 'vuex'
import {removeAuth, removeToken} from '../utils/auth'

export default {
	name: "Header",
	computed: mapState([
		'auth'
	]),
	methods: {
		logout() {
			this.$confirm("确定注销？", "提示", {type: "warning"}).then(() => {
				removeAuth()
				removeToken()
				this.$router.push({name: 'Login'})
			}).catch(() => {
				this.$message.warning("已取消！")
			})
		}
	}
}
</script>

<style>
/* 修改：让 header 铺满视口，减少两侧白边，并取消圆角 */
.app-header {
	background-image:linear-gradient(-20deg,#b721ff 0%, #21d4fd 100%);
	/* 让 header 跨越整个视口宽度 */
	width: 100vw;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	/* 去掉外部 margin，减少两侧空白 */
	margin: 0;
	/* 较小内边距，内容更贴边 */
	padding: 3px 8px;
	/* 取消圆角以避免露出父容器背景 */
	border-radius: 6px;
	box-sizing: border-box;
}

/* 取消 max-width 限制并微调内边距 */
.header-row {
	max-width: 100%;
	margin: 0;
	align-items: center;
	padding: 0 12px;
}

/* logo 间距微调 */
.logo {
	color: #052c56;
	font-size: 32px;
	font-weight: 800;
	margin-right: 12px; /* 从18px缩小为12px */
	letter-spacing: 1px;
	text-decoration: none;
}

/* 导航项间距微调，整体更紧凑 */
.left-nav .nav-link,
.right-nav .nav-link {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: rgba(8,24,44,0.9);
	/* 减小右侧间距 */
	margin-right: 8px;
	text-decoration: none;
	padding: 6px 8px; /* 减少左右内距 */
	border-radius: 8px;
	transition: background 160ms ease, transform 120ms ease;
}

.left-nav .nav-link:hover,
.right-nav .nav-link:hover {
	background: rgba(255,255,255,0.12);
	transform: translateY(-2px);
}

/* 图标统一大小与颜色 */
.nav-icon {
	font-size: 16px;
	color: rgba(255,255,255,0.95);
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

/* 右侧头像按钮 */
.avatar-btn {
	padding: 0;
	border-radius: 50%;
}
.profile-picture {
	box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

/* 弹出框样式 */
.user-popover {
	text-align: center;
	padding: 10px 6px;
}
.popover-avatar {
	margin: 6px auto;
	box-shadow: 0 6px 20px rgba(8,24,44,0.12);
}
.user-popover .name {
	margin-top: 8px;
	font-weight: 700;
	color: #073045;
}

/* 弹出内操作区 */
.pop-actions {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 10px;
	flex-wrap: wrap;
}
.pop-link {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: #07405a;
	text-decoration: none;
	padding: 6px 8px;
	border-radius: 8px;
}
.pop-link:hover {
	background: rgba(0,0,0,0.04);
}

/* 安全退出按钮 */
.logout-btn {
	color: #c33;
	padding: 6px 10px;
	border-radius: 8px;
}

/* 响应式：窄屏时微调 */
@media (max-width: 720px) {
	.header-row { padding: 0 6px; }
	.left-nav .nav-link { display: none; } /* 隐藏部分链接以节省空间 */
	.right-nav .nav-link { display: none; }
	.logo { margin-right: 8px; }
}

/* 保持原有样式表中未提及的规则 */
</style>
<template>
	<!-- 快捷入口模块 -->
	<div class="admin-index">
		<section class="module shortcuts-module">
			<header class="module-header">
				<h3>快捷入口</h3>
			</header>

			<div class="quick-shortcuts">
				<router-link class="shortcut-card" :to="{ name: 'Admin-Index' }" title="首页">
					<div class="icon">首</div>
					<div class="label">首页</div>
					<div class="desc">管理面板首页</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Category-Manage' }" title="分类管理">
					<div class="icon">分</div>
					<div class="label">分类管理</div>
					<div class="desc">管理课程分类</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Course-Manage' }" title="课程管理">
					<div class="icon">课</div>
					<div class="label">课程管理</div>
					<div class="desc">管理课程内容</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Class-Manage' }" title="班级管理">
					<div class="icon">班</div>
					<div class="label">班级管理</div>
					<div class="desc">管理班级和课程关联</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Banner-Manage' }" title="宣传图管理">
					<div class="icon">宣</div>
					<div class="label">宣传图管理</div>
					<div class="desc">管理公司宣传图</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Quiz-Manage' }" title="题库管理">
					<div class="icon">题</div>
					<div class="label">题库管理</div>
					<div class="desc">管理题目内容</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'User-Manage' }" title="用户管理">
					<div class="icon">用</div>
					<div class="label">用户管理</div>
					<div class="desc">查看与编辑用户</div>
				</router-link>

				<router-link class="shortcut-card" :to="{ name: 'Role-Manage' }" title="角色管理">
					<div class="icon">角</div>
					<div class="label">角色管理</div>
					<div class="desc">配置权限角色</div>
				</router-link>

				<a class="shortcut-card" href="/" target="_blank" title="返回官网">
					<div class="icon">返</div>
					<div class="label">返回官网</div>
					<div class="desc">新窗口打开前台网站</div>
				</a>
			</div>
		</section>
	</div>
</template>

<script>
export default {
	/* ...existing code... */
	name: 'Admin-Index'
}
</script>

<style scoped>
/* 快捷入口模块外壳 */
.admin-index {
    /* background-image:linear-gradient(0deg,#d3d3d3 0%, #d3d3d3 1%, #e0e0e0 26%) */
}


.module {
	margin: 18px;
	padding: 16px;
	border-radius: 12px;
	background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
	box-shadow: 0 6px 24px rgba(8,24,40,0.06);
}

/* 模块标题 */
.module-header {
	margin-bottom: 12px;
}
.module-header h3 {
	margin: 0;
	font-size: 17px;
	color: #000000;
	font-weight: 700;
}

/* 网格布局，响应式自动换行 */
.quick-shortcuts {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 14px;
	align-items: stretch;
}

/* 方形卡片样式（稍微加深背景以便图标白字可见） */
.shortcut-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: inherit;
	background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
	border-radius: 10px;
	padding: 18px 12px;
	box-sizing: border-box;
	min-height: 120px;
	transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
	border: 1px solid rgba(255,255,255,0.04);
}

/* 图标圆块：有色背景以保证白字可见 */
.shortcut-card .icon {
	width: 56px;
	height: 56px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26px;
	margin-bottom: 10px;
	color: #fff;
	font-weight: 800;
	/* 使用更明显的渐变以保证对比 */
	background-image: linear-gradient(135deg, #39DABE 0%, #4CA0FF 100%);
	box-shadow: 0 8px 18px rgba(38, 144, 255, 0.12);
}

/* 为不同功能的图标块可选配不同颜色（可扩展） */
.shortcut-card[title="分类管理"] .icon { background-image: linear-gradient(135deg,#FFB86B 0%, #FF7AB6 100%); }
.shortcut-card[title="课程管理"] .icon { background-image: linear-gradient(135deg,#69EACB 0%, #6654F1 100%); }
.shortcut-card[title="班级管理"] .icon { background-image: linear-gradient(135deg,#F093FB 0%, #F5576C 100%); }
.shortcut-card[title="宣传图管理"] .icon { background-image: linear-gradient(135deg,#4FACFE 0%, #00F2FE 100%); }
.shortcut-card[title="题库管理"] .icon { background-image: linear-gradient(135deg,#43E97B 0%, #38F9D7 100%); }
.shortcut-card[title="用户管理"] .icon { background-image: linear-gradient(135deg,#FFD166 0%, #06D6A0 100%); }
.shortcut-card[title="角色管理"] .icon { background-image: linear-gradient(135deg,#A78BFA 0%, #5EEAD4 100%); }
.shortcut-card[title="首页"] .icon { background-image: linear-gradient(135deg,#7AD7FF 0%, #6EE7B7 100%); }

/* 标题与描述 */
.shortcut-card .label {
	font-weight: 700;
	font-size: 14px;
	color: #000000;
	margin-bottom: 6px;
	text-align: center;
}
.shortcut-card .desc {
	font-size: 12px;
	color: rgba(0, 0, 0, 0.85);
	text-align: center;
}

/* 悬停/聚焦效果 */
.shortcut-card:hover,
.shortcut-card:focus {
	transform: translateY(-6px);
	box-shadow: 0 18px 40px rgba(10,30,60,0.12);
	background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
}

/* 可访问性：键盘聚焦时显示环形阴影 */
.shortcut-card:focus {
	outline: none;
	box-shadow: 0 0 0 4px rgba(76,160,255,0.12), 0 18px 40px rgba(10,30,60,0.12);
}

/* 小屏幕时调整最小高度 */
@media (max-width: 420px) {
	.shortcut-card { min-height: 110px; padding: 14px 10px; }
	.shortcut-card .icon { width: 50px; height: 50px; font-size: 22px; }
}
</style>
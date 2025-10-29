<template>
	<div class="admin-header">
		<div class="header-left">
			<!-- 可以放置 logo / 面包屑 等，当前保留为空 -->
		</div>

		<div class="header-right">
			<div class="user">
				<div class="avatar">
					{{ auth && auth.fullName ? auth.fullName.charAt(0) : '鹤' }}
				</div>
				<div class="meta">
					<div class="greet">欢迎，<span class="name">{{ auth.fullName }}</span></div>
					<router-link class="logout" :to="{name: 'Index'}">退出</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: "Admin-Header",
    computed: mapState([
        'auth'
    ])
}
</script>

<style scoped>
.admin-header {
	height: 56px;
	display: flex;
    border-radius: 6px;
	align-items: center;
	justify-content: space-between;
	padding: 0 18px;
	box-sizing: border-box;
	/* 轻微渐变与玻璃感 */
	background-image:linear-gradient(-225deg,#473B7B 0%, #3584A7 51%, #473B7B 100%);
	backdrop-filter: blur(6px);
	box-shadow: 0 2px 10px rgba(6,24,44,0.16);
	border-bottom: 1px solid rgba(255,255,255,0.03);
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* 左侧占位 */
.header-left {
	flex: 1;
}

/* 右侧用户信息 */
.header-right {
	display: flex;
	align-items: center;
}

/* 用户区域 */
.user {
	display: flex;
	align-items: center;
	/* 增大头像与文字/按钮的间距 */
	gap: 14px;
}

/* 头像圆形 */
.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-weight: 700;
	font-size: 18px;
	/* 渐变背景与轻微阴影 */
	background-image: linear-gradient(135deg, #69EACB 0%, #6654F1 100%);
	box-shadow: 0 4px 12px rgba(102,84,241,0.12);
	flex-shrink: 0;
}

/* 用户文字部分：改为横向排列，垂直居中 */
.meta {
	display: flex;
	flex-direction: row; /* 改为同一排 */
	align-items: center; /* 垂直居中 */
	line-height: 1;
	padding-left: 4px;
	gap: 12px; /* greet 与 logout 之间的水平间距 */
}

/* 欢迎词与名字：去掉大 padding，使用右间距更精确 */
.greet {
	font-size: 13px;
	color: #E6F4EA;
	opacity: 0.95;
	padding-right: 0; /* 移除之前的 padding */
	margin: 0;
	white-space: nowrap;
}

.name {
	font-weight: 600;
	color: #FFFFFF;
	margin-left: 6px;
}

/* 退出按钮样式：去掉顶部 margin，保持更明显的按钮 */
.logout {
	display: inline-block;
	margin-top: 0;        /* 不再需要顶部间距 */
	font-size: 13px;        /* 更易点击的字体 */
	padding: 6px 12px;      /* 增大可点击区域 */
	border-radius: 16px;    /* 更圆润的按钮 */
	color: #67C23A;
	background: rgba(103,194,58,0.08);
	text-decoration: none;
	transition: all 160ms ease;
	box-shadow: none;
	font-weight: 600;       /* 更醒目 */
	cursor: pointer;
	margin-left: 0;       /* 使用 .meta 的 gap 控制间距 */
}
.logout:hover {
	background: rgba(103,194,58,0.16);
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(103,194,58,0.08);
}

/* 响应式处理：窄屏时隐藏用户名，仅显示头像 */
@media (max-width: 520px) {
	.meta .greet { display: none; }
	.meta .logout { display: none; }
	.admin-header { padding: 0 10px; }
}
</style>
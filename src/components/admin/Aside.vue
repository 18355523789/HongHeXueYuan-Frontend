<template>
	<div class="admin-aside">
		<div class="brand">
			<div class="brand-logo">鹤</div>
			<div class="brand-title">Kanghe</div>
		</div>

		<el-menu class="custom-menu" background-color="#263847" text-color="#BFCBD9" active-text-color="#67C23A" router unique-opened>
			<div class="aside-scroll">
				<el-menu-item index="0" :route="{name: 'Admin-Index'}">
					<template #title>
						<el-icon>
							<house/>
						</el-icon>
						首页
					</template>
				</el-menu-item>
				<el-sub-menu index="1">
					<template #title>
						<el-icon>
							<collection-tag/>
						</el-icon>
						分类
					</template>
					<el-menu-item index="1-1" :route="{name: 'Category-Manage'}">
						分类管理
					</el-menu-item>
				</el-sub-menu>
				<el-sub-menu index="2">
					<template #title>
						<el-icon>
							<reading/>
						</el-icon>
						课程
					</template>
					<el-menu-item index="2-1" :route="{name: 'Course-Manage'}">
						课程管理
					</el-menu-item>
					<el-menu-item index="2-2" :route="{name: 'Quiz-Manage'}">
						题库管理
					</el-menu-item>
				</el-sub-menu>
				<el-sub-menu index="3">
					<template #title>
						<el-icon>
							<collection/>
						</el-icon>
						班级
					</template>
					<el-menu-item index="3-1" :route="{name: 'Class-Manage'}">
						班级管理
					</el-menu-item>
				</el-sub-menu>
				<el-sub-menu index="4">
					<template #title>
						<el-icon>
							<picture-rounded/>
						</el-icon>
						宣傳圖
					</template>
					<el-menu-item index="4-1" :route="{name: 'Banner-Manage'}">
						宣傳圖管理
					</el-menu-item>
				</el-sub-menu>
				<el-sub-menu index="5">
					<template #title>
						<el-icon>
							<user/>
						</el-icon>
						用户
					</template>
					<el-menu-item index="5-1" :route="{name: 'User-Manage'}">
						用户管理
					</el-menu-item>
					<el-menu-item index="5-2" :route="{name: 'Role-Manage'}">
						角色管理
					</el-menu-item>
				</el-sub-menu>
			</div>
		</el-menu>
	</div>
</template>

<script>
import {mapState} from 'vuex'
import {House, CollectionTag, Reading, Collection, PictureRounded, User} from '@element-plus/icons-vue'

export default {
    name: "Admin-Aside",
    components: {
        House, CollectionTag, Reading, Collection, PictureRounded, User
    },
    computed: mapState([
        'auth',
    ])
}
</script>

<style scoped>
.admin-aside {
		width: 220px;
		display: flex;
		flex-direction: column;
		background-image:linear-gradient(-225deg,#473B7B 0%, #3584A7 51%, #30D2BE 100%);
		color: #BFCBD9;
		height: 100%;
		box-shadow: 2px 0 8px rgba(0,0,0,0.12);
        border-radius: 6px;
	}

	.brand {
		display: flex;
		align-items: center;
		padding: 18px 16px;
		border-bottom: 1px solid rgba(255,255,255,0.03);
	}

	.brand-logo {
		/* 可以通过调整下面这个变量来快速改变字体大小 */
		--brand-logo-font-size: 30px;

		width: 40px; /* 微调宽高以匹配更大的字体 */
		height: 40px;
		border-radius: 8px;
		/* 主要改动：使用指定的线性渐变背景 */
        background-image:linear-gradient(-225deg,#69EACB 0%, #EACCF8 48%, #6654F1 100%);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		margin-right: 10px;
		box-shadow: 0 2px 6px rgba(103,194,58,0.18);

		/* 主要改动：字体大小 */
		font-size: var(--brand-logo-font-size);
	}

	.brand-title {
		font-size: 17px;
		font-weight: 600;
		color: #E6F4EA;
		letter-spacing: 0.4px;
	}

	.custom-menu {
		border-right: none;
		background: transparent;
		/* 减小左右内边距，让菜单项能占满更多宽度 */
		padding: 8px;
		flex: 1;
		box-sizing: border-box;

		/* 新增：给菜单容器圆角并裁切子项，防止子项背景在容器圆角处溢出 */
		border-radius: 10px;
		overflow: hidden;
		/* 容器上也加一点低透明度渐变，和菜单项背景统一，避免角落视觉差异 */
		background-image: linear-gradient(180deg, rgba(105,234,203,0.02), rgba(102,84,241,0.02));
	}

	/* 让每个菜单项宽度填满容器（去掉左右 margin 和圆角，使用分隔线替代间隙） */
	.custom-menu ::v-deep .el-menu-item,
	.custom-menu ::v-deep .el-submenu__title {
		/* 保持渐变背景但取消圆角与外边距以防止露角 */
		background-image: linear-gradient(90deg, rgba(0, 248, 190, 0.06) 0%, rgba(234,204,248,0.06) 48%, rgba(0, 248, 190, 0.06) 100%);
		padding: 10px 16px;
		margin: 0; /* 关键：去掉上下 margin */
		border-radius: 0; /* 关键：去掉圆角 */
		color: #d0dee6;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transition: background 180ms ease, color 180ms ease, padding 180ms ease;
		position: relative;
		/* 用分隔线替代 margin 空隙，线条轻微以不显突兀 */
		border-bottom: 1px solid rgba(255,255,255,0.025);
	}

	/* 最后一项不需要下分隔线，避免双线或尾部显示问题 */
	.custom-menu ::v-deep .el-menu-item:last-child,
	.custom-menu ::v-deep .el-submenu__title:last-child {
		border-bottom: none;
	}

	/* 子菜单容器（展开的子菜单）去除多余内边距/外边距，保证子项与父容器对齐 */
	.custom-menu ::v-deep .el-submenu__title + .el-menu {
		padding: 0;
		margin: 0;
		background: transparent;
	}

	/* 子项沿用父级样式，但要在缩进上保留层级感 */
	.custom-menu ::v-deep .el-menu--inline .el-menu-item {
		padding-left: 28px;
		border-bottom: 1px solid rgba(255,255,255,0.02);
	}

	/* 如上，最后一项去掉底线 */
	.custom-menu ::v-deep .el-menu--inline .el-menu-item:last-child {
		border-bottom: none;
	}

	/* 选中态仍然保持高亮效果，但去掉额外圆角（与容器一致） */
	.custom-menu ::v-deep .is-active {
		background-image: linear-gradient(90deg, rgba(105,234,203,0.28) 0%, rgba(234,204,248,0.28) 48%, rgba(102,84,241,0.28) 100%);
		color: #ffffff !important;
		font-weight: 700;
		box-shadow: inset 4px 0 0 rgba(103,194,58,0.18), 0 6px 20px rgba(18, 52, 86, 0.06);
		padding-left: 24px;
		transition: all 200ms ease;
		border-radius: 0; /* 与容器一致，防止超出圆角处显示 */
	}

	/* 左侧高亮条位置微调以适配去掉圆角后的布局 */
	.custom-menu ::v-deep .is-active::before {
		content: "";
		position: absolute;
		left: 6px;
		top: 6px;
		bottom: 6px;
		width: 4px;
		border-radius: 2px;
		/* 改为更明亮的渐变并增强发光效果 */
		background: linear-gradient(180deg, #A8FF6E 0%, #36FFD1 100%);
		box-shadow: 0 0 18px rgba(54, 255, 209, 0.35), 0 0 6px rgba(168, 255, 110, 0.28);
		pointer-events: none;
	}

	/* 子菜单项适当缩进，保持层级关系视觉 */
	.custom-menu ::v-deep .el-menu--inline .el-submenu__title + .el-menu {
		padding-left: 8px;
	}
	.custom-menu ::v-deep .el-menu--inline .el-menu-item {
		padding-left: 28px;
	}

	.custom-menu ::v-deep .el-menu-item .el-icon,
	.custom-menu ::v-deep .el-submenu__title .el-icon {
		font-size: 18px; 
		color: #9fc7ff;
		margin-right: 8px;
		vertical-align: middle;
	}

	.aside-scroll {
		padding-bottom: 12px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.aside-scroll::-webkit-scrollbar {
		display: none;
	}
</style>
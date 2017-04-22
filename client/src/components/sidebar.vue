<template>
	<div id="sidebar">
		<ProfileInfo></ProfileInfo>
		<RoomList></RoomList>

		<!-- Link to Github -->
		<a class="github-link" target="_blank" href="https://github.com/JaakkoLipsanen/slacky">
			GitHub
		</a>
	</div>
</template>

<script>

import RoomList from './room-list.vue';
import ProfileInfo from './profile-info.vue';
export default {

	name: 'sidebar',
	components: {
		RoomList,
		ProfileInfo
	}
}
</script>

<style lang="scss">
#sidebar {
	background-color: rgb(58, 58, 72);
	height: 100%;

	.github-link {
		position: absolute;
		bottom: 10px;

		color: rgb(110, 110, 110);
		font-weight: 800;
		font-size: 16px;
		text-decoration: none;

		&:hover {
			color: rgb(145, 145, 145);
		}
	}
}

</style>

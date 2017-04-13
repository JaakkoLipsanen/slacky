<template>
	<div id="sidebar">
		<ProfileInfo></ProfileInfo>
		<RoomList></RoomList>
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
}

</style>

<template>
	<div class="profile-container">
		<img class="profile-pic" :src="getProfilePic($store.state.user)" />
		<h4 class="profile-username">{{ $store.state.user.username }} </h4>
	</div>
</template>

<script>
import profilePicCache from '../misc/profile-pic-cache';
export default {
	name: 'profile-info',

	methods: {
		getProfilePic: user => profilePicCache.get(user)
	}
}
</script>

<style lang="scss">

.profile-container {
	margin-top: 24px;
}

.profile-username {
	color: white;
	font-size: 24px;
	font-weight: 600;
	display: inline-block;

	vertical-align: middle;
	margin-left: 4px;
}

.profile-pic {
	width: 40px;
	display: inline-block;

	border-radius: 20%;
	background-color: white;
}

</style>
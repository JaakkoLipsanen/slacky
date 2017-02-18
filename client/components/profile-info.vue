<template>
	<div class="profile-container">
		<img class="profile-pic" :src="$store.state.auth.user.profilePic" />
		<h4 class="profile-username">{{ $store.state.auth.user.username }} </h4>
	</div>
</template>

<script>
export default {
	name: 'profile-info',
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
	width: 38px;
	display: inline-block;

	border-radius: 20%;
}

</style>
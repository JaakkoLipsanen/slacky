<template>
	<div id="topbar">
		<h2 class="room-title">#{{ $store.state.currentRoom.name.toLowerCase() }}</h2>
	</div>
</template>

<script>
export default {
	name: 'topbar',
}

</script>

<style lang="scss">
.room-title {
	font-size: 24px;
	font-weight: 600;

	color: rgb(72, 72, 72);
}

</style>

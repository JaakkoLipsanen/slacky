<template>
	<transition name="fade" mode="out-in">
		<component :is="$root.currentView"></component>
	</transition>
</template>

<script>
import App from './app.vue'
import Login from './login.vue'

export default {
	name: 'root',
	components: {
		App, 
		Login
	},
}
</script>

<style lang='scss' scoped>

.fade-enter-active, .fade-leave-active {
	transition: opacity 0.25s ease;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>

<template>
	<div class="popup-background">
		<div class="popup">
			<input ref="roomName" type='text' v-model="roomName" placeholder="Enter name for the room" style="display: block" autofocus>

			<div class="button-container">
				<button class="create-button" :disabled="!isInputValid" @click="$emit('success', { roomName: $refs.roomName.value })">Create</button>
				<button class="cancel-button" @click="$emit('cancel')">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'new-room-popup',
	data() {
		return {
			roomName: ""
		};
	},

	computed: {
		isInputValid() {
			const MinLength = 3;
			const MaxLength = 18;

			return this.roomName.length >= MinLength && this.roomName.length <= MaxLength;
		}
	}
}
</script>

<style lang="scss">
$accept-button-color: palegreen;
$cancel-button-color: desaturate($accept-button-color, 100);

input {
	width: 100%;
	box-shadow: none;
	outline: none;

	font-size: 20px;
	border: 2px solid rgb(192, 192, 172);
	border-radius: 4px;
	padding-left: 4px; /* padding-left causes the text inside the textarea to be padded */
}

button {
	width: calc(50% - 8px);
	height: 60px;
	margin: 3px;
	padding: 0px;
	box-sizing: border-box;

	position: relative;
	bottom: 0px;
	vertical-align: bottom;

	transition: background 0.2s, opacity 0.2s;
	outline: none;
	border: none;
	border-radius: 4px;
	font-size: 20px;

}

@mixin button-color($base-color) {
	background: $base-color;
	&:hover:not(:disabled) {
		background: darken($base-color, 6);
	}

	&:active:not(:disabled) {
		background: darken($base-color, 15);
	}

	&:disabled {
		opacity: 0.65;
		background: desaturate($base-color, 40);
	}
}

.create-button {
	@include button-color($accept-button-color);
}

.cancel-button {
	@include button-color($cancel-button-color);
}

.button-container {
	position: relative;
	width: 100%;
	top: 20px;
}

.popup {
	width: 450px;
	height: 180px;

	position: absolute;
	top: 50%;
	left: 50%;

	transform: translate(-50%, -50%);

	background-color: white;
	border-radius: 10px;

	padding: 40px;
	padding-top: 40px;
}

.popup-background {
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;

	background-color: rgba(72, 72,72, 0.5);
}
</style>

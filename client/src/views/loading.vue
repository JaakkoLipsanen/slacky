<template>
	<div id='loading-page'>
		<p>Waking up the server...</p>
	</div>
</template>

<script>

export default {
	name: 'login',
	mounted() {
		// display the "Waking up the server.." text only after the time represented
		// by ALLOWED_LATENCY, so that it is actually displayed only after
		// unexpectedly long waiting
		const ALLOWED_LATENCY = 300;
		setTimeout(() => {
			$("#loading-page p").css("opacity", 1);
		}, ALLOWED_LATENCY);
	}
}

</script>

<style lang='scss' scoped>
	$text-size: 24px;
	$text-color: rgb(190, 190, 190);

	#loading-page {
		p {
			opacity: 0;
			transition: opacity 0.3s;

			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			font-size: $text-size;
			color: $text-color;
		}
	}
</style>

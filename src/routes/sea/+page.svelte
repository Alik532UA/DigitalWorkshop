<script>
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Sea View</title>
</svelte:head>

<div class="sea-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="{base}/sea.webm" type="video/webm" />
	</video>
</div>

<style>
	.sea-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 10000;
		background-color: black;
		overflow: hidden;
		/* Повністю вимикаємо можливість клікнути по відео (навіть праву кнопку миші) */
		pointer-events: none;
	}

	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100vh;
		transform: translate(-50%, -50%);
		/* object-fit: cover гарантує, що відео ідеально заповнить весь екран, 
           обрізаючи зайве, але не спотворюючи пропорції */
		object-fit: cover;
	}
</style>

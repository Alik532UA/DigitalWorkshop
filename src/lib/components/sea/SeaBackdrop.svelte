<script lang="ts">
	import { base } from '$app/paths';
</script>

<!--
	Фонове відео сторінки моря.

	Винесене з `+page.svelte` окремим компонентом не заради краси: сторінка
	моря — найбільше відхилення від PROJECT-STRUCTURE-v8 § 7 у проєкті, і кожен
	рядок, доданий туди, робить її гіршою. Тут блок самодостатній — жодного
	пропа, жодного селектора від батька (`.background-video` мав рівно одне
	правило), тож переїзд нічого не змінює в розкладці: Svelte не додає обгортки,
	і `<video>` лишається прямим нащадком `.sea-container`.
-->
<!--
	Джерела впорядковані від найощаднішого до найсуміснішого, і КОЖНЕ несе
	точний `codecs=`. Без нього Safari бере перше джерело за контейнером — WebM
	він підтримує (VP8/VP9) — далі не декодує AV1 і НЕ відкочується: наступне
	джерело обирається до декодування, а не після збою. Тобто нижній `<source>`
	без цього рядка не рятує нікого.

	`poster` тут не прикраса. iOS у режимі енергозбереження блокує autoplay
	навіть для muted-відео, тож без нього замість моря лишається заливка
	`background-color` — рівний сірий на весь екран.
-->
<video autoplay loop muted playsinline poster="{base}/images/sea-poster.jpg" class="background-video">
	<source src="{base}/video/sea_4_av1.webm" type="video/webm; codecs=av01.0.08M.08" />
	<source src="{base}/video/sea_4_h264.mp4" type="video/mp4; codecs=avc1.640028" />
</video>

<style>
	.background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100dvh;
		transform: translate(-50%, -50%);
		object-fit: cover;
		object-position: right center; /* Прив'язуємо відео до правого краю для всіх екранів */
		background-color: #9aa0ac;
	}
</style>

<script setup>
const initImage = ref([
  "https://www.svgheart.com/wp-content/uploads/2020/06/mountains-nature-free-svg-file.png",
  "https://imageio.forbes.com/specials-images/imageserve/6064b148afc9b47d022718d1/Hennessey-Venom-F5/960x0.jpg?height=473&width=711&fit=bounds",
  "https://hips.hearstapps.com/hmg-prod/images/2019-honda-civic-sedan-1558453497.jpg",
]);
</script>
<template>
  <div class="min-h-screen w-screen flex flex-col items-center my-20">
    <h1>Home</h1>
    <multi-image-upload :initImage="initImage"/>
  </div>
</template>

<style scoped></style>

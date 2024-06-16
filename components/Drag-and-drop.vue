<script setup>

const props = defineProps({
  dragover: Boolean,
  dragleave: Boolean,
  mouseover: Boolean,
  mouseleave: Boolean,
  drop: Boolean,
  data: Object,
});

</script>
<template>
  <div
    class="d-flex row"
    @dragover="dragover"
    @dragleave="dragleave"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @drop="drop"
  >
    <slot v-bind="event"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  delay: number;
  timestamp: number;
}>();

const endTime = computed(() => props.timestamp + props.delay);
const timeRemaining = ref(endTime.value - Date.now());
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

const formattedTime = computed<string>(() => {
  const totalSeconds = Math.max(Math.floor(timeRemaining.value / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
});

const updateTimer = (): void => {
  const now = Date.now();
  const remaining = endTime.value - now;

  if (remaining > 0) {
    timeRemaining.value = remaining;
  } else {
    timeRemaining.value = 0;

    if (timerInterval.value !== null) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }
};

onMounted(() => {
  updateTimer();
  timerInterval.value = setInterval(updateTimer, 1000);
});

watch(
  () => [props.delay, props.timestamp],
  () => {
    timeRemaining.value = endTime.value - Date.now();

    if (timerInterval.value !== null) {
      clearInterval(timerInterval.value);
      timerInterval.value = setInterval(updateTimer, 1000);
    }
  },
);
</script>

<template>
  <div class="countdown-timer">
    <span>{{ formattedTime }}</span>
  </div>
</template>

<style scoped>
.countdown-timer {
  font-weight: bold;
}
</style>

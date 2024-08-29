<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  delay: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

// Вычисляем оставшееся время до выполнения задачи
const endTime = computed(() => props.timestamp + props.delay);

// Таймер обратного отсчета
const timeRemaining = ref(endTime.value - Date.now());

const formattedTime = computed(() => {
  const totalSeconds = Math.max(Math.floor(timeRemaining.value / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
});

const updateTimer = () => {
  const now = Date.now();
  const remaining = endTime.value - now;

  if (remaining > 0) {
    timeRemaining.value = remaining;
  } else {
    timeRemaining.value = 0;
    clearInterval(timerInterval.value);
  }
};

const timerInterval = ref(null);

onMounted(() => {
  updateTimer(); // Обновляем таймер сразу при монтировании
  timerInterval.value = setInterval(updateTimer, 1000);
});

watch(() => [props.delay, props.timestamp], () => {
  endTime.value = props.timestamp + props.delay;
  timeRemaining.value = endTime.value - Date.now();
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = setInterval(updateTimer, 1000);
  }
});
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

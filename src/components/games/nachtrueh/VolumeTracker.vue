<template>
  <div class="thermometer">
    <div
      v-for="(active, index) in segments"
      :key="index"
      class="segment"
      :class="{ active }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const segments = ref(Array(10).fill(false));
let intervalId;
let audioContext;
let analyser;
let dataArray;

// Make the meter more sensitive
const thresholds = [
  0.02,
  0.03,
  0.045,
  0.06,
  0.08,
  0.1,
  0.13,
  0.17,
  0.22,
  0.3,
];

// volume normalization and measurement
function getVolume() {
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = (dataArray[i] - 128) / 128;
    sum += val * val;
  }
  // RMS
  return Math.sqrt(sum / dataArray.length);
}

async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    intervalId = setInterval(() => {
      const volume = getVolume();
      segments.value = thresholds.map(thresh => volume >= thresh);
    }, 500);
  } catch (err) {
    console.error('Microphone access failed:', err);
  }
}

onMounted(() => {
  startMic();
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  if (audioContext) audioContext.close();
});
</script>

<style scoped>
.thermometer {
  width: 50px;
  height: 200px;
  border: 2px solid black;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
}

.segment {
  flex: 1;
  background-color: lightgray;
  transition: background-color 0.3s;
}

.segment.active {
  background-color: red;
}
</style>
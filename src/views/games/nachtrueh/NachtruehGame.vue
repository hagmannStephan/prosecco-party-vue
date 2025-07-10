<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const volume = ref(0)
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let dataArray: Uint8Array
let animationFrameId: number
let mediaStream: MediaStream | null = null

const startMicrophone = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(mediaStream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    source.connect(analyser)
    updateVolume()
  } catch (error) {
    console.error('Error accessing microphone:', error)
  }
}

const updateVolume = () => {
  if (!analyser) return
  analyser.getByteTimeDomainData(dataArray)
  
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128
    sum += normalized * normalized
  }
  const rms = Math.sqrt(sum / dataArray.length)
  volume.value = Math.round(rms * 100)

  animationFrameId = requestAnimationFrame(updateVolume)
}

onMounted(() => {
  startMicrophone()
})

onUnmounted(() => {
  if (audioContext) {
    audioContext.close()
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
  }
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div>
    <p>Volume: {{ volume }}</p>
  </div>
</template>

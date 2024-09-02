<template>
  <!-- Uygulamanın kök bileşeni -->
  <div id="app">
    <!-- Task bileşenini tasks verisi ile bağlama -->
    <!-- v-bind:tasks="tasks" ile Task bileşenine 'tasks' adlı veri props olarak aktarılıyor -->
    <app-task ></app-task>
  </div>
</template>

<script>
// Task bileşenini içe aktarma
import AppTask from './components/App-Task.vue';


export default {
  // Bileşenin adı
  name: "App",
  
  // Uygulamada kullanılacak bileşenleri tanımlama
  components: {
    // Task bileşenini kullanıma sunma
    AppTask,
  },
  created(){
    this.$store.dispatch('loadTasks');
  }
 };
</script>

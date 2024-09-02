<template>
  <div class="container">
     <!-- Başlık -->
    <div class="task">
      <div class="title">
        <h1>To Do List</h1><!-- Uygulama başlığı -->
      </div>
      <!-- Yeni görev ekleme formu -->
      <div class="form row">
        <div class="col-8">
           <!-- Görev metnini girmek için giriş alanı -->
          <input 
            type="text" 
            placeholder="New Task" 
            v-model="newTask" 
            class="form-control" 
            @keyup.enter="addTask" 
          />
        </div>
        <div class="col-4 d-flex">
           <!-- Görev ekleme butonu -->
          <button @click="addTask" class="me-5 p-2">
            <i class="fas fa-plus"></i>
          </button>
          <!-- Ses tanıma başlatma/durdurma butonu -->
          <button @click="toggleListening" :class="['btn', listening ? 'listening' : '']">
            <i :class="listening ? 'fas fa-microphone' : 'fas fa-microphone-slash'"></i>
          </button>
        </div>
      </div>
       <!-- Görevlerin listesi -->
      <div class="taskItems m-1">
        <ul>
          <!-- Tamamlanmamış görevleri listeleme -->
          <task-item 
            v-for="(task, index) in tasks.filter(task => !task.completed)" 
            :key="task.id" 
            :task="task" 
            @complete="completeTask(task.id)" 
            @remove="removeTask(task.id)" 
            @update-task="updateTask($event, index)">
          </task-item>
        </ul>
        <div v-if="tasks.filter(task => task.completed).length > 0">
          <h3 class="m-4">Completed Tasks</h3>
          <ul>
            <!-- Tamamlanmış görevleri listeleme -->
            <task-item 
              v-for="(task, index) in tasks.filter(task => task.completed)" 
              :key="task.id" 
              :task="task" 
              @complete="completeTask(task.id)" 
              @remove="removeTask(task.id)" 
              @update-task="updateTask($event, index)">
            </task-item>
          </ul>
        </div>
      </div>
      <!-- Tamamlanmış görevleri ve tüm görevleri temizleme butonları -->
      <div class="clearBtns m-1">
        <button @click="clearCompleted">Clear completed</button>
        <button @click="clearAll">Clear all</button>
      </div>
        <!-- Tamamlanmamış görevlerin sayısını gösterir -->
      <div class="pendingTasks mt-4 ms-1">
        <span>Uncompleted Tasks: {{ incomplete }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from './Task-item.vue'; // TaskItem bileşenini içe aktar

export default {
  name: 'AppTask', // Bu bileşenin adı 'AppTask'
  components: {
    TaskItem // Bileşenler kısmında TaskItem bileşenini tanımla
  },
  computed: {
    // Vuex store'dan görevlerin listesini al
    tasks() {
      return this.$store.getters.tasks;
    },
    // Vuex store'dan yeni görevin metnini al/set et
    newTask: {
      get() {
        return this.$store.getters.newTask;
      },
      set(value) {
        this.$store.commit('SET_NEW_TASK', value);
      }
    },
    // Vuex store'dan tamamlanmamış görevlerin sayısını al
    incomplete() {
      return this.$store.getters.incomplete;
    },
    // Vuex store'dan ses tanıma durumunu al
    listening() {
      return this.$store.getters.listening;
    },
    // Tamamlanmamış görevleri filtrele
    incompleteTasks() {
      return this.tasks.filter(task => !task.completed);
    },
    // Tamamlanmış görevleri filtrele
    completedTasks() {
      return this.tasks.filter(task => task.completed);
    }
  },
  methods: {
    // Yeni görev eklemek için Vuex eylemini çağır
    addTask() {
      this.$store.dispatch('addTask');
    },
    // Görevi silmek için Vuex eylemini çağır
    removeTask(taskId) {
      this.$store.dispatch('removeTask', taskId);
    },
    // Görev tamamlanma durumunu değiştirmek için Vuex eylemini çağır
    completeTask(taskId) {
      this.$store.dispatch('toggleTaskCompletion', taskId);
    },
    // Tamamlanmış tüm görevleri temizlemek için Vuex eylemini çağır
    clearCompleted() {
      this.$store.dispatch('clearCompleted');
    },
    // Tüm görevleri temizlemek için Vuex eylemini çağır
    clearAll() {
      this.$store.dispatch('clearAll');
    },
    // Ses tanımayı başlat veya durdur
    toggleListening() {
      const { recognition, listening } = this.$store.getters;
      if (listening) {
        recognition.stop();
        this.$store.commit('SET_LISTENING', false);
      } else {
        recognition.start();
        this.$store.commit('SET_LISTENING', true);
      }
    },
    // Güncellenmiş görevi Vuex store'a kaydet
    updateTask(updatedTask, index) {
      this.$store.commit('UPDATE_TASK', { updatedTask, index });
      this.$store.dispatch('saveTasks');
    },
    // Ses tanıma sonuçlarını işleme
    handleSpeechResult(event) {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      console.log('Tanıma sonucu: ', transcript);

      if (transcript.includes('ekle')) {
        this.addTaskFromSpeech(transcript);
      } else if (transcript.includes('tümünü sil')) {
        this.confirmAndClearAll();
      } else if (transcript.includes('tamamlananları sil')) {
        this.clearCompleted();
      } else if (transcript.includes('tamamla')) {
        this.completeTaskFromSpeech(transcript);
      } else if (transcript.includes('sil')) {
        this.removeTaskFromSpeech(transcript);
      }
    },
    // Sesle eklenmiş görevi işle
    addTaskFromSpeech(transcript) {
      const taskDescription = transcript.replace(/(ekle)/, '').trim();
      if (taskDescription) {
        this.$store.commit('SET_NEW_TASK', taskDescription);
        this.addTask();
      } else {
        this.showAlert('Lütfen görev tanımını söyleyin.');
      }
    },
    // Sesle tamamlanmış görevi işle
    // Sesle tamamlanmış görevi işle
    completeTaskFromSpeech(transcript) {
    // Önce doğrudan sayı olarak işlemeye çalışın
    let taskId = this.extractTaskId(transcript);

    // Eğer taskId NaN (Geçersiz) ise string ifadeyi sayıya çevirin
    if (isNaN(taskId)) {
      taskId = this.convertStringToNumber(transcript);
    }

    // taskId hala geçerli bir sayıysa işleme devam edin
    if (taskId && !isNaN(taskId)) {
      const taskToComplete = this.tasks.find(task => task.id === taskId);
      if (taskToComplete) {
        this.completeTask(taskToComplete.id);
      } else {
        this.showAlert(`ID'si ${taskId} olan görev bulunamadı.`);
      }
    } else {
      this.showAlert('Geçerli bir görev ID\'si belirtilmedi.');
    }
  },

  // String sayıyı numaraya çeviren fonksiyon
  convertStringToNumber(transcript) {
    const numberWords = {
      'bir': 1,
      'iki': 2,
      'üç': 3,
      'dört': 4,
      'beş': 5,
      'altı': 6,
      'yedi': 7,
      'sekiz': 8,
      'dokuz': 9,
      'on': 10,
    };

    const words = transcript.split(' '); // Transcript'i kelimelere ayırın

    for (let word of words) {
      if (numberWords[word] !== undefined) {
        return numberWords[word];
      }
    }

    return null; // Geçerli bir sayı bulunamazsa null döndürün
  },

  // Tanımadan gelen metinden taskId çıkartma
  extractTaskId(transcript) {
    const regex = /\d+/; // Metin içindeki sayıyı bulmak için regex
    const match = transcript.match(regex);
    return match ? parseInt(match[0], 10) : NaN;
  },
    // Sesle silinecek görevi işle
    removeTaskFromSpeech(transcript) {
      const taskId = this.extractTaskId(transcript);
      if (taskId) {
        const taskToDelete = this.tasks.find(task => task.id === taskId);
        if (taskToDelete) {
          this.removeTask(taskToDelete.id);
        } else {
          this.showAlert(`ID'si ${taskId} olan görev bulunamadı.`);
        }
      }
    },
    
    // Kullanıcıdan tüm görevleri silmek için onay al
    confirmAndClearAll() {
      if (confirm('Tüm görevleri silmek istediğinizden emin misiniz?')) {
        this.clearAll();
      }
    },
    // Uyarı mesajı göster
    showAlert(message) {
      alert(message);
    }
  },
  mounted() {
    // Tarayıcıda ses tanıma desteği var mı kontrol et
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR'; // Türkçe dil ayarı
      recognition.continuous = true; // Kesintisiz dinleme
      recognition.interimResults = false; // Ara sonuçları gösterme

      recognition.onresult = this.handleSpeechResult; // Sonuçları işleme fonksiyonunu ata
      recognition.onstart = () => this.$store.commit('SET_LISTENING', true); // Dinlemeye başlandığında durum güncelle
      recognition.onend = () => this.$store.commit('SET_LISTENING', false); // Dinleme bittiğinde durum güncelle

      this.$store.commit('SET_RECOGNITION', recognition); // Ses tanıma nesnesini Vuex store'a kaydet
    } else {
      this.showAlert('Tarayıcınız konuşma tanıma desteği sunmuyor.'); // Tarayıcı desteklemiyorsa uyarı göster
    }
  }
};
</script>

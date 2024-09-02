import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // Vuex store'umuzun başlangıç durumunu (state) tanımlıyoruz.
  state: {
    tasks: [], // Görevlerin saklanacağı dizi
    newTask: '', // Yeni eklenen görev başlığını tutan string
    listening: false, // Konuşma tanıma (speech recognition) durumu
    recognition: null // SpeechRecognition nesnesi
  },
  // Store'daki durumu (state) güncellemek için kullanılan fonksiyonlar
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks; // Görevleri state'teki tasks dizisine atar
    },
    SET_NEW_TASK(state, task) {
      state.newTask = task; // Yeni görev başlığını state'teki newTask değişkenine atar
    },
    SET_LISTENING(state, listening) {
      state.listening = listening; // Dinleme durumunu (listening) günceller
    },
    SET_RECOGNITION(state, recognition) {
      state.recognition = recognition; // SpeechRecognition nesnesini state'e atar
    },
    ADD_TASK(state, task) {
      state.tasks.push(task); // Yeni bir görevi tasks dizisine ekler
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId); // Belirtilen ID'ye sahip görevi listeden çıkarır
    },
    UPDATE_TASK(state, { updatedTask, index }) {
      state.tasks.splice(index, 1, updatedTask); // Belirli bir görevi günceller
    },
    CLEAR_COMPLETED(state) {
      state.tasks = state.tasks.filter(task => !task.completed); // Tamamlanmış görevleri listeden temizler
    },
    CLEAR_ALL(state) {
      state.tasks = []; // Tüm görevleri listeden temizler
    },
    TOGGLE_TASK_COMPLETION(state, taskId) {
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed; // Belirtilen görevin tamamlanma durumunu değiştirir
      }
    }
  },
  // Asenkron işlemler ve birden fazla mutation'ı tetikleyebilecek işlemler için kullanılan fonksiyonlar
  actions: {
    // Görevin kategorisini belirleyen fonksiyon
    async determineCategory(_, taskTitle) {
      const lowerCaseTitle = taskTitle.toLowerCase(); // Görev başlığını küçük harfe çevirir
      const keywords = {
        // Kategorilere göre anahtar kelimeler
        iş: [
          "toplantı", "rapor", "müşteri", "e-posta", "proje", "iş", "toplantılar", 
          "görüşmeler", "sunum", "plan", "strateji", "bütçe", "işbirliği", 
          "organizasyon", "network", "raporlar", "pazarlama", "finans", "yönetim",
          "stratejik", "planlama", "takım", "departman", "seminer", "şirket"
        ],
        alışveriş: [
          "sipariş", "market", "al", "alışveriş", "marketler", "ürünler", 
          "alışverişler", "ödeme", "indirim", "fırsat", "kampanya", "sepet", 
          "ürün", "ödeme", "fatura", "alışveriş merkezi", "ürün iadesi", "indirim kuponu", 
          "alışveriş listesi", "alışveriş fişi", "e-ticaret", "elektronik alışveriş"
        ],
        kişisel: [
          "egzersiz", "spor", "kitap", "arkadaş", "meditasyon", "yoga", "yüzme", 
          "tenis", "kahve", "mangal", "kişisel", "bakım", "sağlık", "dinlenme", 
          "hobiler", "tatil", "gezi", "müzik", "film", "sinema", "yemek", "güzellik", 
          "kişisel gelişim", "moda", "stil", "kıyafet", "sanat", "yaratıcılık", "sosyal", 
          "aile", "evcil hayvan", "sosyalleşme", "yemek tarifleri","parfüm","park","kafe"
        ],
        eğitim: [
          "ders", "ödev", "sınav", "kurs", "not", "makale", "öğrenme", 
          "eğitim", "eğitimler", "tez", "okul", "araştırma", "sunum", "akademik", 
          "öğretim", "eğitim materyali", "sınıf", "okuma", "yazma", "çalışma", 
          "kütüphane", "bilim", "teknoloji", "kitap okuma", "çalışma programı", 
          "öğrenci", "akademisyen", "mezuniyet", "staj","tez"
        ]
      };

      // Görev başlığındaki kelimelere göre kategoriyi belirler
      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerCaseTitle.includes(word))) {
          return category;
        }
      }
      return "diğer"; // Hiçbir kategoriye uymuyorsa "diğer" kategorisini döndürür
    },
    // Görevleri localStorage'dan yükleyen fonksiyon
    loadTasks({ commit }) {
      const savedTasks = localStorage.getItem('tasks');
      const tasks = savedTasks ? JSON.parse(savedTasks) : []; // Görevleri JSON formatından çözümler
      commit('SET_TASKS', tasks); // Görevleri state'e atar
    },
    // Görevleri localStorage'a kaydeden fonksiyon
    saveTasks({ state }) {
      localStorage.setItem('tasks', JSON.stringify(state.tasks)); // Görevleri JSON formatında kaydeder
    },
    // Yeni bir görev ekleyen fonksiyon
    async addTask({ commit, dispatch, state }) {
      if (state.newTask) {
        const normalizedNewTask = state.newTask.toLowerCase(); // Görev başlığını küçük harfe çevirir
        const taskExists = state.tasks.some(task => task.title.toLowerCase() === normalizedNewTask);

        if (taskExists) {
          alert('Bu görev zaten mevcut. Lütfen farklı bir görev ekleyin.'); // Eğer görev zaten varsa uyarı verir
        } else {
          // Yeni görev ID'si belirlenir
          const newId = state.tasks.length ? Math.max(...state.tasks.map(task => task.id)) + 1 : 1;
          // Görevin kategorisi belirlenir
          const category = await this.dispatch('determineCategory', state.newTask);

          const newTask = {
            id: newId,
            title: state.newTask,
            category: category,
            completed: false // Görev tamamlanmamış olarak eklenir
          };

          commit('ADD_TASK', newTask); // Yeni görevi ekler
          dispatch('saveTasks'); // Görevleri kaydeder
        }

        commit('SET_NEW_TASK', ''); // Yeni görev giriş alanını temizler
      }
    },
    // Bir görevi silen fonksiyon
    removeTask({ commit, dispatch }, taskId) {
      commit('REMOVE_TASK', taskId); // Belirtilen ID'ye sahip görevi siler
      dispatch('saveTasks'); // Görevleri kaydeder
    },
    // Görevin tamamlanma durumunu değiştiren fonksiyon
    toggleTaskCompletion({ commit, dispatch }, taskId) {
      commit('TOGGLE_TASK_COMPLETION', taskId); // Tamamlanma durumunu değiştirir
      dispatch('saveTasks'); // Görevleri kaydeder
    },
    // Tamamlanmış görevleri temizleyen fonksiyon
    clearCompleted({ commit, dispatch }) {
      commit('CLEAR_COMPLETED'); // Tamamlanmış görevleri temizler
      dispatch('saveTasks'); // Görevleri kaydeder
    },
    // Tüm görevleri temizleyen fonksiyon
    clearAll({ commit, dispatch }) {
      commit('CLEAR_ALL'); // Tüm görevleri temizler
      dispatch('saveTasks'); // Görevleri kaydeder
    },
    toggleCompletion({ commit,dispatch }, taskId) {
      commit('TOGGLE_TASK_COMPLETION', taskId); // Belirli bir görevin tamamlanma durumunu değiştirir
      dispatch('saveTasks'); // Görevleri kaydeder
    },
  },
  // State'ten türetilmiş verileri döndüren fonksiyonlar
  getters: {
    tasks: state => state.tasks, // Tüm görevleri döndürür
    newTask: state => state.newTask, // Yeni görev başlığını döndürür
    incomplete: state => state.tasks.filter(task => !task.completed).length, // Tamamlanmamış görev sayısını döndürür
    recognition: state => state.recognition, // SpeechRecognition nesnesini döndürür
    listening: state => state.listening // Dinleme durumunu döndürür
  }
});

<template>
  <!-- Görev öğesinin görsel bileşeni -->
  <li class="list-group-item d-flex align-items-center">
    <!-- Görev tamamlanma durumunu değiştirmek için buton -->
    <button @click="toggleCompletion" :class="className">
      <i :class="iconClass"></i>
    </button>
    <div class="row w-100">
      <div class="col-auto">
        <!-- Görev ID'si -->
        <span :class="className">{{ task.id }}</span>
      </div>
      <div class="col">
        <!-- Görev başlığını düzenlenebilir şekilde göster -->
        <span 
          contenteditable="true" 
          @input="updateTitle" 
          @blur="saveTitle"
          :class="className">
          {{ editableTitle }}
        </span>
      </div>
      <div class="col">
        <!-- Görev kategorisi -->
        <span :class="className">({{ task.category }})</span>
      </div>
    </div>
    <!-- Görevi silmek için buton -->
    <button @click="$emit('remove')">
      <i class="far fa-trash-alt"></i>
    </button>
  </li>
</template>

<script>
import { gsap } from 'gsap'; // GSAP kütüphanesini içe aktar

export default {
  name: 'TaskItem', // Bileşenin adı 'TaskItem'
  props: ['task'], // Bu bileşen, 'task' adlı bir prop alır
  data() {
    return {
      // Görev başlığını düzenlenebilir bir alanda sakla
      editableTitle: this.task.title,
    };
  },
  computed: {
    // Görev tamamlanmışsa 'toggle-completed' sınıfını ekle
    className() {
      return this.task.completed ? 'toggle toggle-completed' : 'toggle';
    },
    // Görev tamamlanmışsa onay işareti simgesi, değilse daire simgesi
    iconClass() {
      return this.task.completed ? 'far fa-check-circle' : 'far fa-circle';
    }
  },
  methods: {
    // Görev tamamlanma durumunu değiştirmek için Vuex eylemini çağır
    toggleCompletion() {
      this.$store.dispatch('toggleCompletion', this.task.id);
    },
    // Başlık güncellenirken 'editableTitle' değişkenini güncelle
    updateTitle(event) {
      this.editableTitle = event.target.innerText;
    },
    // Başlık güncellendikten sonra değişiklikleri üst bileşene ilet
    saveTitle() {
      this.$emit('update-task', { ...this.task, title: this.editableTitle });
    },
    // Görev öğesi ekrana gelirken animasyon ekle
    animateIn() {
      gsap.from(this.$el, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        ease: "power1.out"
      });
    },
  },
  mounted() {
    // Bileşen yüklendiğinde animasyonu başlat
    this.animateIn();
  },
  updated() {
    // Görev tamamlandığında bileşeni opaklık değişikliğiyle animasyonla güncelle
    if (this.task.completed) {
      gsap.to(this.$el, {
        duration: 0.5,
        opacity: 0.5,
        ease: "power1.inOut"
      });
    }
  }
}
</script>

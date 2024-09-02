// Vue CLI projesi için yapılandırma fonksiyonunu dahil ediyoruz.
const { defineConfig } = require('@vue/cli-service');

// Yapılandırma ayarlarını dışa aktarıyoruz.
module.exports = defineConfig({
  // Projedeki bağımlılıkları derleme ayarı. Bazı npm paketlerinin
  // eski JavaScript sürümleriyle uyumlu olması için transpilasyon (kod dönüştürme) yapılır.
  transpileDependencies: true,

  // PWA (Progressive Web App) yapılandırması.
  pwa: {
    // Uygulamanın adı. PWA kurulumunda ve açılış ekranında bu isim gösterilir.
    name: 'To Do List',

    // Tarayıcı üst çubuğunun rengi. Chrome, Firefox gibi tarayıcılarda
    // kullanıcı arayüzünün rengi bu değerle değiştirilir.
    themeColor: '#4DBA87',

    // Microsoft Windows cihazlarındaki Başlat menüsü ve görev çubuğundaki kutucukların rengi.
    msTileColor: '#000000',

    // Uygulamanın manifest dosyasıyla ilgili ek seçenekler.
    manifestOptions: {
      // Uygulama açılırken gösterilen arka plan rengini belirtir.
      background_color: '#ffffff',
    },

    // Uygulama simgelerinin yollarını tanımlar.
    iconPaths: {
      // Favicon: Tarayıcı sekmelerinde, yer imlerinde ve diğer kısımlarda kullanılan 32x32 piksel ikon.
      favicon32: 'img/icons/favicon-32x32.png',
      // 16x16 piksel boyutunda olan daha küçük favicon.
      favicon16: 'img/icons/favicon-16x16.png',
      // Apple cihazlarında ana ekrana eklenebilen uygulama için kullanılan ikon.
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      // Safari tarayıcısında sabitlenmiş sekme için maske ikonu (genellikle tek renkli SVG).
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      // Microsoft uygulama kutucuklarında kullanılan ikon.
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  }
});


// перебрать массив и создать галлерею превью
// назначить слушателя событий, при клике открывается модальное окно с большими картинками

const galleryItems = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];


// создает разметку галереи

const markup = function (galleryItems) {
  return galleryItems.map(({ preview, original, description }, index) => {
    return `
    <li class="gallery__item">
      <a class="gallery__link" href=${original}>
        <img class="gallery__image" src="${preview}"
          data-source="${original}" data-index="${index}" alt="${description}" />
      </a>
    </li>
    `;
  }).join('');
};

const galleryListRefs = document.querySelector('.js-gallery');
galleryListRefs.insertAdjacentHTML('beforeend', markup(galleryItems));

// при нажатии на картинку срабатывает слушатель событий на списке
// отменяет дефолтное поведение ссылки. Запускает колбек, который
// 1. проверяет куда нажали
// 2. передает из атрибута ссылку на большую картинку в lightbox__img
// 3. Назначет lightbox -у класс .open

const lightboxRefs = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox__image');

// функция открытия модального окна
const lightboxOpenClick = (event) => {
  event.preventDefault();

  const target = event.target;
  const targetDataset = target.dataset.source;

    if (target.nodeName !== 'IMG') return;
    
    lightboxImg.removeAttribute('src'); // очистка src от предыдущего пути при повторном открытие модального окна
    lightboxImg.setAttribute('src', `${targetDataset}`);
    lightboxImg.setAttribute('data-index', `${target.dataset.index}`);

  lightboxRefs.classList.add('is-open');
  
  window.addEventListener("keydown", closeLightboxClicker);
  lightboxRefs.addEventListener('click', closeLightboxClicker);
};

galleryListRefs.addEventListener('click', lightboxOpenClick);

// функция закрытия модального окна
const closeLightboxClicker = (event) => {
  const target = event.target;

 // функция для проверки класса области event.target по которой закрывает lightbox
  const removeIsOpenClass = () => {
    const hasButtonClass = target.classList.contains('lightbox__button');
    const hasOverlayClass = target.classList.contains('lightbox__overlay');

    if (hasButtonClass || hasOverlayClass) {
      lightboxRefs.classList.remove('is-open');
    };
  };
  
  removeIsOpenClass();

  let indexImgLightbox = parseInt(lightboxImg.dataset.index);
  
  // функция для перелистывания модалки по кнопкам prev и next
  const setIndexAttrImgLightbox = () => {
    if (!galleryItems[indexImgLightbox]) return;

    lightboxImg.setAttribute('src', `${galleryItems[indexImgLightbox].original}`);
    lightboxImg.setAttribute('data-index', `${indexImgLightbox}`);
  };

  if (target.dataset.action === "prev-img") {

    indexImgLightbox -= 1;

    setIndexAttrImgLightbox();
  };

  if (target.dataset.action === "next-img") {
   
    indexImgLightbox += 1;

    setIndexAttrImgLightbox();
  };

  // закрывает по Esc
  const closeLightboxByEsc = () => {
    const { code } = event;

    if (code === "Escape") {
      lightboxRefs.classList.remove('is-open');
    };
  };

  closeLightboxByEsc();

  // убирает слушатели для закрытия модального окна
  const removeEventListnersLightbox = () => {
    const hasOpenClass = lightboxRefs.classList.contains('is-open');
    if (!hasOpenClass) {
      window.removeEventListener("keydown", closeLightboxClicker);
      lightboxRefs.removeEventListener('click', closeLightboxClicker);
    };
  }

  removeEventListnersLightbox();
};





  // Разметка галереи

  // <li class="gallery__item">
  //   <a class="gallery__link" href="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg">
  //     <img class="gallery__image" src="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546__340.jpg"
  //       data-source="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg" alt="Tulips" />
  //   </a>
  // </li>


import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Course, Comment, KeyWords } from '../api/index'


const tagList = document.querySelector('.index-tag-list')
const commentList = document.querySelector('.swiper-wrapper')
const coursesList = document.querySelector('.new-courses')
// TODO
// 1. 點擊關鍵字跳轉搜尋 v
// 2. 學員推課獲取評論 v
// 3. 最新課程
// 4. 申請新課
// console.log(await Comment.getBest()); => 獲取評分高於4的評論
// console.log(await Course.getNewThree()); => 獲取最新的三個課程


async function init () {
  const keywords = await KeyWords.get()
  const comments = await Comment.getBest()
  const courses = await Course.getNewThree()
  
  renderKeyWords(keywords)
  renderComments(comments)
  renderCourses(courses)
}
init()

function renderKeyWords(keywords) {
  tagList.innerHTML = keywords.map(word => ` <li class="index-tag text-nowrap">${word.keyWord}</li>`).join('')

}
// 學員推課
function renderComments(comments) {
  const colors = ['blue', 'primary' ,'orange']
  if (!comments.length) {
    commentList.classList.add('d-none')
    commentList.previousElementSibling.classList.remove('d-none')
    return
  }
  commentList.innerHTML = comments.map((comment, index) => {
    const {nickName, email} = comment.user
    return `<li data-id="${comment.courseId}" class="swiper-slide p-5 bg-${colors[(index + 1) % 3]} rounded-4 d-flex flex-column cur-point card-hover">
    <h4 class="fs-5 mb-4">${comment.course.title}</h4>
    <div class="fs-4 mb-4 flex-grow-1">
      ${comment.content}
    </div>
    <div class="d-flex align-items-center gap-3">
      <img src="${comment.avatarUrl}" alt="" class="recommend-avatar">
      <p class="fs-6 mb-0">${comment.showName ? nickName : `${email.split('@')[0][0]}***${email.split('@')[0][email.split('@')[0].length -1]}`}</p>
    </div>
  </li>`
  }).join('')

  const li = commentList.querySelectorAll('.swiper-slide')
  li.forEach(comment => {
    comment.addEventListener('click', () => {
      location.href = `coursepages.html?id=${comment.dataset.id}&sort=timer`
    })
  })
}
// 最新課程
function renderCourses(courses) {
  coursesList.innerHTML = courses.map(course => `<li  class="d-flex flex-column">
  <a class="card border-0 latest-courses-hover h-100 rounded-4" href="./coursepages.html?id=${course.id}&sort=timer">
    <div class="pic">
      <img
        src="${course.cover}"
        alt="cover of the course"
        class="card-pic"
      />
    </div>
    <div
      class="badge d-flex justify-content-between align-items-center position-absolute"
    >
      <span
        class="brand bg-secondary small text-white rounded-1 py-1 px-3"
        >${course.platform}</span
      >
    </div>
    <div class="card-body">
      <h3 class="title text-secondary fs-6 fw-bold">
      ${course.title}
      </h3>
    </div>
    <div class="card-footer">
      <div class="tags mb-2 mt-auto">
      ${course.tags.map((tag, index) => `<span class="fs-8 ${index === course.tags.length -1 ? '' : 'me-2'}">#${tag}</span>`).join('')}
      </div>
      <div class="stars d-flex">
        <div class="stars-icon text-primary me-2">
          <span class="material-symbols-outlined ${course.avgScore >= 1 ? '' : 'outline-icon'}">star</span>
          <span class="material-symbols-outlined ${course.avgScore >= 1 ? '' : 'outline-icon'}">star</span>
          <span class="material-symbols-outlined ${course.avgScore >= 1 ? '' : 'outline-icon'}">star</span>
          <span class="material-symbols-outlined ${course.avgScore >= 1 ? '' : 'outline-icon'}">star</span>
          <span class="material-symbols-outlined ${course.avgScore >= 1 ? '' : 'outline-icon'}"
            >star</span
          >
        </div>
        <span class="fs-8 text-gray-400">(${course.comments.length})</span>
      </div>
    </div>
  </a>
</li>`).join('')
}

// 點擊關鍵字搜尋
tagList.addEventListener('click', (e) => {
  if(e.target.nodeName !== 'LI') return
  location.href = `course.html?q=${e.target.textContent}`
})

// swiper 配置
const swiper = new Swiper('.other-courses', {
  // 配置你使用的 swiper class 名稱
  slidesPerView: 'auto', // 一頁幾張
  spaceBetween: 16, // 每一頁的間距
  centeredSlides: false,
  loop: true, // 循環播放
  modules: [Navigation, Autoplay, Pagination],
  autoplay: {
    // 自動撥放配置
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-next', // 控制上一頁箭頭用哪個 class
    prevEl: '.swiper-pre',
  },
  pagination: {
    el: ".swiper-pagination",
    clickable :true,
  },
  });
  
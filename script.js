// SCROLL REVEAL
const elements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
});

elements.forEach(el => observer.observe(el));

// COUNTERS
const counters = document.querySelectorAll('.num');

counters.forEach(counter => {
  const update = () => {
    const target = +counter.dataset.count;
    let value = +counter.innerText;

    if (value < target) {
      counter.innerText = value + 1;
      setTimeout(update, 20);
    }
  };
  update();
});

// FAQ
function toggleFAQ(btn) {
  const answer = btn.nextElementSibling;
  answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
}

// REVIEWS
const reviews = [
  {text: "Закрыли 12 вакансий быстрее срока.", author: "Директор компании"},
  {text: "Очень точный подбор специалистов.", author: "HR Manager"},
  {text: "Сэкономили нам месяц работы.", author: "CEO"}
];

let index = 0;

function updateReview() {
  document.getElementById("reviewText").innerText = reviews[index].text;
  document.getElementById("reviewAuthor").innerText = reviews[index].author;
}

function nextReview() {
  index = (index + 1) % reviews.length;
  updateReview();
}

function prevReview() {
  index = (index - 1 + reviews.length) % reviews.length;
  updateReview();
}

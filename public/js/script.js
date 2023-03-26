const container = document.querySelector(".container");
const bgBtn = document.querySelector(".btn");
const cover = document.querySelector(".cover-bg");
const pic = document.querySelector(".cover-bg img");

bgBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  container.classList.toggle("change");
  bgBtn.classList.toggle("out");
  pic.classList.toggle("pic");
});

cover.addEventListener("click", () => {
  container.classList.toggle("change");
  bgBtn.classList.toggle("out");
  ("out");
  pic.classList.toggle("pic");
});

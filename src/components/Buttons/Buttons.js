let offset = 0;
const sliderLine = document.querySelector(".trainers__cards-slider-line");
console.log("buttons");
document
  .querySelector(".buttons__btn-next")
  .addEventListener("click", function () {
    console.log("next");
    offset = offset + 220;
    if (offset > 1296) {
      offset = 0;
    }
    sliderLine.style.left = -offset + "px";
  });

document
  .querySelector(".buttons__btn-prev")
  .addEventListener("click", function () {
    console.log("prev");
    offset = offset - 220;
    if (offset < 0) {
      offset = 1100;
    }
    sliderLine.style.left = -offset + "px";
  });

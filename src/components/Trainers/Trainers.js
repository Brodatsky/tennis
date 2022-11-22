let offset = 0;
const sliderLine = document.querySelector(".trainers__cards-slider");

document
  .querySelector(".trainers__btn-next")
  .addEventListener("click", function () {
    console.log("next");
    offset = offset + 256;
    if (offset > 768) {
      offset = 0;
    }
    sliderLine.style.left = -offset + "px";
  });

document
  .querySelector(".trainers__btn-prev")
  .addEventListener("click", function () {
    console.log("prev");
    offset = offset - 256;
    if (offset < 0) {
      offset = 768;
    }
    sliderLine.style.left = -offset + "px";
  });

let cards = document.querySelectorAll("#source-card");

let input = document.querySelector(".search-text");
let sourceNames = document.querySelectorAll(".source-name");

input.addEventListener("keyup", search);

function search() {
  let searchTerm = input.value.toUpperCase();

  for (let i = 0; i < cards.length; i++) {
    if (sourceNames[i].textContent.toUpperCase().indexOf(searchTerm) > -1) {
      // cards[i].classList.add("display");
      cards[i].style.display = "";
    } else {
      // cards[i].classList.remove("display");
      cards[i].style.display = "none";
    }
  }
}
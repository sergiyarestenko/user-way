function add() {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = "./img/pizza.png";
  div.appendChild(img);
  document.body.appendChild(div);
}

function remove() {
  const imgParent = document.querySelector("img").parentElement;
  imgParent.remove();
}

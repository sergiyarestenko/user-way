(function () {
  window.onload = async function () {
    // temporary disable scroll

    function disableBodyScrolling() {
      const clientWidthBefore = document.body.clientWidth;
      document.body.style.overflow = "hidden";

      const clientWidthAfter = document.body.clientWidth;

      if (clientWidthBefore !== clientWidthAfter) {
        document.body.style.paddingRight = `${
          clientWidthAfter - clientWidthBefore
        }px`;
      }
    }

    function enableBodyScrolling() {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    function getAltArray(number = 1) {
      const url = "https://random-word-api.herokuapp.com/word?number=";
      return fetch(url + number).then((response) => response.json());
    }

    function changeImgAlt(image, altText) {
      image.alt = altText;
    }

    function createModalInputGroup(image) {
      disableBodyScrolling();
      const changeAtlGroup = document.createElement("div");
      changeAtlGroup.id = "change-alt-group";
      changeAtlGroup.style.cssText =
        "position:fixed; z-index: 9999; top: 0; right: 0; bottom: 0; left: 0; background:rgba(0,0,0,.1)";
      changeAtlGroup.addEventListener("click", removeModalInputGroup);

      const changeAltInput = document.createElement("input");

      changeAltInput.id = "change-alt-input";
      changeAltInput.type = "text";
      changeAltInput.value = image.alt;
      changeAltInput.addEventListener("input", function () {
        changeImgAlt(image, changeAltInput.value);
      });

      //add style to input

      changeAtlGroup.appendChild(changeAltInput);

      changeAtlGroup.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          removeModalInputGroup();
        }
      });
      document.body.appendChild(changeAtlGroup);
      changeAltInput.focus();
    }

    function removeModalInputGroup() {
      const changeAltInput = document.getElementById("change-alt-input");

      changeAltInput.removeEventListener("input", function () {
        changeImgAlt(image, changeAltInput.value);
      });
      changeAltInput.remove();

      const changeAtlGroup = document.getElementById("change-alt-group");
      changeAtlGroup.removeEventListener("click", removeModalInputGroup);
      
      changeAtlGroup.removeEventListener("keypress", function () {
        if (e.key === "Enter") {
          removeModalInputGroup();
        }
      });

      changeAtlGroup.remove();
      
      enableBodyScrolling();
    }

    function addModalInputGroup(image) {
      image.addEventListener("click", function () {
        createModalInputGroup(image);
      });
    }

    const images = document.querySelectorAll("img");
    const imagesLength = images.length;
    const altTextArray = await getAltArray(imagesLength);

    for (let i = 0; i < imagesLength; i += 1) {
      const currentImage = images[i];
      changeImgAlt(currentImage, altTextArray[i]);
      addModalInputGroup(currentImage);
    }
  };
})();

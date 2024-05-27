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

    function createChangeAltGroupDiv(div) {
      div.id = "change-alt-group";
      div.style.cssText =
        "position:fixed; z-index: 9999; top: 0; right: 0; bottom: 0; left: 0; background:rgba(0,0,0,.1)";
      div.addEventListener("click", removeChangeAltGroup);
    }

    function createChangeAltInput(input, image) {
      input.id = "change-alt-input";
      input.type = "text";
      input.value = image.alt;
      input.addEventListener("input", function () {
        changeImgAlt(image, input.value);
      });

      //add style to input
    }

    function addEnterEventListener(div) {
      div.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          removeChangeAltGroup();
        }
      });
    }

    function createChangeAltGroup(image) {
      disableBodyScrolling();

      const changeAtlGroup = document.createElement("div");
      createChangeAltGroupDiv(changeAtlGroup);

      const changeAltInput = document.createElement("input");
      createChangeAltInput(changeAltInput, image);

      changeAtlGroup.appendChild(changeAltInput);

      document.body.appendChild(changeAtlGroup);

      addEnterEventListener(changeAtlGroup);

      changeAltInput.focus();
    }

    function removeChangeAltInput() {
      const changeAltInput = document.getElementById("change-alt-input");

      changeAltInput.removeEventListener("input", function () {
        changeImgAlt(image, changeAltInput.value);
      });
      changeAltInput.remove();
    }

    function removeChangeAltDiv() {
      const changeAtlGroup = document.getElementById("change-alt-group");
      changeAtlGroup.removeEventListener("click", removeChangeAltGroup);

      changeAtlGroup.removeEventListener("keypress", function () {
        if (e.key === "Enter") {
          removeChangeAltGroup();
        }
      });

      changeAtlGroup.remove();
    }

    function removeChangeAltGroup() {
      removeChangeAltInput();

      removeChangeAltDiv();

      enableBodyScrolling();
    }

    function addModalInputGroup(image) {
      image.addEventListener("click", function () {
        createChangeAltGroup(image);
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

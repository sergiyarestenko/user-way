(function () {
  window.onload = async function () {

    //constants
    const urlForAlts = "https://random-word-api.herokuapp.com/word?number=";
    const inputPadding = 12;
    const groupWrapperId = "change-alt-group";
    const groupWrapperStyle =
      "position:fixed; z-index: 9999; top: 0; right: 0; bottom: 0; left: 0; background:rgba(0,0,0,.1)";
    const inputId = "change-alt-input";
    const inputStyle =
      "position: absolute; padding: 10px 12px;font-size:1.2rem;";


    //set alts on start
    setAltAttrToImages(document);

    //mutationObserver
    createMutationObserver();

    //functions

    async function setAltAttrToImages(parentNode) {
      const images = parentNode.querySelectorAll("img");
      const imagesLength = images.length;
      const altTextArray = await getAltArray(imagesLength);

      for (let i = 0; i < imagesLength; i += 1) {
        const currentImage = images[i];
        changeImgAlt(currentImage, altTextArray[i]);
        addChangeAttInputGroup(currentImage);
      }
    }

    function createMutationObserver() {
      let observer = new MutationObserver((mutations) => {
        for (let i = 0, max = mutations.length; i < max; i += 1) {
          const nodes = mutations[i].addedNodes;
          if (nodes.length) {
            findImgInAddedNodes(nodes);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterDataOldValue: true,
      });
    }

    function findImgInAddedNodes(nodes) {
      for (let i = 0, max = nodes.length; i < max; i += 1) {
        setAltAttrToImages(nodes[i]);
      }
    }

    // temporary disable scroll when input is shown
    function disableBodyScrolling() {
      const clientWidthBefore = document.body.clientWidth;
      document.body.style.overflow = "hidden";

      //compensate scrollbar width if exists
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
      return fetch(urlForAlts + number).then((response) => response.json());
    }

    function changeImgAlt(image, altText) {
      image.alt = altText;
    }

    function createChangeAltGroupDiv(div) {
      div.id = groupWrapperId;
      div.style.cssText = groupWrapperStyle;
      div.addEventListener("click", onWrapperClick);
    }

    function createChangeAltInput(input, image) {
      input.id = inputId;
      input.type = "text";
      input.value = image.alt;
      input.addEventListener("input", function () {
        changeImgAlt(image, input.value);
      });

      const inputPosition = findImagePosition(image);

      input.style.cssText = `${inputStyle}left: ${
        inputPosition.left + inputPadding
      }px;top: ${inputPosition.top + inputPadding}px; `;
    }

    function findImagePosition(image) {
      const imageRect = image.getBoundingClientRect();

      const position = {
        left: imageRect.left,
        top: imageRect.top < 0 ? 0 : imageRect.top,
      };
      return position;
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
      const changeAltInput = document.getElementById(inputId);

      changeAltInput.removeEventListener("input", function () {
        changeImgAlt(image, changeAltInput.value);
      });
      changeAltInput.remove();
    }

    function removeChangeAltDiv() {
      const changeAtlGroup = document.getElementById(groupWrapperId);
      changeAtlGroup.removeEventListener("click", onWrapperClick);

      changeAtlGroup.removeEventListener("keypress", function () {
        if (e.key === "Enter") {
          removeChangeAltGroup();
        }
      });

      changeAtlGroup.remove();
    }

    function onWrapperClick(e) {
      if (e.target.id === groupWrapperId) {
        removeChangeAltGroup();
      }
    }

    function removeChangeAltGroup() {
      removeChangeAltInput();

      removeChangeAltDiv();

      enableBodyScrolling();
    }

    function addChangeAttInputGroup(image) {
      image.addEventListener("click", function () {
        createChangeAltGroup(image);
      });
    }
  };
})();

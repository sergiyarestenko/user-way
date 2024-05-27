(function () {
  window.onload = async function () {
    function addAlt(el) {
        console.log(el, alt);
    }

     function getAlts(number = 1) {
        const url = 'https://random-word-api.herokuapp.com/word?number='
        return  fetch(url + number).then(response => response.json());

    }

    const imgs = document.querySelectorAll('img');
    const imgsLength = imgs.length;
    const alts = await getAlts(imgsLength);

    for(let i = 0; i < imgsLength; i +=1) {
        const img = imgs[i];
        img.alt = alts[i]

    }


};
})();

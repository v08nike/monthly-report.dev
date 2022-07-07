(function () {
  document.querySelectorAll(".range-slider").forEach((parent) => {
    if (!parent) {
      return;
    }

    const rangeS = parent.querySelectorAll('input[type="range"]'),
    numberS = parent.querySelectorAll('input[type="number"]');

    rangeS.forEach((el) => {
      el.oninput = () => {
        let lowerVal = parseFloat(rangeS[0].value),
        upperVal = parseFloat(rangeS[1].value);

        if (upperVal < lowerVal + 5) {
          rangeS[0].value = upperVal - 5;
        }
        if (lowerVal > upperVal - 5) {
          rangeS[1].value = lowerVal + 5;
        }

        numberS[0].value = lowerVal;
        numberS[1].value = upperVal;
      };
    });
  });
})();
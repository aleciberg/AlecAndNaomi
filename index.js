(function () {
  "use strict";

  var IMAGE_EXT = /\.(jpe?g|JPE?G)$/;

  var landscapeFilenames = ["1.jpg", "2.JPG", "3.jpg", "4.jpeg", "5.JPG"];

  var portraitFilenames = ["1.jpg", "2.JPG", "3.jpeg", "4.jpeg", "5.JPG"];

  function filterImagePaths(filenames, folder) {
    return filenames
      .filter(function (name) {
        return IMAGE_EXT.test(name);
      })
      .map(function (name) {
        return folder + name;
      });
  }

  var landscapeImages = filterImagePaths(
    landscapeFilenames,
    "assets/landscape/",
  );
  var portraitImages = filterImagePaths(portraitFilenames, "assets/portrait/");

  var imgA = document.querySelector(".carousel-image--a");
  var imgB = document.querySelector(".carousel-image--b");
  var arrowLeft = document.querySelector(".arrow-left");
  var arrowRight = document.querySelector(".arrow-right");
  var btnYes = document.querySelector(".btn-yes");
  var btnNo = document.querySelector(".btn-no");

  var currentIndex = 0;
  var currentSet = landscapeImages;
  var frontEl = imgA;
  var backEl = imgB;

  function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
  }

  function chooseSet() {
    var usePortrait = isPortrait();
    var nextSet = usePortrait ? portraitImages : landscapeImages;
    if (nextSet !== currentSet) {
      currentSet = nextSet;
      currentIndex = Math.min(currentIndex, Math.max(0, currentSet.length - 1));
    }
    return currentSet;
  }

  function showCurrent() {
    if (!currentSet.length) return;
    var src = currentSet[currentIndex];
    backEl.src = src;
    frontEl.classList.remove("carousel-image--visible");
    backEl.classList.add("carousel-image--visible");
    frontEl = frontEl === imgA ? imgB : imgA;
    backEl = backEl === imgA ? imgB : imgA;
    preloadAdjacent();
  }

  function preloadAdjacent() {
    var len = currentSet.length;
    if (len === 0) return;
    var prevIdx = currentIndex === 0 ? len - 1 : currentIndex - 1;
    var nextIdx = currentIndex === len - 1 ? 0 : currentIndex + 1;
    var prevSrc = currentSet[prevIdx];
    var nextSrc = currentSet[nextIdx];
    if (prevSrc) {
      var p = new Image();
      p.src = prevSrc;
    }
    if (nextSrc) {
      var n = new Image();
      n.src = nextSrc;
    }
  }

  function goPrev() {
    if (!currentSet.length) return;
    currentIndex =
      currentIndex === 0 ? currentSet.length - 1 : currentIndex - 1;
    showCurrent();
  }

  function goNext() {
    if (!currentSet.length) return;
    currentIndex =
      currentIndex === currentSet.length - 1 ? 0 : currentIndex + 1;
    showCurrent();
  }

  function onResizeOrOrientation() {
    chooseSet();
    showCurrent();
  }

  function onYesClick() {
    if (typeof confetti !== "function") return;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#e91e8c", "#f472b6", "#fbbf24", "#fff"],
    });
  }

  function onNoClick() {
    btnNo.classList.add("no-shake");
    setTimeout(function () {
      btnNo.classList.remove("no-shake");
    }, 400);
  }

  arrowLeft.addEventListener("click", goPrev);
  arrowRight.addEventListener("click", goNext);
  btnYes.addEventListener("click", onYesClick);
  btnNo.addEventListener("click", onNoClick);
  window.addEventListener("resize", onResizeOrOrientation);
  window.addEventListener("orientationchange", onResizeOrOrientation);

  chooseSet();
  showCurrent();
})();

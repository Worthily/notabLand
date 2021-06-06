let slides = document.querySelectorAll(".slide-item"), //Получение всех слайдов со страницы
  controllLeft = document.querySelector(".controll-left"), //Получение кнопок контроля со страницы
  controllRight = document.querySelector(".controll-right");
let slidesSrc = [], //Массив путей к картинкам
  countOfSlides = slides.length, //Колличество слайдов на странице
  moveInterval, //создается для анимации(каждую миллисекунду перемещение на определенное расстояние)
  // Слайды находящиеся на странице с записью их расположения
  leftSlide = {
    index: 0, //Нужен для присвоения картинок слайдам,определения последовательности вывода слайдов
    position: -500, //Не изменяется, определяет позицию для слайда на странице
  },
  centralSlide = {
    index: 0,
    position: 0,
  },
  rightSlide = {
    index: 0,
    position: 500,
  },
  moveSpeed = 0; //Определяет скорость прокрутки поддерживает значения: 1 и 2

//функции left и right вызывают одно перемещение в определенную сторону
function right() {
  removeListener();
  //В функцию передаются: позиция,скорость, и колличество выполнений
  move("right", 1, 1);
}
function left() {
  removeListener();
  move("left", 1, 1);
}
//показывает сообщение об ошибке при попытке нажать на стрелки при одном слайде в слайдере
function showError() {
  let errorInfo = document.createElement("p");
  errorInfo.classList.add("error");
  errorInfo.id = "oneSlideError";
  document.querySelector("#info").appendChild(errorInfo);
  errorInfo = document.querySelector("#oneSlideError").textContent =
    "На странице существует только один слайд, прокрутка остановлена";
  controllRight.removeEventListener("click", showError);
  controllLeft.removeEventListener("click", showError);
}
//функция отрисовки одного слайда(для случая когда существует только 1 слайд)
function drawOneSlide() {
  let img = document.createElement("img");
  img.src = slidesSrc[0];
  img.classList.add("slide-item" + centralSlide.position);
  img.classList.add("slide-item");
  img.style.left = 0 + "px";
  document.querySelector("#slider").appendChild(img);
  controllLeft.addEventListener("click", showError);
  controllRight.addEventListener("click", showError);
}
//функция для отрисовки начальных элементов и раздачи eventListener
function drawSlides() {
  //for рисует 3 слайда на странице
  let indexOfSlide, positionOfSlide;
  for (let i = 0; i < 3; i++) {
    if (i == 0) {
      indexOfSlide = leftSlide.index;
      positionOfSlide = leftSlide.position;
    } else if (i == 1) {
      indexOfSlide = centralSlide.index;
      positionOfSlide = centralSlide.position;
    } else if (i == 2) {
      indexOfSlide = rightSlide.index;
      positionOfSlide = rightSlide.position;
    }
    let img = document.createElement("img");
    img.src = slidesSrc[indexOfSlide];
    img.classList.add("slide-item" + indexOfSlide); //Класс для идентификации слайда
    img.classList.add("slide-item");
    img.style.left = positionOfSlide + "px";

    if (i == 0) {
      img.classList.add("slide-dellLeft");
    } else if (i == 2) {
      img.classList.add("slide-dellRight");
    }
    document.querySelector("#slider").appendChild(img);
  }
  controllLeft.addEventListener("click", left);
  controllRight.addEventListener("click", right);
}
//функции для удобного удаления и создания eventListener
function addListener() {
  let bullets = document.querySelectorAll(".bullets-item");
  controllLeft.addEventListener("click", left);
  controllRight.addEventListener("click", right);
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].addEventListener("click", goToSlide);
  }
}
function removeListener() {
  //Удаляет события у всех элементов управления(позволяет избежать багов)
  controllLeft.removeEventListener("click", left);
  controllRight.removeEventListener("click", right);
  let bullets = document.querySelectorAll(".bullets-item");
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].removeEventListener("click", goToSlide);
  }
}
//Удаление слайда и нахождения слайда для следующего удаления
function removeSlide(positionToMove) {
  let slideToRemove, side;
  if (positionToMove == "right") {
    side = "Left";
  } else if (positionToMove == "left") {
    side = "Right";
  }
  slideToRemove = document.querySelector(`.slide-dell${side}`);
  slideToRemove.remove();
  // добавление к центральному слайду класс для отслеживания и удаления
  slideToRemove = document.querySelector(`.slide-item${centralSlide.index}`);
  slideToRemove.classList.add(`slide-dell${side}`);
}
//Функция для нахождения слайдов для перемещения
function findeSlideToMove(moveSide) {
  //функция создает и возвращает обьект, состаящий из 2-х слайдов для их дальнейшего перемещения
  let firstSlideObject, //Обьект слайда
    secondSlideObject,
    firstStartPosition, //Позиция слайда
    secondStartPosition,
    firstFinishPosition, //Конечная позиция слайда
    secondFinishPosition;
  // Получение нужных значений
  if (moveSide == "left") {
    firstSlideObject = document.querySelector(`.slide-item${leftSlide.index}`);
    secondSlideObject = document.querySelector(
      `.slide-item${centralSlide.index}`
    );
    firstStartPosition = leftSlide.position;
    secondStartPosition = centralSlide.position;
    firstFinishPosition = leftSlide.position + 500;
    secondFinishPosition = centralSlide.position + 500;
  } else if (moveSide == "right") {
    firstSlideObject = document.querySelector(
      `.slide-item${centralSlide.index}`
    );
    secondSlideObject = document.querySelector(
      `.slide-item${rightSlide.index}`
    );

    firstStartPosition = centralSlide.position;
    secondStartPosition = rightSlide.position;
    firstFinishPosition = centralSlide.position - 500;
    secondFinishPosition = rightSlide.position - 500;
  }
  //Создание обьектов для передачи
  let firstSlide = {
    object: firstSlideObject,
    position: firstStartPosition,
    finishPosition: firstFinishPosition,
  };
  let secondSlide = {
    object: secondSlideObject,
    position: secondStartPosition,
    finishPosition: secondFinishPosition,
  };
  let slidesToMove = {
    side: moveSide,
    first: firstSlide,
    second: secondSlide,
  };

  return slidesToMove;
}
function moveSlides(resolve, slidesToMove, speedLevel) {
  let distance; //Расстояние на которое перемещается слайд за еденицу времени
  if (speedLevel == 1) {
    distance = 20;
  } else if (speedLevel == 2) {
    distance = 50;
  }
  //Слайды двигаются с отрицательным расстоянием при прокрутке вправо
  if (slidesToMove.side == "right") {
    distance = -distance;
  }
  moveInterval = setInterval(() => {
    //передвижение слайдов на нужное расстояние
    slidesToMove.first.position = slidesToMove.first.position + distance;
    slidesToMove.second.position = slidesToMove.second.position + distance;
    //присвоение новой позиции слайдам
    slidesToMove.first.object.style.left = slidesToMove.first.position + "px";
    slidesToMove.second.object.style.left = slidesToMove.second.position + "px";
    //проверка позиции и остановка перемещения
    if (
      slidesToMove.first.position == slidesToMove.first.finishPosition ||
      slidesToMove.second.position == slidesToMove.second.finishPosition
    ) {
      resolve();
      clearInterval(moveInterval);
    }
  }, 10);
}
//функция изменяет индексы слайдов при перемещении
function changeSlideIndex(moveSide) {
  //Получение индексов слайдов
  let leftIndex = leftSlide.index,
    centralIndex = centralSlide.index,
    rightIndex = rightSlide.index,
    //перемещение индексов в массив для удобного изменения
    hotSlidesIndex = [leftIndex, centralIndex, rightIndex];
  //Изменение индексов в зависимости от стороны перемещения
  if (moveSide == "left") {
    for (let i = 0; i < 3; i++) {
      if (hotSlidesIndex[i] - 1 == -1) {
        hotSlidesIndex[i] = countOfSlides - 1;
      } else {
        hotSlidesIndex[i] = --hotSlidesIndex[i];
      }
    }
  } else if (moveSide == "right") {
    for (let i = 0; i < 3; i++) {
      if (hotSlidesIndex[i] + 1 == countOfSlides) {
        hotSlidesIndex[i] = 0;
      } else {
        hotSlidesIndex[i] = ++hotSlidesIndex[i];
      }
    }
  }
  //Присвоение обновленных индексов
  leftSlide.index = hotSlidesIndex[0];
  centralSlide.index = hotSlidesIndex[1];
  rightSlide.index = hotSlidesIndex[2];
}
//Обьединяет все функции и выстраивает последовательность действий
function move(moveSide, speed, recur) {
  //Отключение событий
  removeListener();
  //Удалениe слайда со страницы
  removeSlide(moveSide);
  //Получение слайдов для перемещения
  let slidesToMove = findeSlideToMove(moveSide);
  //Передвижение нужных слайдов
  let req = new Promise(function (resolve) {
    moveSlides(resolve, slidesToMove, speed);
  });
  req.then(function () {
    // Запись актуальных номеров слайдов
    changeSlideIndex(moveSide);
    //Передвижение активного буллета
    document.querySelector(".active-bullet").classList.remove("active-bullet");
    document
      .querySelector(`#bullet${centralSlide.index}`)
      .classList.add("active-bullet");
    //Создание на странице нового слайда
    let newSlide = document.createElement("img");
    if (moveSide == "left") {
      document
        .querySelector("." + "slide-dellLeft")
        .classList.remove("slide-dellLeft");
      newSlide.src = slidesSrc[leftSlide.index];
      newSlide.classList.add(`slide-item${leftSlide.index}`);
      newSlide.classList.add("slide-item");
      newSlide.classList.add("slide-dellLeft");
      newSlide.style.left = leftSlide.position + "px";
      document.querySelector("#slider").appendChild(newSlide);
    } else if (moveSide == "right") {
      document
        .querySelector("." + "slide-dellRight")
        .classList.remove("slide-dellRight");
      newSlide.src = slidesSrc[rightSlide.index];
      newSlide.classList.add(`slide-item${rightSlide.index}`);
      newSlide.classList.add("slide-item");
      newSlide.classList.add("slide-dellRight");
      newSlide.style.left = rightSlide.position + "px";
      document.querySelector("#slider").appendChild(newSlide);
    }
    //Перемещение на несколько слайдов организовано с помощью рекурсии
    if (recur != 1) {
      recur--;
      move(moveSide, speed, recur);
    } else {
      addListener();
    }
  });
}
//функция осуществляет переход к нужному слайду через буллет
function goToSlide(event) {
  removeListener();
  let bullets = document.querySelectorAll(".bullets-item"),
    iterations, //нужное колличество итераций для перемещения
    bulletId;
  // получение id буллета, что вызвал событие
  for (let i = 0; i < bullets.length; i++) {
    if (event.target.id == `bullet${i}`) {
      bulletId = i;
    }
  }
  // получение нужного колличества итераций
  iterations = centralSlide.index - bulletId;
  if (centralSlide.index == bulletId) {
    addListener();
  }

  if (iterations < 0 && iterations * -1 <= 2) {
    moveSpeed = 1;
  } else if (iterations > 0 && iterations <= 2) {
    moveSpeed = 1;
  } else {
    moveSpeed = 2;
  }

  if (iterations < 0) {
    iterations = iterations * -1;
    move("right", moveSpeed, iterations);
  } else if (iterations > 0) {
    move("left", moveSpeed, iterations);
  }
}
//Функция создает на странице буллеты, выдает им уникальные ID и включает события
function createBullets() {
  for (let i = 0; i < countOfSlides; i++) {
    let newBullet = document.createElement("li");
    newBullet.id = `bullet${i}`; //добавление id для отслеживания событий
    newBullet.classList.add("bullets-item");
    if (i == centralSlide.index) {
      newBullet.classList.add("active-bullet");
    }
    document.querySelector("#bulletsWrapper").appendChild(newBullet);
  }
  //добавление событий
  addListener();
}
// удаление слайдов и запись путей к картинкам
for (let i = 0; i < countOfSlides; i++) {
  slidesSrc[i] = slides[i].src;
  slides[i].remove();
}
// Раздача нужных индексов и создание слайдов на странице
if (countOfSlides == 1) {
  leftSlide.index = 0;
  centralSlide.index = 0;
  rightSlide.index = 0;
  drawOneSlide();
} else if (countOfSlides == 2) {
  leftSlide.index = 1;
  centralSlide.index = 0;
  rightSlide.index = 1;
  drawSlides();
} else {
  leftSlide.index = countOfSlides - 1;
  centralSlide.index = 0;
  rightSlide.index = 1;
  drawSlides();
}
createBullets();

"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form"); //перехватываем отправку формы по нажатию кнопки. Обявляем переменную form, куда присваиваем весь объект форма по id
  form.addEventListener("submit", formSend); //вешаем событие на эту переменную. При отправке формы мы должны перейти в ф-цию formSend

  async function formSend(e) {
    e.preventDefault(); //запрещаем стандартную отправку формы, т.е. сейчас при нажатии на кнопку ничего не происходит

    //валидация формы. поле должно быть обязательно заполненным и проверяем правильность email, чтобы там была @ . и тд.
    let error = formValidate(form); //объявляем переменную и присваиваем ей результат работы другой ф-ции, куда передаем сам объект form.

    //получаем данные формы
    let formData = new FormData(form); //эта строка с помощью FormData вытягивает все данные полей
    formData.append("image", formImage.files[0]); //здесь мы добавляем теперь в переменную formData еще и изображение, полученное уже при обработке внизу.

    if (error === 0) {
      //проверка (если error равно 0)
      form.classList.add("_sending"); //как только мы убедились, что ошибок в валидации нет, мы сразу добавляем к форме данный класс и по этому классу, мы будем что то делать. (показать пользователю, что форма отправляется)
      //и когда форма прошла валидацию, мы будем делать отправку:
      let response = await fetch("\form\sendmail.php", {
        //файл sendmail.php будет возвращать некий json ответ. и если все хорошо, именно этот ответ мы и будем получать и выводить пользователю.
        //объявляем переменную response, и в нее ждем выполнение отправки методом post, данных (formData),
        method: "POST",
        body: formData,
      });
      //получаем ответ, успешно ли наша отправка или нет:
      if (response.ok) {
        let result = await response.json();
        alert(result.messsage);
        formPreview.innerHTML = ""; //при отправке формы, необходимо почистить ее. очищаем див с formPreview
        form.reset(); //очищаем все поля форм
        form.classList.remove("_sending");
      } else {
        //если что-то пошло не так при отправке:
        alert("Произошла Ошибка");
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля"); //если нет, то выводить alert (можно делать popup-ы)
    }
  }

  function formValidate(form) {
    let error = 0; //создаем свою переменную error
    let formReq = document.querySelectorAll("._req"); //присваиваем в новую переменную все объекты с классом _req. require - обязательное поле.И данный класс нам необходимо добавить к тем полям, которые необходимо проверять. (у нас таких 3 объекта - имя, email и checkbox).теперь эти объекты поступят в эту переменную.

    for (let index = 0; index < formReq.length; index++) {
      //создаем цикл, где мы будем бегать по этим объектам
      const input = formReq[index]; //получать каждый объект в константу input и дальше уже с ней работать.
      formRemoveError(input); //каждый раз когда мы приступим к какой либо проверке (благодаря двум ф-циям ниже),нам изначально нужно убрать у объекта класс _error.

      if (input.classList.contains("_email")) {
        //проверка email. Привяжемся к какому-то классу.
        //появился новый класс, его мы добавляем к полю с email
        if (emailTest(input)) {
          //если тест не пройден
          formAddError(input); //то этому объекту будем добавлять класс error
          error++; //также будем увеличивать на единицу нашу переменную
        }
      } else if (
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        //будем проверять наличие checkbox(если input checkbox, то будут свои проверки)
        formAddError(input); //вешаем на него и на его родителя класс error
        error++; //увеличиваем на единицу
      } else {
        //ставим проверку, заполнено ли поле вообще.
        if (input.value === "") {
          // если это пустая строка, то опять вешаем класс error.
          formAddError(input);
          error++;
        }
      }
    }
    return error; //возвращаем значение error (либо 0, либо нет, либо больше нуля) из ф-ции
  }
  //создадим еще две вспомогательные ф-ции.Эти ф-ции добавляют самому объекту (класс _error) и родительскому объекту тоже класс _error. А вторая ф-цияя соответственно убирает этот класс у родителя и у самого объекта.
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }
  //функция проверки(теста) email:
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
  //получаем инпут file в переменную (далее чтобы можно было видеть какую фотографию добавили)
  const formImage = document.getElementById("formImage");
  //получеам div для превью в переменную. куда будет выводиться сама картинка.
  const formPreview = document.getElementById("formPreview");
  //для самого объекта выбора файла добавим событие change. Т.е. когда мы будем выбирать какой-то файл, будет срабатывать событие и будем отправляться в ф-цию uploadFile и передавать туда файл, который выбран
  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });
  function uploadFile(file) {
    //проверяем тип файла
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Разрешены только изображения.");
      formImage.value = "";
      return;
    }
    //проверяем размер файла (менее 2Мб)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл должен быть менее 2 МБ.");
      return;
    }
    //если проверки пройдены, то дальше надо этот файл вывести пользователю в качестве превью.
    var reader = new FileReader();
    reader.onload = function (e) {
      //когда файл успешно загружен.
      formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`; //отправляем изображение и помещаем все это(фото) во внутрь дива formPreview.
    };
    reader.onerror = function (e) {
      //если будет какая то ошибка, то пользователь получит сообщение об ошибке.
      alert("Произошла Ошибка");
    };
    reader.readAsDataURL(file);
  }
});

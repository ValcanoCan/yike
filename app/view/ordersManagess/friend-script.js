var show = function (arr) {
    arr.forEach(function(el) {
        document.querySelector(el).style.display = 'block';
    })
    
}

var hide = function (arr) {
    arr.forEach(function(el) {
        document.querySelector(el).style.display = 'none';
    })
}

var ajax = function (option) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    for (var key in option.data) {
        formData.append(key, option.data[key]);
    }
    xhr.open('POST', option.url);
    xhr.onload = function () {
        var result = JSON.parse(xhr.responseText);
        option.success(result);
    }
    xhr.send(formData);
}

var showDialog = function (option) {
    var newOption = {
        title: option.title || '',
        text: option.text || '',
        note: option.note || '',
        btnStr: option.btnStr || '',
        subText: option.subText || '',
        inner: option.inner || '',
        clickHandler: option.clickHandler
    }

    var title = (newOption.title !== '') ? '<h2>' + newOption.title + '</h2>' : '';
    var text = (newOption.text !== '') ? '<p>' + newOption.text + '</p>' : '';
    var note = (newOption.note !== '') ? '<b>' + newOption.note + '</b>' : '';
    var subText = (newOption.subText !== '') ? '<span>' + newOption.subText + '</span>' : '';
    var hintInner = (newOption.inner !== '') ? newOption.inner : ('<div class="table"><div class="table-cell">' + title + text + subText + note +'</div></div>');
    var button = (newOption.btnStr !== '') ? '<button class="dialog-btn">' + newOption.btnStr + '</button>' : '';

    var htmlStr = '<div class="dialog">' +
                    '<div class="close"><span class="close-btn"></span></div>' +
                    '<div class="hint">' + hintInner + '</div>' +
                    button +
                '</div>';
    var dialogWrap = document.createElement('div');
    dialogWrap.classList.add('dialogWrap');
    dialogWrap.innerHTML = htmlStr;
    document.body.appendChild(dialogWrap);
    
    document.querySelector('.body').style.overflowY = 'hidden';

    dialogWrap.querySelector('.close-btn').addEventListener('click', function () {
        document.body.removeChild(dialogWrap);
        document.querySelector('.body').style.overflowY = 'scroll';
    });
    if (button !== '') {
        document.querySelector('.dialog-btn').addEventListener('click', function () {
            newOption.clickHandler && newOption.clickHandler();
            document.body.removeChild(dialogWrap);
            document.querySelector('.body').style.overflowY = 'scroll';
        });
    }
}

var init = function () {
    hide(['.mark-loading', '.tip']);

    document.querySelector('#detail-btn').addEventListener('click', function () {
        show(['.mark', '.detail']);
    });

    document.querySelector('.close-detail').addEventListener('click', function () {
        hide(['.mark', '.detail']);
    });

}


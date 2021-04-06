'use strict'
let data;
const dataFile = 'data/list.json'

async function readData(dataFile) {
    data = await fetch(dataFile).then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            console.log('Network request for list.json failed with response '
                + response.status + ': ' + response.statusText);
        }
    });
};

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    if(!num) num = 1;
    return num;
}

function generateLetters() {
    let set = new Set();
    let letterCode = 0;
    let i = 0;
    while(i < 5) {
        // English Upcase letters 
        letterCode = random(65, 90);
        if(!set.has(letterCode)) {
            set.add(letterCode);
            i++;
        }
    }
    return [...set];
}

function generateLettersSelection() {
    const letters = generateLetters();
    let select = document.createElement('select');
    let option = document.createElement('option');
    option.value = '';
    option.innerHTML = '--';
    select.append(option);
    letters.forEach((letter) => {
        option = document.createElement('option');
        option.value = String.fromCharCode(letter);
        option.innerHTML = option.value;
        select.append(option);
    });
    return select;
}

function createUlList(list) {
    let ul = document.createElement('ul');
    list.forEach((resName) => {
        let li = document.createElement('li');
        li.append(resName);
        ul.append(li);
    });
    return ul;
}

function getListContentByChar(char) {
    const result = [];
    let firstChar = '';
    if(data && char) {
        data.forEach((user) => {
            firstChar = user.name[0].toUpperCase();
            if(firstChar === char) {
                result.push(user.name)
            }
        })
    }
    return result;
}

function updateUlList(ulList) {
    let target = document.querySelector('ul');
    if(target) {
        target.replaceWith(ulList);
    }
    else {
        target = document.querySelector('select');
        target.after(ulList);
    }
}

readData(dataFile);


window.onload = function () {
    let label = document.querySelector('label ~ br');
    label.after(generateLettersSelection());
    let select = document.querySelector('select');

    select.addEventListener('change', (choosedLetter) => {
        let choose = choosedLetter.target.options.selectedIndex;
        const list = getListContentByChar(choosedLetter.target.options[choose].value);
        const ulList = createUlList(list);
        updateUlList(ulList);
    })




    // ul.append(getListContent()); 
    // let ul = document.querySelector('ul.list');
    // console.log('ul');
    // readData(dataFile).then((result) => {
    //     let li = document.createElement('li');
    //     li.innerHTML(JSON.stringify(result));
    //     ul.append(li);
    // });

}

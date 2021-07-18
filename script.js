document.querySelector(".max_date_input").valueAsDate = new Date();

let codes = ["145", "292", "298"];

function getTableValue(datesCounter, code, tableValue, minDate) {
    let currentDate = new Date();
    if(minDate !== null){
        currentDate = minDate;
    }

    for(let i = 0; i < datesCounter - 1; i++){
        currentDate.setDate(currentDate.getDate() - 1);
    }

    for(let i = 0; i < datesCounter; i++){
        fetch(`https://www.nbrb.by/api/exrates/rates/${code}?ondate=${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}&periodicity=0`)
        .then(res => res.json())
        .then(data => {
            tableValue[i].innerHTML += ` 
            <td>${parseFloat(data.Cur_OfficialRate / data.Cur_Scale).toFixed(4)}</td>`;
        })
        .then(() => {
            for(let i = 1; i < codes.length + 1; i++){
                searchMin(document.querySelectorAll(`.table_value${i}`));
                searchMax(document.querySelectorAll(`.table_value${i}`));
            }
        })
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function searchMax(table){
    let max = parseFloat(table[0].innerHTML);
    let maxPosition = 0;
    for(let i = 1; i < table.length; i++){
        if(max < parseFloat(table[i].innerHTML) || max < parseFloat(table[i].innerHTML)){
            max = parseFloat(table[i].innerHTML);
            maxPosition = i;
        } 
    }
    table[maxPosition].style.color = "green";
    for(let i = 0; i < table.length; i++){
        if(i !== maxPosition && table[i].style.color !== "red"){
            table[i].style.color = "black";
        }
    }
    for(let i = 0; i < table.length; i++){
        if(parseFloat(table[maxPosition].innerHTML) === parseFloat(table[i].innerHTML)){
            table[i].style.color = "green";
        }
    }
}

function searchMin(table){
    let min = parseFloat(table[0].innerHTML);
    let minPosition = 0;
    for(let i = 1; i < table.length; i++){
        if(min > parseFloat(table[i].innerHTML)){
            min = parseFloat(table[i].innerHTML);
            minPosition = i;
        } 
    }
    table[minPosition].style.color = "red";
    for(let i = 0; i < table.length; i++){
        if(i !== minPosition && table[i].style.color !== "#66ff00"){
            table[i].style.color = "black";
        }
    }
    for(let i = 0; i < table.length; i++){
        if(parseFloat(table[minPosition].innerHTML) === parseFloat(table[i].innerHTML)){
            table[i].style.color = "red";
        }
    }
}

function getTableClasses(from, to, tableItems, item){
    for(let i = from; i < to; i++){
        let td = document.createElement("td");
        td.className += `table_value${item}`;
        tableItems[item].appendChild(td);
    }
}

const getTableValues = (minDate, maxDate) => {
    let currentDate = new Date();

    let tableItems = document.querySelectorAll(".table_item");
    for(let i = 0; i <= codes.length; i++){
        tableItems[i].innerHTML = "";
    }
    
    for(let i = 0; i < tableItems.length; i++){
        let tdName = document.createElement("td");
        tdName.className += "name";
        tableItems[i].appendChild(tdName);
        let tdCode = document.createElement("td");
        tdCode.className += "code";
        tableItems[i].appendChild(tdCode);
    }

    let tableItemsName = document.querySelectorAll(".name");
    tableItemsName[0].innerHTML += ` 
    <td>Наименование</td>`;
    let tableItemsCode = document.querySelectorAll(".code");
    tableItemsCode[0].innerHTML += ` 
    <td>Код</td>`;

    for(let i = 0; i < codes.length; i++){
        fetch(`https://www.nbrb.by/api/exrates/rates/${codes[i]}?ondate=${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}&periodicity=0`)
        .then(res => res.json())
        .then(data => {  
            tableItemsName[i + 1].innerHTML += ` 
            <td>${data.Cur_Name}</td>`;
            tableItemsCode[i + 1].innerHTML += ` 
            <td>${data.Cur_Abbreviation}</td>`
        })
        .catch(err => console.log(err))
    }

    let datesCounter = 1;
    if(minDate === null && maxDate === null){
        datesCounter = 7;
    }
    else{
        let inputMinDateValue = new Date(minDate.value);
        currentDate = new Date(maxDate.value);
        while(inputMinDateValue < currentDate){
            inputMinDateValue.setDate(inputMinDateValue.getDate() + 1);
            datesCounter++;
        }
    }

    getTableClasses(0, datesCounter, tableItems, 0);    

    let tableValues = document.querySelectorAll(".table_value0");

    for(let i = 0; i < datesCounter - 1; i++){
        currentDate.setDate(currentDate.getDate() - 1);
    }

    for(let i = 0; i < datesCounter; i++){
        tableValues[i].innerHTML += ` 
        <td>${currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear()}</td>`;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    for(let i = 1; i < codes.length + 1; i++){
        getTableClasses(datesCounter * i + 1, datesCounter * (i + 1) + 1, tableItems, i);
        let tableValue = document.querySelectorAll(`.table_value${i}`);
        getTableValue(datesCounter, codes[i - 1], tableValue, currentDate);
    }
}

getTableValues(null, null);

function tableSearch() {
    let code = document.querySelector(".search_input");
    let table = document.querySelector(".table");
    let regExpCode = new RegExp(code.value, "i");
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regExpCode.test(table.rows[i].cells[j].innerHTML);
            if (flag) {
                break;
            } 
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }
}

document.querySelector(".get_date_button").addEventListener("click", function(){
    let minDate = document.querySelector(".min_date_input");
    let maxDate = document.querySelector(".max_date_input");
    if(minDate.value < maxDate.value){
        getTableValues(minDate, maxDate);
    }
})

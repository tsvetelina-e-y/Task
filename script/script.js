
class EntriesDb {

    constructor() {
        this.entries = [];
    }

    getEntries() {
        return this.entries;
    }

    addEntry(entry) {
        this.entries.push(entry);
    }

    getById(id) {
        return this.entries.find(function (entry) {
            return entry.id == id;
        });
    }

    removeById(id) {
        let idx = this.entries.findIndex(entry => entry.id == id);
        this.entries.splice(idx, 1);
    }

    edit(id) {
        let idx = this.entries.findIndex(entry => entry.id == id);
        this.entries[idx] = 'Edited';
    }

}

class Entry {

    constructor(id, name, email, age, phone, communication
        , englishLevel, startDate, skills, presentation, studyHome) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.phone = phone;
        this.communication = communication;
        this.englishLevel = englishLevel;
        this.startDate = startDate;
        this.skills = skills;
        this.presentation = presentation;
        this.studyHome = studyHome;
    }

}


let formFields = getFromFields();
let entriesDb = new EntriesDb();
let submitBtn = document.getElementById('submitAdd');
let id = 0
id = addEntries(id);


document.getElementsByClassName('btn-back')[0].addEventListener('click', function () {
    setVisible('entriesList');
});


submitBtn.addEventListener('click', function (ev) {

    ev.preventDefault();

    if (!validateForm()) {
        return;
    }

    let communicationValue = formFields.communication[0].checked
        ? formFields.communication[0].value
        : formFields.communication[1].value;

    let newEntry = new Entry(id++, formFields.name.value, formFields.email.value, formFields.age.value
        , formFields.phone.value, communicationValue, formFields.englishLevel.value, formFields.startDate.value
        , formFields.skills.value, formFields.presentation.value, formFields.studyHome.checked ? 'yes' : 'no');


    entriesDb.addEntry(newEntry);

    entriesDb.getEntries().forEach(element => {
        console.log(JSON.stringify(element));
    });

    document.getElementById('form').reset();

    updateEntries(entriesDb.getEntries());
    updateActionBtns()
    setVisible('entriesList');

});

function getFromFields() {
    let formFields = {};
    formFields.name = document.getElementById('name');
    formFields.email = document.getElementById('email');;
    formFields.age = document.getElementById('age');
    formFields.phone = document.getElementById('phone');
    formFields.communication = document.getElementsByName('communication');
    formFields.englishLevel = document.getElementById('englishLevel');
    formFields.startDate = document.getElementById('startDate');
    formFields.skills = document.getElementById('skills');
    formFields.presentation = document.getElementById('presentation');
    formFields.studyHome = document.getElementById('studyHome');
    formFields.hiddenInput = document.getElementById('hiddenInput');
    return formFields;
}



function updateActionBtns() {
    let deleteButtons = document.getElementsByClassName("delete");
    let editButtons = document.getElementsByClassName('edit');
    let readEntryButtons = document.getElementsByClassName('btn-read');

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function (ev) {
            let id = this.parentNode.parentNode.getAttribute('id');
            entriesDb.removeById(id);
            updateEntries(entriesDb.getEntries());
            updateActionBtns();
        });
    }

    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', function (ev) {

            let id = this.parentNode.parentNode.getAttribute('id');
            setFormEntryInfo(id);
            setVisible('formContent');
        });
    }

    for (let i = 0; i < readEntryButtons.length; i++) {
        readEntryButtons[i].addEventListener('click', function (ev) {
            ev.preventDefault();
            let id = this.dataset.entryid;

            setReadEntryInfo(id);
            setVisible('readEntry');
        });
    }

}


function updateEntries(entryCollection) {

    String.prototype.format = function (args) {
        let str = this;
        return str.replace(String.prototype.format.regex, function (item) {
            let intVal = parseInt(item.substring(1, item.length - 1));
            let replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = "{";
            } else if (intVal === -2) {
                replace = "}";
            } else {
                replace = "";
            }
            return replace;
        });
    };

    String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

    let entryTemplate = `<div class="entry-box" id="{0}">
                    <div class="actions-container" >
                        <span class="delete"><i class="far fa-trash-alt"></i></span>
                        <a class="edit"><i class="fas fa-pen"></i></a>
                    </div>
                    <div class="entry-inner">
                        <div class="name">
                            <h2>{1}</h2>
                        </div>
                        <div class="email">
                            <p>{2}</p>
                        </div>
                        <p class="presentation">{3} ...<a href="#" class="btn-read" data-entryid="{0}">Read entry</a></p>
                    </div>
                </div>`;

    let entryContainer = document.getElementById('entryContainer');
    entryContainer.innerHTML = '';
    entryCollection.forEach(function (entry) {
        entryContainer.innerHTML += entryTemplate.format([entry.id, entry.name, entry.email, entry.presentation.substr(0, 30)]);
    });

}

function setVisible(visibleSectionId) {
    let sectionsIds = ['formContent', 'entriesList', 'readEntry'];

    sectionsIds.forEach(function (id) {
        document.getElementById(id).classList.add('display-none');
    });
    document.getElementById(visibleSectionId).classList.remove('display-none');

}

function setReadEntryInfo(id) {

    document.getElementById('submitAdd').style.display = 'none';
    document.getElementById('submitEdit').style.display = 'block';

    let entry = entriesDb.getById(id);

    document.getElementById('readName').innerText = entry.name;
    document.getElementById('readEmail').innerText = entry.email;
    document.getElementById('readAge').innerText = entry.age;
    document.getElementById('readPhone').innerText = entry.phone;
    document.getElementById('readCommunication').innerText = entry.communication;
    document.getElementById('readEnglishLevel').innerText = entry.englishLevel;
    document.getElementById('readStartDate').innerText = entry.startDate;
    document.getElementById('readSkills').innerText = entry.skills;
    document.getElementById('readPresentation').innerText = entry.presentation;
    document.getElementById('readStudyHome').innerText = entry.studyHome;

}

function setFormEntryInfo(id) {

    document.getElementById('submitAdd').style.display = 'none';
    document.getElementById('submitEdit').style.display = 'block';

    let entry = entriesDb.getById(id);

    formFields.name.value = entry.name;
    formFields.email.value = entry.email;
    formFields.age.value = entry.age;
    formFields.phone.value = entry.phone;
    // fields.communication.value = entry.communication;

    document.getElementsByName('communication').forEach(function (radioBtn) {
        if (radioBtn.value == entry.communication) {
            radioBtn.setAttribute('checked', 'true');
            radioBtn.classList.add('checked');
        } else {
            radioBtn.setAttribute('checked', 'false');
            radioBtn.classList.remove('checked');
        }
    });

    let emailPhoneIdx = entry.communication == 'email' ? 0 : 1;
    formFields.communication[emailPhoneIdx].checked = true;
    formFields.englishLevel.value = entry.englishLevel;
    formFields.startDate.value = entry.startDate;
    formFields.skills.value = entry.skills;
    formFields.presentation.value = entry.presentation;


    if (entry.studyHome == 'yes') {
        formFields.studyHome.checked = true;
    } else {
        formFields.studyHome.checked = false;
    }

    formFields.hiddenInput.value = id;

    setVisible('formContent');

}

document.getElementById('submitEdit').addEventListener('click', function (ev) {

    ev.preventDefault();

    let targetEntry = entriesDb.getById(formFields.hiddenInput.value);

    targetEntry.name = formFields.name.value;
    targetEntry.email = formFields.email.value;
    targetEntry.age = formFields.age.value;
    targetEntry.phone = formFields.phone.value;
    targetEntry.communication = formFields.communication[0].checked
        ? formFields.communication[0].value
        : formFields.communication[1].value;
    targetEntry.englishLevel = formFields.englishLevel.value;
    targetEntry.startDate = formFields.startDate.value;
    targetEntry.skills = formFields.skills.value;
    targetEntry.presentation = formFields.presentation.value;

    targetEntry.studyHome = formFields.studyHome.checked ? 'yes' : 'no';

    if (!validateForm()) {
        return;
    }

    document.getElementById('form').reset();
    updateEntries(entriesDb.getEntries());
    updateActionBtns();
    setVisible('entriesList');

});

document.getElementById('headerViewAll').addEventListener('click', function (ev) {
    ev.preventDefault();
    removeErrorStyles();
    document.getElementById('form').reset();
    setVisible('entriesList');

});

document.getElementById('headerAddEntry').addEventListener('click', function (ev) {
    ev.preventDefault();
    removeErrorStyles();
    document.getElementById('submitAdd').style.display = 'block';
    document.getElementById('submitEdit').style.display = 'none';
    document.getElementById('form').reset();
    setVisible('formContent');
});

function validateForm() {

    let regexPatterns = {
        name: /[a-zA-z]+/,
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i,
        phone: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[0-9]*$/g,
        age: /[1-9]{1}[0-9]{0,2}/,
        date: /^((0|1|2)\d{1})\/((0|1)\d{1})\/((19|20)\d{2})/,
        text: /.{5,}/
    }
    let formFields = getFromFields();

    let allValid = true;
    let errInputs = [];

    removeErrorStyles();

    if (!regexPatterns.name.test(formFields.name.value)) {
        allValid = false;
        errInputs.push(formFields.name);
    }

    if (!regexPatterns.email.test(formFields.email.value)) {
        allValid = false;
        errInputs.push(formFields.email);
    }

    if (!regexPatterns.phone.test(formFields.phone.value)) {

        allValid = false;
        errInputs.push(formFields.phone);
    }

    if (!regexPatterns.age.test(formFields.age.value)) {
        allValid = false;

        errInputs.push(formFields.age);

    }

    if (!regexPatterns.text.test(formFields.skills.value)) {
        allValid = false;

        errInputs.push(formFields.skills);
    }

    if (!regexPatterns.text.test(formFields.presentation.value)) {
        allValid = false;

        errInputs.push(formFields.presentation);

    }

    // let date = new Date(formFields.startDate.value);
    // if (new Date() > date) {
    //     alert('starto e');
    // }

    if (!regexPatterns.date.test(formFields.startDate.value)) {

        allValid = false;

        errInputs.push(formFields.startDate);
    }

    errInputs.forEach(function (input) {
        addErrorStyles(input);

    });


    if (!formFields.communication[0].checked && !formFields.communication[1].checked) {

        let circles = document.getElementsByClassName('label-radio ');

        for (let i = 0; i < circles.length; i++) {
            circles[i].classList.add('not-valid');
        }

    }

    if (allValid) {
        removeErrorStyles();

   
    }

    return allValid;


}

function addErrorStyles(element) {
    element.classList.add('not-valid');
    element.parentNode.classList.add('err');
}

function removeErrorStyles() {
    let inputs = document.getElementsByClassName('not-valid');
    let inputParents = document.getElementsByClassName('err');

    while (inputs[0]) {
        inputs[0].classList.remove('not-valid')
    }

    while (inputParents[0]) {
        inputParents[0].classList.remove('err')
    }

}


function addEntries(id) {
    let arrEntries = [
        new Entry(id++, 'Alyssia Grey', 'alyssia@abv.bg', 20, '2342452345', 'email', 'a2', '06/05/2019', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, ', 'a type specimen book. It has survived not only five centuries, ', 'yes'),
        new Entry(id++, 'Domonic Valentine', 'domonic@gmail.com', 30, '456456745', 'phone', 'c2', '06/05/2019', 'A type specimen book. It has survived not only five centuries, ', ' Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make', 'no'),
        new Entry(id++, 'Christina Baxter', 'christina@gmail.com', 23, '3452525', 'email', 'b2', '06/05/2019', 'Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ', 'A type specimen book. It has survived not only five centuries, ', 'yes'),
        new Entry(id++, 'Reyansh Wainwright', 'reyansh@abv.bg', 15, '45734524', 'phone', 'b2', '06/05/2019', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, ', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, ', 'no'),
        new Entry(id++, 'Jacque Gamble', 'jacque@gmail.com', 60, '474563', 'email', 'c1', '06/05/2019', 'Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, ', 'yes'),
        new Entry(id++, 'Zion Young', 'zion@gmail.com', 45, '345525', 'email', 'c1', '06/05/2019', 'Letraset sheets containing Lorem Ipsum passages, ', 'Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ', 'yes'),
    ];

    arrEntries.forEach(function (entry) {
        entriesDb.addEntry(entry);
    });

    updateEntries(entriesDb.getEntries());
    updateActionBtns();
    setVisible('entriesList');
    return id;
}

function toggleCheck(element) {

    let radioButtons = document.getElementsByName('communication');


    radioButtons.forEach(function (button) {
        button.setAttribute("checked", "false");
        button.classList.remove('checked');
    });

    element.setAttribute("checked", "true");
    element.classList.add("checked");
}

function resetRadioButtons() {
    document.getElementsByName('communication').forEach(function (element) {
        element.setAttribute("checked", "false");
    });
}


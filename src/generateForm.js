let generateForm = () => {
    return "generate form";
}

let generateTextField = (label, id, placeholder) => {
    let textField =``
    if (placeholder) {
        textField = `<input type="text" id="${id}" name="${id}" placeholder="${placeholder}" required>`;
    }else {
        textField = `<input type="text" id="${id}" name="${id}" required>`;
    }
   return `
   <label for="${id}">${label}</label>
   ${textField}
   `
}

let generateNumberOption = (label, id) => {
    let numberOption = `<input type="number" id="${id}" name="${id}" min="1" max="5" required>`;
   return `
   <label for="${id}">${label} </label>
   ${numberOption}
   `
}

let generateButton = (text, id, uid) => {
   let button = `<button type="submit" class="${id}" id="${id}${uid}" name="${id}" data-id="${uid}"> ${text} </button>`;
   return button;
}

export default {
    generateForm,
    generateTextField,
    generateNumberOption,
    generateButton
}
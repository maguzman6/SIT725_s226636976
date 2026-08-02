
const clickMe = () => {
    alert("Thanks for clicking me. Hope you have a nice day!")
}

const fetchCards = () => {
    fetch("/get-coffee")
        .then(response => response.json())
        .then(data => {
            addCards(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

const submitForm = () => {
    let formData = {};
    formData.coffee_name = $('#coffee_name').val();
    formData.coffee_description = $('#coffee_description').val();
    
    fetch("/submit-form", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Form submitted, server response:", data);
        alert("Coffee card added successfully! Coffee: " + data.coffee.coffee_name);
        addCard(data.coffee);
    })
    .catch(error => {
        console.error("Error submitting form:", error);
    });
}

const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = `<div class="col s4 center-align">
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="${item.image}">
                        </div> 
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${item.coffee_name}<i
                                    class="material-icons right">more_vert</i></span>
                            <p><a href="#">About ${item.coffee_name}</a></p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">Coffee<i
                                    class="material-icons right">close</i></span>
                            <p class="card-text">${item.description}</p>
                        </div>
                    </div>
                </div>`;
        $("#card-section").append(itemToAppend)
    });
}

const addCard = (item) => {
    let itemToAppend = `<div class="col s4 center-align">
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="${item.image}">
                        </div> 
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${item.coffee_name}<i
                                    class="material-icons right">more_vert</i></span>
                            <p><a href="#">About ${item.coffee_name}</a></p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">Coffee<i
                                    class="material-icons right">close</i></span>
                            <p class="card-text">${item.description}</p>
                        </div>
                    </div>
                </div>`;
    $("#card-section").append(itemToAppend)
}

$(document).ready(function () {
    $('.materialboxed').materialbox();
    $('#formSubmit').click(() => {
        submitForm();
    })
    $('#clickMeButton').click(() => {
        clickMe();
    })

    fetchCards();

    $('.modal').modal();
});
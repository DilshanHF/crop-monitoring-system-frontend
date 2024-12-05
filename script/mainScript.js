$("#home-section").css({display: 'block'});
$("#field-section").css({display: 'none'});
$("#crop-section").css({display: 'none'});
$("#staff-section").css({display: 'none'});
$("#monitoring-section").css({display: 'none'});
$("#vehicle-section").css({display: 'none'});
$("#equipment-section").css({display: 'none'});

$("#home-btn").on('click', () => {
    $("#home-section").css({display: 'block'});
    $("#field-section").css({display: 'none'});
    $("#crop-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});

$("#Field-btn").on('click', () => {
    $("#field-section").css({display: 'block'});
    $("#home-section").css({display: 'none'});
    $("#crop-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});

$("#Crop-btn").on('click', () => {
    $("#crop-section").css({display: 'block'});
    $("#home-section").css({display: 'none'});
    $("#field-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});
$("#Staff-btn").on('click', () => {
    $("#staff-section").css({display: 'block'});
    $("#crop-section").css({display: 'none'});
    $("#home-section").css({display: 'none'});
    $("#field-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});
$("#Monitoring-btn").on('click', () => {
    $("#monitoring-section").css({display: 'block'});
    $("#home-section").css({display: 'none'});
    $("#field-section").css({display: 'none'});
    $("#crop-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});
$("#Vehicle-btn").on('click', () => {
    $("#vehicle-section").css({display: 'block'});
    $("#home-section").css({display: 'none'});
    $("#field-section").css({display: 'none'});
    $("#crop-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#equipment-section").css({display: 'none'});
});
$("#Equipment-btn").on('click', () => {
    $("#equipment-section").css({display: 'block'});
    $("#home-section").css({display: 'none'});
    $("#field-section").css({display: 'none'});
    $("#crop-section").css({display: 'none'});
    $("#staff-section").css({display: 'none'});
    $("#monitoring-section").css({display: 'none'});
    $("#vehicle-section").css({display: 'none'});
});


(function ($) {

    "use strict";

    $('nav .dropdown').hover(function () {
        var $this = $(this);
        $this.addClass('show');
        $this.find('> a').attr('aria-expanded', true);
        $this.find('.dropdown-menu').addClass('show');
    }, function () {
        var $this = $(this);
        $this.removeClass('show');
        $this.find('> a').attr('aria-expanded', false);
        $this.find('.dropdown-menu').removeClass('show');
    });

})(jQuery);

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()


// Get the video
var video = document.getElementById("myVideo");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "  <i class=\"fa-solid fa-pause\"></i>";
    } else {
        video.pause();
        btn.innerHTML = "<i class=\"fa-solid fa-play\">";
    }
}


/*-----------crop table script----------*/
// Highlight the row with a specific color
document.querySelectorAll('.edit-row').forEach(button => {
    button.addEventListener('click', function () {
        // Show a confirmation dialog
        const confirmEdit = confirm("Are you sure you want to edit this information?");
        if (!confirmEdit) return;

        const row = button.closest('tr');
        const updateButton = row.querySelector('.update-row');
        const editables = row.querySelectorAll('.editable');

        // Enable editing
        editables.forEach(cell => {
            if (cell.classList.contains('field-id-text')) {
                cell.style.display = 'none'; // Hide the text
                const dropdown = cell.nextElementSibling; // Get the dropdown
                dropdown.style.display = 'inline-block'; // Show the dropdown
            } else {
                cell.contentEditable = true; // Enable editing for other cells
            }
        });

        // Highlight the row
        row.classList.add('highlight');

        // Show Update button and hide Edit button
        button.style.display = 'none';
        updateButton.style.display = 'inline-block';
    });
});

document.querySelectorAll('.update-row').forEach(button => {
    button.addEventListener('click', function () {
        const row = button.closest('tr');
        const editButton = row.querySelector('.edit-row');
        const editables = row.querySelectorAll('.editable');

        // Disable editing, remove highlighting, and get new data
        editables.forEach(cell => {
            if (cell.classList.contains('field-id-dropdown')) {
                const dropdown = cell; // Get the dropdown
                const selectedValue = dropdown.value; // Get selected value
                const textCell = cell.previousElementSibling; // Get the text cell
                textCell.innerText = selectedValue; // Update the text cell
                dropdown.style.display = 'none'; // Hide the dropdown
            } else {
                cell.contentEditable = false; // Disable editing for other cells
            }
        });
        row.classList.remove('highlight'); // Remove highlight

        const updatedData = {
            commonName: editables[0].innerText,
            scientificName: editables[1].innerText,
            category: editables[2].innerText,
            season: editables[3].innerText,
            fieldId: editables[4].previousElementSibling.innerText // Get updated FieldId
        };
        console.log('Updated Data:', updatedData);

        // Show Edit button and hide Update button
        button.style.display = 'none';
        editButton.style.display = 'inline-block';
    });
});

/*--------------------------------*/
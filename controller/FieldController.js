let next_id_filed;
initialize();


initialize();

function initialize() {
    setTimeout(() => {
        loadNextIFieldId();
        loadFieldList();
        loadField();
        loadTablefield()

    }, 1000);
}

function loadFieldList() {
    let fieldArray = [];
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/field",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        dataType: "json",
        success: (res) => {
            fieldArray = res;
            console.log("print response:" + res)

            setFieldIds(fieldArray);


        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load Field!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load Field:", err);
        }
    });
}

function loadField() {
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/field",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        dataType: "json",
        success: (res) => {
            if (res && Array.isArray(res)) {
                setFieldIds(res);
                renderFields(res);
            } else {
                console.warn("No fields found in response");
            }
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load Field!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load Field:", err);
        }
    });
}

function renderFields(fieldArray) {
    const container = document.querySelector(".container.py-2");
    container.innerHTML = ""; // Clear previous content

    fieldArray.forEach(field => {
        const imageSrc = field.image1
            ? `data:image/jpeg;base64,${field.image1}`
            : "https://via.placeholder.com/100";

        const fieldHTML = `
            <article class="postcard light blue">
                <a class="postcard__img_link" href="#">
                 <img class="postcard__img" src="${imageSrc}" alt="Image for ${field.fieldName}" width="400" height="300" />
                </a>
                <div class="postcard__text t-dark">
                    <h1 class="postcard__title blue">
                        <a href="#">Field Name: ${field.fieldName}</a>
                    </h1>
                    <div class="postcard__subtitle small">
                        <time datetime="${field.dateAdded || '2020-05-25 12:00:00'}">
                            <i class="fa-solid fa-location-dot"></i> ${field.fieldLocation || 'Unknown Location'}
                        </time>
                    </div>
                    <div class="postcard__bar"></div>
                    <div class="postcard__preview-txt">
                        This field, identified by the code ${field.fieldCode || 'N/A'}, is named ${field.fieldName || 'N/A'}
                        and is located at ${field.fieldLocation || 'N/A'}. It spans an area of ${field.fieldSize || 'N/A'}
                        and is actively monitored and managed. The operational history for this field is recorded under the log code ${field.logCode || 'N/A'},
                        ensuring all activities are well-documented. Currently, this field has been assigned to ${field.numberOfStaff || 0} employee(s),
                        identified by their IDs: ${field.staffIds || 'N/A'}, who are responsible for its maintenance and productivity.
                    </div>
                </div>
            </article>
        `;

        container.innerHTML += fieldHTML;
    });
}

$("#save-field").on("click", function () {
    const fieldCode = next_id_filed
    const fieldLocation = $("#fieldLocation").val();
    const fieldName = $("#field_name").val();
    const fieldSize = $("#fieldSize").val();
    const image1 = $("#field-image1")[0].files[0];
    const image2 = $("#field-image2")[0].files[0];


    const logCode = document.getElementById("field-log-id");
    const staffIds = document.getElementById("staff-id");

    const logCode1 = logCode.options[logCode.selectedIndex].text;
    const staffIds1 = staffIds.options[staffIds.selectedIndex].text;


    const formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldLocation", fieldLocation);
    formData.append("fieldName", fieldName);
    formData.append("fieldSize", fieldSize);
    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("logCode", logCode1);
    formData.append("staffIds", staffIds1);

    let jwtToken = localStorage.getItem('jwtToken');

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/field",
        type: "POST",
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.fire({
                title: "Field saved successfully!!",
                text: "Success",
                icon: "success"
            });

            console.log(response);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Field saved unsuccessfully!!",
                text: "error",
                icon: "error"
            });
            console.error(error);
        },
    });

});


function loadNextIFieldId() {
    let jwtToken = localStorage.getItem('jwtToken');

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/field/genFieldID",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },

        success: (res) => {

            console.log("print response nextID:" + res)
            next_crop_id = res


            document.getElementById("field-id").innerText = res;

            next_id_filed = res;


        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next  ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next log ID:", err);
        }
    });
}

function loadTablefield() {
    let jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        console.error("JWT token not found. Please log in.");
        return;
    }

    $.ajax({
        url: 'http://localhost:8093/greenShadow/api/v1/field',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        success: function (data) {
            const tableBody = $("#field-table-view");
            tableBody.empty();

            if (data.length === 0) {
                console.log("No data available to display.");
                tableBody.append("<tr><td colspan='8'>No data available</td></tr>");
                return;
            }

            data.forEach((field) => {
                console.log("Staff id",field.staffIds)
                const imageSrc1 = field.image1
                    ? `data:image/jpeg;base64,${field.image1}`
                    : "https://via.placeholder.com/100";
                const imageSrc2 = field.image2
                    ? `data:image/jpeg;base64,${field.image2}`
                    : "https://via.placeholder.com/100";

                const row = `
                <tr>
                    <td>${field.fieldCode}</td>
                    <td>${field.fieldName}</td>
                    <td>${field.fieldLocation}</td>
                    <td>${field.fieldSize}</td>
                    <td><img src="${imageSrc1}" alt="Image 1" width="50" height="50"></td>
                    <td><img src="${imageSrc2}" alt="Image 2" width="50" height="50"></td>
                    <td>${field.logCode}</td>
                  
                </tr>`;
                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error(`Failed to load table data. Status: ${status}, Error: ${error}`);
        }
    });
}

$("#search-field").on("input", function () {
    var typedText = $("#search-field").val();


    if (typedText.trim() === "") {
        loadTablefield()
    } else {
        let jwtToken = localStorage.getItem('jwtToken');
        $.ajax({
            url: `http://localhost:8093/greenShadow/api/v1/field/${typedText}`,
            type: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            success: (res) => {
                console.log("Response received:", res);

                const tableBody = $("#field-table-view");
                tableBody.empty();

                const imageSrc1 = res.image1
                    ? `data:image/jpeg;base64,${res.image1}`
                    : "https://via.placeholder.com/100";
                const imageSrc2 = res.image2
                    ? `data:image/jpeg;base64,${res.image2}`
                    : "https://via.placeholder.com/100";

                const row = `
                <tr>
                    <td>${res.fieldCode}</td>
                    <td>${res.fieldName}</td>
                    <td>${res.fieldLocation}</td>
                    <td>${res.fieldSize}</td>
                    <td><img src="${imageSrc1}" alt="Image 1" width="50" height="50"></td>
                    <td><img src="${imageSrc2}" alt="Image 2" width="50" height="50"></td>
                    <td>${res.logCode}</td>
                  
                </tr>`;
                tableBody.append(row);




            },
            error: (err) => {
                console.error("AJAX error:", err);
                alert("Failed to fetch field details. Please try again.");
            }
        });
    }
});













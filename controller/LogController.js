let jwtToken = localStorage.getItem('jwtToken');
let next_id;

initialize();


function initialize() {
    setTimeout(() => {
        loadLogDataIntoTable();
        loadNextILogId();
        loadLogList()
    }, 10);
}

function loadLogList() {
    let logArray = [];
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/log",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        dataType: "json",
        success: (res) => {
            logArray = res;
            console.log("print response:"+res)

            setLogIds(logArray);



        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load Log!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load Log:", err);
        }
    });
}

function loadLogDataIntoTable(){
    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/log",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        dataType: "json",
        success: (res) => {
            const logTableBody = $("#log-table-tBody");
            logTableBody.empty();

            res.forEach(log => {
                const { logCode, logDetails, observedImage, logDate } = log;

                const imageSrc = observedImage
                    ? `data:image/jpeg;base64,${observedImage}`
                    : "https://via.placeholder.com/100";


                const tableRow = `
                <tr>
                    <td>${logCode || "N/A"}</td>
                    <td>${logDetails || "N/A"}</td>
                    <td><img src="${imageSrc}" alt="Observed Image" style="width: 100px; height: auto;"></td>
                    <td>${logDate || "N/A"}</td>
                </tr>
            `;

                logTableBody.append(tableRow);
            });
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load Log!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load Log:", err);
        }
    });

}

$("#log-table-tBody").on("click", "tr", function () {

    const logId = $(this).find("td:eq(0)").text();
    const logDetails = $(this).find("td:eq(1)").text();
    const observedImage = $(this).find("td:eq(2) img").attr("src");


    $("#update-log-id").text(`Log ID: ${logId}`);
    $("#update-log-details").val(logDetails);
    $("#update-log-old-image").attr("src", observedImage);

    $("#update-log").modal("show");
});

// save log
$("#log-save").on("click", function () {



    const token = localStorage.getItem("jwtToken");


    const logDetails = $("#log-details").val();
    const logDate = new Date().toISOString().split('T')[0];
    const logImage = $("#log-image")[0].files[0];
    const logId = next_id
    console.log("new Log code"+logId)


    const formData = new FormData();
    formData.append("logCode", logId);
    formData.append("LogDetails", logDetails);
    formData.append("date", logDate);
    if (logImage) {
        formData.append("ObservedImage", logImage);
    }


    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/log",
        type: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {

            loadLogDataIntoTable()
            clear()

            alert("Log saved successfully!");
            Swal.fire({
                title: "log saved successfully!",
                text: "Success",
                icon: "success"
            });


            $("#new-log").modal('hide');
        },
        error: function (error) {
            Swal.fire({
                title: "log Save unsuccessfully!",
                text: "error",
                icon: "error"
            });

            alert("Failed to save the log. Please try again.");
        }
    });





});

// update log
$("#update-log .btn-primary").on("click", function () {

    const logId = $("#update-log-id").text().replace("Log ID: ", "").trim();
    const updatedDetails = $("#update-log-details").val();
    const updateDate =$("#u-date").val();
    const updatedFile = $("#update-log-image")[0].files[0];


    const currentDate = new Date().toISOString().split('T')[0];



    const formData = new FormData();
    formData.append("LogDetails", updatedDetails);
    formData.append("date", currentDate);
    if (updatedFile) {
        formData.append("ObservedImage", updatedFile);
    }


    $.ajax({
        url: `http://localhost:8093/greenShadow/api/v1/log/${logId}`,
        type: "PUT",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {

            loadLogDataIntoTable()
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Log updated successfully!",
                showConfirmButton: false,
                timer: 3000
            });
            $("#update-log").modal('hide');
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Failed to update log!",
                showConfirmButton: false,
                timer: 3000
            });
            console.error("Update failed:", err);
        }
    });


    $("#update-log").modal("hide");
});

//delete log
$("#delete-log").on("click", function () {
    const logId = $("#update-log-id").text().replace("Log ID: ", "").trim();
    console.log("Search Log");
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let jwtToken = localStorage.getItem('jwtToken');
            $.ajax({
                url: `http://localhost:8093/greenShadow/api/v1/log/${logId}`,
                type: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
                success: (res) => {
                    clear()
                    loadLogDataIntoTable()
                    console.log("Response received:", res);

                    Swal.fire({
                        title: "log Delete successfully!",
                        text: "Success",
                        icon: "success"
                    });


                },
                error: (err) => {
                    console.error("AJAX error:", err);
                    Swal.fire({
                        title: "log Delete unsuccessfully!",
                        text: "Error",
                        icon: "Error"
                    });
                }
            });
        }
    });




});

//search log id
$("#log-search").on("input", function () {
    var typedText = $("#log-search").val().trim();
    console.log("Search Log:", typedText);

    if (typedText === "") {
        loadLogDataIntoTable()

    } else {
        let jwtToken = localStorage.getItem("jwtToken");

        $.ajax({
            url: `http://localhost:8093/greenShadow/api/v1/log/${typedText}`,
            type: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            success: (res) => {
                console.log("Response received:", res);

                // Get the table body
                let tableBody = document.querySelector('.tbody');
                tableBody.innerHTML = '';

                let pic = res.observesImage;
                const imageSrc = pic
                    ? `data:image/jpeg;base64,${pic}`
                    : "https://via.placeholder.com/100";

                let record = `
                    <tr>
                              <td>${res.logCode || "N/A"}</td>
                    <td>${res.logDetails || "N/A"}</td>
                    <td><img src="${imageSrc}" alt="Observed Image" style="width: 100px; height: auto;"></td>
                    <td>${res.logDate || "N/A"}</td>

                        </td>

                    </tr>`;
                tableBody.insertAdjacentHTML('beforeend', record);

                /*
                      // Check if the response contains data
                      if (res && res.length > 0) {
                          res.forEach(log => {
                              // Create a new row with log details
                              let record = `
                                  <tr>
                                      <td>${log.logCode}</td>
                                      <td>${log.logDetails}</td>
                                      <td><img src="${log.observesImage}" alt="Image" style="width: 50px; height: 50px;"></td>
                                      <td>${log.logDate}</td>
                                  </tr>
                              `;
                              tableBody.append(record); // Append the new row
                          });
                      } else {
                          // If no data, display a message
                          tableBody.append(`
                              <tr>
                                  <td colspan="4" style="text-align: center;">No records found</td>
                              </tr>
                          `);
                      }*/
            },
            error: (err) => {
                console.error("AJAX error:", err);
                alert("Failed to fetch log details. Please try again.");
            }
        });
    }
});

//next log id
function loadNextILogId() {

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/log/genLogID",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },

        success: (res) => {

            console.log("print response nextID:"+res)
            next_crop_id = res


            document.getElementById("next-log-id").innerText = "Log ID:"+res;

            next_id = res;


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




function  clear(){
    $('.form-control').val('');
    $('.styled-date-picker').val('');
    $('.form-select').prop('selectedIndex', 0);
}



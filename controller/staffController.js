let staff_id;
initialize();

function initialize() {
    setTimeout(() => {
        loadStaffTable();
        loadNextIid();

    }, 1000);
}
//staff next id
function loadNextIid() {

    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/staff/getStaffID",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },

        success: (res) => {

            console.log("print response nextID:"+res)
            next_crop_id = res


            document.getElementById("staff_next_id").innerText = res;


        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next crop ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next crop ID:", err);
        }
    });
}

function loadStaffTable() {
    const apiUrl = "http://localhost:8093/greenShadow/api/v1/staff";
    const jwtToken = localStorage.getItem("jwtToken");

    // Function to fetch and populate staff data
    function fetchStaffData() {
        $.ajax({
            url: apiUrl,
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            success: function (response) {
                const $tbody = $("#staff-table-tBody");
                $tbody.empty(); // Clear existing rows

                response.forEach((staff) => {
                    const row = `
                    <tr data-staff='${JSON.stringify(staff)}'>
                        <td>${staff.staffId}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.staffDesignation}</td>
                        <td>${staff.contact}</td>
                        <td>${staff.email}</td>
                        <td>${staff.jobRole}</td>
                    </tr>
                    `;
                    $tbody.append(row);
                });

                // Add click event to table rows
                $("#staff-table-tBody tr").on("click", function () {
                    const staffData = $(this).data("staff");
                    populateModal(staffData);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error);
            },
        });
    }

    // Function to populate modal fields with selected staff data
    function populateModal(staff) {

        staff_id = staff.staffId;

        $("#staff-update-id").text(staff.staffId || "S00-00..");
        $("#staff-first-name").val(staff.firstName || "");
        $("#staff-last-name").val(staff.lastName || "");
        $("#staff-designation").val(staff.staffDesignation || "");
        $("#Gender").val(staff.gender || "Gender");
        $("#joing-date").val(staff.joiningDate || "");
        $("#birthday").val(staff.birthday || "");
        $("#u-staff-AddressLine01").val(staff.addressLine01 || "");
        $("#u-staff-AddressLine02").val(staff.addressLine02 || "");
        $("#u-staff-AddressLine03").val(staff.addressLine03 || "");
        $("#u-staff-AddressLine04").val(staff.addressLine04 || "");
        $("#u-staff-AddressLine05").val(staff.addressLine05 || "");
        $("#u-staff-contact").val(staff.contact || "");
        $("#u-staff-email").val(staff.email || "");
        $("#u-staff-jobRole").val(staff.jobRole || "jobRole");
        $("#staff-update-logCode").val(staff.logCode || "Log Code");
        $("#staff-update-field-id").val(staff.fieldId || "Select Field ID");

        // Show the modal
        $("#staffUpdateModel").modal("show");
    }

    // Fetch data on page load
    fetchStaffData();
}
// update staff
document.getElementById('update-staff').addEventListener('click', () => {
    console.log("update staff details")
    const jwtToken = localStorage.getItem('jwtToken');
    const staffId = document.getElementById('staff-update-id').innerText.trim();

    if (!jwtToken || !staffId) {
        Swal.fire({
            title: "Error!",
            text: "Invalid session or missing Staff ID.",
            icon: "error"
        });
        return;
    }

    const formData = new FormData();
    const staffGender = document.getElementById("Gender");
    const staffDesignation = document.getElementById("staff-designation");
    const staffJobRole = document.getElementById("u-staff-jobRole");
    const staffUpdateLogCode = document.getElementById("staff-update-logCode");
    const staffUpdateFieldId = document.getElementById("staff-update-field-id");

    formData.append('firstName', document.getElementById('staff-first-name').value.trim() || '');
    formData.append('lastName', document.getElementById('staff-last-name').value.trim() || '');
    formData.append('staffDesignation', staffDesignation.options[staffDesignation.selectedIndex]?.text || '');
    formData.append('gender', staffGender.options[staffGender.selectedIndex]?.text || '');
    formData.append('joinedDate', document.getElementById('joing-date').value || '');
    formData.append('DOB', document.getElementById('birthday').value || '');
    formData.append('AddressLine01', document.getElementById('u-staff-AddressLine01').value.trim() || '');
    formData.append('AddressLine02', document.getElementById('u-staff-AddressLine02').value.trim() || '');
    formData.append('AddressLine03', document.getElementById('u-staff-AddressLine03').value.trim() || '');
    formData.append('AddressLine04', document.getElementById('u-staff-AddressLine04').value.trim() || '');
    formData.append('AddressLine05', document.getElementById('u-staff-AddressLine05').value.trim() || '');
    formData.append('contact', document.getElementById('u-staff-contact').value.trim() || '');
    formData.append('email', document.getElementById('u-staff-email').value.trim() || '');
    formData.append('jobRole', staffJobRole.options[staffJobRole.selectedIndex]?.text || '');
    formData.append('image', document.getElementById('staff-update-image').files[0] || null);
    formData.append('logCode', staffUpdateLogCode.options[staffUpdateLogCode.selectedIndex]?.text || '');
    formData.append('fieldIds', staffUpdateFieldId.options[staffUpdateFieldId.selectedIndex]?.text || '');

    $.ajax({
        url: `http://localhost:8093/greenShadow/api/v1/staff/${staffId}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {
            Swal.fire({
                title: "Success!",
                text: "Staff updated successfully.",
                icon: "success"
            });
            loadStaffTable();
            clear();

        },
        error: (err) => {
            console.error("Error:", err);
            Swal.fire({
                title: "Error!",
                text: err.responseJSON?.message || "Failed to update staff data.",
                icon: "error"
            });
        }
    });
});

//save staff
document.getElementById('save-staff').addEventListener('click', function() {

    const jwtToken = localStorage.getItem('jwtToken');


    const staffId = document.getElementById('staffSaveModel').querySelector('.staff_next_id').innerText;


    const formData = new FormData();


    formData.append('firstName', document.getElementById('staff-f-name').value || '');
    formData.append('lastName', document.getElementById('staff-l-name').value || '');


    const staffGender = document.getElementById("staffGender");
    const staffDesignation = document.getElementById("staff-designation1");
    const staffJobRole = document.getElementById("s-staff-jobRole");
    const staffUpdateLogCode = document.getElementById("staff-save-logCode");
    const staffUpdateFieldId = document.getElementById("staff-save-field-id");

    formData.append('staffId', staffId || '');
    formData.append('staffDesignation', staffDesignation.options[staffDesignation.selectedIndex].text || '');
    formData.append('gender', staffGender.options[staffGender.selectedIndex].text || '');
    formData.append('joinedDate', document.getElementById('joing-date1').value || '');
    formData.append('DOB', document.getElementById('birthday1').value || '');
    formData.append('AddressLine01', document.getElementById('s-staff-AddressLine01').value || '');
    formData.append('AddressLine02', document.getElementById('s-staff-AddressLine02').value || '');
    formData.append('AddressLine03', document.getElementById('s-staff-AddressLine03').value || '');
    formData.append('AddressLine04', document.getElementById('s-staff-AddressLine04').value || '');
    formData.append('AddressLine05', document.getElementById('s-staff-AddressLine05').value || '');
    formData.append('contact', document.getElementById('s-staff-contact').value || '');
    formData.append('email', document.getElementById('s-staff-email').value || '');
    formData.append('jobRole', staffJobRole.options[staffJobRole.selectedIndex].text || '');
    formData.append('image', document.getElementById('staff-save-image').files[0] || null);
    formData.append('logCode', staffUpdateLogCode.options[staffUpdateLogCode.selectedIndex].text || '');
    formData.append('fieldIds', staffUpdateFieldId.options[staffUpdateFieldId.selectedIndex].text || '');


    $.ajax({
        url: `http://localhost:8093/greenShadow/api/v1/staff`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: (res) => {

            Swal.fire({
                title: "Staff saved successfully!",
                text: "Success",
                icon: "success"
            });
            clear();
            loadStaffTable();
        },
        error: (res) => {
            console.error(res);
            Swal.fire({
                title: "Error!",
                text: "Failed to save staff data.",
                icon: "error"
            });
        }
    });
});

// clear staff

function  clear(){
    $('.form-control').val('');
    $('.styled-date-picker').val('');
    $('.form-select').prop('selectedIndex', 0);
}

$("#clear-save-model").on('click', () => {
    clear()
});

// delete staff
$("#delete-staff").on("click", function () {
    console.log("Attempting to delete staff...");
    let deleteId = staff_id

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
            let jwtToken = localStorage.getItem("jwtToken"); // Ensure token exists

            $.ajax({
                url: `http://localhost:8093/greenShadow/api/v1/staff/${deleteId}`,
                type: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
                success: (res) => {
                    console.log("Staff deleted successfully:", res);

                    // Optionally, refresh or reinitialize UI elements
                    initialize();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Staff has been deleted successfully.",
                        icon: "success"
                    });
                },
                error: (xhr, status, error) => {
                    console.error("Error during delete operation:", xhr, status, error);

                    Swal.fire({
                        title: "Deletion Failed",
                        text: xhr.responseJSON?.message || "An error occurred while deleting the staff.",
                        icon: "error"
                    });
                }
            });
        }
    });






});

// search
$("#search-staff").on("input", function () {
    var typedText = $("#search-staff").val();
    console.log("Search Staff");

    if (typedText.trim() === "") {
        initialize();
    } else {
        let jwtToken = localStorage.getItem('jwtToken');
        $.ajax({
            url: `http://localhost:8093/greenShadow/api/v1/staff/${typedText}`,
            type: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            success: (staff) => {
                console.log("Response received:", staff);


                const staffDetailsTbody = $("#staff-table-tBody");
                staffDetailsTbody.empty();
                staffDetailsTbody.append(`
                    <tr>
                        <td>${staff.staffId}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.lastName}</td>
                        <td>${staff.staffDesignation}</td>
                        <td>${staff.gender}</td>
                        <td>${staff.joinedDate}</td>
                        <td>${staff.contact}</td>
                        <td>${staff.email}</td>
                        <td>${staff.jobRole}</td>
                        <td>${staff.logCode}</td>
                    </tr>
                `);
            },
            error: (err) => {
                console.error("AJAX error:", err);
                alert("Failed to fetch staff details. Please try again.");
            }
        });
    }
});

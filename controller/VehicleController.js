let pop_id_vehicle;
let next_vehicle_id;
initialize();

function initialize() {
    setTimeout(() => {
        loadTableVehicle();
        nextVehicleId();

    }, 1000);
}

function loadTableVehicle() {
    let jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        console.error("JWT token not found. Please log in.");
        return;
    }

    $.ajax({
        url: 'http://localhost:8093/greenShadow/api/v1/vehicle',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        success: function (data) {
            const tableBody = $("#vehicle-table-tBody");
            tableBody.empty();

            if (data.length === 0) {
                console.log("No data available to display.");
                tableBody.append("<tr><td colspan='7'>No data available</td></tr>");
                return;
            }

            data.forEach((field) => {
                const row = `
                    <tr data-vehicle='${JSON.stringify(field)}'>
                        <td>${field.vehicleCode || 'N/A'}</td>
                        <td>${field.plateNumber || 'N/A'}</td>
                        <td>${field.vehicleCategory || 'N/A'}</td>
                        <td>${field.fuelType || 'N/A'}</td>
                        <td>${field.vehicleStatus || 'N/A'}</td>
                        <td>${field.staId || 'N/A'}</td>
                        <td>${field.remarks || 'N/A'}</td>
                    </tr>
                `;
                tableBody.append(row);
            });

            // Add click event to rows
            tableBody.find('tr').on('click', function () {
                const vehicleData = $(this).data('vehicle');
                populateVehicleModal(vehicleData);
                $('#update-vehicle').modal('show');
            });
        },
        error: function (xhr, status, error) {
            console.error(`Failed to load table data. Status: ${status}, Error: ${error}`);
        }
    });
}

function populateVehicleModal(vehicleData) {
    pop_id_vehicle = vehicleData.vehicleCode
    $("#update-vehicle-id").text(vehicleData.vehicleCode || 'N/A');
    $("#update-vehicle-plate-number").val(vehicleData.plateNumber || '');
    $("#old-category").text(vehicleData.vehicleCategory || 'Select Category');
    $("#old-fuel-type").text(vehicleData.fuelType || 'Select Fuel Type');
    $("#old-vehicleStatus").text(vehicleData.vehicleStatus || 'Select Status');
    $("#old-staff-id-vehicle").text(vehicleData.staffId || 'Select Staff ID');
    $("#update-remarks").val(vehicleData.remarks || '');

}

class VehicleModel {
    constructor(vehicleCode, plateNumber, vehicleCategory, fuelType, vehicleStatus, staId, remarks) {
        this.vehicleCode = vehicleCode;
        this.plateNumber = plateNumber;
        this.vehicleCategory = vehicleCategory;
        this.fuelType = fuelType;
        this.vehicleStatus = vehicleStatus;
        this.staId = staId;
        this.remarks = remarks;
    }
}

//save vehicle
$("#new-vehicle-save").click(function () {

    const vehicleCode = $("#new-vehicle-id").text();
    const plateNumber = $("#vehicle-plate-number").val();
    const vehicleCategory = $("#vehicleCategory option:selected").text();
    const fuelType = $("#fuelType option:selected").text();
    const vehicleStatus = $("#vehicleStatus option:selected").text();
    const staId = $("#staff-id-vehicle option:selected").text();
    const remarks = $("#remarks").val();


    if (!plateNumber || vehicleCategory === "Select Category" || fuelType === "Select Fuel Type") {
        Swal.fire({
            title: "Error",
            text: "Please fill in all required fields.",
            icon: "error",
        });
        return;
    }

    const vehicleDetails = new VehicleModel(vehicleCode, plateNumber, vehicleCategory, fuelType, vehicleStatus, staId, remarks);

    const jwtToken = localStorage.getItem("jwtToken");

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/vehicle",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(vehicleDetails),
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        success: function (response) {
            nextVehicleId();
            loadTableVehicle();
            Swal.fire({
                title: "Vehicle Saved Successfully!",
                text: "Success",
                icon: "success",
            });
            $("#new-vehicle").modal('hide');
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to save vehicle.",
                icon: "error",
            });
            console.error(xhr, status, error);
        },
    });
});

//generate next id
function nextVehicleId(){
    let jwtToken = localStorage.getItem('jwtToken');

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/vehicle/genVehicleID",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },

        success: (res) => {


            next_vehicle_id = res


            document.getElementById("new-vehicle-id").innerText = res;



        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next  ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next vehicle ID:", err);
        }
    });
}

//update vehicle
$("#update-vehicle-save").on("click", () => {
    const vehicleCode = $("#update-vehicle-id").text();
    const plateNumber = $("#update-vehicle-plate-number").val();
    const vehicleCategory = $("#update-vehicleCategory option:selected").text();
    const fuelType = $("#update-fuelType option:selected").text();
    const vehicleStatus = $("#update-vehicleStatus option:selected").text();
    const staId = $("#update-staff-id-vehicle option:selected").text();
    const remarks = $("#update-remarks").val();


    if (!plateNumber || vehicleCategory === "Select Category" || fuelType === "Select Fuel Type" || vehicleStatus === "Select Status" || staId === "Select Staff ID") {
        Swal.fire({
            title: "Error",
            text: "Please fill in all required fields.",
            icon: "error",
        });
        return;
    }


    const vehicleDetails = new VehicleModel(vehicleCode, plateNumber, vehicleCategory, fuelType, vehicleStatus, staId, remarks);


    const jwtToken = localStorage.getItem("jwtToken");

    $.ajax({
        url: `http://localhost:8093/greenShadow/api/v1/vehicle/${vehicleCode}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(vehicleDetails),
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        success: function (response) {
            loadTableVehicle();
            Swal.fire({
                title: "Vehicle updated Successfully!",
                text: "Success",
                icon: "success",
            });
            $("#update-vehicle").modal("hide");
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update vehicle.",
                icon: "error",
            });
            console.error(xhr, status, error);
        },
    });
});

//delete vehicle
$("#delete-vehicle").on("click", function () {
    let vehicleCode = pop_id_vehicle
    console.log("Search Crop");
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
                url: `http://localhost:8093/greenShadow/api/v1/vehicle/${vehicleCode}`,
                type: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
                success: (res) => {
                    loadTableVehicle();
                    Swal.fire({
                        title: "vehicle Delete successfully!",
                        text: "Success",
                        icon: "success"
                    });


                    $("#update-vehicle").modal("hide");


                },
                error: (err) => {
                    console.error("AJAX error:", err);
                    Swal.fire({
                        title: "vehicle Delete unsuccessfully!",
                        text: "Error",
                        icon: "Error"
                    });
                }
            });
        }
    });




});

//search vehicle id
$("#vehicle-search").on("input", function () {
    var typedText = $("#vehicle-search").val();
    console.log("Search vehicle:", typedText);

    if (typedText === "") {
        loadTableVehicle();
    } else {
        let jwtToken = localStorage.getItem("jwtToken");

        $.ajax({
            url: `http://localhost:8093/greenShadow/api/v1/vehicle/${typedText}`,
            type: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            success: (res) => {
                console.log("Response received:", res);

                const tableBody = $("#vehicle-table-tBody");
                tableBody.empty();

                if (Array.isArray(res)) {

                    res.forEach((vehicle) => {
                        tableBody.append(`
                            <tr>
                                <td>${vehicle.vehicleCode || "N/A"}</td>
                                <td>${vehicle.plateNumber || "N/A"}</td>
                                <td>${vehicle.vehicleCategory || "N/A"}</td>
                                <td>${vehicle.fuelType || "N/A"}</td>
                                <td>${vehicle.vehicleStatus || "N/A"}</td>
                                <td>${vehicle.staffId || "N/A"}</td>
                                <td>${vehicle.remarks || "N/A"}</td>
                            </tr>
                        `);
                    });
                } else {

                    tableBody.append(`
                        <tr>
                            <td>${res.vehicleCode || "N/A"}</td>
                            <td>${res.plateNumber || "N/A"}</td>
                            <td>${res.vehicleCategory || "N/A"}</td>
                            <td>${res.fuelType || "N/A"}</td>
                            <td>${res.vehicleStatus || "N/A"}</td>
                            <td>${res.staffId || "N/A"}</td>
                            <td>${res.remarks || "N/A"}</td>
                        </tr>
                    `);
                }
            },
            error: (err) => {
                console.error("AJAX error:", err);
                alert(
                    err.responseJSON?.message ||
                    "Failed to fetch vehicle details. Please try again."
                );
            },
        });
    }
});

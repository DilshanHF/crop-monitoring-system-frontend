initialize();



function initialize() {
    setTimeout(() => {
        loadTableEquipment()
        nextEquipmentId()


    }, 1000);
}

function loadTableEquipment() {
    $(document).ready(function () {

        function loadTableEquipment() {
            let jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error("JWT token not found. Please log in.");
                return;
            }

            $.ajax({
                url: 'http://localhost:8093/greenShadow/api/v1/equipment',
                method: 'GET',
                headers: { 'Authorization': `Bearer ${jwtToken}` },
                success: function (data) {
                    populateEquipmentTable(data);
                },
                error: function (xhr, status, error) {
                    console.error(`Failed to load table data. Status: ${status}, Error: ${error}`);
                }
            });
        }


        function populateEquipmentTable(equipmentList) {
            const tableBody = $("#equipment-table-tBody");
            tableBody.empty();

            equipmentList.forEach(equipment => {
                const row = `
                <tr data-equipment='${JSON.stringify(equipment)}'>
                    <td>${equipment.equipmentId}</td>
                    <td>${equipment.equipmentName}</td>
                    <td>${equipment.equipmentType}</td>
                    <td>${equipment.equipmentStatus}</td>
                    <td>${equipment.staffId}</td>
                    <td>${equipment.fieldCode}</td>
                </tr>
            `;
                tableBody.append(row);
            });
        }


        $('#equipment-table-tBody').on('click', 'tr', function () {
            const equipmentData = $(this).data('equipment');
            populateEquipmentModal(equipmentData);
            $('#update-equipment').modal('show');
        });


        function populateEquipmentModal(equipmentData) {
            $("#update-equipment-id").text(equipmentData.equipmentId || 'N/A');
            $("#update-equipmentName").val(equipmentData.equipmentName || '');
            $("#update-equipmentType").val(equipmentData.equipmentType || '');
            $("#update-status").text(equipmentData.equipmentStatus || 'Select Status');
            $("#update-staff-id").text(equipmentData.staffId || 'Select Staff ID');
            $("#update-field-id").text(equipmentData.fieldCode || 'Select Field Code');
        }


        loadTableEquipment();
    });
}



//new Equipment
$("#new-equipment-save").click(function () {

    const equipmentId = $("#new-equipment-id").text();
    const equipmentName = $("#equipmentName").val();
    const equipmentType = $("#equipmentType").val();
    const equipmentStatus = $("#equipmentStatus option:selected").text();
    const staffIdEquipment = $("#staff-id-equipment option:selected").text();
    const fieldIdEquipment = $("#field-id-equipment option:selected").text();

    if (!equipmentName || equipmentType === "" || equipmentStatus === "Select Status" ||
        staffIdEquipment === "Select Staff ID" || fieldIdEquipment === "Select Field ID") {
        Swal.fire({
            title: "Error",
            text: "Please fill in all required fields.",
            icon: "error",
        });
        return;
    }

    const equipmentModel = new EquipmentModel(
        equipmentId,
        equipmentName,
        equipmentType,
        equipmentStatus,
        staffIdEquipment,
        fieldIdEquipment
    );
    console.log("equipment model print:"+equipmentModel.staffId)

    const jwtToken = localStorage.getItem("jwtToken");

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/equipment",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(equipmentModel),
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        success: function (response) {
            loadTableEquipment();
            Swal.fire({
                title: "Equipment Saved Successfully!",
                text: "Success",
                icon: "success",
            });
            $("#new-equipment").modal("hide");
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to save equipment.",
                icon: "error",
            });
            console.error("Error details:", xhr.responseText, status, error);
        },
    });
});

//generate next id
function nextEquipmentId(){
    let jwtToken = localStorage.getItem('jwtToken');

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/equipment/genEquipmentID",
        type: "GET",
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },

        success: (res) => {


            next_vehicle_id = res


            document.getElementById("new-equipment-id").innerText = res;



        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next  ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next equipment ID:", err);
        }
    });
}

//update vehicle
$("#update-equipment-save").on("click", () => {
    const equipmentId = $("#update-equipment-id").text();
    const equipmentName = $("#update-equipmentName").val();
    const equipmentType = $("#update-equipmentType").val();
    const equipmentStatus = $("#update-equipmentStatus option:selected").text();
    const staffIdEquipment = $("#update-staff-id-equipment option:selected").text();
    const fieldIdEquipment = $("#update-field-id-equipment option:selected").text();


    if (!equipmentName || equipmentType === "" || equipmentStatus === "Select Status" ||
        staffIdEquipment === "Select Staff ID" || fieldIdEquipment === "Select Field ID") {
        Swal.fire({
            title: "Error",
            text: "Please fill in all required fields.",
            icon: "error",
        });
        return;
    }


    const equipmentModel = new EquipmentModel(
        equipmentId,
        equipmentName,
        equipmentType,
        equipmentStatus,
        staffIdEquipment,
        fieldIdEquipment
    );


    const jwtToken = localStorage.getItem("jwtToken");

    $.ajax({
        url: `http://localhost:8093/greenShadow/api/v1/equipment/${equipmentId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(equipmentModel),
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        success: function (response) {
            loadTableEquipment();
            Swal.fire({
                title: "Equipment Updated Successfully!",
                text: "Success",
                icon: "success",
            });
            $("#update-equipment").modal("hide");
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to updated equipment.",
                icon: "error",
            });
            console.error("Error details:", xhr.responseText, status, error);
        },
    });
});


class EquipmentModel {
    constructor(equipmentId,equipmentName,equipmentType,equipmentStatus,staffId,fieldCode) {
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.equipmentType = equipmentType;
        this.equipmentStatus = equipmentStatus;
        this.staffId = staffId;
        this.fieldCode = fieldCode;


    }

}

//search equipment id
$("#equipment-search").on("input", function () {
    var typedText = $("#equipment-search").val();
    console.log("Search vehicle:", typedText);

    if (typedText === "") {
        loadTableEquipment()
    } else {
        let jwtToken = localStorage.getItem("jwtToken");

        $.ajax({
            url: `http://localhost:8093/greenShadow/api/v1/equipment/${typedText}`,
            type: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            success: (res) => {
                console.log("Response received:", res);


                $("#equipment-table-tBody").empty();

                if (res.length > 0) {
                    res.forEach((equipment) => {
                        let row = `
                            <tr>
                                <td>${equipment.equipmentId}</td>
                                <td>${equipment.equipmentName}</td>
                                <td>${equipment.equipmentType}</td>
                                <td>${equipment.equipmentStatus}</td>
                                <td>${equipment.staffId}</td>
                                <td>${equipment.fieldCode}</td>
                            </tr>
                        `;
                        $("#equipment-table-tBody").append(row);
                    });
                } else {

                    let noDataRow = `
                        <tr>
                            <td colspan="6" class="text-center">No equipment found.</td>
                        </tr>
                    `;
                    $("#equipment-table-tBody").append(noDataRow);
                }
            },
            error: (err) => {
                console.error("AJAX error:", err);
                alert(
                    err.responseJSON?.message ||
                    "Failed to fetch equipment details. Please try again."
                );
            },
        });
    }
});

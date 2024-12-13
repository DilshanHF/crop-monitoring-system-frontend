const wrapper = document.querySelector(".wrapper"),
    signupHeader = document.querySelector(".signup header"),
    loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
    wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

class UseModelSignUP {
    constructor(email, password, role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

}
class UseModelSignIn {
    constructor(email, password) {
        this.email = email;
        this.password = password;

    }

}

$('#sign-up').on('click', () => {
    console.log("click sign up button");


    const role = $("#staff-role option:selected").text();
    var email = $("#sign-up-email").val();
    var password = $("#sign-up-password").val();
    var re_password = $("#sign-up-re-password").val();

    if (role == "" || email == "" || password == "" || re_password == "") {
        Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please fill all fields",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }


    let user = new UseModelSignUP(email, password, role);
    let userJson = JSON.stringify(user);

    console.log(role, email, password, re_password);
    if (password == re_password) {
        $.ajax({
            url: "http://localhost:8093/greenShadow/api/v1/auth",
            type: "POST",
            data: userJson,
            contentType: "application/json",
            success: (res) => {

                if (res.token) {

                    localStorage.setItem("jwtToken", res.token);

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your details saved",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    window.location.href = "index1.html";
                } else {
                    console.error("Token not found in response");
                }
            },
            error: (res) => {
                console.error(res);
                Swal.fire({
                    title: "Error",
                    text: "Failed to create user. Please try again later.",
                    icon: "error"
                });
            }
        });
    } else {
        Swal.fire({
            title: "Password Not Match!",
            text: "Please ensure the passwords are the same.",
            icon: "question"
        });
    }
});


$('#sign-In').on('click', () => {
    console.log("Click sign-in button");

    var email = $("#sign-In-email").val();
    var password = $("#sign-In-password").val();

    if (email == "" || password == "") {
        Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please fill all fields",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }



    let userSignIn = new UseModelSignIn(email, password);
    let userJson = JSON.stringify(userSignIn);

    console.log(email, password);

    $.ajax({
        url: "http://localhost:8093/greenShadow/api/v1/auth/signIn",
        type: "POST",
        data: userJson,
        contentType: "application/json",
        success: (res) => {

            if (res.token) {

                localStorage.setItem("jwtToken", res.token);

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login successful",
                    showConfirmButton: false,
                    timer: 1000
                });

                window.location.href = "index1.html";
            } else {
                console.error("Token not found in response");
                Swal.fire({
                    title: "Error",
                    text: "Login successful but token is missing!",
                    icon: "error"
                });
            }
        },
        error: (res) => {
            console.error(res);
            Swal.fire({
                title: "Login Failed",
                text: "Incorrect email or password. Please try again.",
                icon: "error"
            });
        }
    });
});








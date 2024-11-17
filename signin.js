import { getAuth, signInWithEmailAndPassword } from "./firebase.js";

const auth = getAuth();

let userEmail = document.getElementById("loginemail");
let userPassword = document.getElementById("loginpass");
let loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    if (userEmail.value.trim() === "" || userPassword.value.trim() === "") {
        Swal.fire({
            title: "Warning!",
            text: "Please fill all fields",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    signInWithEmailAndPassword(auth, userEmail.value.trim(), userPassword.value.trim())
        .then((userCredential) => {
            Swal.fire({
                title: "Success!",
                text: "You have successfully logged in!",
                icon: "success",
                confirmButtonText: "OK"
            })


                .then(() => {
                    setTimeout(() => {
                        userEmail.value = "";
                        userPassword.value = "";
                        location.href = "profile.html";
                    }, 0);
                });

        })
        .catch((error) => {
    
            switch (error.code) {
                case "auth/invalid-email":
                    Swal.fire("Error", "Invalid email format. Please enter a valid email address.", "error");
                    break;
                case "auth/too-many-requests":
                    Swal.fire("Error", "Too many login attempts. Please try again later.", "error");
                    break;
                case "auth/network-request-failed":
                    Swal.fire("Error", "Network error. Please check your internet connection.", "error");
                    break;
                default:
                    Swal.fire("Error", `Something went wrong: ${error.message}`, "error");
                    break;
            }

            userEmail.value = "";
            userPassword.value = "";
        });
});
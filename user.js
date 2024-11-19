import { getAuth, signOut, doc, deleteDoc, getDoc, db } from "./firebase.js";

const auth = getAuth();

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

let logoutBtn = document.getElementById("logoutBtn");
let deleteBtn = document.getElementById("deleteAccountBtn");

const userDataString = urlParams.get("data");
const userData = JSON.parse(decodeURIComponent(userDataString));
const userImageElement = document.getElementById("userImage")

document.getElementById("fullName").textContent = userData.fullName || "Not Available";
document.getElementById("email").textContent = userData.email || "Not Available";
document.getElementById("dob").textContent = userData.dob || "Not Available";
document.getElementById("gender").textContent = userData.gender || "Not Available";
document.getElementById("bio").textContent = userData.bio || "Not Available";

if (userId) {
    const userDocRef = doc(db, "users", userId);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User Data:", userData); 

            if (userData.imageUrl) {
                userImageElement.src = userData.imageUrl;
                userImageElement.style.display = "block";
            } else {
                console.log("No image URL found for this user.");
                userImageElement.style.display = "none";
            }

            document.getElementById("userEmail").textContent = userData.email || "Not Available";
            document.getElementById("userUID").textContent = userId;
        } else {
            console.log("No such user!");
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
    });
}


logoutBtn.addEventListener("click", () => {
    console.log("LogOut");

    signOut(auth).then(() => {
        Swal.fire({
            title: "Success!",
            text: "You have been logged out successfully!",
            icon: "success",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "signin.html";
        });
    }).catch((error) => {
        console.error("Sign Out Error", error);
        Swal.fire({
            title: "Error!",
            text: "Error signing out: " + error.message,
            icon: "error",
            confirmButtonText: "OK"
        });
    });
});

deleteBtn.addEventListener("click", async () => {
    console.log("Delete button clicked");

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log("User confirmed deletion");

            try {
                if (!userId) {
                    console.error("No userId found!");
                    return;
                }

                await deleteDoc(doc(db, "users", userId));
                console.log("User deleted successfully!");

                Swal.fire(
                    'Deleted!',
                    'The user has been deleted.',
                    'success'
                ).then(() => {
                    window.location.href = "index.html";
                });
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire({
                    title: "Error!",
                    text: "There was an issue deleting the user: " + error.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } else {
            console.log("User cancelled deletion");
            Swal.fire(
                'Cancelled',
                'The user was not deleted.',
                'info'
            );
        }
    });
});

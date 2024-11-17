import { getAuth, signOut, doc, deleteDoc, getDoc, db } from "./firebase.js";

const auth = getAuth();
// Get the userId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

let logoutBtn = document.getElementById("logoutBtn");
let deleteBtn = document.getElementById("deleteAccountBtn");

// URL se user data ko decode karein
const userDataString = urlParams.get("data");
const userData = JSON.parse(decodeURIComponent(userDataString));

// Show user data on the page
document.getElementById("fullName").textContent = userData.fullName || "Not Available";
document.getElementById("email").textContent = userData.email || "Not Available";
document.getElementById("dob").textContent = userData.dob || "Not Available";
document.getElementById("gender").textContent = userData.gender || "Not Available";
document.getElementById("bio").textContent = userData.bio || "Not Available";

// Fetch user data from Firestore if userId is available
if (userId) {
    // Get the user data from Firestore
    const userDocRef = doc(db, "users", userId);

    getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            // Display the user data
            document.getElementById("userEmail").textContent = userData.email;
            document.getElementById("userUID").textContent = userId;
        } else {
            console.log("No such user!");
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
    });
}

// Logout button event
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

// Delete button event
deleteBtn.addEventListener("click", async () => {
    console.log("Delete button clicked");

    // Confirm deletion with SweetAlert before proceeding
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
                // Ensure userId is available
                if (!userId) {
                    console.error("No userId found!");
                    return;
                }

                // Delete the user document from Firestore using the userId
                await deleteDoc(doc(db, "users", userId));
                console.log("User deleted successfully!");

                // Show success message after deletion
                Swal.fire(
                    'Deleted!',
                    'The user has been deleted.',
                    'success'
                ).then(() => {
                    // Redirect to the user list page after deletion
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

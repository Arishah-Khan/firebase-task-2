import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, collection, addDoc, serverTimestamp, db} from "./firebase.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

// DOM Elements
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const bio = document.getElementById("bio");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleBtn"); // Ensure this exists in the HTML

signupBtn.addEventListener("click", async () => {
  console.log("Button clicked");

  const userFullName = fullName.value.trim();
  const userEmail = email.value.trim();
  const userPassword = password.value.trim();
  const userDob = dob.value.trim();
  const userGender = gender.value;
  const userBio = bio.value.trim();

  console.log(userFullName, userEmail, userPassword, userDob)

  // Validate required fields
  if (userEmail === "" || userPassword === "" || userFullName === "") {
    Swal.fire({
      title: "Warning!",
      text: "Please fill all required fields",
      icon: "warning",
      confirmButtonText: "OK"
    });
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
    const user = userCredential.user;

    console.log("User created:", user);
    

    // Save user details to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      fullName: userFullName,
      email: userEmail,
      dob: userDob,
      gender: userGender,
      bio: userBio,
      createdAt: serverTimestamp(),
    });

    Swal.fire("Success!", "Account created successfully", "success").then(() => {
      location.href = "signin.html"; // Redirect to sign-in page
    });

  } catch (error) {
    console.error("Error during sign-up:", error);

    let errorMessage = "Something went wrong. Please try again.";
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already in use.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error.";
        break;
      default:
        errorMessage = error.message;
    }

    Swal.fire("Error", errorMessage, "error");
  }
});

// Google Sign-In
googleBtn.addEventListener("click", () => {
  console.log("Google sign-in button clicked");

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Google Sign-In successful:", result.user);

      // Handle Google Sign-In success
      Swal.fire({
        icon: "success",
        title: "Sign-In Successful",
        text: `Welcome, ${result.user.displayName}! Redirecting to your profile...`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "profile.html"; // Redirect to profile page
      });
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);

      let message = "An unknown error occurred.";
      switch (error.code) {
        case "auth/popup-blocked":
          message = "Popup was blocked. Please allow popups.";
          break;
        case "auth/popup-closed-by-user":
          message = "You closed the popup. Try again.";
          break;
        case "auth/invalid-api-key":
          message = "Invalid API key.";
          break;
        case "auth/network-request-failed":
          message = "Network error.";
          break;
        case "auth/account-exists-with-different-credential":
          message = "An account exists with this email.";
          break;
        case "auth/operation-not-allowed":
          message = "Google Sign-In is not enabled.";
          break;
      }

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Sign-In Failed",
        text: message,
      });
    });
});

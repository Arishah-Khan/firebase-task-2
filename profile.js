import { collection, addDoc, onSnapshot, db, deleteDoc, doc, updateDoc } from "./firebase.js";

// DOM elements
const userListDiv = document.getElementById("userList");
const globalPostsContainer = document.getElementById("globalPostsContainer"); // Global container for all posts

// Listen for real-time updates to users
onSnapshot(collection(db, "users"), (querySnapshot) => {
  userListDiv.innerHTML = ""; // Clear previous data

  // Create a flex container to hold all users
  const usersContainer = document.createElement("div");
  usersContainer.style.display = "flex";
  usersContainer.style.justifyContent = "center";
  usersContainer.style.alignItems = "center";
  usersContainer.style.flexWrap = "wrap"; // Wrap users to new rows if needed
  usersContainer.style.gap = "10px"; // Add spacing between items
  usersContainer.style.padding = "10px"; // Optional padding

  // Iterate through each user
  querySnapshot.forEach((userDoc) => {
    const userData = userDoc.data();

    // Create a new div for each user
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-item");
    userDiv.style.margin = "10px";
    userDiv.style.border = "1px solid #ddd";
    userDiv.style.borderRadius = "10px";
    userDiv.style.display = "flex";
    userDiv.style.flexDirection = "column";
    userDiv.style.alignItems = "center";

    // Display basic user information and Add Post button
    userDiv.innerHTML = `
      <img src="image/user.png" alt="Profile Image" class="profile-img" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
      <h3 class="userName">${userData.fullName}</h3>
      <div class="profile">
        <button class="viewProfileBtn">View Profile</button>
        <button class="addPostBtn">Add Post</button>
      </div>

      <!-- Profile Section (Initially Hidden) -->
      <div class="profileSection" style="display: none;">
        <h4>Full Profile</h4>
        <p><strong>Full Name:</strong> ${userData.fullName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Date of Birth:</strong> ${userData.dob}</p>
        <p><strong>Gender:</strong> ${userData.gender}</p>
        <p><strong>Bio:</strong> ${userData.bio}</p>
      </div>

      <!-- Post Section (Initially Hidden) -->
      <div class="postSection" style="display: none;">
        <!-- Title Field -->
        <input class="postTitle" type="text" placeholder="Post Title" />

        <!-- Description (Post Content) Field -->
        <textarea class="postDescription" placeholder="Write your post..."></textarea>
        <div class="submit">
          <button class="submitPostBtn">Submit Post</button>
        </div>
      </div>
    `;

    // Append the user div to the user container
    usersContainer.appendChild(userDiv);

    // Handle "Add Post" button click to show the post input section
    const addPostBtn = userDiv.querySelector(".addPostBtn");
    const postSection = userDiv.querySelector(".postSection");

    addPostBtn.addEventListener("click", () => {
      postSection.style.display = "block"; // Show the post input section
    });

    // Handle "View Profile" button click to show the full profile
    const viewProfileBtn = userDiv.querySelector(".viewProfileBtn");
    const profileSection = userDiv.querySelector(".profileSection");

    viewProfileBtn.addEventListener("click", () => {
      const userId = userDoc.id; // Firebase user ID
      const userDataString = encodeURIComponent(JSON.stringify(userData)); // User data encode karein
      window.location.href = `user.html?userId=${userId}&data=${userDataString}`;
    });

    // Handle submitting a post globally
    const submitPostBtn = userDiv.querySelector(".submitPostBtn");

    submitPostBtn.addEventListener("click", async () => {
      const postTitle = userDiv.querySelector(".postTitle").value.trim();
      const postDescription = userDiv.querySelector(".postDescription").value.trim();

      if (postTitle && postDescription) {
        try {
          // Add the post to the global posts collection
          await addDoc(collection(db, "posts"), {
            title: postTitle,
            content: postDescription,
            createdAt: new Date(),
            userId: userDoc.id,
            userName: userData.fullName,
          });

          // Clear the post fields
          userDiv.querySelector(".postTitle").value = "";
          userDiv.querySelector(".postDescription").value = ""; // Clear post description field

          // Hide the post input field after submission
          postSection.style.display = "none"; // Hide post input field

          // Show SweetAlert success
          Swal.fire({
            icon: 'success',
            title: 'Post added successfully!',
            showConfirmButton: false,
            timer: 1500
          });

        } catch (error) {
          console.error("Error adding post:", error);
        }
      }
    });

  });

  // Append the users container to the main list div
  userListDiv.appendChild(usersContainer);
  userListDiv.appendChild(globalPostsContainer);
});

onSnapshot(collection(db, "posts"), (querySnapshot) => {
  globalPostsContainer.innerHTML = ""; // Clear previous posts

  querySnapshot.forEach((postDoc) => {
    const postData = postDoc.data();

    // Check if heading is already appended, to avoid duplication
    if (!document.querySelector('.posts-heading')) {
      const postsHeading = document.createElement('h3');
      postsHeading.textContent = "User Posts";
      postsHeading.classList.add('posts-heading');
      globalPostsContainer.appendChild(postsHeading);
    }

    // Create a post div
    const globalPostDiv = document.createElement("div");
    globalPostDiv.classList.add("global-post");
    globalPostDiv.style.padding = "10px";
    globalPostDiv.style.border = "1px solid #ccc";
    globalPostDiv.style.marginTop = "10px";
    globalPostDiv.style.borderRadius = "5px";

    globalPostDiv.innerHTML = `
      <h4 class="userNames">Posted by: <strong class="strong">${postData.userName}</strong></h4>
      <h5>Title: <strong class="strong">${postData.title}</strong></h5>
      <p>Description: ${postData.content}</p>
      <div class="postBtn">
        <button class="editPostBtn">Edit Post</button>
        <button class="deletePostBtn">Delete Post</button>
      </div>
    `;

    globalPostsContainer.appendChild(globalPostDiv);

    const editPostBtn = globalPostDiv.querySelector(".editPostBtn");
    const deletePostBtn = globalPostDiv.querySelector(".deletePostBtn");

    // Edit Post Button
    editPostBtn.addEventListener("click", async () => {
      // Using SweetAlert for title and description edit
      const { value: title } = await Swal.fire({
        title: 'Edit Post Title',
        input: 'text',
        inputValue: postData.title, // pre-fill with the current title
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to enter a title!';
          }
        }
      });

      if (title) {
        const { value: content } = await Swal.fire({
          title: 'Edit Post Content',
          input: 'textarea',
          inputValue: postData.content, // pre-fill with the current content
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to enter content!';
            }
          }
        });

        if (content) {
          // Update the post with new title and content
          try {
            await updateDoc(doc(db, "posts", postDoc.id), {
              title: title,
              content: content
            });

            // SweetAlert for success
            Swal.fire({
              icon: 'success',
              title: 'Post updated successfully!',
              showConfirmButton: false,
              timer: 1500
            });
          } catch (error) {
            console.error("Error updating post:", error);
          }
        }
      }
    });

    // Delete Post Button
    deletePostBtn.addEventListener("click", async () => {
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
          try {
            await deleteDoc(doc(db, "posts", postDoc.id));
            // SweetAlert for success
            Swal.fire({
              icon: 'success',
              title: 'Post deleted successfully!',
              showConfirmButton: false,
              timer: 1500
            });
          } catch (error) {
            console.error("Error deleting post:", error);
          }
        }
      });
    });
  });
});

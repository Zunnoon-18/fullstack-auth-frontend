// HASH FUNCTION USING SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}


// SIGNUP FORM VALIDATION
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    console.log("Signup clicked");
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let isValid = true;

        // Clear old errors
        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("passwordError").textContent = "";
        document.getElementById("confirmError").textContent = "";

        if (name === "") {
            document.getElementById("nameError").textContent = "Name is required";
            isValid = false;
        }

        if (email === "") {
            document.getElementById("emailError").textContent = "Email is required";
            isValid = false;
        }

        if (password === "") {
            document.getElementById("passwordError").textContent = "Password is required";
            isValid = false;
        }

        if (confirmPassword === "") {
            document.getElementById("confirmError").textContent = "Confirm your password";
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById("confirmError").textContent = "Passwords do not match";
            isValid = false;
        }

        if (isValid) {

    try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Signup successful!");
        signupForm.reset();
        window.location.href = "login.html";
    } else {
        document.getElementById("emailError").textContent = data.message;
    }

    } catch (error) {
    console.error(error);
    alert("Server error");
    }
}
    });
}
    

// LOGIN FORM LOGIC
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById("loginEmail").value.trim();
        const loginPassword = document.getElementById("loginPassword").value.trim();

        try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: loginEmail,
            password: loginPassword
        })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("loginPasswordError").textContent = data.message;
    }

} catch (error) {
    console.error(error);
    alert("Server error");
}
    });
}


// DASHBOARD LOGIC
const usernameSpan = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");

if (usernameSpan) {

    const isLoggedIn =
    localStorage.getItem("isLoggedIn") ||
    sessionStorage.getItem("isLoggedIn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!isLoggedIn || !currentUser) {
    window.location.href = "login.html";
} else {
    usernameSpan.textContent = currentUser.name;
}
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}
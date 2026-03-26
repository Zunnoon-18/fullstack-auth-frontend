const BASE_URL = "https://auth-backend-1avv.onrender.com";


// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let isValid = true;

        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("passwordError").textContent = "";
        document.getElementById("confirmError").textContent = "";

        if (!name) {
            document.getElementById("nameError").textContent = "Name is required";
            isValid = false;
        }

        if (!email) {
            document.getElementById("emailError").textContent = "Email is required";
            isValid = false;
        }

        if (!password) {
            document.getElementById("passwordError").textContent = "Password is required";
            isValid = false;
        }

        if (!confirmPassword) {
            document.getElementById("confirmError").textContent = "Confirm your password";
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById("confirmError").textContent = "Passwords do not match";
            isValid = false;
        }

        if (isValid) {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Signup successful!");
                    signupForm.reset();
                    window.location.href = "login.html";
                } else {
                    document.getElementById("emailError").textContent = data.message || "Signup failed";
                }

            } catch (error) {
                console.error(error);
                alert("Server error");
            }
        }
    });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById("loginEmail").value.trim();
        const loginPassword = document.getElementById("loginPassword").value.trim();

        document.getElementById("loginPasswordError").textContent = "";

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
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

            if (res.ok && data.token) {
                // ✅ ONLY TOKEN (NO OLD SYSTEM)
                localStorage.setItem("token", data.token);

                window.location.href = "dashboard.html";
            } else {
                document.getElementById("loginPasswordError").textContent = data.message || "Login failed";
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    });
}


// ================= DASHBOARD =================
const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    } else {
        // ✅ NO API CALL (temporary stable version)

        // Get user name from token (simple decode)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userName = payload.name || "User";

            welcomeText.textContent = `Welcome, ${userName} 👋`;
        } catch (err) {
            welcomeText.textContent = "Welcome 👋";
        }
    }
}


// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}
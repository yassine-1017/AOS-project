const API_URL = "http://127.0.0.1:8000/auth";

// REGISTER
function register() {
    const username = document.getElementById("username").value.trim();
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // FRONT VALIDATION
    if (!username || !email || !password) {
        document.getElementById("message").innerText = "All fields are required";
        return;
    }

    authFetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, first_name, last_name, email, password })

    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.status === "success") {
            window.location.href = "login.html";
        } else {
            // HANDLE DJANGO ERRORS
            let errorMsg = "";

            if (data.message) {
                errorMsg = data.message;
            } else {
                // Extract first error from Django
                const firstKey = Object.keys(data)[0];
                errorMsg = data[firstKey][0];
            }

            document.getElementById("message").innerText = errorMsg;
        }
    })
    .catch(err => console.error(err));
}

// LOGIN
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        document.getElementById("message").innerText = "All fields are required";
        return;
    }

    fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            localStorage.setItem("access", data.data.access);
            localStorage.setItem("refresh", data.data.refresh);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("message").innerText = data.message || "Login failed";
        }
    });
}

// GET USER INFO
function getUser() {
    authFetch("http://127.0.0.1:8000/auth/me", {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("username").innerText = data.data.username;

            document.getElementById("userInfo").innerHTML = `
                <strong>Username:</strong> ${data.data.username}<br>
                <strong>Role:</strong> ${data.data.role}
            `;
        } else {
            window.location.href = "login.html";
        }
    });
}

// LOGOUT
function logout() {
    const refresh = localStorage.getItem("refresh");

    authFetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh })
    })
    .then(() => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}

// AUTO LOAD USER ON DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {
    getUser();
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (window.location.pathname.includes("login.html")) {
            login();
        }
        if (window.location.pathname.includes("register.html")) {
            register();
        }
    }
});

function authFetch(url, options = {}) {
    const token = localStorage.getItem("access");

    if (!options.headers) {
        options.headers = {};
    }

    options.headers["Authorization"] = "Bearer " + token;

    return fetch(url, options);
}

function checkAuth() {
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "login.html";
    }
}

function goToTables() {
    alert("Tables service will be implemented by another microservice");
}

function goToReservations() {
    alert("Reservation service will be implemented by another microservice");
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-220px";
    } else {
        sidebar.style.left = "0px";
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById("userDropdown");

    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
}
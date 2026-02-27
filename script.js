// Hardcoded accounts (3 students + 1 admin)
const users = [
    {username: "marcenoaugustine@gmail.com", password: "@August1008", role: "student", name: "Augustine Josh Marceno"},
    {username: "mirabitejohnson@gmail.com", password: "083008", role: "student", name: "Johnson Roi Mirabite"},
    {username: "dlvg.erikmiguel@gmail.com", password: "020708", role: "student", name: "Erik Miguel Dela Vega"},
    {username: "rnhsadmin301770", password: "301770", role: "admin", name: "Romblon National High School"}
];

// ------------------ LOGIN ------------------
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const hardcodedUsers = [
        {username: "marcenoaugustine@gmail.com", password: "@August1008", role: "student", name: "Augustine Josh Marceno"},
        {username: "mirabitejohnson@gmail.com", password: "083008", role: "student", name: "Johnson Roi Mirabite"},
        {username: "dlvg.erikmiguel@gmail.com", password: "020708", role: "student", name: "Erik Miguel Dela Vega"},
        {username: "rnhsadmin301770", password: "301770", role: "admin", name: "Romblon National High School"}
    ];

    const allUsers = [...hardcodedUsers, ...storedUsers];

    const user = allUsers.find(u => u.username === username && u.password === password);

    if(user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if(user.role === "admin") {
            window.location.href = "admin.html"; // Admin goes to admin dashboard
        } else {
            window.location.href = "home.html";  // Student goes to homepage
        }
    } else {
        document.getElementById("error").innerText = "Invalid username or password!";
    }
}

// ------------------ STUDENT CHECK ------------------
function checkLogin() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== "student") {
        window.location.href = "index.html";
    } else {
        document.getElementById("studentName").innerText = user.name;
        loadStudentMessages();
    }
}

// ------------------ ADMIN CHECK ------------------
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== "admin") {
        window.location.href = "index.html";
    } else {
        loadMessages();
    }
}

function signup() {
    const name = document.getElementById("signupName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    let existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Merge hardcoded users so signup can see them
    const hardcodedUsers = [
        {username: "student1", password: "123", role: "student", name: "Juan Dela Cruz"},
        {username: "student2", password: "123", role: "student", name: "Maria Santos"},
        {username: "student3", password: "123", role: "student", name: "Pedro Reyes"},
        {username: "admin", password: "admin123", role: "admin", name: "Principal"}
    ];

    const allUsers = [...hardcodedUsers, ...existingUsers];

    // Check if username exists
    if(allUsers.find(u => u.username === username)) {
        document.getElementById("signupError").innerText = "Username already taken!";
        document.getElementById("signupSuccess").innerText = "";
        return;
    }

    // Add new student
    const newStudent = {username, password, role: "student", name};
    existingUsers.push(newStudent);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    document.getElementById("signupSuccess").innerText = "Sign Up Successful! You can now log in.";
    document.getElementById("signupError").innerText = "";

    // Clear form
    document.getElementById("signupName").value = "";
    document.getElementById("signupUsername").value = "";
    document.getElementById("signupPassword").value = "";
}

// ------------------ LOGOUT ------------------
function logout(event) {
    if(event) event.preventDefault(); // stop default action if any
    localStorage.removeItem("loggedInUser"); // remove login info
    window.location.href = "index.html"; // redirect to login page
}
// ------------------ STUDENT SEND MESSAGE ------------------
function sendMessage() {
    const messageText = document.getElementById("message").value;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (messageText.trim() === "") {
        alert("Please enter a message.");
        return;
    }

    let messages = JSON.parse(localStorage.getItem("messages")) || [];

    messages.push({
        id: Date.now(),
        sender: user.name,
        message: messageText,
        status: "Pending", // default status
        date: new Date().toLocaleString()
    });

    localStorage.setItem("messages", JSON.stringify(messages));
    document.getElementById("message").value = "";
    loadStudentMessages();
}

// ------------------ STUDENT LOAD MESSAGES ------------------
function loadStudentMessages() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const container = document.getElementById("studentMessages");

    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    const myMessages = messages.filter(m => m.sender === user.name);

    if (myMessages.length === 0) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    container.innerHTML = ""; // clear previous messages

    myMessages.forEach(msg => {
        const card = document.createElement("div");
        card.className = "card"; // apply card styles

        card.innerHTML = `
            <strong>${msg.sender}</strong>
            <p>${msg.message}</p>
            <p>Status: <strong>${msg.status}</strong></p>
            <small>${msg.date}</small>
        `;

        container.appendChild(card);
    });
}
// ------------------ ADMIN LOAD MESSAGES ------------------
function loadMessages() {
    const container = document.getElementById("messageList");
    let messages = JSON.parse(localStorage.getItem("messages")) || [];

    if (messages.length === 0) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    container.innerHTML = "";

    messages.forEach(msg => {
        // auto-mark Pending as Read
        if(msg.status === "Pending") msg.status = "Read";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <strong>${msg.sender}</strong>
            <p>${msg.message}</p>
            <p>Status: ${msg.status}</p>
            ${msg.status !== "Approved" && msg.status !== "Rejected" ? `
                <button class="approve-btn" onclick="updateMessage(${msg.id}, 'Approved')">Approve</button>
                <button class="reject-btn" onclick="updateMessage(${msg.id}, 'Rejected')">Reject</button>
            ` : ""}
        `;

        container.appendChild(card);
    });

    localStorage.setItem("messages", JSON.stringify(messages));
}
// ------------------ ADMIN UPDATE MESSAGE STATUS ------------------
function updateMessage(id, newStatus) {
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages = messages.map(msg => {
        if(msg.id === id) msg.status = newStatus;
        return msg;
    });
    localStorage.setItem("messages", JSON.stringify(messages));
    loadMessages(); // refresh admin dashboard
}
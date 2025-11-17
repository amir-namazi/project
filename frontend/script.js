document.getElementById("loginBtn").addEventListener("click", async function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("نام کاربری یا رمز را وارد کنید");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        console.log("RAW response:", res);
        const data = await res.json();
        console.log("Server Response:", data);

        if (data.token) {
            alert("ورود موفق!");
            localStorage.setItem("token", data.token);
        } else {
            alert("توکن از سرور دریافت نشد!");
        }
    } catch (err) {
        alert("اتصال به سرور برقرار نشد");
        console.log(err);
    }
});

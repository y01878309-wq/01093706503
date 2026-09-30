<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة فاهم التعليمية - تسجيل الدخول</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(135deg, #0f172a, #1e293b);
            color: #f8fafc;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .login-card {
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(10px);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
            width: 100%;
            max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .login-card h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #38bdf8;
            font-size: 1.8rem;
        }
        .input-group {
            margin-bottom: 1.2rem;
        }
        .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
            color: #cbd5e1;
        }
        .input-group input {
            width: 100%;
            padding: 0.75rem;
            border-radius: 8px;
            border: 1px solid #475569;
            background: #0f172a;
            color: #fff;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }
        .input-group input:focus {
            border-color: #38bdf8;
        }
        .btn {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            background: #0284c7;
            color: white;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
            margin-top: 0.5rem;
        }
        .btn:hover {
            background: #0369a1;
        }
        .btn:active {
            transform: scale(0.98);
        }
        .whatsapp-btn {
            display: block;
            width: 100%;
            padding: 0.75rem;
            margin-top: 1rem;
            border-radius: 8px;
            background: #25d366;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: bold;
            transition: background 0.3s;
        }
        .whatsapp-btn:hover {
            background: #20ba5a;
        }
        .msg {
            margin-top: 1rem;
            text-align: center;
            font-size: 0.9rem;
        }
        .error { color: #f87171; }
        .success { color: #4ade80; }
    </style>
</head>
<body>

    <div class="login-card">
        <h2>منصة فاهم التعليمية</h2>
        <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="input-group">
                <label for="email">البريد الإلكتروني (Gmail)</label>
                <input type="email" id="email" required placeholder="example@gmail.com">
            </div>
            <button type="submit" class="btn">دخول للمنصة</button>
            <div id="message" class="msg"></div>
        </form>

        <!-- زر التواصل عبر واتساب لطلب التفعيل (تم تجهيزه برقمك) -->
        <a href="https://wa.me/20101878309?text=ازيك يا مستر يوسف، عاوز أقدم طلب انضمام للمنصة وده الإيميل بتاعي:" target="_blank" class="whatsapp-btn">
            💬 تواصل مع المسؤول عبر واتساب
        </a>
    </div>

    <script>
        // إيميلك الشخصي للإدارة والتحكم الكامل
        const adminEmail = "y01878309@gmail.com";

        // قائمة الإيميلات المسموح لها بالدخول (الطلاب المقبولين)
        const allowedStudents = [
            "student1@domain.com"
        ];

        function handleLogin(event) {
            event.preventDefault();
            const emailInput = document.getElementById("email").value.trim().toLowerCase();
            const msgDiv = document.getElementById("message");

            if (emailInput === adminEmail) {
                msgDiv.className = "msg success";
                msgDiv.textContent = "أهلاً يا بشمهندس يوسف! جاري توجيهك لوحة التحكم...";
            } 
            else if (allowedStudents.includes(emailInput)) {
                msgDiv.className = "msg success";
                msgDiv.textContent = "تم تسجيل الدخول بنجاح، أهلاً بك في المنصة!";
            } 
            else {
                msgDiv.className = "msg error";
                msgDiv.textContent = "عذراً، هذا الإيميل غير مفعل. برجاء إرسال إيميلك عبر الواتساب لتفعيل حسابك.";
            }
        }
    </script>

</body>
</html>

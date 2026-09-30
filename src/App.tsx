<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة فاهم التعليمية</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background-color: #0b0f19;
            color: #fff;
            min-height: 100vh;
        }
        /* تصميم شاشة تسجيل الدخول */
        #loginScreen {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            padding: 20px;
        }
        .login-card {
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(10px);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        .login-card h2 {
            margin-bottom: 1.5rem;
            color: #38bdf8;
            font-size: 1.8rem;
        }
        .input-group {
            margin-bottom: 1.2rem;
            text-align: right;
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
            transition: background 0.3s;
        }
        .btn:hover { background: #0369a1; }
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
        .whatsapp-btn:hover { background: #20ba5a; }
        .msg { margin-top: 1rem; font-size: 0.9rem; }
        .error { color: #f87171; }
        .success { color: #4ade80; }

        /* تصميم واجهة المنصة بعد الدخول */
        #appScreen { display: none; }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 25px;
            background: #161e2e;
            border-bottom: 1px solid #1e293b;
        }
        header h1 { font-size: 1.2rem; color: #38bdf8; }
        .logout-btn { background: #ef4444; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        
        nav {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            background: #111827;
            flex-wrap: wrap;
        }
        .nav-btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            background: #1f2937;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9rem;
        }
        .nav-btn.active { background: #3b82f6; }

        main { padding: 25px; max-width: 800px; margin: 0 auto; }
        .section-box { display: none; }
        .section-box.active { display: block; }
        
        .card {
            background: #161e2e;
            border: 1px solid #1e293b;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
        }
        .card h3 { color: #60a5fa; margin-bottom: 8px; }
        .card p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 12px; }
    </style>
</head>
<body>

    <!-- شاشة تسجيل الدخول -->
    <div id="loginScreen">
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

            <a href="https://wa.me/20101878309?text=ازيك يا مستر يوسف، عاوز أقدم طلب انضمام للمنصة وده الإيميل بتاعي:" target="_blank" class="whatsapp-btn">
                💬 تواصل مع المسؤول عبر واتساب
            </a>
        </div>
    </div>

    <!-- واجهة المنصة الرئيسية -->
    <div id="appScreen">
        <header>
            <h1 id="welcomeTitle">منصة فاهم التعليمية</h1>
            <button class="logout-btn" onclick="handleLogout()">تسجيل خروج</button>
        </header>

        <nav>
            <button class="nav-btn active" onclick="switchTab('videos', this)">🎥 الفيديوهات</button>
            <button class="nav-btn" onclick="switchTab('exams', this)">📝 الامتحانات</button>
            <button class="nav-btn" onclick="switchTab('solutions', this)">💡 الحل</button>
            <button class="nav-btn" onclick="switchTab('pdfs', this)">📁 ملفات PDF</button>
            <button class="nav-btn" onclick="switchTab('leaderboard', this)">🏆 التقييم</button>
        </nav>

        <main>
            <!-- قسم الفيديوهات -->
            <div id="videos" class="section-box active">
                <h2 style="margin-bottom: 15px; font-size: 1.2rem;">الفيديوهات والشرح</h2>
                <div class="card">
                    <h3>مقدمة في المنهج التعليمي</h3>
                    <p>شرح تفصيلي لأهم أساسيات المنهج وتوجيهات البداية.</p>
                    <a href="#" style="color: #38bdf8; text-decoration: none; font-weight: bold;">مشاهدة الفيديو ⬅</a>
                </div>
            </div>

            <!-- قسم الامتحانات -->
            <div id="exams" class="section-box">
                <h2 style="margin-bottom: 15px; font-size: 1.2rem;">الامتحانات والاختبارات</h2>
                <div class="card">
                    <h3>امتحان الفيزياء التجريبي - الفصل الأول</h3>
                    <p>اختبر معلوماتك في أساسيات الفصل الأول.</p>
                    <button style="background: #10b981; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">ابدأ الامتحان ✍</button>
                </div>
            </div>

            <!-- قسم الحلول -->
            <div id="solutions" class="section-box">
                <h2 style="margin-bottom: 15px; font-size: 1.2rem;">حل التدريبات والأسئلة</h2>
                <div class="card">
                    <h3>الخطوات الكاملة للحل النموذجي</h3>
                    <p>ملخص الخطوات لحل مسائل الامتحانات السابقة.</p>
                </div>
            </div>

            <!-- قسم ملفات الـ PDF -->
            <div id="pdfs" class="section-box">
                <h2 style="margin-bottom: 15px; font-size: 1.2rem;">ملفات PDF والملخصات</h2>
                <div class="card">
                    <h3>ملخص قوانين الفيزياء</h3>
                    <p>ملف شامل لأهم القوانين واشتقاقات المنهج.</p>
                </div>
            </div>

            <!-- قسم التقييم -->
            <div id="leaderboard" class="section-box">
                <h2 style="margin-bottom: 15px; font-size: 1.2rem;">ترتيب الطلاب المتفوقين</h2>
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: #fff; margin-bottom: 4px;">1. أحمد البهي</h4>
                        <p style="margin: 0; font-size: 0.8rem;">أكمل اختبارين · دراجة كاملة</p>
                    </div>
                    <span style="font-size: 1.5rem;">🏆</span>
                </div>
            </div>
        </main>
    </div>

    <script>
        const adminEmail = "y01878309@gmail.com";
        const allowedStudents = ["student1@domain.com"]; // تقدر تضيف هنا الإيميلات اللي بتوافق عليها

        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const msgDiv = document.getElementById("message");

            if (email === adminEmail) {
                document.getElementById("loginScreen").style.display = "none";
                document.getElementById("appScreen").style.display = "block";
                document.getElementById("welcomeTitle").textContent = "منصة فاهم - لوحة تحكم الأدمن (يوسف فرج)";
            } 
            else if (allowedStudents.includes(email)) {
                document.getElementById("loginScreen").style.display = "none";
                document.getElementById("appScreen").style.display = "block";
                document.getElementById("welcomeTitle").textContent = "منصة فاهم التعليمية - طالب";
            } 
            else {
                msgDiv.className = "msg error";
                msgDiv.textContent = "عذراً، هذا الإيميل غير مفعل. تواصل عبر الواتساب لتفعيل حسابك.";
            }
        }

        function handleLogout() {
            document.getElementById("appScreen").style.display = "none";
            document.getElementById("loginScreen").style.display = "flex";
            document.getElementById("email").value = "";
            document.getElementById("message").textContent = "";
        }

        function switchTab(tabId, btn) {
            document.querySelectorAll('.section-box').forEach(box => box.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            
            document.getElementById(tabId).classList.add('active');
            btn.classList.add('active');
        }
    </script>

</body>
</html>

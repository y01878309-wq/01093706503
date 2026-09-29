import { VideoLesson } from '../types';

export const INITIAL_VIDEOS: VideoLesson[] = [
  {
    id: 'vid-phys-01',
    title: 'شرح شامل: قوانين كيرشوف للدائرة الكهربائية المعقدة من الصفر',
    type: 'explanation',
    subject: 'الفيزياء',
    subjectId: 'physics',
    grade: 'الثانوية العامة (الصف الثالث الثانوي)',
    unit: 'الوحدة الأولى: التيار الكهربي وقانون أوم وكيرشوف',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kYJm3Wv9yX8', // or standard educational embed
    thumbnailUrl: '/src/assets/images/course_physics_circuits_1790682829737.jpg',
    duration: '24:15',
    durationSeconds: 1455,
    difficulty: 'medium',
    description: 'شرح تفصيلي لقانون كيرشوف الأول (حفظ الشحنة) وقانون كيرشوف الثاني (حفظ الطاقة)، وكيفية فرض اتجاه التيارات والمسارات المغلقة وتطبيق معادلات الجهود بكل بساطة دون أخطاء الإشارات.',
    instructor: {
      name: 'أ. أحمد الشناوي',
      title: 'كبير معلمي الفيزياء للمرحلة الثانوية',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    timestamps: [
      { id: 't1', timeSeconds: 0, formattedTime: '00:00', title: 'مقدمة ومفهوم الدوائر المعقدة' },
      { id: 't2', timeSeconds: 180, formattedTime: '03:00', title: 'قانون كيرشوف الأول (قانون العقدة وتيارات الدخول والخروج)' },
      { id: 't3', timeSeconds: 485, formattedTime: '08:05', title: 'قانون كيرشوف الثاني (المسارات المغلقة وحفظ الطاقة)' },
      { id: 't4', timeSeconds: 820, formattedTime: '13:40', title: 'قاعدة الإشارات لفرق الجهد والمقاومات والبطاريات' },
      { id: 't5', timeSeconds: 1150, formattedTime: '19:10', title: 'خريطة ذهنية لحل أي دائرة معقدة بـ 3 خطوات' }
    ],
    keyTakeaways: [
      'Σ I_in = Σ I_out (مجموع التيارات الداخلة لنقطة تفرع يساوي مجموع الخارجة)',
      'Σ V_B = Σ (I × R) في أي مسار مغلق',
      'إذا تحركت في المسار مع اتجاه التيار، يكون هبوط الجهد سالباً (- I·R)',
      'المرور في البطارية من القطب السالب إلى الموجب يعطي قوة دافعة موجبة (+ V_B)'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'تحديد نقطة التفرع (العقدة)',
        explanation: 'حدد العقدة الرئيسية في الدائرة واكتب معادلة قانون كيرشوف الأول بتجميع التيارات الداخلة والخارجة.',
        formulaOrWork: 'I₁ + I₂ = I₃  ==>  I₁ + I₂ - I₃ = 0'
      },
      {
        stepNumber: 2,
        title: 'اختيار مسارين مغلقين مستقلين وتحديد اتجاه الدوران',
        explanation: 'حدد اتجاه الدوران (مع أو عكس عقارب الساعة) لكل مسار، ثم طبق قانون كيرشوف الثاني بدقة الإشارات.',
        formulaOrWork: 'المسار 1: V_B1 - V_B2 = I₁·R₁ + I₃·R₃'
      },
      {
        stepNumber: 3,
        title: 'حل المعادلات الثلاث بواسطة المصفوفات أو الآلة الحاسبة (Mode 5 2)',
        explanation: 'رتب المعادلات خطياً للحصول على قيم التيارات بدقة.',
        formulaOrWork: 'I₁ = 2.5 A, I₂ = 1.0 A, I₃ = 3.5 A'
      }
    ],
    attachments: [
      {
        id: 'att-1',
        title: 'مذكرة القوانين والخرائط الذهنية لكيرشوف PDF',
        type: 'pdf',
        url: '#',
        size: '2.4 MB'
      },
      {
        id: 'att-2',
        title: 'ورقة ملخص الإشارات وتوصيل المقاومات',
        type: 'image',
        url: '#',
        size: '850 KB'
      }
    ],
    practiceQuestions: [
      {
        id: 'q1',
        questionText: 'في دائرة كهربية عند نقطة تفرع، تدخل تيارات مقاديرها 3A و 4A، ويخرج تيار مقداره 2A وتيار مجهول I. ما هي قيمة واتجاه التيار I؟',
        options: ['5A خارج من النقطة', '5A داخل إلى النقطة', '9A خارج من النقطة', '1A داخل إلى النقطة'],
        correctOptionIndex: 0,
        explanation: 'مجموع الداخل = 3 + 4 = 7A. الخارج الحالي = 2A. حتى يتساوى الداخل والخارج، يجب أن يخرج 5A إضافية (7 - 2 = 5A).'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'يوسف حسام',
        role: 'student',
        date: 'منذ يومين',
        text: 'شرح ممتاز جداً يا أستاذنا، هل يوجد فيديو مخصص لحل مسائل الجسور (قنطرة وتستون)؟',
        timestampSeconds: 820,
        reply: 'أهلاً يا يوسف! نعم تم رفع فيديو حل خاص بقنطرة وتستون في قسم حل المسائل تحت نفس الوحدة.'
      }
    ],
    viewsCount: 3840,
    likesCount: 312,
    createdAt: '2026-09-15',
    isFeatured: true
  },
  {
    id: 'vid-phys-02',
    title: 'حل 8 مسائل امتحانات ثانوية عامة متقدمة على قوانين كيرشوف وتوزيع الجهود',
    type: 'problem-solving',
    subject: 'الفيزياء',
    subjectId: 'physics',
    grade: 'الثانوية العامة (الصف الثالث الثانوي)',
    unit: 'الوحدة الأولى: التيار الكهربي وقانون أوم وكيرشوف',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=0jmm0sW_a3Q',
    thumbnailUrl: '/src/assets/images/course_physics_circuits_1790682829737.jpg',
    duration: '31:20',
    durationSeconds: 1880,
    difficulty: 'hard',
    description: 'حل نماذج وتدريبات الامتحانات الوزارية للسنوات السابقة ومسائل بنك المعرفة التي تحتوي على بطاريات متعاكسة ومقاومات داخلية وأجهزة قياس (فولتميتر وأميتر) مع توضيح الفخاخ الشائعة وكيفية تجنبها.',
    instructor: {
      name: 'أ. أحمد الشناوي',
      title: 'كبير معلمي الفيزياء للمرحلة الثانوية'
    },
    timestamps: [
      { id: 't1', timeSeconds: 0, formattedTime: '00:00', title: 'المسألة 1: دائرة بها 3 بطاريات وفرع به فولتميتر مثالي' },
      { id: 't2', timeSeconds: 380, formattedTime: '06:20', title: 'المسألة 2: إيجاد فرق الجهد بين نقطتين مفتوحتين (V_AB)' },
      { id: 't3', timeSeconds: 790, formattedTime: '13:10', title: 'المسألة 3: مسألة امتحان 2024 دور أول - التيار المنعدم' },
      { id: 't4', timeSeconds: 1220, formattedTime: '20:20', title: 'المسألة 4: حساب القدرة المستهلكة في الدائرة الكهربية بالكامل' },
      { id: 't5', timeSeconds: 1610, formattedTime: '26:50', title: 'نصائح الحل السريع في الامتحان بدون تضييع وقت' }
    ],
    keyTakeaways: [
      'الفولتميتر المثالي مقاومته لا نهائية ولا يمر به تيار في حساب كيرشوف',
      'حساب فرق الجهد بين نقطتين V_AB يتم بالسير في أي مسار من A إلى B وتجميع الجهود',
      'القدرة المستمدة من البطاريات المنتجة تساوي مجموع القدرات المستهلكة في المقاومات والبطاريات المشحونة'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'تحديد قراءة الفولتميتر في المسألة الأولى',
        explanation: 'الفولتميتر موصول بين طرفي بطارية في حالة شحن (التيار يدخل قطبها الموجب).',
        formulaOrWork: 'V = V_B + I·r = 12 + (1.5 × 1) = 13.5 Volt',
        tip: 'انتبه: إذا كان التيار يخرج من القطب الموجب فإن V = V_B - I·r'
      },
      {
        stepNumber: 2,
        title: 'حساب فرق الجهد بين النقطتين A و B عبر المسار الأوسط',
        explanation: 'نبدأ من النقطة A ثم نتبع المسار: V_A - (2×3) + 6 - (1×4) = V_B',
        formulaOrWork: 'V_A - 6 + 6 - 4 = V_B  ==>  V_A - V_B = 4 Volt'
      },
      {
        stepNumber: 3,
        title: 'التحقق بمبدأ اتزان القدرة الكهربائية (Power Balance)',
        explanation: 'P_produced = Σ (V_B_discharging × I) = P_consumed = Σ I²R + Σ (V_B_charging × I)',
        formulaOrWork: 'P_total = 72 Watt'
      }
    ],
    attachments: [
      {
        id: 'att-ps-1',
        title: 'نموذج إجابة الـ 8 مسائل بالخطوات والرسومات التوضيحية PDF',
        type: 'pdf',
        url: '#',
        size: '3.1 MB'
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-2',
        questionText: 'إذا كانت بطارية قوتها الدافعة 9V ومقاومتها الداخلية 1Ω متصلة في دائرة يمر بها تيار 2A يخرج من قطبها الموجب، فإن قراءة فولتميتر بين طرفيها تساوي:',
        options: ['11 Volt', '7 Volt', '9 Volt', '2 Volt'],
        correctOptionIndex: 1,
        explanation: 'البطارية في حالة تفريغ: V = V_B - I·r = 9 - (2 × 1) = 7 Volt.'
      }
    ],
    comments: [
      {
        id: 'c2',
        author: 'سارة محمود',
        role: 'student',
        date: 'منذ 3 ساعات',
        text: 'طريقة حل المسألة رقم 3 سهلت عليا الفكرة جداً، كنت دايماً بتلخبط في إشارة الـ V_B!',
        timestampSeconds: 790
      }
    ],
    viewsCount: 2950,
    likesCount: 280,
    createdAt: '2026-09-18',
    isFeatured: true
  },
  {
    id: 'vid-math-01',
    title: 'شرح مفهوم الاشتقاق وقواعد التفاضل الأساسية والتفسير الهندسي',
    type: 'explanation',
    subject: 'الرياضيات',
    subjectId: 'mathematics',
    grade: 'الصف الثالث الثانوي / السنة التحضيرية بالجامعة',
    unit: 'التفاضل والتكامل: الوحدة الأولى',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
    thumbnailUrl: '/src/assets/images/course_math_solutions_1790682815626.jpg',
    duration: '28:10',
    durationSeconds: 1690,
    difficulty: 'medium',
    description: 'فهم عميق وبصري لمعدل التغير والمماس والاشتقاق: لماذا نشتق؟ كيف نستخدم قاعدة السلسلة، مشتقة ضرب وقسمة دالتين، والدوال المثلثية ومقلوباتها بدقة.',
    instructor: {
      name: 'د. سامي رضوان',
      title: 'أستاذ الرياضيات البحتة والتطبيقية'
    },
    timestamps: [
      { id: 'tm1', timeSeconds: 0, formattedTime: '00:00', title: 'المعنى الهندسي للمماس ومعدل التغير اللحظي' },
      { id: 'tm2', timeSeconds: 240, formattedTime: '04:00', title: 'قواعد القوى والاشتقاق الجبري الأساسي' },
      { id: 'tm3', timeSeconds: 620, formattedTime: '10:20', title: 'مشتقة حاصل ضرب وقسمة دالتين مع أمثلة مباشرة' },
      { id: 'tm4', timeSeconds: 1040, formattedTime: '17:20', title: 'قاعدة السلسلة (Chain Rule) والاشتقاق الضمني' },
      { id: 'tm5', timeSeconds: 1400, formattedTime: '23:20', title: 'مشتقات الدوال المثلثية (جا، جتا، ظا، ظتا، قا، قتا)' }
    ],
    keyTakeaways: [
      'f\'(x) = lim_{h->0} [f(x+h) - f(x)] / h',
      'مشتقة الضرب: الأولى × مشتقة الثانية + الثانية × مشتقة الأولى',
      'مشتقة القسمة: [المقام × مشتقة البسط - البسط × مشتقة المقام] / (المقام)²',
      'مشتقة جا(س) = جتا(س)، بينما مشتقة جتا(س) = - جا(س)'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'اشتقاق دالة كسرية مركبة f(x) = (3x² + 1) / (2x - 5)',
        explanation: 'نطبق قانون القسمة: مربع المقام في الأسفل، وفي البسط: المقام في مشتقة البسط ناقص البسط في مشتقة المقام.',
        formulaOrWork: "f'(x) = [(2x - 5)(6x) - (3x² + 1)(2)] / (2x - 5)²",
        tip: 'حافظ على الأقواس عند ضرب المقدار لتفادي خطأ توزيع إشارة السالب'
      },
      {
        stepNumber: 2,
        title: 'تبسيط البسط وتجميع الحدود المتشابهة',
        explanation: 'نقوم بفك الأقواس بعناية: 12x² - 30x - 6x² - 2',
        formulaOrWork: "f'(x) = (6x² - 30x - 2) / (2x - 5)²"
      }
    ],
    attachments: [
      {
        id: 'att-m-1',
        title: 'جدول مشتقات جميع الدوال الجبرية والمثلثية وعكسها PDF',
        type: 'pdf',
        url: '#',
        size: '1.8 MB'
      }
    ],
    practiceQuestions: [
      {
        id: 'qm-1',
        questionText: 'إذا كانت ص = ظا(٣س)، فإن دص / دس تساوي:',
        options: ['٣ قا²(٣س)', 'قا²(٣س)', '-٣ قتا²(٣س)', '٣ ظتا(٣س)'],
        correctOptionIndex: 0,
        explanation: 'مشتقة ظا(u) هي قا²(u) مضروبة في مشتقة الزاوية u\'، إذن: ٣ × قا²(٣س).'
      }
    ],
    comments: [],
    viewsCount: 4210,
    likesCount: 389,
    createdAt: '2026-09-10',
    isFeatured: true
  },
  {
    id: 'vid-math-02',
    title: 'حل مسائل المعدلات الزمنية المرتبطة وتطبيقات القيم العظمى والصغرى',
    type: 'problem-solving',
    subject: 'الرياضيات',
    subjectId: 'mathematics',
    grade: 'الصف الثالث الثانوي (علمي رياضة)',
    unit: 'التفاضل والتكامل: الوحدة الأولى والثالثة',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kYJm3Wv9yX8',
    thumbnailUrl: '/src/assets/images/course_math_solutions_1790682815626.jpg',
    duration: '35:40',
    durationSeconds: 2140,
    difficulty: 'genius',
    description: 'خطوات منهجية لا تخطئ لحل مسائل السلم المنزلق، الظل ومصباح الشارع، تسرب السوائل من المخروط، وحساب أبعاد المستطيل ذي المساحة القصوى داخل دائرة.',
    instructor: {
      name: 'د. سامي رضوان',
      title: 'أستاذ الرياضيات البحتة والتطبيقية'
    },
    timestamps: [
      { id: 'tm1', timeSeconds: 0, formattedTime: '00:00', title: 'المسألة 1: سلم طوله 10 أمتار يستند على حائط رأسي وأرض أفقية' },
      { id: 'tm2', timeSeconds: 450, formattedTime: '07:30', title: 'المسألة 2: رجل يقترب من عمود إنارة ومعدل تغير طول ظله' },
      { id: 'tm3', timeSeconds: 980, formattedTime: '16:20', title: 'المسألة 3: خزان ماء على شكل مخروط دائري قائم مقلوب' },
      { id: 'tm4', timeSeconds: 1530, formattedTime: '25:30', title: 'المسألة 4: إيجاد أكبر مساحة لمثلث متساوي الساقين داخل دائرة نق=6سم' }
    ],
    keyTakeaways: [
      'الخطوة 1: ارسم شكلاً تخطيطياً وسمِّ المتغيرات بدلالة الزمن t',
      'الخطوة 2: أوجد علاقة هندسية بين المتغيرات (فيثاغورس، تشابه مثلثات، قانون جيب التمام)',
      'الخطوة 3: اشتق طرفي العلاقة بالنسبة للزمن t وعوّض باللحظة المطلوبة فقط بعد الاشتقاق'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'مسألة السلم: صياغة العلاقة من نظرية فيثاغورس',
        explanation: 'نفرض بُعد الطرف السفلي عن الحائط x وبُعد الطرف العلوي عن الأرض y. طول السلم ثابت L = 10m.',
        formulaOrWork: 'x² + y² = 10² = 100'
      },
      {
        stepNumber: 2,
        title: 'الاشتقاق الضمني بالنسبة للزمن t',
        explanation: 'نشتق كل طرف بالنسبة للزمن مع تطبيق قاعدة السلسلة.',
        formulaOrWork: '2x (dx/dt) + 2y (dy/dt) = 0  ==>  x (dx/dt) + y (dy/dt) = 0'
      },
      {
        stepNumber: 3,
        title: 'التعويض عند اللحظة التي يكون فيها x = 8m و dx/dt = 2 m/s',
        explanation: 'عندما x = 8، فإن y = √(100 - 64) = 6m. بالتعويض في معادلة الاشتقاق:',
        formulaOrWork: '8(2) + 6 (dy/dt) = 0  ==>  dy/dt = -16/6 = -2.67 m/s (معدل هبوط الطرف العلوي)',
        tip: 'الإشارة السالبة تعني أن البعد y يتناقص بمرور الزمن، وهو منطقي ومطابق للواقع الفيزيائي.'
      }
    ],
    attachments: [
      {
        id: 'att-ms-1',
        title: 'ملزمة الـ 20 مسألة الأقوى في المعدلات الزمنية مع الحلول الكاملة PDF',
        type: 'pdf',
        url: '#',
        size: '4.2 MB'
      }
    ],
    practiceQuestions: [
      {
        id: 'qp-math-1',
        questionText: 'تتمدد صفيحة دائرية بانتظام بحيث يزداد نصف قطرها بمعدل 0.2 سم/ث. ما معدل الزيادة في مساحتها عندما يكون نصف قطرها 10 سم؟',
        options: ['4π سم²/ث', '2π سم²/ث', '40π سم²/ث', '20π سم²/ث'],
        correctOptionIndex: 0,
        explanation: 'المساحة A = π r². بالاشتقاق بالنسبة للزمن: dA/dt = 2π r (dr/dt) = 2π (10) (0.2) = 4π سم²/ث.'
      }
    ],
    comments: [],
    viewsCount: 3120,
    likesCount: 340,
    createdAt: '2026-09-21'
  },
  {
    id: 'vid-chem-01',
    title: 'شرح موازنة معادلات الأكسدة والاختزال بطريقة أيون-إلكترون (في وسط حمضي وقاعدي)',
    type: 'explanation',
    subject: 'الكيمياء',
    subjectId: 'chemistry',
    grade: 'الصف الثالث الثانوي / المستوى الجامعي الأول',
    unit: 'الكيمياء الكهربية وتفاعلات الأكسدة والاختزال',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=0jmm0sW_a3Q',
    thumbnailUrl: '/src/assets/images/hero_education_platform_1790682800091.jpg',
    duration: '21:30',
    durationSeconds: 1290,
    difficulty: 'medium',
    description: 'شرح متدرج لقواعد حساب أعداد التأكسد، وكيفية تقسيم التفاعل الكلي إلى نصفي تفاعل (أكسدة واختزال)، وموازنة الأكسجين بإضافة ماء والهيدروجين بإضافة أيونات H+ ثم موازنة الشحنات بالإلكترونات.',
    instructor: {
      name: 'أ. مروة عبد العزيز',
      title: 'خبيرة تدريس الكيمياء للثانوية والمنافسات العلمية'
    },
    timestamps: [
      { id: 'tc1', timeSeconds: 0, formattedTime: '00:00', title: 'مفهوم الأكسدة والاختزال عبر تغير أعداد التأكسد' },
      { id: 'tc2', timeSeconds: 270, formattedTime: '04:30', title: 'الخطوات السحرية السبع لموازنة أي معادلة في وسط حمضي' },
      { id: 'tc3', timeSeconds: 690, formattedTime: '11:30', title: 'التحويل من وسط حمضي إلى وسط قاعدي بإضافة OH-' },
      { id: 'tc4', timeSeconds: 1020, formattedTime: '17:00', title: 'موازنة تفاعلات التفكك الذاتي (Disproportionation)' }
    ],
    keyTakeaways: [
      'الأكسدة: فقد إلكترونات وزيادة في عدد التأكسد',
      'الاختزال: اكتساب إلكترونات ونقص في عدد التأكسد',
      'في الوسط الحمضي: نوازن O بإضافة H2O، ونوازن H بإضافة H+',
      'في الوسط القاعدي: نضيف OH- لكلا الطرفين بعدد أيونات H+ لتكوين ماء'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'موازنة تفاعل البرمنجنات مع أيون الحديد الثنائي MnO4- + Fe2+ -> Mn2+ + Fe3+',
        explanation: 'نقسم التفاعل إلى نصفي تفاعل أكسدة واختزال:',
        formulaOrWork: 'الأكسدة: Fe²⁺ -> Fe³⁺ + e⁻\nالاختزال: MnO₄⁻ + 8H⁺ + 5e⁻ -> Mn²⁺ + 4H₂O'
      },
      {
        stepNumber: 2,
        title: 'مساواة عدد الإلكترونات المفقودة والمكتسبة',
        explanation: 'نضرب نصف تفاعل الأكسدة في 5 ليصبح عدد الإلكترونات متساوياً (5e-):',
        formulaOrWork: '5Fe²⁺ -> 5Fe³⁺ + 5e⁻'
      },
      {
        stepNumber: 3,
        title: 'جمع نصفي التفاعل واختصار الإلكترونات',
        explanation: 'المعادلة النهائية الموزونة في وسط حمضي:',
        formulaOrWork: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ -> Mn²⁺ + 5Fe³⁺ + 4H₂O'
      }
    ],
    attachments: [
      {
        id: 'att-c-1',
        title: 'ملخص أعداد التأكسد وقواعد الموازنة الملونة PDF',
        type: 'pdf',
        url: '#',
        size: '1.5 MB'
      }
    ],
    practiceQuestions: [
      {
        id: 'qc-1',
        questionText: 'ما هو عدد تأكسد ذرة المنجنيز في أيون البرمنجنات MnO4⁻؟',
        options: ['+7', '+4', '+2', '+6'],
        correctOptionIndex: 0,
        explanation: 'Mn + 4(-2) = -1  ==>  Mn - 8 = -1  ==>  Mn = +7.'
      }
    ],
    comments: [],
    viewsCount: 2480,
    likesCount: 215,
    createdAt: '2026-09-24'
  },
  {
    id: 'vid-chem-02',
    title: 'حل مسائل الحساب الكيميائي والتراكيز ونسبة النقاء والمعايرة في الامتحانات',
    type: 'problem-solving',
    subject: 'الكيمياء',
    subjectId: 'chemistry',
    grade: 'الصف الثالث الثانوي',
    unit: 'الباب الثاني: التحليل الكيميائي والكمي',
    videoSourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kYJm3Wv9yX8',
    thumbnailUrl: '/src/assets/images/hero_education_platform_1790682800091.jpg',
    duration: '26:50',
    durationSeconds: 1610,
    difficulty: 'hard',
    description: 'حل مسائل المعايرة المركبة التي تطلب حساب النسبة المئوية للمادة النقية في عينة غير نقية، ومسائل التطاير والترسيب وحساب ماء التبلر في الأملاح المتهدرتة.',
    instructor: {
      name: 'أ. مروة عبد العزيز',
      title: 'خبيرة تدريس الكيمياء للثانوية والمنافسات العلمية'
    },
    timestamps: [
      { id: 't-ch-1', timeSeconds: 0, formattedTime: '00:00', title: 'المسألة 1: معايرة حمض مع هيدروكسيد صوديوم لحساب نسبة النقاء' },
      { id: 't-ch-2', timeSeconds: 390, formattedTime: '06:30', title: 'المسألة 2: إيجاد الصيغة الجزيئية لكبريتات النحاس المتهدرتة (ماء التبلر)' },
      { id: 't-ch-3', timeSeconds: 840, formattedTime: '14:00', title: 'المسألة 3: مسائل الترسيب وحساب كتلة الراسب المتكون' }
    ],
    keyTakeaways: [
      'قانون المعايرة: (M_a × V_a) / n_a = (M_b × V_b) / n_b',
      'النسبة المئوية للنقاء = (كتلة المادة النقية ÷ كتلة العينة غير النقية) × 100%',
      'عدد مولات ماء التبلر (x) = (كتلة الماء المفقود ÷ 18) ÷ (كتلة الملح الجاف ÷ كتلته المولية)'
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'كتابة معادلة التفاعل الموزونة وتحديد المعاملات',
        explanation: 'H₂SO₄ + 2NaOH -> Na₂SO₄ + 2H₂O  (n_a = 1, n_b = 2)',
        formulaOrWork: 'n_a = 1 , n_b = 2'
      },
      {
        stepNumber: 2,
        title: 'تطبيق قانون المعايرة لحساب عدد مولات الحمض أو القلوي',
        explanation: 'لدينا حجم 25 مللتر من NaOH تركيزه 0.1M مع 20 مللتر حمض H2SO4 مجهول التركيز:',
        formulaOrWork: '(M_a × 20) / 1 = (0.1 × 25) / 2  ==>  M_a × 20 = 1.25  ==>  M_a = 0.0625 M'
      }
    ],
    attachments: [
      {
        id: 'att-chem-sol',
        title: 'ورقة قوانين المعايرة والترسيب والتطاير في ورقة واحدة PDF',
        type: 'pdf',
        url: '#',
        size: '1.2 MB'
      }
    ],
    practiceQuestions: [],
    comments: [],
    viewsCount: 1980,
    likesCount: 172,
    createdAt: '2026-09-25'
  }
];

export const SUBJECTS_LIST = [
  { id: 'all', name: 'جميع المواد', icon: 'Sparkles' },
  { id: 'physics', name: 'الفيزياء', icon: 'Atom', count: 2 },
  { id: 'mathematics', name: 'الرياضيات', icon: 'Compass', count: 2 },
  { id: 'chemistry', name: 'الكيمياء', icon: 'FlaskConical', count: 2 },
  { id: 'biology', name: 'الأحياء', icon: 'Dna', count: 0 },
  { id: 'programming', name: 'البرمجة والحاسب', icon: 'Code', count: 0 }
];

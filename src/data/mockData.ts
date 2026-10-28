import {
  Subject,
  CurriculumCategory,
  Chapter,
  Subchapter,
  Question,
  User,
  Quiz,
  QuizAssignment,
  QuizAttempt,
} from '../types/schema';

// 1. Current Mock Users
export const MOCK_ADMIN: User = {
  id: 'usr_admin_01',
  email: 'admin.taqwim@madrasah.sch.id',
  fullName: 'Dr. H. Miftah Faridl (Super Admin / Owner)',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  identifierNumber: 'ADMIN-SYS-001',
};

export const MOCK_TEACHER: User = {
  id: 'usr_teach_01',
  email: 'ustadz.fauzi@madrasah.sch.id',
  fullName: 'Ustadz Ahmad Fauzi, M.Pd.I',
  role: 'TEACHER',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  identifierNumber: 'NIP. 19850412 201001 1 008',
};

export const MOCK_STUDENTS: User[] = [
  {
    id: 'usr_stud_01',
    email: 'ahmad.fathan@siswa.sch.id',
    fullName: 'Ahmad Fathan Bil-Haq',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    identifierNumber: 'NISN 0083921021',
  },
  {
    id: 'usr_stud_02',
    email: 'fatimah.azzahra@siswa.sch.id',
    fullName: 'Fatimah Az-Zahra',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    identifierNumber: 'NISN 0083921022',
  },
  {
    id: 'usr_stud_03',
    email: 'zaid.alhabsy@siswa.sch.id',
    fullName: 'Zaid bin Thabit Al-Habsy',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    identifierNumber: 'NISN 0083921023',
  },
  {
    id: 'usr_stud_04',
    email: 'aisyah.humaira@siswa.sch.id',
    fullName: 'Aisyah Nur Humaira',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    identifierNumber: 'NISN 0083921024',
  },
  {
    id: 'usr_stud_05',
    email: 'umar.alkhattab@siswa.sch.id',
    fullName: 'Umar Al-Faruq',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    identifierNumber: 'NISN 0083921025',
  },
];

// 2. Hierarchical Islamic Curriculum Data
export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'subj_pai',
    code: 'PAI-BP',
    name: 'Pendidikan Agama Islam & Budi Pekerti',
    description: 'Kurikulum standar nasional terintegrasi Fiqih, Akidah, Hadits & Tarikh Islam.',
  },
];

export const MOCK_CATEGORIES: CurriculumCategory[] = [
  {
    id: 'cat_fiqih',
    subjectId: 'subj_pai',
    code: 'FIQIH',
    name: 'Fiqih Ibadah',
    description: 'Hukum-hukum praktis syariat Islam mengenai tata cara bersuci, shalat, puasa, dan muamalah.',
    iconName: 'Droplets',
  },
  {
    id: 'cat_akidah',
    subjectId: 'subj_pai',
    code: 'AKIDAH',
    name: 'Akidah Akhlak',
    description: 'Pokok keimanan tauhid, nama-nama Allah (Asmaul Husna), dan adab budi pekerti terpuji.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'cat_quran_hadits',
    subjectId: 'subj_pai',
    code: 'QURAN_HADITS',
    name: 'Al-Qur\'an & Hadits',
    description: 'Kaidah tajwid, makharijul huruf, terjemah ayat, dan hafalan sunnah shahihah.',
    iconName: 'BookOpen',
  },
  {
    id: 'cat_ski',
    subjectId: 'subj_pai',
    code: 'SKI',
    name: 'Sejarah Kebudayaan Islam (SKI)',
    description: 'Perjalanan dakwah Rasulullah SAW, Khulafaur Rasyidin, dan peradaban emas Islam.',
    iconName: 'Compass',
  },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'chap_thaharah',
    categoryId: 'cat_fiqih',
    chapterNumber: 1,
    name: 'Thaharah (Bersuci dari Hadats & Najis)',
    description: 'Konsep dasar thaharah, pembagian air suci menyucikan, dan sarana bersuci.',
  },
  {
    id: 'chap_shalat',
    categoryId: 'cat_fiqih',
    chapterNumber: 2,
    name: 'Shalat Fardhu & Tatacaranya',
    description: 'Syarat wajib, syarat sah, rukun fi\'li & qauli shalat serta sujud sahwi.',
  },
  {
    id: 'chap_iman',
    categoryId: 'cat_akidah',
    chapterNumber: 1,
    name: 'Rukun Iman & Esensi Tauhid',
    description: 'Memahami rukun iman dan implementasi dalam tauhid uluhiyah dan rububiyah.',
  },
  {
    id: 'chap_tajwid',
    categoryId: 'cat_quran_hadits',
    chapterNumber: 1,
    name: 'Kaidah Ilmu Tajwid',
    description: 'Hukum nun sukun/tanwin, mim sukun, mad thabi\'i dan waqaf.',
  },
];

export const MOCK_SUBCHAPTERS: Subchapter[] = [
  {
    id: 'sub_wudhu',
    chapterId: 'chap_thaharah',
    subchapterNumber: 1,
    name: 'Wudhu (Rukun & Sunnah)',
    standardCompetency: 'KD 3.1 Menganalisis tata cara berwudhu yang benar sesuai Sunnah Nabi SAW.',
    description: '6 rukun wudhu, sunnah-sunnah sebelum & sesudah, serta hal-hal yang membatalkan wudhu.',
  },
  {
    id: 'sub_tayammum',
    chapterId: 'chap_thaharah',
    subchapterNumber: 2,
    name: 'Tayammum (Rukhsah Pengganti Air)',
    standardCompetency: 'KD 3.2 Menjelaskan sebab kebolehan tayammum dan rukun mengusap wajah serta tangan.',
    description: 'Kondisi darurat ketiadaan air atau udzur sakit, debu suci, dan niat tayammum.',
  },
  {
    id: 'sub_mandi',
    chapterId: 'chap_thaharah',
    subchapterNumber: 3,
    name: 'Mandi Wajib (Janabat)',
    standardCompetency: 'KD 3.3 Mengidentifikasi sebab hadats besar dan rukun meratakan air ke sekujur tubuh.',
    description: 'Sebab-sebab mandi janabat, niat, rukun mengalirkan air ke seluruh rambut dan kulit.',
  },
  {
    id: 'sub_rukun_shalat',
    chapterId: 'chap_shalat',
    subchapterNumber: 1,
    name: 'Rukun & Syarat Sah Shalat',
    standardCompetency: 'KD 3.4 Membedakan antara rukun qauli, rukun fi\'li, dan rukun qalbi dalam shalat.',
    description: '13 rukun shalat, tuma\'ninah, tertib, dan syarat menutup aurat menghadap kiblat.',
  },
  {
    id: 'sub_sujud_sahwi',
    chapterId: 'chap_shalat',
    subchapterNumber: 2,
    name: 'Sujud Sahwi & Sujud Tilawah',
    standardCompetency: 'KD 3.5 Menganalisis sebab pelaksanaan sujud sahwi karena lupa rakaat atau tasyahhud awwal.',
    description: 'Bacaan sujud sahwi, posisi sebelum atau sesudah salam, dan pengganti kekurangan sunnah ab\'adh.',
  },
  {
    id: 'sub_malaikat',
    chapterId: 'chap_iman',
    subchapterNumber: 1,
    name: 'Iman Kepada Malaikat Allah',
    standardCompetency: 'KD 3.6 Memahami sifat-sifat malaikat dan 10 malaikat wajib beserta tugasnya.',
    description: 'Penciptaan dari cahaya (nur), ketaatan mutlak, tugas Jibril, Mikail, Israfil, hingga Ridwan.',
  },
  {
    id: 'sub_nun_sukun',
    chapterId: 'chap_tajwid',
    subchapterNumber: 1,
    name: 'Hukum Nun Sukun & Tanwin',
    standardCompetency: 'KD 3.7 Mengidentifikasi hukum Izhar, Idgham, Iqlab, dan Ikhfa Haqiqi.',
    description: 'Huruf halqi untuk Izhar, Idgham bighunnah/bilaghunnah, Iqlab pada huruf Ba, dan 15 huruf Ikhfa.',
  },
];

// 3. Question Bank Tagged Strictly to Subchapters
export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q_wudhu_01',
    subchapterId: 'sub_wudhu',
    createdBy: 'usr_teach_01',
    questionText: 'Manakah di bawah ini yang merupakan RUKUN wudhu (bukan sunnah wudhu)?',
    arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ',
    difficulty: 'MEDIUM',
    explanation: 'Membasuh muka adalah rukun wudhu yang disebutkan dalam Al-Qur\'an (QS. Al-Maidah: 6). Sedangkan berkumur-kumur, bersiwak, dan mencuci telapak tangan adalah sunnah muakkadah.',
    dalilReference: 'QS. Al-Maidah Ayat 6: "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku..."',
    defaultTimeSeconds: 20,
    defaultPoints: 1000,
    options: [
      { id: 'opt_w1_a', label: 'A', text: 'Berkumur-kumur (Madhmadhah)', isCorrect: false, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_w1_b', label: 'B', text: 'Membasuh muka disertai niat', isCorrect: true, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_w1_c', label: 'C', text: 'Membersihkan hidung (Istinsyaq)', isCorrect: false, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_w1_d', label: 'D', text: 'Membasuh kedua daun telinga', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_wudhu_02',
    subchapterId: 'sub_wudhu',
    createdBy: 'usr_teach_01',
    questionText: 'Berapa batas membasuh kedua tangan yang menjadi kewajiban rukun wudhu?',
    arabicText: 'وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
    difficulty: 'EASY',
    explanation: 'Batas rukun membasuh tangan adalah sampai kedua siku (al-marafiq). Termasuk memasukkan siku ke dalam basuhan.',
    dalilReference: 'Hadits Shahih Bukhari & Muslim dari Abu Hurairah r.a.',
    defaultTimeSeconds: 15,
    defaultPoints: 1000,
    options: [
      { id: 'opt_w2_a', label: 'A', text: 'Hanya sampai pergelangan tangan', isCorrect: false, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_w2_b', label: 'B', text: 'Sampai pangkal lengan atas', isCorrect: false, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_w2_c', label: 'C', text: 'Sampai kedua siku tangan', isCorrect: true, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_w2_d', label: 'D', text: 'Cukup ujung-ujung jari saja', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_tayammum_01',
    subchapterId: 'sub_tayammum',
    createdBy: 'usr_teach_01',
    questionText: 'Manakah media yang sah digunakan untuk bersuci dengan cara tayammum menurut jumhur ulama?',
    arabicText: 'فَتَيَمَّمُوا صَعِيدًا طَيِّبًا',
    difficulty: 'MEDIUM',
    explanation: 'Media tayammum adalah debu atau tanah yang suci (sha\'idan thayyiba), tidak bercampur najis atau kotoran beracun.',
    dalilReference: 'QS. An-Nisa: 43 dan QS. Al-Ma\'idah: 6',
    defaultTimeSeconds: 20,
    defaultPoints: 1000,
    options: [
      { id: 'opt_t1_a', label: 'A', text: 'Debu tanah yang suci dan bersih', isCorrect: true, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_t1_b', label: 'B', text: 'Kain handuk yang dibasahi alkohol', isCorrect: false, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_t1_c', label: 'C', text: 'Serbuk kapur tulis yang mengandung kimia', isCorrect: false, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_t1_d', label: 'D', text: 'Abu gosok yang sudah terkena kotoran', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_tayammum_02',
    subchapterId: 'sub_tayammum',
    createdBy: 'usr_teach_01',
    questionText: 'Anggota tubuh mana sajakah yang diusap saat melakukan tayammum?',
    arabicText: 'فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ',
    difficulty: 'EASY',
    explanation: 'Dalam tayammum hanya ada 2 anggota tubuh yang diusap debu: wajah dan kedua tangan. Kepala dan kaki tidak diusap dalam tayammum.',
    dalilReference: 'Hadits Ammar bin Yasir r.a. (Muttafaq \'alaih)',
    defaultTimeSeconds: 15,
    defaultPoints: 1000,
    options: [
      { id: 'opt_t2_a', label: 'A', text: 'Wajah, kepala, dan kedua kaki', isCorrect: false, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_t2_b', label: 'B', text: 'Wajah dan kedua tangan saja', isCorrect: true, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_t2_c', label: 'C', text: 'Kedua tangan dan kedua telinga', isCorrect: false, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_t2_d', label: 'D', text: 'Seluruh tubuh seperti mandi besar', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_shalat_01',
    subchapterId: 'sub_rukun_shalat',
    createdBy: 'usr_teach_01',
    questionText: 'Seseorang yang shalat tidak berhenti sejenak setelah ruku\' (tidak tuma\'ninah). Bagaimanakah hukum shalatnya?',
    arabicText: 'ارْجِعْ فَصَلِّ فَإِنَّكَ لَمْ تُصَلِّ',
    difficulty: 'HARD',
    explanation: 'Tuma\'ninah (tenang sejenak sekadar bacaan tasbih) merupakan rukun fi\'li shalat. Tanpa tuma\'ninah, shalat tidak sah sebagaimana hadits al-musi\'u shalatah.',
    dalilReference: 'Hadits Bukhari no. 757: Nabi bersabda kepada orang yang shalat terburu-buru: "Kembalilah dan ulangi shalatmu, sesungguhnya engkau belum shalat."',
    defaultTimeSeconds: 25,
    defaultPoints: 1000,
    options: [
      { id: 'opt_s1_a', label: 'A', text: 'Shalatnya tetap sah namun makruh', isCorrect: false, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_s1_b', label: 'B', text: 'Shalatnya batal / tidak sah karena tuma\'ninah adalah rukun', isCorrect: true, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_s1_c', label: 'C', text: 'Cukup diganti dengan sedekah', isCorrect: false, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_s1_d', label: 'D', text: 'Sah asalkan membaca surat Al-Fatihah lancar', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_nun_01',
    subchapterId: 'sub_nun_sukun',
    createdBy: 'usr_teach_01',
    questionText: 'Hukum bacaan apakah yang terjadi jika Nun Sukun (نْ) bertemu dengan huruf Ba (ب)?',
    arabicText: 'مِنْ بَعْدِ (MIM BA\'DI)',
    difficulty: 'EASY',
    explanation: 'Jika nun sukun atau tanwin bertemu huruf Ba, hukumnya adalah Iqlab, di mana bunyi Nun diubah menjadi Mim disertai ghunnah (dengung).',
    dalilReference: 'Matan Tuhfatul Athfal: "Wats-tsaalitsu al-Iqlaabu \'indal baa-i miiman bighunnatin ma\'al ikhfaa-i"',
    defaultTimeSeconds: 15,
    defaultPoints: 1000,
    options: [
      { id: 'opt_n1_a', label: 'A', text: 'Izhar Halqi (Jelas tanpa dengung)', isCorrect: false, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_n1_b', label: 'B', text: 'Idgham Bighunnah (Melebur dengan dengung)', isCorrect: false, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_n1_c', label: 'C', text: 'Iqlab (Mengubah bunyi menjadi Mim)', isCorrect: true, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_n1_d', label: 'D', text: 'Ikhfa Haqiqi (Samar-samar)', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
  {
    id: 'q_malaikat_01',
    subchapterId: 'sub_malaikat',
    createdBy: 'usr_teach_01',
    questionText: 'Malaikat yang bertugas membagi rezeki dan mengatur turunnya hujan atas izin Allah adalah...',
    arabicText: 'مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ',
    difficulty: 'EASY',
    explanation: 'Malaikat Mikail ditugaskan Allah untuk mengurus rezeki makhluk dan menurunkan hujan serta menumbuhkan pepohonan.',
    dalilReference: 'QS. Al-Baqarah: 98',
    defaultTimeSeconds: 15,
    defaultPoints: 1000,
    options: [
      { id: 'opt_m1_a', label: 'A', text: 'Malaikat Mikail', isCorrect: true, shape: 'TRIANGLE', colorName: 'red' },
      { id: 'opt_m1_b', label: 'B', text: 'Malaikat Israfil', isCorrect: false, shape: 'DIAMOND', colorName: 'blue' },
      { id: 'opt_m1_c', label: 'C', text: 'Malaikat Izrail', isCorrect: false, shape: 'CIRCLE', colorName: 'yellow' },
      { id: 'opt_m1_d', label: 'D', text: 'Malaikat Raqib', isCorrect: false, shape: 'SQUARE', colorName: 'green' },
    ],
  },
];

// 4. Initial Active Quizzes
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz_thaharah_01',
    teacherId: 'usr_teach_01',
    title: 'Kuis Akbar Fiqih Thaharah: Wudhu & Tayammum',
    description: 'Evaluasi formatif interaktif gaya Kahoot mencakup bab bersuci, rukun wudhu, dan syarat sah tayammum.',
    pinCode: '784291',
    accessMode: 'HYBRID',
    status: 'ACTIVE',
    quizDurationMinutes: 30, // Default 30 min (range 5-120 min)
    timePerQuestionDefault: 20,
    questionIds: ['q_wudhu_01', 'q_wudhu_02', 'q_tayammum_01', 'q_tayammum_02'],
    createdAt: '2026-10-25T08:00:00Z',
  },
  {
    id: 'quiz_gabungan_02',
    teacherId: 'usr_teach_01',
    title: 'Ujian Kilat Tajwid & Shalat Berjamaah',
    description: 'Uji kecepatan pemahaman rukun shalat dan hukum nun sukun dengan analisis granular.',
    pinCode: '319502',
    accessMode: 'MANDATORY_ONLY',
    status: 'ACTIVE',
    quizDurationMinutes: 15,
    timePerQuestionDefault: 20,
    questionIds: ['q_shalat_01', 'q_nun_01', 'q_malaikat_01'],
    createdAt: '2026-10-26T10:00:00Z',
  },
];

// 5. Mandatory Invitations / Assignments
// Key constraint: Students cannot reject! Status transitions: ASSIGNED -> IN_PROGRESS -> COMPLETED
export const MOCK_ASSIGNMENTS: QuizAssignment[] = [
  {
    id: 'asg_01',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_01', // Ahmad Fathan (Current logged in student)
    studentName: 'Ahmad Fathan Bil-Haq',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    assignedBy: 'usr_teach_01',
    status: 'ASSIGNED', // Belum Dikerjakan (Wajib Masuk)
    isMandatory: true,
    assignedAt: '2026-10-26T08:00:00Z',
    dueDate: '2026-10-29T23:59:00Z',
  },
  {
    id: 'asg_02',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_02', // Fatimah Az-Zahra
    studentName: 'Fatimah Az-Zahra',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    assignedBy: 'usr_teach_01',
    status: 'COMPLETED',
    isMandatory: true,
    assignedAt: '2026-10-26T08:00:00Z',
    dueDate: '2026-10-29T23:59:00Z',
    score: 3850,
    completedAt: '2026-10-27T09:14:00Z',
  },
  {
    id: 'asg_03',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_03', // Zaid
    studentName: 'Zaid bin Thabit Al-Habsy',
    studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    assignedBy: 'usr_teach_01',
    status: 'COMPLETED',
    isMandatory: true,
    assignedAt: '2026-10-26T08:00:00Z',
    dueDate: '2026-10-29T23:59:00Z',
    score: 2900,
    completedAt: '2026-10-27T11:20:00Z',
  },
  {
    id: 'asg_04',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_04', // Aisyah
    studentName: 'Aisyah Nur Humaira',
    studentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedBy: 'usr_teach_01',
    status: 'IN_PROGRESS',
    isMandatory: true,
    assignedAt: '2026-10-26T08:00:00Z',
    dueDate: '2026-10-29T23:59:00Z',
  },
  {
    id: 'asg_05',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_05', // Umar
    studentName: 'Umar Al-Faruq',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedBy: 'usr_teach_01',
    status: 'ASSIGNED',
    isMandatory: true,
    assignedAt: '2026-10-26T08:00:00Z',
    dueDate: '2026-10-29T23:59:00Z',
  },
];

// 6. Pre-computed Historical Quiz Attempts for Granular Reports
export const INITIAL_STUDENT_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att_01',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_02', // Fatimah
    totalScore: 3850,
    totalCorrect: 4,
    totalQuestions: 4,
    totalTimeSpentMs: 24500,
    finishedAt: '2026-10-27T09:14:00Z',
    answers: [
      { questionId: 'q_wudhu_01', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w1_b', isCorrect: true, responseTimeMs: 4200, pointsEarned: 960 },
      { questionId: 'q_wudhu_02', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w2_c', isCorrect: true, responseTimeMs: 3100, pointsEarned: 980 },
      { questionId: 'q_tayammum_01', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t1_a', isCorrect: true, responseTimeMs: 5100, pointsEarned: 940 },
      { questionId: 'q_tayammum_02', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t2_b', isCorrect: true, responseTimeMs: 4800, pointsEarned: 970 },
    ],
  },
  {
    id: 'att_02',
    quizId: 'quiz_thaharah_01',
    studentId: 'usr_stud_03', // Zaid
    totalScore: 2900,
    totalCorrect: 3,
    totalQuestions: 4,
    totalTimeSpentMs: 38200,
    finishedAt: '2026-10-27T11:20:00Z',
    answers: [
      { questionId: 'q_wudhu_01', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w1_b', isCorrect: true, responseTimeMs: 6500, pointsEarned: 910 },
      { questionId: 'q_wudhu_02', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w2_c', isCorrect: true, responseTimeMs: 5400, pointsEarned: 930 },
      { questionId: 'q_tayammum_01', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t1_c', isCorrect: false, responseTimeMs: 12000, pointsEarned: 0 },
      { questionId: 'q_tayammum_02', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t2_b', isCorrect: true, responseTimeMs: 7200, pointsEarned: 890 },
    ],
  },
  // Baseline historical attempts for Ahmad (to demonstrate granular sub-bab mastery & weakness)
  {
    id: 'att_03_prior',
    quizId: 'quiz_prior_eval',
    studentId: 'usr_stud_01', // Ahmad Fathan Bil-Haq
    totalScore: 4850,
    totalCorrect: 11,
    totalQuestions: 17,
    totalTimeSpentMs: 78000,
    finishedAt: '2026-10-25T14:30:00Z',
    answers: [
      // 1. Wudhu: 4 benar dari 5 soal = 80%
      { questionId: 'q_wudhu_01', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w1_b', isCorrect: true, responseTimeMs: 3800, pointsEarned: 950 },
      { questionId: 'q_wudhu_02', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w2_c', isCorrect: true, responseTimeMs: 4100, pointsEarned: 920 },
      { questionId: 'q_wudhu_03', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w1_b', isCorrect: true, responseTimeMs: 4500, pointsEarned: 900 },
      { questionId: 'q_wudhu_04', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w2_c', isCorrect: true, responseTimeMs: 3900, pointsEarned: 940 },
      { questionId: 'q_wudhu_05', subchapterId: 'sub_wudhu', selectedOptionId: 'opt_w1_a', isCorrect: false, responseTimeMs: 7200, pointsEarned: 0 },

      // 2. Mandi Hadas / Janabat: 2 benar dari 5 soal = 40% (Kelemahan Spesifik yang perlu remedial!)
      { questionId: 'q_mandi_01', subchapterId: 'sub_mandi', selectedOptionId: 'opt_m1', isCorrect: true, responseTimeMs: 5000, pointsEarned: 880 },
      { questionId: 'q_mandi_02', subchapterId: 'sub_mandi', selectedOptionId: 'opt_m2', isCorrect: true, responseTimeMs: 5200, pointsEarned: 860 },
      { questionId: 'q_mandi_03', subchapterId: 'sub_mandi', selectedOptionId: 'opt_m_err1', isCorrect: false, responseTimeMs: 8100, pointsEarned: 0 },
      { questionId: 'q_mandi_04', subchapterId: 'sub_mandi', selectedOptionId: 'opt_m_err2', isCorrect: false, responseTimeMs: 9500, pointsEarned: 0 },
      { questionId: 'q_mandi_05', subchapterId: 'sub_mandi', selectedOptionId: 'opt_m_err3', isCorrect: false, responseTimeMs: 8700, pointsEarned: 0 },

      // 3. Tayammum: 3 benar dari 5 soal = 60%
      { questionId: 'q_tayammum_01', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t1_a', isCorrect: true, responseTimeMs: 4200, pointsEarned: 910 },
      { questionId: 'q_tayammum_02', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t2_b', isCorrect: true, responseTimeMs: 4600, pointsEarned: 890 },
      { questionId: 'q_tayammum_03', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t1_a', isCorrect: true, responseTimeMs: 4800, pointsEarned: 880 },
      { questionId: 'q_tayammum_04', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t1_c', isCorrect: false, responseTimeMs: 9800, pointsEarned: 0 },
      { questionId: 'q_tayammum_05', subchapterId: 'sub_tayammum', selectedOptionId: 'opt_t2_a', isCorrect: false, responseTimeMs: 8900, pointsEarned: 0 },

      // 4. Kaidah Tajwid (Nun Sukun): 2 benar dari 2 soal = 100%
      { questionId: 'q_nun_01', subchapterId: 'sub_nun_sukun', selectedOptionId: 'opt_n1_c', isCorrect: true, responseTimeMs: 3500, pointsEarned: 960 },
      { questionId: 'q_nun_02', subchapterId: 'sub_nun_sukun', selectedOptionId: 'opt_n1_c', isCorrect: true, responseTimeMs: 3800, pointsEarned: 950 },
    ],
  },
];

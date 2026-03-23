import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // --- Seed Courses ---
  const course1 = await prisma.course.upsert({
    where: { id: 'course-beginner' },
    update: {},
    create: {
      id: 'course-beginner',
      title: 'English for Beginners',
      description: 'Start your journey with basic English.',
      level: 'A1',
      category: 'General',
      orderIndex: 1,
    },
  });

  // --- Seed Units ---
  const unit1 = await prisma.unit.upsert({
    where: { id: 'unit-1-beginner' },
    update: {},
    create: {
      id: 'unit-1-beginner',
      courseId: course1.id,
      title: 'Greetings & Introduction',
      description: 'Learn how to greet people and introduce yourself.',
      orderIndex: 1,
    },
  });

  // --- Seed Lessons ---
  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1-intro' },
    update: {},
    create: {
      id: 'lesson-1-intro',
      unitId: unit1.id,
      title: 'Saying Hello',
      type: 'VOCABULARY',
      contentJson: {
        text: 'Hello, Hi, Good morning',
        media: [],
      },
      durationMinutes: 10,
      xpReward: 50,
      orderIndex: 1,
    },
  });

  // --- Seed Vocabulary ---
  const vocabData = [
    { word: 'Hello', phonetic: '/həˈləʊ/', definition: 'Một lời chào phổ biến.', level: 'A1', topic: 'Greetings' },
    { word: 'Goodbye', phonetic: '/ˌɡʊdˈbaɪ/', definition: 'Chào tạm biệt.', level: 'A1', topic: 'Greetings' },
    { word: 'Thank you', phonetic: '/ˈθæŋk juː/', definition: 'Cảm ơn.', level: 'A1', topic: 'Greetings' },
    { word: 'Family', phonetic: '/ˈfæm.əl.i/', definition: 'Gia đình.', level: 'A1', topic: 'Family' },
    { word: 'Father', phonetic: '/ˈfɑː.ðər/', definition: 'Cha, bố.', level: 'A1', topic: 'Family' },
    { word: 'Mother', phonetic: '/ˈmʌð.ər/', definition: 'Mẹ.', level: 'A1', topic: 'Family' },
    { word: 'Brother', phonetic: '/ˈbrʌð.ər/', definition: 'Anh/em trai.', level: 'A1', topic: 'Family' },
    { word: 'Sister', phonetic: '/ˈsɪs.tər/', definition: 'Chị/em gái.', level: 'A1', topic: 'Family' },
    { word: 'Friend', phonetic: '/frend/', definition: 'Bạn bè.', level: 'A1', topic: 'Family' },
    { word: 'House', phonetic: '/haʊs/', definition: 'Ngôi nhà.', level: 'A1', topic: 'Home' },
    { word: 'School', phonetic: '/skuːl/', definition: 'Trường học.', level: 'A1', topic: 'Education' },
    { word: 'Teacher', phonetic: '/ˈtiː.tʃər/', definition: 'Giáo viên.', level: 'A1', topic: 'Education' },
    { word: 'Student', phonetic: '/ˈstjuː.dənt/', definition: 'Học sinh, sinh viên.', level: 'A1', topic: 'Education' },
    { word: 'Book', phonetic: '/bʊk/', definition: 'Quyển sách.', level: 'A1', topic: 'Education' },
    { word: 'Work', phonetic: '/wɜːk/', definition: 'Công việc/Làm việc.', level: 'A1', topic: 'Work' },
    { word: 'Office', phonetic: '/ˈɒf.ɪs/', definition: 'Văn phòng.', level: 'A1', topic: 'Work' },
    { word: 'Computer', phonetic: '/kəmˈpjuː.tər/', definition: 'Máy tính.', level: 'A1', topic: 'Technology' },
    { word: 'Internet', phonetic: '/ˈɪn.tə.net/', definition: 'Mạng internet.', level: 'A1', topic: 'Technology' },
    { word: 'Travel', phonetic: '/ˈtræv.əl/', definition: 'Du lịch.', level: 'A1', topic: 'Travel' },
    { word: 'Airport', phonetic: '/ˈeə.pɔːt/', definition: 'Sân bay.', level: 'A1', topic: 'Travel' },
    // More words to reach 50+
    { word: 'Restaurant', phonetic: '/ˈres.trɒnt/', definition: 'Nhà hàng.', level: 'A1', topic: 'Travel' },
    { word: 'Hospital', phonetic: '/ˈhɒs.pɪ.təl/', definition: 'Bệnh viện.', level: 'A2', topic: 'Health' },
    { word: 'Doctor', phonetic: '/ˈdɒk.tər/', definition: 'Bác sĩ.', level: 'A1', topic: 'Health' },
    { word: 'Medicine', phonetic: '/ˈmed.sn/', definition: 'Thuốc.', level: 'A2', topic: 'Health' },
    { word: 'Happy', phonetic: '/ˈhæp.i/', definition: 'Hạnh phúc.', level: 'A1', topic: 'Emotions' },
    { word: 'Sad', phonetic: '/sæd/', definition: 'Buồn.', level: 'A1', topic: 'Emotions' },
    { word: 'Angry', phonetic: '/ˈæŋ.ɡri/', definition: 'Tức giận.', level: 'A1', topic: 'Emotions' },
    { word: 'Beautiful', phonetic: '/ˈbjuː.tɪ.fəl/', definition: 'Đẹp.', level: 'A1', topic: 'General' },
    { word: 'Difficult', phonetic: '/ˈdɪf.ɪ.kəlt/', definition: 'Khó.', level: 'A1', topic: 'General' },
    { word: 'Easy', phonetic: '/ˈiː.zi/', definition: 'Dễ.', level: 'A1', topic: 'General' },
    { word: 'Market', phonetic: '/ˈmɑː.kɪt/', definition: 'Chợ.', level: 'A1', topic: 'Travel' },
    { word: 'Money', phonetic: '/ˈmʌn.i/', definition: 'Tiền.', level: 'A1', topic: 'General' },
    { word: 'Time', phonetic: '/taɪm/', definition: 'Thời gian.', level: 'A1', topic: 'General' },
    { word: 'Year', phonetic: '/jɪər/', definition: 'Năm.', level: 'A1', topic: 'General' },
    { word: 'Month', phonetic: '/mʌnθ/', definition: 'Tháng.', level: 'A1', topic: 'General' },
    { word: 'Week', phonetic: '/wiːk/', definition: 'Tuần.', level: 'A1', topic: 'General' },
    { word: 'Day', phonetic: '/deɪ/', definition: 'Ngày.', level: 'A1', topic: 'General' },
    { word: 'Night', phonetic: '/naɪt/', definition: 'Đêm.', level: 'A1', topic: 'General' },
    { word: 'Morning', phonetic: '/ˈmɔː.nɪŋ/', definition: 'Buổi sáng.', level: 'A1', topic: 'General' },
    { word: 'Afternoon', phonetic: '/ˌɑːf.təˈnuːn/', definition: 'Buổi chiều.', level: 'A1', topic: 'General' },
    { word: 'Evening', phonetic: '/ˈiːv.nɪŋ/', definition: 'Buổi tối.', level: 'A1', topic: 'General' },
    { word: 'Sun', phonetic: '/sʌn/', definition: 'Mặt trời.', level: 'A1', topic: 'Nature' },
    { word: 'Moon', phonetic: '/muːn/', definition: 'Mặt trăng.', level: 'A1', topic: 'Nature' },
    { word: 'Water', phonetic: '/ˈwɔː.tər/', definition: 'Nước.', level: 'A1', topic: 'Nature' },
    { word: 'Food', phonetic: '/fuːd/', definition: 'Thức ăn.', level: 'A1', topic: 'General' },
    { word: 'Drink', phonetic: '/drɪŋk/', definition: 'Đồ uống.', level: 'A1', topic: 'General' },
    { word: 'Bread', phonetic: '/bred/', definition: 'Bánh mì.', level: 'A1', topic: 'General' },
    { word: 'Fruit', phonetic: '/fruːt/', definition: 'Trái cây.', level: 'A1', topic: 'General' },
    { word: 'Apple', phonetic: '/ˈæp.l̩/', definition: 'Quả táo.', level: 'A1', topic: 'General' },
    { word: 'Orange', phonetic: '/ˈɒr.ɪndʒ/', definition: 'Quả cam.', level: 'A1', topic: 'General' },
    { word: 'Success', phonetic: '/səkˈses/', definition: 'Thành công.', level: 'B1', topic: 'Work' },
    { word: 'Ability', phonetic: '/əˈbɪl.ə.ti/', definition: 'Khả năng.', level: 'B1', topic: 'General' },
  ];

  for (const item of vocabData) {
    await prisma.vocabWord.upsert({
      where: { id: `word-${item.word.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `word-${item.word.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
      },
    });
  }

  // --- Seed Grammar ---
  const grammarTopic1 = await prisma.grammarTopic.upsert({
    where: { id: 'grammar-present-simple' },
    update: {},
    create: {
      id: 'grammar-present-simple',
      title: 'Thì Hiện tại đơn (Present Simple)',
      description: 'Cách dùng, công thức và dấu hiệu nhận biết thì hiện tại đơn.',
      level: 'A1',
      orderIndex: 1,
      contentJson: {
        sections: [
          {
            title: '1. Cách dùng',
            content: 'Diễn tả một thói quen, hành động lặp đi lặp lại hoặc một chân lý hiển nhiên.'
          },
          {
            title: '2. Công thức',
            content: 'Khẳng định: S + V(s/es). Phủ định: S + do/does + not + V. Nghi vấn: Do/Does + S + V?'
          }
        ],
        quickNotes: 'He, She, It -> V thêm s/es. I, You, We, They -> V nguyên mẫu.'
      }
    }
  });

  await prisma.grammarExercise.upsert({
    where: { id: 'grammar-ex-1' },
    update: {},
    create: {
      id: 'grammar-ex-1',
      topicId: grammarTopic1.id,
      type: 'MULTIPLE_CHOICE',
      question: 'She ___ to school every day.',
      optionsJson: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 'goes',
      explanation: 'Với chủ ngữ "She" (ngôi thứ 3 số ít), động từ "go" phải thêm "es" thành "goes".',
      orderIndex: 1
    }
  });

  await prisma.grammarExercise.upsert({
    where: { id: 'grammar-ex-2' },
    update: {},
    create: {
      id: 'grammar-ex-2',
      topicId: grammarTopic1.id,
      type: 'FILL_IN_BLANK',
      question: 'They ___ (not/like) apples.',
      correctAnswer: 'do not like',
      explanation: 'Với chủ ngữ "They", ta mượn trợ động từ "do" kèm "not" để thành lập câu phủ định.',
      orderIndex: 2
    }
  });

  // --- Seed Listening ---
  const listeningEx1 = await prisma.listeningExercise.upsert({
    where: { id: 'listening-daily-conv' },
    update: {},
    create: {
      id: 'listening-daily-conv',
      title: 'Cuộc hội thoại hàng ngày (A Daily Conversation)',
      description: 'Nghe một cuộc hội thoại ngắn giữa hai người bạn về các hoạt động trong ngày.',
      level: 'A2',
      topic: 'Daily Life',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
      transcript: 'Person A: Hi, how are you?\nPerson B: I am fine, thank you. What are you doing?\nPerson A: I am reading a book.\nPerson B: That sounds nice. What book is it?\nPerson A: It is a book about history.',
      durationSec: 30,
      orderIndex: 1
    }
  });

  await prisma.listeningQuestion.upsert({
    where: { id: 'listen-q1' },
    update: {},
    create: {
      id: 'listen-q1',
      exerciseId: listeningEx1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is Person A doing?',
      optionsJson: ['Reading a book', 'Sleeping', 'Eating', 'Walking'],
      correctAnswer: 'Reading a book',
      explanation: 'Trong transcript, Person A nói: "I am reading a book."',
      orderIndex: 1
    }
  });

  await prisma.listeningQuestion.upsert({
    where: { id: 'listen-q2' },
    update: {},
    create: {
      id: 'listen-q2',
      exerciseId: listeningEx1.id,
      type: 'FILL_IN_BLANK',
      questionText: 'The book is about ___.',
      correctAnswer: 'history',
      explanation: 'Person A xác nhận: "It is a book about history."',
      orderIndex: 2
    }
  });

  // --- Seed Speaking ---
  await prisma.speakingExercise.upsert({
    where: { id: 'speak-ex-apple' },
    update: {},
    create: {
      id: 'speak-ex-apple',
      title: 'Phát âm từ: Apple',
      description: 'Luyện tập phát âm từ "Apple" chính xác.',
      level: 'A1',
      type: 'PRONUNCIATION',
      targetText: 'Apple',
      phonetic: '/ˈæpl/',
      orderIndex: 1
    }
  });

  await prisma.speakingExercise.upsert({
    where: { id: 'speak-ex-greeting' },
    update: {},
    create: {
      id: 'speak-ex-greeting',
      title: 'Chào hỏi cơ bản',
      description: 'Đọc câu chào hỏi phổ biến một cách tự nhiên.',
      level: 'A1',
      type: 'READ_ALOUD',
      targetText: 'How are you today?',
      orderIndex: 2
    }
  });

  // --- Seed Writing ---
  await prisma.writingPrompt.upsert({
    where: { id: 'write-ex-email' },
    update: {},
    create: {
      id: 'write-ex-email',
      title: 'Thư gửi bạn về kỳ nghỉ (Holiday Email)',
      description: 'Viết email cho một người bạn kể về kỳ nghỉ gần nhất của bạn.',
      requirements: 'Mention where you went, who you were with, and what you did. Use appropriate informal greetings and closings.',
      type: 'EMAIL',
      level: 'A2',
      topic: 'Travel',
      targetWords: 100,
      tipsJson: [
        'Sử dụng các thì quá khứ (Past Simple) để kể lại sự kiện.',
        'Đừng quên các từ nối: First, Then, After that, Finally.',
        'Cố gắng sử dụng ít nhất 3 tính từ miêu tả cảm xúc.'
      ],
      orderIndex: 1
    }
  });

  await prisma.writingPrompt.upsert({
    where: { id: 'write-ex-essay' },
    update: {},
    create: {
      id: 'write-ex-essay',
      title: 'Biến đổi khí hậu (Climate Change Essay)',
      description: 'Nghị luận về nguyên nhân và giải pháp cho biến đổi khí hậu.',
      requirements: 'Climate change is one of the most serious issues facing the world today. What are the causes and what can be done to solve this problem? Write at least 250 words.',
      type: 'ESSAY',
      level: 'B2',
      topic: 'Environment',
      targetWords: 250,
      tipsJson: [
        'Cấu trúc bài viết: Introduction, Causes, Solutions, Conclusion.',
        'Sử dụng từ vựng học thuật: emissions, environmental impact, sustainable, mitigation.',
        'Đưa ra các ví dụ cụ thể để minh họa cho luận điểm.'
      ],
      orderIndex: 2
    }
  });

  // --- Seed Reading ---
  const passage1 = await prisma.readingPassage.upsert({
    where: { id: 'read-ex-tea' },
    update: {},
    create: {
      id: 'read-ex-tea',
      title: 'Lịch sử của Trà (The History of Tea)',
      topic: 'History',
      level: 'A2',
      durationMins: 5,
      content: `Trà là đồ uống phổ biến thứ hai trên thế giới, chỉ sau nước. Nó có nguồn gốc từ Trung Quốc cách đây hàng ngàn năm. Truyền thuyết kể rằng Hoàng đế Thần Nông đã tình cờ phát hiện ra trà khi một vài chiếc lá từ một bụi cây gần đó rơi vào nước đang sôi của ông. 

Ngày nay, trà được trồng ở nhiều quốc gia, bao gồm Ấn Độ, Sri Lanka và Kenya. Có nhiều loại trà khác nhau như trà xanh, trà đen và trà ô long, tất cả đều đến từ cùng một loại cây gọi là Camellia sinensis. Sự khác biệt nằm ở cách chế biến lá sau khi hái.`
    }
  });

  await prisma.readingQuestion.upsert({
    where: { id: 'read-q1' },
    update: {},
    create: {
      id: 'read-q1',
      passageId: passage1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: 'Trà có nguồn gốc từ quốc gia nào?',
      optionsJson: ['Ấn Độ', 'Trung Quốc', 'Kenya', 'Sri Lanka'],
      correctAnswer: 'Trung Quốc',
      explanation: 'Đoạn văn nêu rõ: "Nó có nguồn gốc từ Trung Quốc cách đây hàng ngàn năm."',
      orderIndex: 1
    }
  });

  await prisma.readingQuestion.upsert({
    where: { id: 'read-q2' },
    update: {},
    create: {
      id: 'read-q2',
      passageId: passage1.id,
      type: 'TRUE_FALSE_NG',
      questionText: 'Trà là đồ uống phổ biến nhất trên thế giới.',
      optionsJson: ['True', 'False', 'Not Given'],
      correctAnswer: 'False',
      explanation: 'Trà là đồ uống phổ biến thứ hai, sau nước.',
      orderIndex: 2
    }
  });

  // --- Seed Placement Test ---
  const placementSet = await prisma.examSet.upsert({
    where: { id: 'placement-test-set' },
    update: {},
    create: {
      id: 'placement-test-set',
      title: 'Initial Placement Test',
      type: 'PLACEMENT',
      level: 'ALL',
      durationMinutes: 30,
    },
  });

  const placementQuestions = [
    {
      id: 'pt-q1',
      examSetId: placementSet.id,
      skill: 'GRAMMAR',
      questionText: 'I ___ a student.',
      optionsJson: ['am', 'is', 'are', 'be'],
      correctAnswer: 'am',
      orderIndex: 1,
    },
    {
      id: 'pt-q2',
      examSetId: placementSet.id,
      skill: 'VOCABULARY',
      questionText: 'Which word is a fruit?',
      optionsJson: ['Car', 'Apple', 'Book', 'Phone'],
      correctAnswer: 'Apple',
      orderIndex: 2,
    },
    {
      id: 'pt-q3',
      examSetId: placementSet.id,
      skill: 'GRAMMAR',
      questionText: 'He ___ to the park every Sunday.',
      optionsJson: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 'goes',
      orderIndex: 3,
    },
    {
      id: 'pt-q4',
      examSetId: placementSet.id,
      skill: 'READING',
      questionText: 'If it is raining, you should take an ___.',
      optionsJson: ['Umbrella', 'Sunscreen', 'Sunglasses', 'Hat'],
      correctAnswer: 'Umbrella',
      orderIndex: 4,
    },
    {
      id: 'pt-q5',
      examSetId: placementSet.id,
      skill: 'GRAMMAR',
      questionText: 'They ___ playing football now.',
      optionsJson: ['is', 'am', 'are', 'was'],
      correctAnswer: 'are',
      orderIndex: 5,
    },
  ];

  for (const q of placementQuestions) {
    await prisma.examQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });
  }

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

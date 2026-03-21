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
  await prisma.vocabWord.upsert({
    where: { id: 'word-hello' },
    update: {},
    create: {
      id: 'word-hello',
      word: 'Hello',
      phonetic: '/həˈləʊ/',
      definition: 'A common greeting.',
      level: 'A1',
      topic: 'Greetings',
    },
  });

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

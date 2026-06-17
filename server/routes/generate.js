const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const { generateQuestions } = require('../services/aiService');

const router = express.Router();
const prisma = new PrismaClient();

// ── POST /api/generate ────────────────────────────────────────
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { role, company, jd, categories, difficulty, count } = req.body;

    // Validation
    if (!role || !company) {
      return res.status(400).json({ error: 'Role and company are required' });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: 'Select at least one category' });
    }

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const validCounts = [5, 10, 15];
    const questionCount = parseInt(count);
    if (!validCounts.includes(questionCount)) {
      return res.status(400).json({ error: 'Count must be 5, 10, or 15' });
    }

    // Call AI service (with fallback chain)
    const { data, model } = await generateQuestions({
      role,
      company,
      jd,
      categories,
      difficulty,
      count: questionCount
    });

    if (!data.questions || !Array.isArray(data.questions)) {
      return res.status(500).json({ error: 'Invalid response from AI, please try again' });
    }

    // Save session to DB
    const session = await prisma.session.create({
      data: {
        userId: req.userId,
        role,
        company,
        jd: jd || null,
        difficulty,
        categories,
        modelUsed: model,
        questions: {
          create: data.questions.map((q) => ({
            category: q.category,
            question: q.question,
            hint: q.hint,
            bookmarked: false
          }))
        }
      },
      include: { questions: true }
    });

    res.status(201).json({
      message: 'Questions generated successfully',
      sessionId: session.id,
      modelUsed: model,
      questions: session.questions
    });

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: 'Failed to generate questions, please try again' });
  }
});

module.exports = router;
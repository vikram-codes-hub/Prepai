const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /api/history ──────────────────────────────────────────
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          select: {
            id: true,
            category: true,
            question: true,
            hint: true,
            bookmarked: true
          }
        }
      }
    });

    res.json({ sessions });

  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ── GET /api/history/:id ──────────────────────────────────────
router.get('/history/:id', authMiddleware, async (req, res) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId  // ensure ownership
      },
      include: { questions: true }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });

  } catch (err) {
    console.error('Session fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// ── DELETE /api/history/:id ───────────────────────────────────
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId  // ensure ownership
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Delete questions first (foreign key constraint)
    await prisma.question.deleteMany({
      where: { sessionId: req.params.id }
    });

    await prisma.session.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Session deleted successfully' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// ── PATCH /api/questions/:id/bookmark ────────────────────────
router.patch('/questions/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    const question = await prisma.question.findFirst({
      where: { id: req.params.id },
      include: { session: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Ensure the question belongs to the requesting user
    if (question.session.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: { bookmarked: !question.bookmarked }
    });

    res.json({
      message: updated.bookmarked ? 'Bookmarked' : 'Bookmark removed',
      bookmarked: updated.bookmarked
    });

  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// ── GET /api/bookmarks ────────────────────────────────────────
router.get('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: {
        bookmarked: true,
        session: { userId: req.userId }
      },
      include: {
        session: {
          select: { role: true, company: true, createdAt: true }
        }
      },
      orderBy: { session: { createdAt: 'desc' } }
    });

    res.json({ questions });

  } catch (err) {
    console.error('Bookmarks fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

module.exports = router;
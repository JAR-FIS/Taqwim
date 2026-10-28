// =========================================================================
// SEQUELIZE MODELS: TAQWIM INTERACTIVE ISLAMIC LMS
// Database: PostgreSQL with Sequelize ORM
// =========================================================================

export const SEQUELIZE_MODELS_CODE = `
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export const initSequelizeModels = (sequelize: Sequelize) => {
  // -----------------------------------------------------------------------
  // 1. MODEL QUIZ
  // -----------------------------------------------------------------------
  class Quiz extends Model {}
  Quiz.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'teacher_id',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Judul kuis tidak boleh kosong' },
          len: [3, 200],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pinCode: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
        field: 'pin_code',
        validate: {
          isNumeric: true,
          len: [6, 6],
        },
      },
      accessMode: {
        type: DataTypes.ENUM('MANDATORY_ONLY', 'PUBLIC_PIN', 'HYBRID'),
        defaultValue: 'HYBRID',
        field: 'access_mode',
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'BANNED', 'ARCHIVED'),
        defaultValue: 'ACTIVE',
      },
      bannedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'banned_reason',
      },
      bannedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'banned_at',
      },
      // Tugas 2: Durasi Global Kuis (min 5 menit, max 120 menit, default 30 menit)
      quizDurationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        field: 'quiz_duration_minutes',
        validate: {
          min: {
            args: [5],
            msg: 'Durasi kuis minimal 5 menit',
          },
          max: {
            args: [120],
            msg: 'Durasi kuis maksimal 120 menit',
          },
        },
      },
      timePerQuestionDefault: {
        type: DataTypes.INTEGER,
        defaultValue: 20,
        field: 'time_per_question_default',
      },
    },
    {
      sequelize,
      tableName: 'quizzes',
      timestamps: true,
      underscored: true,
    }
  );

  // -----------------------------------------------------------------------
  // 2. MODEL QUESTION
  // -----------------------------------------------------------------------
  class Question extends Model {}
  Question.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subchapterId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'subchapter_id',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by',
      },
      questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'question_text',
        validate: {
          notEmpty: { msg: 'Teks pertanyaan wajib diisi' },
        },
      },
      questionTextArabic: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'question_text_arabic',
      },
      difficulty: {
        type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'),
        defaultValue: 'MEDIUM',
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dalilReference: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'dalil_reference',
      },
      // Tugas 2: Durasi Per-Soal
      isQuestionTimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_question_timed',
      },
      questionDurationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
        field: 'question_duration_seconds',
        validate: {
          min: {
            args: [10],
            msg: 'Durasi per-soal minimal 10 detik',
          },
          max: {
            args: [120],
            msg: 'Durasi per-soal maksimal 120 detik',
          },
        },
      },
      defaultPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
        field: 'default_points',
      },
    },
    {
      sequelize,
      tableName: 'questions',
      timestamps: true,
      underscored: true,
    }
  );

  // -----------------------------------------------------------------------
  // 3. MODEL QUESTION OPTION (Multiple Choice 4 Opsi Pasti A, B, C, D)
  // -----------------------------------------------------------------------
  class QuestionOption extends Model {}
  QuestionOption.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'question_id',
      },
      optionLabel: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'option_label',
        validate: {
          isIn: {
            args: [['A', 'B', 'C', 'D']],
            msg: 'Opsi jawaban harus salah satu dari A, B, C, atau D',
          },
        },
      },
      optionText: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'option_text',
        validate: {
          notEmpty: { msg: 'Teks opsi jawaban tidak boleh kosong' },
        },
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_correct',
      },
      shape: {
        type: DataTypes.ENUM('TRIANGLE', 'DIAMOND', 'CIRCLE', 'SQUARE'),
        allowNull: false,
      },
      colorHex: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'color_hex',
      },
    },
    {
      sequelize,
      tableName: 'question_options',
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['question_id', 'option_label'],
        },
      ],
    }
  );

  // Associations
  Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
  Question.belongsTo(Quiz, { foreignKey: 'quiz_id' });

  Question.hasMany(QuestionOption, { foreignKey: 'question_id', as: 'options', onDelete: 'CASCADE' });
  QuestionOption.belongsTo(Question, { foreignKey: 'question_id' });

  return { Quiz, Question, QuestionOption };
};
`;

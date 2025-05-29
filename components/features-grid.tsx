"use client";

import { motion } from "framer-motion";
import { Github, MessageSquare, Calendar, GripVertical } from "lucide-react";

const FeatureCard = ({ title, description, children, className = "" }: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="relative z-10">
        <h3 className="mb-2 text-2xl font-medium">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  );
};

const NotificationItem = ({ avatar, title, subtitle, time }: any) => (
  <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors">
    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
      {avatar}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
      {time && <p className="text-xs text-gray-400 mt-1">{time}</p>}
    </div>
  </div>
);

const TaskItem = ({ title, checked = false }: { title: string; checked?: boolean }) => (
  <div className="flex items-center gap-3 py-2">
    <div className={`h-5 w-5 rounded border ${checked ? 'bg-black border-black' : 'border-gray-300'} flex items-center justify-center`}>
      {checked && <span className="text-white text-xs">✓</span>}
    </div>
    <span className={`text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{title}</span>
  </div>
);

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Smart Tutoring Card */}
      <FeatureCard
        title="Smart AI Tutoring"
        description="Personalized learning assistant that adapts to your pace and style."
        className="md:row-span-2"
      >
        <div className="space-y-2">
          <NotificationItem
            avatar="🎓"
            title="Personalized Learning Path Created"
            subtitle="Based on your learning style and goals"
          />
          <NotificationItem
            avatar="📚"
            title="New Topic Mastered"
            subtitle="Advanced Mathematics • Chapter 3"
            time="2 hours ago"
          />
          <NotificationItem
            avatar="🎯"
            title="Weekly Progress Update"
            subtitle="You're 85% towards your goal"
            time="Today"
          />
        </div>
      </FeatureCard>

      {/* Video Generator Card */}
      <FeatureCard
        title="AI Video Generator"
        description="Transform lessons into engaging video content."
      >
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Input your topic</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-black text-white p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Generate video</span>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Quiz Generator Card */}
      <FeatureCard
        title="Adaptive Quizzes"
        description="AI-generated assessments that evolve with you."
      >
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Personalized difficulty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Real-time feedback</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">Progress tracking</span>
          </div>
        </div>
      </FeatureCard>

      {/* Memory System Card */}
      <FeatureCard
        title="Long-Term Memory"
        description="AI that remembers your learning journey."
        className="md:col-span-2"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <TaskItem title="Remembers your learning style" checked={true} />
            <TaskItem title="Tracks concept mastery" checked={true} />
            <TaskItem title="Identifies knowledge gaps" checked={true} />
          </div>
          <div className="space-y-2">
            <TaskItem title="Adapts to your progress" checked={true} />
            <TaskItem title="Suggests review sessions" checked={true} />
            <TaskItem title="Builds on previous lessons" checked={true} />
          </div>
        </div>
      </FeatureCard>
    </div>
  );
} 
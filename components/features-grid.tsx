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
      {/* Notifications Card */}
      <FeatureCard
        title="Notifications"
        description="All your notifications in one place."
        className="md:row-span-2"
      >
        <div className="space-y-2">
          <NotificationItem
            avatar={<Github className="w-5 h-5" />}
            title="Jake requested PR review"
            subtitle="#323 Learning Integration • Main"
          />
          <NotificationItem
            avatar="🎨"
            title="David Assigned a Ticket"
            subtitle="Login page style updates"
            time="2 hours ago"
          />
          <NotificationItem
            avatar="👥"
            title="Team meeting scheduled"
            subtitle="Weekly Sync"
            time="Tomorrow 10 AM"
          />
        </div>
      </FeatureCard>

      {/* Drag & Drop Card */}
      <FeatureCard
        title="Effortless drag & drop"
        description="Move items between apps."
      >
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Drag items here</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Drop zone</span>
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Calendar Integration Card */}
      <FeatureCard
        title="Calendar Integration"
        description="Seamlessly manage your schedule."
      >
        <div className="mt-4 grid grid-cols-5 gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-square rounded bg-gray-50 p-2">
              <div className="text-center text-sm">{11 + i}</div>
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Task Management Card */}
      <FeatureCard
        title="Task Management"
        description="Keep track of your progress."
        className="md:col-span-2"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <TaskItem title="Review documentation" checked={true} />
            <TaskItem title="Update design system" />
            <TaskItem title="Implement new features" />
          </div>
          <div className="space-y-2">
            <TaskItem title="Team meeting prep" checked={true} />
            <TaskItem title="Client presentation" />
            <TaskItem title="Project planning" />
          </div>
        </div>
      </FeatureCard>
    </div>
  );
} 
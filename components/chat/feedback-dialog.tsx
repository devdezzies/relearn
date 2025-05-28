import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Github } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🙌</span> Share Your Feedback
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We're constantly working to improve Relearn. Your feedback helps us make it better for everyone.
          </p>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={() => window.open('mailto:support@relearn.ai', '_blank')}
            >
              <Mail className="h-5 w-5 text-blue-500" />
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Email Support</span>
                <span className="text-xs text-gray-500">support@relearn.ai</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={() => window.open('https://discord.gg/relearn', '_blank')}
            >
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Join Our Community</span>
                <span className="text-xs text-gray-500">discord.gg/relearn</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4"
              onClick={() => window.open('https://github.com/relearn/issues', '_blank')}
            >
              <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Report an Issue</span>
                <span className="text-xs text-gray-500">github.com/relearn/issues</span>
              </div>
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            Your feedback is valuable to us. We review every submission and use it to guide our development priorities.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
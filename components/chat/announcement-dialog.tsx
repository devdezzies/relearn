import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementDialog({ isOpen, onClose }: AnnouncementDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🎉</span> What's New
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Latest Updates
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <span>Improved chat response time with enhanced AI model</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <span>Added system-wide dark mode support for better visibility</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <span>Enhanced conversation organization with date-based categories</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Coming Soon
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5" />
                <span>Learning vaults for storing conversations</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5" />
                <span>Personalized quiz generation</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5" />
                <span>Memory layer for LLM</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            Stay tuned for more exciting features! We're constantly working to improve your experience.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
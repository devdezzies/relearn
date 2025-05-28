import { AlertDialog } from "@/components/ui/alert-dialog";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const helpMessage = `If you experience any issues:

1. Try refreshing the page
2. Check your internet connection
3. Clear browser cache if problems persist
4. Start a new conversation

Your chat history will be preserved.`;

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Troubleshooting"
      message={helpMessage}
    />
  );
} 
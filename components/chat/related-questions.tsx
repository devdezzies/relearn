import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isResponseComplete?: boolean;
}

export function RelatedQuestions({ questions, onQuestionClick, isResponseComplete = true }: RelatedQuestionsProps) {
  if (!questions || questions.length === 0) return null;
  if (!isResponseComplete) return null;

  return (
    <div className="mt-4 space-y-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">Related Questions</p>
        {!isResponseComplete && <Loader2 className="h-3 w-3 animate-spin" />}
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className="justify-start text-left hover:bg-muted/50 h-auto py-2 text-sm"
            onClick={() => onQuestionClick(question)}
          >
            <span className="mr-2">👉</span>
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
} 
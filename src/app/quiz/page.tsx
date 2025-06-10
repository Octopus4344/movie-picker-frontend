"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProtectedRoute } from "@/components/protected-route";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { Answer, Movie, Question } from "@/lib/types";

export default function QuizPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const { data, isLoading, isError } = useQuery<Question[]>({
    queryKey: ["quiz-questions"], // Added user primary key to queryKey
    queryFn: async () => {
      return await fetchData("auth/questions/", "GET", undefined, user?.access);
    },
    enabled: !!user,
  });

  const mutation = useMutation<Movie[], Error, { answers: Answer[] }>({
    mutationFn: async (answersToSubmit: { answers: Answer[] }) => {
      return fetchData(
        "auth/quiz-answers/",
        "POST",
        { body: JSON.stringify(answersToSubmit) },
        user?.access,
      );
    },
    onSuccess: (movies: Movie[]) => {
      console.log("Quiz completed with movies:", movies);
      queryClient.invalidateQueries({ queryKey: ["my-recommendations"] });
      router.push("/recommendations"); // Redirect to results page
      // Example: router.push('/quiz/results?movies=' + JSON.stringify(movies.map(m => m.id)));
    },
    onError: (error: any) => {
      alert(error.message || "Failed to submit answers. Please try again.");
    },
  });

  if (isError) {
    return (
      <div className="bg-gradient-primary flex min-h-screen items-center justify-center">
        <p className="rounded-md bg-white/10 p-4 text-lg text-red-500">
          Error loading questions. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading || !data || data.length === 0) {
    return (
      <div className="bg-gradient-primary flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleQuestionAnswered = ({
    question_id,
    answer_text,
  }: {
    question_id: number;
    answer_text: string;
  }) => {
    const newAnswer: Answer = { question_id, answer: answer_text };
    const newSelectedAnswers = [...selectedAnswers, newAnswer];
    setSelectedAnswers(newSelectedAnswers);

    if (step < data.length - 1) {
      setStep(step + 1);
    } else {
      mutation.mutate({ answers: newSelectedAnswers });
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gradient-primary flex min-h-screen items-center justify-center overflow-hidden p-4">
        <QuestionComponent
          question={data[step]}
          onQuestionAnswered={handleQuestionAnswered}
          totalSteps={data.length}
          currentStep={step}
        />
      </div>
    </ProtectedRoute>
  );
}

const QuestionComponent = ({
  question,
  onQuestionAnswered,
  totalSteps,
  currentStep,
}: {
  question: Question;
  onQuestionAnswered: ({
    question_id,
    answer_text,
  }: {
    question_id: number;
    answer_text: string;
  }) => void;
  totalSteps: number;
  currentStep: number;
}) => {
  const [selectedAnswerText, setSelectedAnswerText] = useState<string | null>(
    null,
  );

  const handleNextClick = () => {
    if (selectedAnswerText !== null) {
      onQuestionAnswered({
        question_id: question.id,
        answer_text: selectedAnswerText,
      });
      setSelectedAnswerText(null);
    }
  };

  if (!question) {
    return (
      <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl bg-neutral-700/40 p-8 text-white shadow-2xl backdrop-blur-lg md:p-10">
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl bg-neutral-700/40 p-8 text-white shadow-2xl backdrop-blur-lg md:p-10">
      <p className="text-base font-medium text-neutral-200 md:text-lg">
        Step {currentStep + 1} of {totalSteps}
      </p>
      <h2 className="text-center text-xl font-semibold md:text-2xl">
        {question.question}
      </h2>
      <div className="w-full space-y-3 pt-4">
        {question.available_answers.map((answer_text) => (
          <button
            key={answer_text}
            onClick={() => setSelectedAnswerText(answer_text)}
            className={`w-full cursor-pointer rounded-xl border px-5 py-3 text-center text-sm font-medium transition-all duration-200 ease-in-out focus:ring-2 focus:ring-white/50 focus:outline-none md:text-base ${
              selectedAnswerText === answer_text
                ? "border-white bg-white text-neutral-900"
                : "border-neutral-400 bg-transparent text-neutral-100 hover:border-white hover:bg-white/20"
            }`}
          >
            {answer_text}
          </button>
        ))}
      </div>
      <button
        onClick={handleNextClick}
        disabled={selectedAnswerText === null}
        className="mt-6 w-full cursor-pointer rounded-xl bg-white px-5 py-3 text-center text-base font-semibold text-neutral-900 transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-10"
      >
        Next
      </button>
    </div>
  );
};

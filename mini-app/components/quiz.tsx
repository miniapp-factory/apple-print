"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";
import Image from "next/image";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Option {
  text: string;
  animal: Animal;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: "What’s your favorite type of snack?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Bones", animal: "dog" },
      { text: "Berries", animal: "fox" },
      { text: "Seeds", animal: "hamster" },
      { text: "Hay", animal: "horse" },
    ],
  },
  {
    question: "Which activity do you enjoy most?",
    options: [
      { text: "Chasing laser pointers", animal: "cat" },
      { text: "Playing fetch", animal: "dog" },
      { text: "Hunting in the woods", animal: "fox" },
      { text: "Storing food", animal: "hamster" },
      { text: "Racing on tracks", animal: "horse" },
    ],
  },
  {
    question: "What’s your preferred sleeping position?",
    options: [
      { text: "On a soft cushion", animal: "cat" },
      { text: "On a blanket", animal: "dog" },
      { text: "In a burrow", animal: "fox" },
      { text: "In a nest", animal: "hamster" },
      { text: "In a stable", animal: "horse" },
    ],
  },
  {
    question: "How do you react to strangers?",
    options: [
      { text: "Curious but cautious", animal: "cat" },
      { text: "Friendly and wagging", animal: "dog" },
      { text: "Alert and quick", animal: "fox" },
      { text: "Quiet and observant", animal: "hamster" },
      { text: "Graceful and calm", animal: "horse" },
    ],
  },
  {
    question: "What’s your favorite color?",
    options: [
      { text: "Black", animal: "cat" },
      { text: "Brown", animal: "dog" },
      { text: "Orange", animal: "fox" },
      { text: "White", animal: "hamster" },
      { text: "Golden", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Animal, number>>({
    cat: 0,
    dog: 0,
    fox: 0,
    hamster: 0,
    horse: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>(shuffleArray(questions[0].options));

  const handleAnswer = (animal: Animal) => {
    setScores((prev) => ({ ...prev, [animal]: prev[animal] + 1 }));
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setShuffledOptions(shuffleArray(questions[current + 1].options));
    } else {
      const maxScore = Math.max(...Object.values(scores));
      const winner = Object.entries(scores).find(([, s]) => s === maxScore)?.[0] as Animal;
      setSelectedAnimal(winner);
      setShowResult(true);
    }
  };

  const retake = () => {
    setCurrent(0);
    setScores({ cat: 0, dog: 0, fox: 0, hamster: 0, horse: 0 });
    setShowResult(false);
    setSelectedAnimal(null);
    setShuffledOptions(shuffleArray(questions[0].options));
  };

  if (showResult && selectedAnimal) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">You are a {selectedAnimal}!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Image
              src={`/${selectedAnimal}.png`}
              alt={selectedAnimal}
              width={512}
              height={512}
            />
            <Share text={`I am a ${selectedAnimal}! ${url}`} />
            <Button variant="outline" onClick={retake}>
              Retake Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQuestion = questions[current];
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
      <div className="flex flex-col gap-2">
        {shuffledOptions.map((opt) => (
          <Button key={opt.text} onClick={() => handleAnswer(opt.animal)}>
            {opt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

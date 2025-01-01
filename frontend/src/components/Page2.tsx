import React from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

interface Page2Props {
  handlePageChange: (newPage: number) => void;
  noOfQuestions: number;
  handleNoOfQuestionsChange: (noOfQuestions: number) => void;
  additionalPrompt: string;
  handleAdditionalPromptChange: (text: string) => void;
  difficulty: string;
  handleDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void;
  handleSubmit: () => void;
}

function Page2({
  handlePageChange,
  noOfQuestions,
  handleNoOfQuestionsChange,
  additionalPrompt,
  handleAdditionalPromptChange,
  handleDifficultyChange,
  handleSubmit,
}: Page2Props) {
  return (
    <>
      <div className="flex justify-center px-5 py-10 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-2xl">
        Customize Your Quiz
      </div>
      <div className="flex m-auto flex-col gap-14 text-lg justify-center px-[10vw] py-10 lg:pl-[30vw] ">
        <div>
          <div>Select Difficulty</div>
          <RadioGroup
            className="flex lg:gap-10 gap-5  py-5 lg:px-5"
            defaultValue="easy"
            onValueChange={(value) =>
              handleDifficultyChange(value as "easy" | "medium" | "hard")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="r1" />
              <Label className="cursor-pointer text-md" htmlFor="r1">
                Easy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="r2" />
              <Label className="cursor-pointer text-md" htmlFor="r2">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="r3" />
              <Label className="cursor-pointer text-md" htmlFor="r3">
                Hard
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <div>Select Number of questions to generate. (Min 5, Max 15.)</div>
          <Input
            className={`my-5 w-[200px] ${
              noOfQuestions < 5 || noOfQuestions > 15
                ? "text-red-500 border-red-500"
                : ""
            }`}
            type="number"
            placeholder="10"
            onChange={(e) => handleNoOfQuestionsChange(Number(e.target.value))}
          />
        </div>
        <div className="max-w-screen-sm">
          <div>Additional Prompt</div>
          <Textarea
            className="my-5 min-h-32 max-w-screen-sm"
            placeholder="Enter additional prompt here..."
            value={additionalPrompt}
            maxLength={500}
            onChange={(e) => handleAdditionalPromptChange(e.target.value)}
          />
          <span className="text-sm text-right">
            {additionalPrompt.length}/500
          </span>
        </div>
      </div>
      <div className="flex justify-around m-auto flex-wrap max-w-[60vw] p-5">
        <div className="h-[15%] flex justify-center pt-10">
          <Button className="w-[200px]" onClick={() => handlePageChange(1)}>
            Previous
          </Button>
        </div>
        <div className="h-[15%] flex justify-center pt-10">
          <Button
            className="w-[200px]"
            onClick={() => {
              handleSubmit();
              //   handlePageChange(3);
            }}
          >
            Generate
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page2;

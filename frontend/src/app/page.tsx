"use client";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";
import Loading from "@/components/Loading";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | "">("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  ); // Default difficulty level
  const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB
  const [noOfQuestions, setNoOfQuestions] = useState<number>(10);
  const [additionalPrompt, setAdditionalPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const handleAdditionalPromptChange = (text: string) => {
    setAdditionalPrompt(text);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleInputTextUpdate = (text: string) => {
    setInputText(text);
  };
  const handleNoOfQuestionsChange = (number: number) => {
    setNoOfQuestions(number);
  };
  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard"
  ) => {
    setDifficulty(newDifficulty);
  };
  const handleApiKeyChange = (text: string) => {
    setApiKey(text);
  };
  const handleUrlChange = (text: string) => {
    setUrl(text);
  };
  const handleProjectIdChange = (text: string) => {
    setProjectId(text);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setError(null);
      const file = event.target.files[0];
      const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
      console.log(fileSizeMB, file);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setError(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`
        );
        setSelectedFile("");
        return;
      }
      setSelectedFile(file);
    }
  };
  const resetFile = () => {
    setSelectedFile("");
    setError(null);
  };

  const downloadTxtFile = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quiz.txt"; // Name of the file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    console.log("submit trigger");
    if (!selectedFile && !inputText) {
      alert("Please select a file or provide input text.");
      return;
    }
    if (noOfQuestions < 5 || noOfQuestions > 15) {
      alert("Number of questions must be between 5 and 15.");
      return;
    }
    console.log(
      selectedFile,
      inputText,
      difficulty,
      noOfQuestions,
      additionalPrompt
    );
    setLoading(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("content", inputText);
    formData.append("difficulty", difficulty);
    formData.append("no_of_questions", noOfQuestions.toString());
    formData.append("additional_contents", additionalPrompt);
    formData.append("apikey", apiKey);
    formData.append("url", url);
    formData.append("project_id", projectId);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      const data = response.data;
      if (data) {
        downloadTxtFile(data.generated_quiz);
      }
      console.log(data);
      setLoading(false);
      setAlertText(
        "Quiz Downloaded Successfully! Please check your downloads folder."
      );
      // handlePageChange(3);
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setLoading(false);
      console.error(error);
      if (error.response) {
        console.error("Error data:", error.response.data.detail);
        setAlertText(error.response.data.detail);
      } else {
        setAlertText("An error occurred while generating the quiz.");
      }
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  // const dummySubmit = () => {
  //   console.log("in loading", loading);
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 8000);
  // };

  return (
    <div>
      {currentPage === 1 && (
        <Page1
          handlePageChange={handlePageChange}
          handleFileChange={handleFileChange}
          handleApiChange={handleApiKeyChange}
          handleUrlChange={handleUrlChange}
          apiKey={apiKey}
          url={url}
          projectId={projectId}
          handleProjectIdChange={handleProjectIdChange}
          selectedFile={selectedFile}
          error={error}
          resetFile={resetFile}
          inputText={inputText}
          handleInputTextUpdate={handleInputTextUpdate}
        />
      )}
      {currentPage === 2 && (
        <Page2
          handlePageChange={handlePageChange}
          noOfQuestions={noOfQuestions}
          handleNoOfQuestionsChange={handleNoOfQuestionsChange}
          additionalPrompt={additionalPrompt}
          handleAdditionalPromptChange={handleAdditionalPromptChange}
          handleDifficultyChange={handleDifficultyChange}
          difficulty={difficulty}
          handleSubmit={handleSubmit}
        />
      )}
      {currentPage === 3 && <Page3 handlePageChange={handlePageChange} />}
      <Loading open={loading} />
      <>
        <Dialog open={showAlert}>
          <DialogTitle style={{ display: "none" }}>Processing</DialogTitle>
          <DialogContent
            className={`[&>button]:hidden ${
              alertText.toLowerCase().includes("error") ? "border-red-600" : ""
            } `}
          >
            <DialogDescription style={{ display: "none" }}>
              Processing Transaction
            </DialogDescription>
            <div className="flex items-center justify-center gap-4">
              <div className="text-lg items-center justify-center border-red-500  flex-wrap gap-2 font-semibold ml-4 transition-all flex">
                {alertText}
              </div>
              <Button
                className={` ${
                  alertText.toLowerCase().includes("error")
                    ? "border-red-600"
                    : ""
                } `}
                onClick={() => {
                  setShowAlert(false);
                  setAlertText("");
                }}
                variant={"outline"}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
}

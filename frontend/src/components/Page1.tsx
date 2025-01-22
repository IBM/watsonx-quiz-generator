import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";

interface Page1Props {
  handlePageChange: (newPage: number) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | "";
  error: string | null;
  apiKey: string;
  url: string;
  projectId: string;
  resetFile: () => void;
  inputText: string;
  fromPage: number | null;
  toPage: number | null;
  handleInputTextUpdate: (newText: string) => void;
  handleApiChange: (newText: string) => void;
  handleUrlChange: (newText: string) => void;
  handleProjectIdChange: (newText: string) => void;
  handleFromPageChange: (page: number) => void;
  handleToPageChange: (page: number) => void;
}

function Page1({
  handlePageChange,
  handleFileChange,
  selectedFile,
  error,
  resetFile,
  inputText,
  handleInputTextUpdate,
  handleApiChange,
  handleUrlChange,
  handleProjectIdChange,
  apiKey,
  projectId,
  url,
  handleFromPageChange,
  handleToPageChange,
  fromPage,
  toPage,
}: Page1Props) {
  const [inputType, setInputType] = useState<"file" | "text">("file");
  return (
    <>
      <div className=" px-10 py-4 max-w-[85vw] mx-auto text-justify scroll-m-20 text-lg font-normal tracking-tight">
        Welcome to AQ GEN, an AI based Quiz Generator. Here you can generate a
        quiz from any text or file content. The quiz will be generated based on
        the content provided and you can take the quiz to test your knowledge.
        The application uses WatsonX based LLM to analyze your text and generate
        a quiz. To get started, enter your IBM WatsonX Credentials below and
        then simply provide the text input or upload a pdf file and click next.{" "}
        <a
          target="blank"
          href="https://dataplatform.cloud.ibm.com/developer-access?context=wx"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Click Here
        </a>{" "}
        to get your WatsonX Credentials.
        <br /> Note: Your credentials are handled in a secure manner and are not
        stored anywhere in the application
      </div>
      <div className=" px-10 py-10 flex flex-col justify-center items-center w-full">
        <div className="p-4">Enter Your Credentials</div>
        <div className="flex gap-4 p-4 mb-4 w-[80vw] flex-wrap md:flex-nowrap">
          <Input
            type="text"
            placeholder="WatsonX API Key"
            onChange={(e) => handleApiChange(e.target.value)}
          />
          <Input
            type="text"
            placeholder="WatsonX Region URL"
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <Input
            type="text"
            placeholder="WatsonX Project ID"
            onChange={(e) => handleProjectIdChange(e.target.value)}
          />
        </div>
        <div>Select your input type</div>
        <RadioGroup
          className="flex gap-4 py-5 px-5"
          defaultValue="file"
          onValueChange={(value) => setInputType(value as "file" | "text")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="r1" />
            <Label className="cursor-pointer" htmlFor="r1">
              Upload a file
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="r2" />
            <Label className="cursor-pointer" htmlFor="r2">
              Text Input
            </Label>
          </div>
        </RadioGroup>
        <div className="w-full flex justify-center items-center">
          {inputType === "text" && (
            <div className="h-[400px] w-[90%] py-5">
              <div className="text-center pb-5 font-semibold">
                Insert text below
              </div>
              <div className="p-5 h-full">
                <Textarea
                  value={inputText}
                  maxLength={50000}
                  minLength={500}
                  onChange={(e) => handleInputTextUpdate(e.target.value)}
                  placeholder="Insert text here. Minimum Length 500, Maximum Length 50000"
                  className=" border-gray-400 h-[95%] rounded-md"
                />
                <span
                  className={`flex justify-end px-3 py-1 ${
                    inputText.length > 50000 ? "text-red-600" : ""
                  }`}
                >
                  {inputText.length}/50000
                </span>
              </div>
            </div>
          )}
          {inputType === "file" && (
            <>
              <div className="flex h-[400px] flex-col px-10 py-10 gap-5 justify-center items-center">
                <Label
                  htmlFor="file-input"
                  className="block text-sm font-medium cursor-pointer"
                >
                  Upload File (Max size: 5 MB)
                </Label>
                <Input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only w-0"
                />
                <Label
                  htmlFor="file-input"
                  className="flex items-center justify-between px-8 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span className="flex justify-around items-center space-x-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 px-5">
                      {selectedFile ? selectedFile.name : "Choose a file"}
                    </span>
                  </span>
                  {selectedFile && !error && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {error && <AlertCircle className="w-5 h-5 text-red-500" />}
                </Label>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <Label htmlFor="page-range" className="mt-5">
                  (Optional) Specify a page range in the PDF to generate the
                  quiz.
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="page-range"
                    type="number"
                    placeholder="Page From"
                    min="1"
                    step="1"
                    onChange={(e) =>
                      handleFromPageChange(
                        Math.floor(Math.abs(Number(e.target.value)))
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Page To"
                    min="1"
                    step="1"
                    onChange={(e) =>
                      handleToPageChange(
                        Math.floor(Math.abs(Number(e.target.value)))
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className=" w-full flex justify-center pt-10">
          <Button
            className="w-[200px]"
            onClick={() => {
              if (process.env.NODE_ENV === "production") {
                console.log("Running in production mode");
                if (!apiKey) {
                  alert("Please enter your WatsonX API key.");
                  return;
                }
                if (!url) {
                  alert("Please enter your WatsonX region URL.");
                  return;
                }
                if (!projectId) {
                  alert("Please enter your WatsonX project ID.");
                  return;
                }
              }

              if (inputType === "text") {
                if (inputText.length < 500 || inputText.length > 50000) {
                  alert("Text must be between 500 and 50000 characters");
                  return;
                } else {
                  resetFile();
                }
              } else if (inputType === "file" && !selectedFile) {
                alert("Please select a file.");
                return;
              } else {
                handleInputTextUpdate("");
              }

              if (fromPage !== null && toPage !== null) {
                if (fromPage < 1 || fromPage > toPage) {
                  alert("Invalid page range");
                  return;
                }
              }
              handlePageChange(2);
              console.log(fromPage, toPage);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page1;

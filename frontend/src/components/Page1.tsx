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
  resetFile: () => void;
  inputText: string;
  handleInputTextUpdate: (newText: string) => void;
}

function Page1({
  handlePageChange,
  handleFileChange,
  selectedFile,
  error,
  resetFile,
  inputText,
  handleInputTextUpdate,
}: Page1Props) {
  const [inputType, setInputType] = useState<"file" | "text">("file");
  return (
    <>
      <div className=" px-10 py-4 max-w-[85vw] mx-auto text-justify scroll-m-20 text-lg font-normal tracking-tight">
        Welcome to AQ GEN, an AI based Quiz Generator. Here you can generate a
        quiz from any text or file content. The quiz will be generated based on
        the content provided and you can take the quiz to test your knowledge.
        The application uses WatsonX based LLM to analyze your text and generate
        a quiz. To get started, simply provide the text below or upload a pdf
        file and click next
      </div>
      <div className=" px-10 py-10 flex flex-col justify-center items-center w-full">
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
            <div className="h-[500px] w-[90%] py-5">
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
              <div className="flex h-[500px] flex-col px-10 py-10 gap-5 justify-center items-center">
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
              </div>
            </>
          )}
        </div>
        <div className=" w-full flex justify-center pt-10">
          <Button
            className="w-[200px]"
            onClick={() => {
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
              handlePageChange(2);
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

# Import necessary libraries and modules
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ibm import WatsonxLLM
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from prompts import system_prompt, user_msg
from utils import (
    is_toc_or_index_page,
    clean_header_footer,
    clean_text,
    token_calculator,
)
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

prompt_template = f"{system_prompt}\n{user_msg}"

prompt = PromptTemplate.from_template(prompt_template)

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 4000,
    "min_new_tokens": 1,
    "repetition_penalty": 1,
}

watsonx_llm = WatsonxLLM(
    model_id="meta-llama/llama-3-3-70b-instruct",
    url=os.getenv("WATSONX_URL"),
    project_id=os.getenv("PROJECT_ID"),
    apikey=os.getenv("WAX_API_KEY"),
    params=parameters,
)


def extract_text_from_pdf(pdf_path):
    print(pdf_path)
    if os.path.exists(pdf_path):
        print("Path exists.")
    else:
        print("Path does not exist.")

    reader = PdfReader(pdf_path)

    raw_text = ""
    for page in reader.pages:
        if is_toc_or_index_page(page.extract_text()):
            continue
        else:
            clean_page = clean_header_footer(page.extract_text())
            raw_text += clean_page + "\n"
    # for page in reader.pages:
    #     raw_text += page.extract_text() + "\n"

    processed_text = clean_text(raw_text)
    # print(processed_text)

    # saving for reference only
    current_path = Path.cwd()
    save_path = current_path / "uploads" / "output.txt"
    with open(save_path, "w") as file:
        file.write(processed_text)

    return processed_text


def generate_quiz(variables):

    no_of_tokens = token_calculator(variables["content"])
    print(no_of_tokens)

    # if num_doc_tokens < 25000:
    #     print("technique 1")
    #     return None
    # elif num_doc_tokens < 50000:
    #     print("technique 2")

    # Render the final prompt with variables
    final_prompt = prompt.format(**variables)
    tkns = token_calculator(final_prompt)
    print(final_prompt)
    print(tkns)
    try:
        print("calling watsonx api...")
        response = watsonx_llm.invoke(final_prompt)
        # response = watsonx_llm.invoke("Who is man's best friend?")
        print("watsonx response successful")
        print(response)
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Error occurred while running the chain.")


# if __name__ == "__main__":
# processed_text = extract_text_from_pdf(
#     "/Users/yash/Developer/quizGen/backend/uploads/MaaS360_API Documentation_Guide.pdf"
# )
# variables = {
#     "content": processed_text,
#     "difficulty": "Hard",
#     "no_of_questions": 10,
#     "additional_contents": "Unique Questions",
# }
# # Render the final prompt with variables
# final_prompt = prompt.format(**variables)
# tkns = token_calculator(final_prompt)
# # print(final_prompt)
# print(tkns)
# llm_chain = prompt | watsonx_llm
# try:

#     print("strating chain...")
#     response = watsonx_llm.invoke(final_prompt)
#     print("chain ran successfully!")
#     # response = watsonx_llm.invoke("Who is man's best friend?")
#     print(response)
# except Exception as e:
#     print(f"An error occurred: {e}")
#     print("Error occurred while running the chain.")

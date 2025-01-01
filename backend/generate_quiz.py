# Import necessary libraries and modules
from langchain.chains.summarize import load_summarize_chain
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

# LLM for generating quiz questions
parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 4000,
    "min_new_tokens": 1,
    "repetition_penalty": 1,
    "stop_sequences": ["----------", "Note:"],
}

watsonx_llm = WatsonxLLM(
    model_id="meta-llama/llama-3-3-70b-instruct",
    url=os.getenv("WATSONX_URL"),
    project_id=os.getenv("PROJECT_ID"),
    apikey=os.getenv("WAX_API_KEY"),
    params=parameters,
)

# LLM for summarizing long text or document for quiz generation
sum_parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 8000,
    "min_new_tokens": 1,
    "repetition_penalty": 1,
}

summarize_llm = WatsonxLLM(
    model_id="mistralai/mixtral-8x7b-instruct-v01",
    url=os.getenv("WATSONX_URL"),
    project_id=os.getenv("PROJECT_ID"),
    apikey=os.getenv("WAX_API_KEY"),
    params=sum_parameters,
)


# Function to extract text from PDF and clean it
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
    print("input tokens:", no_of_tokens)

    # Too many contents. cancel process
    if no_of_tokens > 50000:
        print(
            "Too many tokens. Canceling process. Please provide a shorter document. Exiting."
        )
        return False

    # directly process if content length is less than 15000 tokens.
    if no_of_tokens < 15000:
        # Render the final prompt with variables
        final_prompt = prompt.format(**variables)
        # print(final_prompt)

    # Summarize document and generate quiz for larger inputs.
    elif no_of_tokens > 15000 and no_of_tokens < 50000:
        try:
            print("large input detected, summarizing...")
            content_summary = summarize_input(variables["content"])
            print("input summarized")

            # Render the final prompt with summary
            variables["content"] = content_summary
            final_prompt = prompt.format(**variables)
            # print(final_prompt)

        except Exception as e:
            print(f"An error occurred while summarizing: {e}")
            return "Error"

    try:
        print("calling watsonx api...")
        response = watsonx_llm.invoke(final_prompt)
        print("watsonx response successful")
        print(response)
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error"


def chunk_input(text):
    print("Input text length:", len(text))  # Check the length of the input text
    print("chunking input")
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", ". ", " ", ""], chunk_size=10000, chunk_overlap=500
    )
    docs = text_splitter.create_documents([text])
    print("input chunked. no of doc chunks", len(docs))
    return docs


def summarize_input(text):
    document_chunks = chunk_input(text)
    # Summarizing using map reduce method
    map_prompt = """
                  Please provide a detailed summary of the following text.
                  TEXT: {text}
                  DETAILED SUMMARY:
                  """

    combine_prompt = """
                Write a detailed summary of the following text delimited by triple backquotes.
                Return a detailed response that covers the key points of the text.
                ```{text}```
                SUMMARY:
                """

    map_template = PromptTemplate(template=map_prompt, input_variables=["text"])

    combine_template = PromptTemplate(template=combine_prompt, input_variables=["text"])

    # Load refine chain with summarize_llm
    chain = load_summarize_chain(
        llm=summarize_llm,
        chain_type="map_reduce",
        map_prompt=map_template,
        combine_prompt=combine_template,
        return_intermediate_steps=False,
        input_key="input_documents",
    )

    result = chain({"input_documents": document_chunks}, return_only_outputs=True)

    # comparing tokens before and after summarizing
    sum_tkn = token_calculator(result["output_text"])
    print("original tokens -", token_calculator(text), "vs -", sum_tkn)
    return result["output_text"]


if __name__ == "__main__":
    print("test")
    # processed_text = extract_text_from_pdf(
    #     "/Users/yash/Developer/quizGen/backend/uploads/MaaS360_API_Documentation_Guide.pdf"
    # )
    # sum_txt = summarize_input(processed_text)

    # map_prompt = """
    #               Please provide a detailed summary of the following text.
    #               TEXT: {text}
    #               DETAILED SUMMARY:
    #               """

    # combine_prompt = """
    #             Write a detailed summary of the following text delimited by triple backquotes.
    #             Return a detailed response that covers the key points of the text.
    #             ```{text}```
    #             SUMMARY:
    #             """

    # map_template = PromptTemplate(template=map_prompt, input_variables=["text"])

    # combine_template = PromptTemplate(template=combine_prompt, input_variables=["text"])

    # # Load refine chain
    # chain = load_summarize_chain(
    #     llm=summarize_llm,
    #     chain_type="map_reduce",
    #     map_prompt=map_template,
    #     combine_prompt=combine_template,
    #     return_intermediate_steps=False,
    #     input_key="input_documents",
    # )
    # result = chain({"input_documents": sum_txt}, return_only_outputs=True)

    # print(result["output_text"])
    # print("original len -", len(processed_text), "vs -", len(result["output_text"]))
    # sum_tkn = token_calculator(result["output_text"])
    # print("original tokens -", token_calculator(processed_text), "vs -", sum_tkn)

    # current_path = Path.cwd()
    # sum_path = current_path / "uploads" / "sum.txt"
    # with open(sum_path, "w") as file:
    #     file.write(result["output_text"])

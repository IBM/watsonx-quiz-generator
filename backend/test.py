import os
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
from prompts import system_prompt, user_msg
from langchain_core.prompts import PromptTemplate

load_dotenv()  # Load environment variables from .env file

# Combine system prompt and user message into a full prompt
prompt_template = f"{system_prompt}\n{user_msg}"

prompt = PromptTemplate.from_template(prompt_template)
response = None

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 4000,
    "min_new_tokens": 1,
    "repetition_penalty": 1,
}
try:
    watsonx_llm = watsonx_llm = WatsonxLLM(
        model_id="meta-llama/llama-3-3-70b-instruct",
        url=os.getenv("WATSONX_URL"),
        project_id=os.getenv("PROJECT_ID"),
        apikey=os.getenv("WAX_API_KEY"),
        params=parameters,
    )
except Exception as e:
    # print(type(e))
    print("errorrrr", str(e))
    response = f"Error: {str(e)}"

# llm_chain = prompt | watsonx_llm
# topic = ""
# response = llm_chain.invoke(topic)
# response = "saf"
response = watsonx_llm.invoke("Who is man's best friend?")
print(response)
if "Error" in response and "validation error" in response:
    print("response found")

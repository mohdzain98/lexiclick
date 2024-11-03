from langchain_openai import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

llm = ChatOpenAI(model='gpt-4o-mini', temperature=0, max_tokens=200)


template_S = "You are a helpful assistant that provides concise descriptions of words or phrases given by the user."
system_message_prompt = SystemMessagePromptTemplate.from_template(template_S)

template = "Please provide a short, concise description or elaboration on the following word or phrase: {input_word}.Your response should be a single paragraph or two, without unnecessary details"

user_message_prompt = HumanMessagePromptTemplate.from_template(template)

prompt = ChatPromptTemplate.from_messages([system_message_prompt, user_message_prompt])

class Core:
    def LLMResponse(self):
        chain = (
            {"input_word":RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        return chain
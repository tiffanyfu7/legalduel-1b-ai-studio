import spacy
import os
from spacy.language import Language
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

@Language.component("openai_summarizer")
def summarize_text(doc):
    """Custom component that summarizes the text using OpenAI's GPT model."""
    prompt = ("Please take the following document and create a chronology from it in markdown."
        "Format dates in UTC."
        "Take your time, and make sure to think through it as to minimize error.")
    # prompt = ("You are a helpful assistant that transforms text into a legal chronology."
    #     "Extract dates from events and summarize the event. Follow a format of 'DATE (MM/DD/YYYY): EVENT SUMMARIZATION'."
    #     "Bold dates and seperate each event with a new line character")
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": doc.text}
    ],)
    summary = response.choices[0].message.content
    doc._.summary = summary
    return doc

nlp = spacy.blank("en")

if not spacy.tokens.Doc.has_extension("summary"):
    spacy.tokens.Doc.set_extension("summary", default=None)

nlp.add_pipe("openai_summarizer", last=True)

def summarize(text):
    """Summarizes the input text using the OpenAI GPT model."""
    doc = nlp(text)
    return doc._.summary
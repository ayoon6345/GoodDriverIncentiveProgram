import openai
from openai import OpenAI
import os
from dotenv import load_dotenv
import time

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY", "default_value")
MODEL4_5TURBO = "gpt-4-1106-preview"
client = OpenAI()

OPENAI_POINT_CONSULTANT_ID = os.getenv("OPENAI_POINT_CONSULTANT_ID")

def get_point_advise(driver_action_description, sponsor_point_ratio):
    # Creating thread on first iteration
    thread = new_assistant_thread()
    thread_ID = thread.id

    # Add the user's message to the thread
    message = openai.beta.threads.messages.create(
        thread_id=thread_ID,
        role="user",
        content="Driver Action Description: [" + driver_action_description + "]\nSponsor Point Ratio: [" + sponsor_point_ratio + "]"
    )

    # Create and run the assistant 
    run = openai.beta.threads.runs.create(
        thread_id=thread_ID,
        assistant_id=OPENAI_POINT_CONSULTANT_ID
    )

    run_status = 'running'
    # Retrieve the run to check status and get responses
    while(run_status != 'completed'):
        run_retrieved = openai.beta.threads.runs.retrieve(thread_id=thread_ID, run_id=run.id)
        run_status = run_retrieved.status
        if run_status == 'completed':
            break
        elif run_status == 'failed' or run_status == 'expired':
            err_msg = "Run " + run_status + ". Please try again."
            return err_msg
        else:
            print(run_status)
            time.sleep(3)

    # After checking the run and ensuring the status is completed
    messages = openai.beta.threads.messages.list(thread_id=thread_ID)
    for msg in message.data:
        if msg.role != "user":
            content = msg.content[0].text.value
            gpt_response = f"{content}"
    return gpt_response

def new_assistant_thread():
    # Create a new thread
    thread = openai.beta.threads.create()
    return thread
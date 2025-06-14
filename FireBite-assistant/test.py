from assistantModel import Assistant

chat_history = []
assistant = Assistant()
chat_history.append({"role": "human", "content":"show me the menu you have"})
print("human:","i like pizza")
reply = assistant.askAI(chat_history)
print("assistant:",reply)
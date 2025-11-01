# L'Oréal Chatbot

An AI-powered chatbot that helps users discover and understand L'Oréal's extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

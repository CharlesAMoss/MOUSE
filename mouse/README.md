# MOUSE Tokenization App

This app provides a user-friendly interface for uploading or entering text, then tokenizing it into meaningful units for further processing. 

## Features
- Upload `.txt` files or enter text manually
- Tokenization by words, punctuation, whitespace, and special characters (expansion planned)
- View token count, sample tokens, and download output as JSON
- Responsive UI with accessibility features
- Modular architecture for easy extension

## Planned Expansion
- Advanced tokenization using configurable regular expressions
- Token type assignment (word, punctuation, whitespace, special)
- UI options for selecting tokenization mode
- Unit tests for robust token identification
## Input IDs (token ids)

- The app can optionally include `input_ids` in the exported JSON. These are numeric ids assigned to each token value by an in-repo vocabulary encoder.
- Toggle "Include input_ids" in the Tokenization UI to enable this feature. The downloaded JSON will then include `input_ids` alongside `tokens` for downstream use.

Note: This uses a simple dynamic vocabulary. For production workflows you may prefer integrating a pretrained subword tokenizer (e.g., Hugging Face Tokenizers or tiktoken) to match model tokenization.

## How It Works
1. User uploads a text file or enters text
2. The app tokenizes the input using the current logic (whitespace/punctuation)
3. Token count and sample tokens are displayed
4. Output can be downloaded as a JSON file for downstream use

## Next Steps
- Implement advanced tokenization logic and UI options
- Add unit tests for new features
- Continue improving design and accessibility

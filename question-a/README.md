# Question A

This folder will contain the solution for the selected Section A challenge.

# Ethereum Wallet Validator

This project validates Ethereum wallet addresses entered by the user. It checks that each address:
- Starts with `0x`
- Is exactly 42 characters long
- Contains only hexadecimal characters after `0x` (0–9, a–f, A–F)

Valid and invalid results are displayed on the page, with invalid addresses highlighted in red. There's also a button to copy all valid addresses to the clipboard.

## Running the App

1. Navigate to the `question-a/` folder.
2. Open `index.html` in a browser.

## Testing the App

- Enter addresses (one per line or comma-separated) in the textarea.
- Click **Validate Addresses**.
- Invalid entries will appear in red.
- Click **Copy Valid Addresses** to copy only the valid ones to your clipboard.

## Examples and Edge Cases

Use the following sample inputs to test the validator:

**Valid Addresses**
- `0x0000000000000000000000000000000000000000`  (all zeros)
- `0x1234567890abcdefABCDEF1234567890abcdefAB`  (mixed case hex)
- Comma-separated: `0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD`

**Invalid Addresses**
- `0x123`  (too short)
- `1234567890abcdefABCDEF1234567890abcdefAB`  (missing `0x`)
- `0xG234567890abcdefABCDEF1234567890abcdefAB`  (contains non-hex character)
- `0x1234567890abcdefABCDEF1234567890abcdefABCD`  (too long)
- Empty or whitespace-only entries (ignored)

Paste these into the textarea and click **Validate** to see which ones pass or fail.

## Testing

Instructions to run and test the project will go here.

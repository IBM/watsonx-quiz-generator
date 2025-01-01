from typing import List, Dict
import re
import tiktoken


def token_calculator(text):
    tokenizer = tiktoken.get_encoding("cl100k_base")
    tokens = tokenizer.encode(text)
    num_tokens = len(tokens)
    return num_tokens


def clean_text(text):
    # Remove extra whitespace
    clean = re.sub(r"\s+", " ", text)
    # Remove special characters but keep basic punctuation
    clean = re.sub(r"[^\w\s.,!?-]", "", clean)
    # Fix spacing around punctuation
    clean = re.sub(r"\s([.,!?])", r"\1", clean)
    processed_text = clean.strip()
    return processed_text


def is_toc_or_index_page(text: str) -> bool:
    # Check for common TOC titles in a single line
    toc_title_pattern = re.compile(
        r"^\s*(table of contents|contents|index)\s*$", re.IGNORECASE | re.MULTILINE
    )
    if toc_title_pattern.search(text):
        return True

    # Check for typical TOC line format: "Title .............. PageNumber"
    pattern = r"\.{10,}"
    toc_lines = re.findall(pattern, text)
    # Ensure there are at least 3 lines matching the TOC format
    if len(toc_lines) >= 3:
        return True

    return False


def clean_header_footer(text: str) -> str:
    """
    Remove common header and footer patterns.

    Args:
        text (str): Input text

    Returns:
        str: Cleaned text
    """

    # Remove page numbers
    text = re.sub(r"\n\s*\d+\s*\n", "\n", text)

    return text.strip()

import os
import re

# Define the directory to search
root_dir = r"E:\WEB DEVELOPMENT\malikclaw"

# Define the replacement rules
replacements = [
    # 1. Module and Repo URLs
    (re.compile(re.escape("github.com/sipeed/malikclaw"), re.IGNORECASE), "github.com/AbdullahMalik17/malikclaw"),
    (re.compile(re.escape("https://github.com/sipeed/malikclaw"), re.IGNORECASE), "https://github.com/AbdullahMalik17/malikclaw"),
    
    # 2. Social Media and Website
    (re.compile(re.escape("https://x.com/SipeedIO"), re.IGNORECASE), "https://x.com/AbdullahMalik17"),
    (re.compile(re.escape("sipeed.com"), re.IGNORECASE), "malikclaw.io"),
    (re.compile(re.escape("SipeedIO"), re.IGNORECASE), "AbdullahMalik17"),
    
    # 3. Old project name
    (re.compile(re.escape("picoclaw"), re.IGNORECASE), "malikclaw"),
    
    # 4. GitHub Org/Owner
    (re.compile(re.escape("sipeed/malikclaw"), re.IGNORECASE), "AbdullahMalik17/malikclaw"),
    
    # 5. Docker images
    (re.compile(re.escape("docker.io/sipeed"), re.IGNORECASE), "docker.io/AbdullahMalik17"),
    (re.compile(re.escape("image: sipeed/malikclaw"), re.IGNORECASE), "image: AbdullahMalik17/malikclaw"),

    # 6. nanobot to malikclaw in metadata and env vars
    (re.compile(re.escape('"nanobot":'), re.IGNORECASE), '"malikclaw":'),
    (re.compile(re.escape('NANOBOT_'), re.IGNORECASE), 'MALIKCLAW_'),
    
    # 7. Sipeed brand name in text (remove affiliation)
    # Replace "Sipeed boards" with "supported boards", etc.
    (re.compile(re.escape("Sipeed boards"), re.IGNORECASE), "supported boards"),
    (re.compile(re.escape("Sipeed MaixCAM"), re.IGNORECASE), "MaixCAM"),
    (re.compile(re.escape("from Sipeed"), re.IGNORECASE), "from the community"),
    (re.compile(re.escape("by Sipeed"), re.IGNORECASE), "by Abdullah Malik"),
]

# Specific phrases to remove or replace to "remove Sipeed affiliation"
# e.g. "company website is sipeed.com" -> "website is malikclaw.io"
# This might be too complex for a simple regex, so I'll do some manual checks or common patterns.

# Files to exclude from processing
exclude_dirs = {".git", "node_modules", ".vscode", ".idea"}

def process_file(file_path):
    if file_path.endswith("rebrand.py"):
        return
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError:
        # Skip binary files
        return

    new_content = content
    modified = False

    for pattern, replacement in replacements:
        if pattern.search(new_content):
            new_content = pattern.sub(replacement, new_content)
            modified = True

    # Special case for "company website is malikclaw.io" -> "official website is malikclaw.io"
    if "company website is malikclaw.io" in new_content:
        new_content = new_content.replace("company website is malikclaw.io", "official website is malikclaw.io")
        modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

# Traverse the directory
for root, dirs, files in os.walk(root_dir):
    # Skip excluded directories
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    for file in files:
        file_path = os.path.join(root, file)
        process_file(file_path)

print("Rebranding phase 2 complete.")

document.getElementById("convert-button").addEventListener("click", async function() {
    const markdown = document.getElementById("markdown-input").value;
    const escapeQuotes = document.getElementById("escape-quotes").checked;
    
    if (!markdown.trim()) {
        alert("Please enter some Markdown to convert.");
        return;
    }

    try {
        const response = await fetch("https://api.github.com/markdown", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: markdown, mode: "gfm" })
        });

        if (!response.ok) {
            throw new Error("Error converting markdown.");
        }

        let rawHtml = await response.text();

        // Wrap output in required structure
        let wrappedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Preview</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
    <style>
        body {
            display: flex;
            justify-content: center;
            background-color: #f6f8fa;
            padding: 20px;
        }
        .markdown-body {
            max-width: 800px;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <article class="markdown-body">
        ${rawHtml}
    </article>
</body>
</html>`;

        // Escape double quotes if the option is checked
        if (escapeQuotes) {
            wrappedHtml = wrappedHtml.replace(/"/g, '""');
        }

        document.getElementById("html-output").value = wrappedHtml;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("copy-button").addEventListener("click", function() {
    const htmlOutput = document.getElementById("html-output");
    htmlOutput.select();
    document.execCommand("copy");
});

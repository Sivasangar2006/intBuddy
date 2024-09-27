// Load Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' } });
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '// Write your code here',
        language: 'python',  // Default language can be set here
        theme: 'vs-dark',
        automaticLayout: true,
    });
});

// Function to get the selected language for JDoodle API
function getLanguage() {
    const languageSelect = document.getElementById('language-select');
    return languageSelect.value;
}

// Function to run the code
document.getElementById('run-btn').addEventListener('click', async () => {
    const code = window.editor.getValue();
    const language = getLanguage();
    const outputElement = document.getElementById('output');
    
    outputElement.textContent = "Running code...";

    try {
        const response = await fetch('http://localhost:3000/run-code', {  // Pointing to your local server
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: code,
                language: language,
                versionIndex: '0',
                stdin: '',  // Handle input if needed
            })
        });

        const data = await response.json();
        outputElement.textContent = data.output || data.error || "No output received.";
    } catch (error) {
        outputElement.textContent = "Error executing code: " + error.message;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const foldersContainer = document.getElementById("folders-container");
    const addFolderBtn = document.getElementById("add-folder-btn");
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    // Load notes on page load
    loadNotes();

    async function loadNotes() {
        try {
            const response = await fetch("http://localhost:3000/api/note/getNotesByUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();

            if (data.success) {
                // Group notes by folder
                const notesByFolder = {};

                // Initialize folders
                data.folders.forEach(folderName => {
                    notesByFolder[folderName] = [];
                });

                // Add notes to folders
                data.notes.forEach(note => {
                    if (!notesByFolder[note.folderName]) {
                        notesByFolder[note.folderName] = [];
                    }
                    notesByFolder[note.folderName].push(note);
                });

                // Create folders and add notes
                Object.entries(notesByFolder).forEach(([folderName, notes]) => {
                    const folder = createFolder(folderName);
                    notes.forEach(note => {
                        const textArea = createTextArea(note.content, note._id);
                        folder.querySelector('.folder-notes').appendChild(textArea);
                    });
                    foldersContainer.appendChild(folder);
                });
            }
        } catch (error) {
            console.error("Error loading notes:", error);
        }
    }

    // Add folder function
    addFolderBtn.addEventListener("click", async () => {
        const baseName = "Untitled Folder";
        let folderCount = 1;
        let folderName = baseName;
        
        // Count existing folders with similar names
        const existingFolders = document.querySelectorAll('.folder h2');
        const existingNames = Array.from(existingFolders).map(h2 => h2.textContent);
        
        while (existingNames.includes(folderName)) {
            folderName = `${baseName} ${folderCount}`;
            folderCount++;
        }

        try {
            const response = await fetch("http://localhost:3000/api/note/addFolder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    folderName
                })
            });
            const data = await response.json();

            console.log("Add Folder Response:", data); // Debug log

            if (data.success) {
                const folder = createFolder(folderName);
                foldersContainer.appendChild(folder);
                console.log("Folder added to DOM:", folder); // Debug log
            } else {
                console.error("Failed to add folder:", data.message); // Debug log
            }
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    });

    function createFolder(name) {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");

        const folderTitle = document.createElement("h2");
        folderTitle.textContent = name;
        folderDiv.appendChild(folderTitle);

        const folderIcons = document.createElement("div");
        folderIcons.classList.add("folder-icons");

        const editIcon = document.createElement("img");
        editIcon.src = "editicon.png";
        editIcon.alt = "Edit";
        editIcon.addEventListener("click", () => editFolderName(folderTitle));

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "deleteicon.png";
        deleteIcon.alt = "Delete";
        deleteIcon.addEventListener("click", () => deleteFolder(folderDiv));

        folderIcons.appendChild(editIcon);
        folderIcons.appendChild(deleteIcon);
        folderDiv.appendChild(folderIcons);

        const noteList = document.createElement("div");
        noteList.classList.add("folder-notes");
        folderDiv.appendChild(noteList);

        const addNoteBtn = document.createElement("button");
        addNoteBtn.textContent = "+ Add Note";
        addNoteBtn.classList.add("add-btn");
        addNoteBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:3000/api/note/addNote", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId,
                        folderName: folderTitle.textContent,
                        content: ""
                    })
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || "Failed to create note");
                }

                if (!data.note || !data.note._id) {
                    throw new Error("Invalid note data received from server");
                }

                const textArea = createTextArea("", data.note._id);
                noteList.appendChild(textArea);
                console.log("Note created successfully:", data.note);
            } catch (error) {
                console.error("Error adding note:", error);
                alert(`Failed to add note: ${error.message}`);
            }
        });
        folderDiv.appendChild(addNoteBtn);

        return folderDiv;
    }

    function createTextArea(content = "", noteId = "") {
        const textArea = document.createElement("textarea");
        textArea.placeholder = "Type your notes here...";
        textArea.value = content;
        textArea.rows = 5;
        textArea.classList.add("note-text-area");
        if (noteId) textArea.dataset.noteId = noteId;

        let saveTimeout;
        textArea.addEventListener("input", () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/note/updateNote", {  // Changed to updateNote
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            userId,
                            noteId: textArea.dataset.noteId,
                            content: textArea.value
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (!data.success) {
                        throw new Error(data.message || "Failed to save note");
                    }
                } catch (error) {
                    console.error("Error saving note:", error);
                    alert("Failed to save note. Please try again.");
                }
            }, 1000);
        });

        return textArea;
    }

    async function deleteFolder(folderDiv) {
        if (!confirm("Are you sure you want to delete this folder?")) return;

        const folderName = folderDiv.querySelector('h2').textContent;

        try {
            const response = await fetch("http://localhost:3000/api/note/deleteFolder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    folderName
                })
            });

            const data = await response.json();
            if (data.success) {
                folderDiv.remove();
            } else {
                alert("Failed to delete folder: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting folder:", error);
            alert("Failed to delete folder. Please try again.");
        }
    }

    async function saveFolderName(input, folderTitle) {
        const newName = input.value.trim();
        const oldName = folderTitle.textContent;

        if (newName && newName !== oldName) {
            try {
                const response = await fetch("http://localhost:3000/api/note/renameFolder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        oldName,
                        newName
                    })
                });

                const data = await response.json();
                if (data.success) {
                    folderTitle.textContent = newName;
                } else {
                    alert("Failed to rename folder: " + data.message);
                    folderTitle.textContent = oldName;
                }
            } catch (error) {
                console.error("Error renaming folder:", error);
                alert("Failed to rename folder. Please try again.");
                folderTitle.textContent = oldName;
            }
        }
        input.replaceWith(folderTitle);
    }

    function editFolderName(folderTitle) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = folderTitle.textContent;
        input.classList.add("folder-input");
        folderTitle.replaceWith(input);
        input.focus();

        input.addEventListener("blur", () => saveFolderName(input, folderTitle));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                saveFolderName(input, folderTitle);
            }
        });
    }
});
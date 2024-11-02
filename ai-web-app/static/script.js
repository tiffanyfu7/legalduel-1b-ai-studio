document.getElementById("inputForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const inputText = document.getElementById("inputText").value;
    const response = await fetch("/summarize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
    });

    const result = await response.json();
    const outputElement = document.getElementById("modelOutput");
    const timeline = document.querySelector('.timeline');

    let container_left_Tracker = true;

    if (response.ok) {
        const events = result.summary.split("\n"); 
        outputElement.textContent = '';  
        timeline.textContent = '';

        events.forEach(event => {
            const newLine = document.createElement("p"); 
            newLine.textContent = event; 
            outputElement.appendChild(newLine);  
            
            const [date, description] = event.split(":"); 
            if (date && description) {
                const timeline_content = document.createElement("div");

                if(container_left_Tracker)
                {
                    timeline_content.className = "container left"; 
                    container_left_Tracker = false;
                }
                else
                {
                    timeline_content.className = "container right"; 
                    container_left_Tracker = true;
                }

                timeline_content.innerHTML = `
                    <div class="content">
                        <h2>${date.trim()}</h2> 
                        <p>${description.trim()}</p>
                    </div>
                `;
                timeline.appendChild(timeline_content); 
            }


        });
    } else {
        outputElement.textContent = result.error || "Something went wrong!";
    }
});

function toggleContent() {
    const showText = document.getElementById("showText").checked;
    const showImage = document.getElementById("showTimeline").checked;

    document.getElementById("textContent").style.display = showText ? "block" : "none";
    document.getElementById("timelineContent").style.display = showImage ? "block" : "none";
}

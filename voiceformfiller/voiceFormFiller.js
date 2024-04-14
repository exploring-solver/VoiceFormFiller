let isListening = false;
        let wordsArray = [];

        const recognition = new window.webkitSpeechRecognition(); // For Chrome
        recognition.continuous = true;
        recognition.lang = 'en-US';
        
        // lol u don't know what happens here nigga
        const BASE_URL = 'http://panel.mait.ac.in:3012';

        function sendSpeechToServer(words) {
            const prompt = "I am giving you these details of a form arrange the data in an array and separate them by a comma, " + words.join(', ');
            fetch(`${BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            })
                .then(response => response.json())
                .then(data => {
                    const responseWordsArray = JSON.parse(data.text);
                    console.log('Words array:', responseWordsArray);
                    changeInputValues(responseWordsArray);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        // voice button does the work here
        document.getElementById("voiceButton").addEventListener("click", function () {
            if (!isListening) {
                recognition.start();
                isListening = true;
                this.textContent = "Stop Voice Input";

                wordsArray = [];
            } else {
                recognition.stop();
                isListening = false;
                this.textContent = "Start Voice Input";

                sendSpeechToServer(wordsArray);
            }
        });

        recognition.onend = function () {
            sendSpeechToServer(wordsArray);
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
        };

        // recognizes the array and prints them 
        // ye chalega jab tak stop voice nahi dabaya jata
        recognition.onresult = function (event) {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            const words = transcript.split(',').map(word => word.trim());
            wordsArray = wordsArray.concat(words.filter(Boolean));
            console.log('Current array:', wordsArray);
        };

        // works for checkboxes , input and select and text area
        //made with something called javascript knowledge
        function changeInputValues(values) {
            const form = document.getElementsByTagName("form")[0];
            const inputs = form.querySelectorAll("input, textarea, select");

            for (let i = 0; i < inputs.length && i < values.length; i++) {
                const input = inputs[i];
                const value = values[i];

                if (input.tagName.toLowerCase() === 'input') {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                } else if (input.tagName.toLowerCase() === 'textarea') {
                    input.value = value;
                } else if (input.tagName.toLowerCase() === 'select') {
                    const option = input.querySelector(`option[value="${value}"]`);
                    if (option) {
                        option.selected = true;
                    }
                }
            }
        }
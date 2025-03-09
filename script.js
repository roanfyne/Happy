document.getElementById('extract-button').addEventListener('click', function() {
    const url = document.getElementById('url-input').value;
    if (url) {
        const visited = new Set();
        const mp3List = document.getElementById('mp3-list');
        mp3List.innerHTML = '';

        function extractMP3sFromUrl(url) {
            if (visited.has(url)) return;
            visited.add(url);

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    
                    // Extract MP3 links
                    const mp3Links = Array.from(doc.querySelectorAll('a'))
                        .filter(link => link.href.endsWith('.mp3'))
                        .map(link => link.href);

                    mp3Links.forEach(mp3 => {
                        const div = document.createElement('div');
                        div.className = 'mp3-item';

                        const title = document.createElement('p');
                        title.textContent = mp3.split('/').pop(); // Use the file name as the title
                        div.appendChild(title);

                        const audio = document.createElement('audio');
                        audio.controls = true;
                        audio.src = mp3;
                        div.appendChild(audio);

                        mp3List.appendChild(div);
                    });

                    // Extract and visit linked pages
                    const linkedPages = Array.from(doc.querySelectorAll('a'))
                        .filter(link => link.href && !link.href.endsWith('.mp3'))
                        .map(link => link.href);

                    linkedPages.forEach(link => {
                        extractMP3sFromUrl(link);
                    });

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        extractMP3sFromUrl(url);
    } else {
        alert('Please enter a URL.');
    }
});

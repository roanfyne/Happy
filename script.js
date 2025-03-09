document.getElementById('extract-button').addEventListener('click', function() {
    const url = document.getElementById('url-input').value;
    if (url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const mp3Links = Array.from(doc.querySelectorAll('a'))
                    .filter(link => link.href.endsWith('.mp3'))
                    .map(link => link.href);

                const mp3List = document.getElementById('mp3-list');
                mp3List.innerHTML = '';

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

                if (mp3Links.length === 0) {
                    mp3List.innerHTML = '<p>No MP3 files found.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('mp3-list').innerHTML = '<p>Failed to fetch the URL.</p>';
            });
    } else {
        alert('Please enter a URL.');
    }
});
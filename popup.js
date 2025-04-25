function getYouTubeVideoId(url) {
  const match = url.match(/(?:v=|\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function createImageElement(src, resolution) {
  const wrapper = document.createElement('div');
  const img = document.createElement('img');
  const button = document.createElement('button');

  img.src = src;
  img.alt = resolution;

  button.textContent = `Download ${resolution}`;
  button.onclick = () => {
    chrome.downloads.download({
      url: src,
      filename: `${resolution}.jpg`
    });
  };

  img.onload = () => {
    if (img.naturalWidth === 120 && img.naturalHeight === 90 && resolution !== 'Default (120x90)') {
      wrapper.remove();
    }
  };
  wrapper.classList.add("thumbnail");
  wrapper.appendChild(img);
  wrapper.appendChild(button);
  document.getElementById('main').appendChild(wrapper);
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const videoId = getYouTubeVideoId(tabs[0].url);  
  if (!videoId) {
    document.getElementById('main').innerHTML = '<p class="alert-message">This page is not a valid YouTube video page.</p>';
    return;
  }

  const resolutions = {
    'HD (1280x720)': `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    'SD (640x480)': `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    'HQ (480x360)': `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    'MQ (320x180)': `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    'Default (120x90)': `https://img.youtube.com/vi/${videoId}/default.jpg`,
  };

  for (const [label, url] of Object.entries(resolutions)) {
    createImageElement(url, label);
  }
});
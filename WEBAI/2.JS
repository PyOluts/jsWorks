// Відстеження локації та вибір аудіо
navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    const nearestGuide = findNearestPoint(latitude, longitude);

    if (nearestGuide && currentTrack !== nearestGuide.url) {
        playAudioGuide(nearestGuide.url);
    }
}, error => console.error(error), { enableHighAccuracy: true });

async function playAudioGuide(url) {
    const context = new AudioContext();
    const response = await fetch(url); // Service Worker перехопить це для офлайн-режиму
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
}
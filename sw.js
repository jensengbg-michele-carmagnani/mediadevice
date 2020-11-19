// The purpose of this file is to provide a minimal service worker file
// It is not complete, but it should be enough for you to get started

self.addEventListener('install', function(event) {
  console.log('Service worker: install');
  // Attempt to load cached files
});

self.addEventListener('fetch', function(event) {
  console.log('Service worker: fetch');
// Look for cached files and handle AJAX failures due to being offline
});

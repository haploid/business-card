// Loads the image at the URL, draws it onto a new Canvas element
// Returns the Canvas
function loadImageAsCanvas(url, width, height) {
  const imageTag = document.createElement('img');
  imageTag.src = url;

  return new Promise((fulfill, reject) => {
    imageTag.onerror = (event) => {
      reject(new Error(event.msg));
    };

    imageTag.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width || imageTag.width;
      canvas.height = height || imageTag.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageTag, 0, 0, canvas.width, canvas.height);

      fulfill(canvas);
    };
  });
}

module.exports = {
  loadImageAsCanvas,
};

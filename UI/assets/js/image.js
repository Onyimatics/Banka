
const CLOUDINARY_UPLOAD_PRESET = 'jkyymz0v';
const imagePreview = document.getElementById('img-preview');
const fileUpload = document.getElementById('rupload');


fileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  fetch('https://api.cloudinary.com/v1_1/onyimatics/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then((response) => {
      if (response.secure_url) {
        imagePreview.src = response.secure_url;
      }
      console.log(response);
    })
    .then((error) => {
      console.log(error);
    });
});

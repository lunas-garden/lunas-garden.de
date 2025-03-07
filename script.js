// Language Toggle

const toggleLangButton = document.getElementById('toggle-lang');
let currentLang = 'de'; // Default language is German

toggleLangButton.addEventListener('click', () => {
  // Toggle the language
  currentLang = currentLang === 'en' ? 'de' : 'en';

  // Update the button text
  toggleLangButton.textContent = currentLang === 'de' ? 'EN' : 'DE';

  // Update all elements with language-specific data
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-lang-${currentLang}`);
  });
});



//---------------------------------------------------------

//Details Summary auto close

document.addEventListener("DOMContentLoaded", function() {
  const detailsElements = document.querySelectorAll("#courses .right details");

  detailsElements.forEach((detail) => {
      detail.addEventListener("click", function() {
          detailsElements.forEach((otherDetail) => {
              if (otherDetail !== detail) {
                  otherDetail.removeAttribute("open");
              }
          });
      });
  });
});
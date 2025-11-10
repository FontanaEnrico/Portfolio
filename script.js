const cvButton = document.getElementById('CV');

cvButton.addEventListener('click', () => {
    const fileUrl = 'CV_Fontana_Enrico.pdf';
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'CV_Enrico_Fontana.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

function collegaSocial() {
  const instagramIcon = document.querySelector('.Social svg:first-of-type');

  const linkedinIcon = document.querySelector('.Social svg:nth-of-type(2)');

  const GitHubIcon = document.querySelector('.Social svg:nth-of-type(3)')

  if (instagramIcon) {
    instagramIcon.addEventListener('click', () => {
      window.open('https://www.instagram.com/enrico_fontana._/', '_blank');
    });
  }

  if (linkedinIcon) {
    linkedinIcon.addEventListener('click', () => {
      window.open('https://www.linkedin.com/in/enrico-fontana-67a4a6292/', '_blank');
    });
  }

  if (GitHubIcon) {
    GitHubIcon.addEventListener('click', () => {
      window.open('https://github.com/FontanaEnrico/', '_blank');
    });
  }
}

document.addEventListener('DOMContentLoaded', collegaSocial);

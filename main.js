document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      if (!isOpen) {
        item.classList.add('open');
      } else {
        item.classList.remove('open');
      }
    });
  });

  // 2. Copy to Clipboard for CLI section
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const commandText = 'npm install -g autoflow-cli';
      navigator.clipboard.writeText(commandText).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="text-signal" style="font-size:12px;font-family:var(--f-mono)">Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
        }, 2000);
      });
    });
  }

  // 3. Simple Deploy Sequence Strip Animation Orchestration
  const sequenceStages = document.querySelectorAll('.sequence-stage');
  
  if (sequenceStages.length > 0) {
    let currentStageIndex = 0;
    let timeoutId = null;
    
    // Inject Blue Line and Rocket into every stage
    sequenceStages.forEach((stage) => {
      const line = document.createElement('div');
      line.className = 'blue-line';
      const rocket = document.createElement('div');
      rocket.className = 'rocket-icon';
      rocket.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>';
      line.appendChild(rocket);
      stage.appendChild(line);
    });
    
    const track = document.querySelector('.sequence-track');
    
    const processNextStage = () => {
      if (currentStageIndex > 0) {
        sequenceStages[currentStageIndex - 1].classList.add('passed');
      }
      sequenceStages[currentStageIndex].classList.add('done');
      currentStageIndex++;
      
      if (currentStageIndex < sequenceStages.length) {
        timeoutId = setTimeout(processNextStage, 1000);
      } else {
        timeoutId = setTimeout(() => {
          track.classList.add('fade-out');
          
          setTimeout(() => {
            sequenceStages.forEach(s => {
              s.classList.remove('done');
              s.classList.remove('passed');
            });
            currentStageIndex = 0;
            track.classList.remove('fade-out');
            
            setTimeout(() => {
              timeoutId = setTimeout(processNextStage, 0);
            }, 800);
          }, 800);
        }, 3000);
      }
    };
    
    timeoutId = setTimeout(processNextStage, 500);
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timeoutId);
        if (track) track.classList.remove('fade-out');
        sequenceStages.forEach(s => {
          s.classList.remove('done');
          s.classList.remove('passed');
        });
        currentStageIndex = 0;
        timeoutId = setTimeout(processNextStage, 500);
      }
    });
  }

  // Scroll to top button logic
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
        scrollToTopBtn.style.opacity = '1';
      } else {
        scrollToTopBtn.style.opacity = '0';
        setTimeout(() => { if (window.scrollY <= 300) scrollToTopBtn.style.display = 'none'; }, 200);
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. OS Detection & Direct GitHub Release Download Links
  const REPO_OWNER = 'primetech-live';
  const REPO_NAME = 'Autoflow-Release';
  const DEFAULT_TAG = 'v1.0.0';

  // ponytail: platform & userAgent detection covers Win/Mac/Linux; mobile/unknown defaults to Windows binary
  function detectOS() {
    const ua = (navigator.userAgent || '').toLowerCase();
    const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();

    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
    if (ua.includes('android')) return 'android';
    if (platform.includes('win') || ua.includes('win')) return 'windows';
    if (platform.includes('mac') || ua.includes('mac')) return 'mac';
    if (platform.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
    return 'unknown';
  }

  const downloadAssets = {
    windows: {
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${DEFAULT_TAG}/Autoflow-vNext_${DEFAULT_TAG}.exe`,
      label: 'DOWNLOAD FOR WINDOWS',
      subtext: 'Windows (.exe)'
    },
    mac: {
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${DEFAULT_TAG}/Autoflow-vNext-1.0.0-arm64.dmg`,
      label: 'DOWNLOAD FOR MACOS',
      subtext: 'macOS (.dmg)'
    },
    linux: {
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${DEFAULT_TAG}/autoflow-tech_1.0.0_amd64.deb`,
      label: 'DOWNLOAD FOR LINUX',
      subtext: 'Linux (.deb)'
    },
    unknown: {
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${DEFAULT_TAG}/Autoflow-vNext_${DEFAULT_TAG}.exe`,
      label: 'DOWNLOAD DESKTOP APP',
      subtext: 'Windows, macOS, Linux'
    }
  };

  function updateDownloadLinks(tag = DEFAULT_TAG) {
    const os = detectOS();
    const active = downloadAssets[os] || downloadAssets.unknown;

    // Primary auto-detected buttons (Hero CTA, pricing, etc.)
    const downloadBtns = document.querySelectorAll('.js-download-btn');
    downloadBtns.forEach(btn => {
      btn.href = active.url;
      const labelSpan = btn.querySelector('.js-download-label');
      if (labelSpan) {
        labelSpan.textContent = active.label;
      }
    });

    // Platform-specific buttons in the installation section
    const winBtn = document.querySelector('.js-download-windows');
    const macBtn = document.querySelector('.js-download-mac');
    const linuxBtn = document.querySelector('.js-download-linux');

    if (winBtn) winBtn.href = downloadAssets.windows.url;
    if (macBtn) macBtn.href = downloadAssets.mac.url;
    if (linuxBtn) linuxBtn.href = downloadAssets.linux.url;

    if (winBtn && macBtn && linuxBtn) {
      [winBtn, macBtn, linuxBtn].forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      if (os === 'mac') {
        macBtn.classList.replace('btn-secondary', 'btn-primary');
      } else if (os === 'linux') {
        linuxBtn.classList.replace('btn-secondary', 'btn-primary');
      } else {
        winBtn.classList.replace('btn-secondary', 'btn-primary');
      }
    }

    const osBadgeEl = document.querySelector('.js-os-badge');
    if (osBadgeEl) {
      osBadgeEl.innerHTML = `Auto-detected: <strong style="color: var(--c-bone);">${active.subtext}</strong> &bull; Release ${tag} &bull; <a href="#install" style="color: var(--c-primary); text-decoration: underline;">Other platforms</a>`;
    }
  }

  // Initialize with fallback v1.0.0
  updateDownloadLinks(DEFAULT_TAG);

  // Dynamically resolve actual latest asset URLs from GitHub Releases API
  fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data && Array.isArray(data.assets) && data.assets.length > 0) {
        const tag = data.tag_name || DEFAULT_TAG;
        const exeAsset = data.assets.find(a => a.name.endsWith('.exe') && !a.name.includes('Setup'));
        const dmgAsset = data.assets.find(a => a.name.endsWith('.dmg'));
        const debAsset = data.assets.find(a => a.name.endsWith('.deb')) || data.assets.find(a => a.name.endsWith('.AppImage'));

        if (exeAsset) downloadAssets.windows.url = exeAsset.browser_download_url;
        if (dmgAsset) downloadAssets.mac.url = dmgAsset.browser_download_url;
        if (debAsset) downloadAssets.linux.url = debAsset.browser_download_url;

        updateDownloadLinks(tag);
      }
    })
    .catch(err => {
      console.warn('Could not fetch latest release info, using fallback v1.0.0:', err);
    });

  const sloganEl = document.querySelector('.hero-slogan');
  if (sloganEl) {
    const sloganText = 'Deploy with Precision.';
    sloganEl.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      sloganEl.textContent += sloganText.charAt(i);
      i++;
      if (i >= sloganText.length) clearInterval(interval);
    }, 80);
  }
});

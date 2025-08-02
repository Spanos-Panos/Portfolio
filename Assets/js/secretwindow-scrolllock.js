// This script toggles scroll lock on the body when the secret window is open/closed.
// Call window.SecretWindowScrollLock.enable() when opening, and .disable() when closing.
window.SecretWindowScrollLock = {
  enable: function() {
    document.body.classList.add('secret-modal-open');
    document.body.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.touchAction = 'none';
  },
  disable: function() {
    document.body.classList.remove('secret-modal-open');
    document.body.removeAttribute('aria-hidden');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.touchAction = '';
  }
};

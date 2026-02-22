(function () {
  'use strict';

  // Smooth scroll for anchor links (except pricing CTAs that open modal)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (anchor.hasAttribute('data-pricing-modal')) {
        e.preventDefault();
        var modal = document.getElementById('pricing-modal');
        if (modal) {
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
        }
        return;
      }
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      var target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Pricing modal: close on backdrop, close button, or Escape
  var pricingModal = document.getElementById('pricing-modal');
  if (pricingModal) {
    function closePricingModal() {
      pricingModal.classList.remove('is-open');
      pricingModal.setAttribute('aria-hidden', 'true');
    }
    document.querySelectorAll('[data-pricing-modal-close]').forEach(function (el) {
      el.addEventListener('click', closePricingModal);
    });
    var modalCta = pricingModal.querySelector('.pricing-modal-content a[href="#early-access"]');
    if (modalCta) modalCta.addEventListener('click', closePricingModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pricingModal.classList.contains('is-open')) closePricingModal();
    });
  }

  // Scroll reveal — Intersection Observer
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Early access form (with optional reCAPTCHA v3 for Formspree)
  var form = document.getElementById('early-access-form');
  var formSuccess = document.getElementById('form-success');
  var recaptchaLoaded = false;

  function sendForm(token) {
    var formData = new FormData(form);
    if (token) {
      formData.set('g-recaptcha-response', token);
    }
    var endpoint = 'https://formspree.io/f/' + 'xkovqkbe';
    return fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
  }

  function onFormResult(submitBtn, res) {
    if (res.ok) {
      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Early Access';
      }
    }
  }

  if (form && formSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        return false;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var siteKey = form.getAttribute('data-recaptcha-sitekey');
      var useRecaptcha = siteKey && siteKey.length > 0 && siteKey !== 'YOUR_RECAPTCHA_V3_SITE_KEY';

      if (useRecaptcha) {
        function submitWithToken(token) {
          sendForm(token).then(function (res) {
            onFormResult(submitBtn, res);
          }).catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Request Early Access';
            }
          });
        }
        function doRecaptchaSubmit() {
          if (typeof grecaptcha === 'undefined' || !grecaptcha.ready) {
            submitWithToken(null);
            return;
          }
          grecaptcha.ready(function () {
            grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
              submitWithToken(token);
            }).catch(function () {
              submitWithToken(null);
            });
          });
        }
        if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
          doRecaptchaSubmit();
        } else if (!recaptchaLoaded) {
          recaptchaLoaded = true;
          var s = document.createElement('script');
          s.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(siteKey);
          s.async = true;
          s.onload = doRecaptchaSubmit;
          document.head.appendChild(s);
        } else {
          var attempts = 0;
          var maxAttempts = 50;
          var t = setInterval(function () {
            attempts++;
            if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
              clearInterval(t);
              doRecaptchaSubmit();
            } else if (attempts >= maxAttempts) {
              clearInterval(t);
              submitWithToken(null);
            }
          }, 100);
        }
      } else {
        sendForm(null).then(function (res) {
          onFormResult(submitBtn, res);
        }).catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Early Access';
          }
        });
      }
      return false;
    });
  }
})();

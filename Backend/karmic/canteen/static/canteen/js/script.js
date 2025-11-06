
    // ===== PARTICLE ANIMATION =====
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }

    // ===== PASSWORD VISIBILITY TOGGLE =====
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      this.textContent = isPassword ? '🙈' : '👁';
    });

    // ===== FORM VALIDATION & SUBMISSION =====
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btnText');
    const messagesContainer = document.getElementById('messages-container');

    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Validation
      if (username.length < 3) {
        showAlert('Username must be at least 3 characters long.', 'error', '❌');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'error', '❌');
        return;
      }

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'Logging in...';

      // Simulate API call (replace with actual form submission)
      setTimeout(() => {
        // Success message
        showAlert('Login successful! Redirecting...', 'success', '✅');
        submitBtn.classList.add('success-animation');

        // Reset button state
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          spinner.style.display = 'none';
          btnText.textContent = 'Login';
          // In a real app, this would redirect
          // window.location.href = '/dashboard';
        }, 1500);
      }, 2000);
    });

    // ===== ALERT MESSAGE DISPLAY =====
    function showAlert(message, type, icon) {
      const alertDiv = document.createElement('div');
    //   alertDiv.className = alert alert-${type};
    //   alertDiv.innerHTML = <span class="alert-icon">${icon}</span>${message};

      messagesContainer.appendChild(alertDiv);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        alertDiv.style.animation = 'slideInLeft 0.5s ease-out reverse';
        setTimeout(() => alertDiv.remove(), 500);
      }, 5000);
    }

    // ===== INPUT ANIMATIONS =====
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });

      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
      // Enter to submit
      if (e.key === 'Enter' && (document.activeElement === passwordInput)) {
        loginForm.dispatchEvent(new Event('submit'));
      }

      // Escape to clear form
      if (e.key === 'Escape') {
        loginForm.reset();
        messagesContainer.innerHTML = '';
      }
    });

    // ===== PAGE LOAD ANIMATION =====
    window.addEventListener('load', function() {
      document.body.style.opacity = '1';
    });

    // // Display any server-side messages
    // {% if messages %}
    //   {% for msg in messages %}
    //     showAlert('{{ msg }}', 'error', '⚠');
    //   {% endfor %}
    // {% endif %}

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const inputEl = document.getElementById('input');
  const validateBtn = document.getElementById('validateBtn');
  const copyValidBtn = document.getElementById('copyValidBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultsEl = document.getElementById('results');
  const validCountEl = document.getElementById('valid-count');
  const invalidCountEl = document.getElementById('invalid-count');
  const totalCountEl = document.getElementById('total-count');
  const summaryEl = document.getElementById('validation-summary');
  
  let validAddresses = [];
  let isProcessing = false;
  
  // Helper function to check if a string is valid hex
  function isValidHex(str) {
    return /^[0-9a-fA-F]+$/.test(str);
  }
  
  // Validate a single Ethereum address
  function validateAddress(address) {
    // Trim any whitespace
    address = address.trim();
    
    // Ignore empty strings
    if (!address) {
      return { isValid: false, address, reason: 'Empty address' };
    }
    
    // Check if starts with '0x'
    if (!address.startsWith('0x')) {
      return { isValid: false, address, reason: 'Missing 0x prefix' };
    }
    
    // Remove '0x' prefix for further validation
    const addressWithoutPrefix = address.slice(2);
    
    // Check length (should be 40 chars after removing 0x)
    if (addressWithoutPrefix.length !== 40) {
      return { 
        isValid: false, 
        address, 
        reason: addressWithoutPrefix.length < 40 ? 'Too short' : 'Too long' 
      };
    }
    
    // Check if it contains only hex characters
    if (!isValidHex(addressWithoutPrefix)) {
      return { isValid: false, address, reason: 'Contains non-hex characters' };
    }
    
    // Valid address
    return { isValid: true, address };
  }

  // Main validation function
  function validateAddresses() {
    if (isProcessing) return;
    
    // Reset UI state
    resultsEl.innerHTML = '';
    validAddresses = [];
    summaryEl.classList.add('hidden');
    
    // Get input value
    const raw = inputEl.value.trim();
    if (!raw) {
      showToast('Please enter at least one address', 'warning');
      return;
    }
    
    // Set processing state
    isProcessing = true;
    
    try {
      // Split by commas, newlines or spaces and filter out empty strings
      const rawAddresses = raw.split(/[\n,\s]+/)
        .map(s => s.trim())
        .filter(Boolean);
      
      // Validate each address
      let validCount = 0;
      let invalidCount = 0;
      
      rawAddresses.forEach(addr => {
        const result = validateAddress(addr);
        const li = document.createElement('li');
        const icon = document.createElement('span');
        
        if (result.isValid) {
          li.classList.add('valid');
          icon.innerHTML = '<i class="fas fa-check-circle"></i>';
          validAddresses.push(addr);
          validCount++;
        } else {
          li.classList.add('invalid');
          icon.innerHTML = '<i class="fas fa-times-circle"></i>';
          invalidCount++;
          
          // Add reason for invalid address
          const reason = document.createElement('span');
          reason.className = 'reason';
          reason.textContent = result.reason;
          li.appendChild(reason);
        }
        
        li.prepend(icon);
        li.insertAdjacentText('beforeend', ' ' + addr);
        resultsEl.appendChild(li);
      });
      
      // Update summary
      validCountEl.textContent = validCount;
      invalidCountEl.textContent = invalidCount;
      totalCountEl.textContent = rawAddresses.length;
      
      // Show results
      summaryEl.classList.remove('hidden');
      
      // Scroll to results
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
    } catch (error) {
      console.error('Validation error:', error);
      showToast('Error processing addresses', 'error');
    } finally {
      isProcessing = false;
    }
  }

  // Copy valid addresses to clipboard with fallback
  function copyValidAddresses() {
    if (validAddresses.length === 0) {
      showToast('No valid addresses to copy', 'warning');
      return;
    }
    
    const text = validAddresses.join('\n');
    
    // Try using Clipboard API (modern browsers)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Valid addresses copied to clipboard', 'success'))
        .catch(err => {
          console.error('Clipboard error:', err);
          fallbackCopy(text);
        });
    } else {
      // Fallback for browsers without clipboard API
      fallbackCopy(text);
    }
  }
  
  // Fallback copy method
  function fallbackCopy(text) {
    try {
      // Create temporary textarea
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Execute copy command
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showToast('Valid addresses copied to clipboard', 'success');
      } else {
        showToast('Failed to copy addresses', 'error');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      showToast('Unable to copy addresses', 'error');
    }
  }
  
  // Clear all input and results
  function clearAll() {
    inputEl.value = '';
    resultsEl.innerHTML = '';
    validAddresses = [];
    summaryEl.classList.add('hidden');
    inputEl.focus();
  }
  
  // Create and show a toast notification
  function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existing = document.querySelector('.copied-feedback');
    if (existing) {
      document.body.removeChild(existing);
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'copied-feedback';
    toast.textContent = message;
    
    // Apply color based on type
    if (type === 'error') {
      toast.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
      toast.style.backgroundColor = 'var(--warning-color)';
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Event listeners
  validateBtn.addEventListener('click', validateAddresses);
  copyValidBtn.addEventListener('click', copyValidAddresses);
  clearBtn.addEventListener('click', clearAll);
  
  // Allow validation by pressing Enter in the textarea
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      validateAddresses();
    }
  });
  
  // Initial focus
  inputEl.focus();
});
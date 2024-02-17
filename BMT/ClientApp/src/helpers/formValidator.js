export const formValidator = () => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  const tooltips = document.querySelectorAll('.invalid-tooltip');
  const inputs = document.querySelectorAll('.form-control');
  // Loop over them and prevent submission
  tooltips.forEach((tooltip) => {
    tooltip.style.display = 'none';
  });
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          inputs.forEach((input) => {
            input.addEventListener('mouseenter', () => {
              // Get the next sibling element with the class 'invalid-tooltip'
              const invalidTooltip = input.nextElementSibling;

              // Check if the element exists and is a valid tooltip
              if (invalidTooltip && invalidTooltip.classList.contains('invalid-tooltip')) {
                // Change the display style to 'block'
                invalidTooltip.style.display = 'block';
              }
            });
            // Add event listener for 'mouseenter' (hover)
            input.addEventListener('mouseleave', () => {
              // Get the next sibling element with the class 'invalid-tooltip'
              const invalidTooltip = input.nextElementSibling;

              // Check if the element exists and is a valid tooltip
              if (invalidTooltip && invalidTooltip.classList.contains('invalid-tooltip')) {
                // Change the display style to 'none'
                invalidTooltip.style.display = 'none';
              }
            });

            // Add event listener for 'mouseleave' (hover out)
          });
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      },
      false,
    );
  });
};
export const resetValidation = () => {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.classList.remove('was-validated');
    form.classList.remove('needs-validation');
  });
};

import { alertTypes } from '../stores/alertStore';

export function copyOrShareText(text: string, alertHandler: (_text: string, _type: keyof typeof alertTypes) => void) {
  if (navigator.share) {
    // If the Web Share API is supported, share the text
    navigator
      .share({
        text: text,
      })
      .then(() => alertHandler('Shared successfully', 'success'))
      .catch(() => alertHandler('Error sharing', 'error'));
  } else {
    navigator.clipboard.writeText(text).then(
      function () {
        alertHandler('Share text copied to clipboard', 'success');
      },
      function () {
        alertHandler('Error copying', 'error');
      },
    );
  }
}

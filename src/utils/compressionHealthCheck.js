/**
 * Compression health check — verifies pdf-lib is available and functional.
 * No external API keys or network calls required.
 */

import { PDFDocument } from 'pdf-lib';

/**
 * Check if the local PDF compression engine is healthy
 * @returns {Promise<{healthy: boolean, message: string, details?: object}>}
 */
export const checkCompressionHealth = async () => {
  try {
    // Verify pdf-lib can create and save a document (proves the library works)
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
    await pdfDoc.save({ useObjectStreams: true });

    return {
      healthy: true,
      message: 'Local PDF compression engine (pdf-lib) is operational',
      details: {
        engine: 'pdf-lib + sharp/mozjpeg',
        approach: 'image recompression + grayscale detection + metadata stripping + structural optimization',
        minFileSize: '5 MB',
        maxFileSize: '100 MB',
        qualityLoss: 'visually imperceptible (mozjpeg Q82 + trellis quantisation)',
        networkRequired: false,
      },
    };
  } catch (error) {
    return {
      healthy: false,
      message: 'PDF compression engine failed self-test',
      details: {
        engine: 'pdf-lib',
        error: error.message,
      },
    };
  }
};

/**
 * Get compression statistics and configuration
 * @returns {object}
 */
export const getCompressionStats = () => ({
  engine: 'pdf-lib + sharp/mozjpeg (local)',
  minCompressionSize: '5 MB',
  maxFileSize: '100 MB',
  supportedFormats: ['PDF'],
  approach: 'mozjpeg Q82 with trellis + grayscale detection + metadata stripping + object streams',
  networkRequired: false,
});

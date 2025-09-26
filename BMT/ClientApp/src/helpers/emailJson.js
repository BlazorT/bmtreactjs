// Utility function to convert HTML to Unlayer design JSON
export const htmlToDesignJson = (html) => {
  if (!html) return null;

  // Clean HTML and extract basic content
  const cleanHtml = html.replace(/\s+/g, ' ').trim();

  return {
    body: {
      rows: [
        {
          cells: [1],
          columns: [
            {
              contents: [
                {
                  type: 'html',
                  values: {
                    html: cleanHtml,
                    hideDesktopVersion: false,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };
};

// Alternative: Parse HTML and create structured design
export const htmlToStructuredDesign = (html) => {
  if (!html) return null;

  try {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    const contents = [];

    // Extract different content types
    const elements = body.children;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      switch (element.tagName.toLowerCase()) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          contents.push({
            type: 'text',
            values: {
              text: `<${element.tagName.toLowerCase()}>${element.textContent}</${element.tagName.toLowerCase()}>`,
            },
          });
          break;

        case 'p':
          contents.push({
            type: 'text',
            values: {
              text: `<p>${element.innerHTML}</p>`,
            },
          });
          break;

        case 'img':
          contents.push({
            type: 'image',
            values: {
              src: element.src || '',
              alt: element.alt || '',
            },
          });
          break;

        case 'a':
          if (element.querySelector('img')) {
            // Image with link
            const img = element.querySelector('img');
            contents.push({
              type: 'image',
              values: {
                src: img.src || '',
                alt: img.alt || '',
                href: element.href || '',
              },
            });
          } else {
            // Text link
            contents.push({
              type: 'text',
              values: {
                text: `<a href="${element.href || ''}">${element.textContent}</a>`,
              },
            });
          }
          break;

        case 'table':
          contents.push({
            type: 'html',
            values: {
              html: element.outerHTML,
            },
          });
          break;

        default:
          // For other elements, use HTML block
          contents.push({
            type: 'html',
            values: {
              html: element.outerHTML,
            },
          });
      }
    }

    // If no structured content found, use the entire HTML
    if (contents.length === 0) {
      contents.push({
        type: 'html',
        values: {
          html: html,
        },
      });
    }

    return {
      body: {
        rows: contents.map((content) => ({
          cells: [1],
          columns: [
            {
              contents: [content],
            },
          ],
        })),
      },
    };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    // Fallback to simple HTML block
    return htmlToDesignJson(html);
  }
};

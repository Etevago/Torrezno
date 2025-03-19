import { environment } from '../environment.dev';
import { Result } from './shared.model';
import { formatDate, transformHackerImageToRARBGImage } from './utils/utils';
const parser = new DOMParser();

export const scrapeElAmigos = (html: string | null): Result[] => {
  const results: Result[] = [];
  if (html) {
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll(
      '.row div .card .card-body .card-title a'
    );
    const categories = doc.querySelectorAll('.row div .card .card-body small');
    const images = doc.querySelectorAll('.row div .card a img');
    elements.forEach((element, index) => {
      if (
        categories[index].textContent !== '[Offer]' &&
        categories[index].textContent !== '[Pre-Order]'
      ) {
        results.push({
          name: element.innerHTML,
          link: element.attributes[0].value,
          source: 'ElAmigos',
          img: environment.elamigosApi + images[index].attributes[1].value,
        });
      }
    });
  }
  return results;
};

export const scrapeRARBG = (html: string | null): Result[] => {
  const results: Result[] = [];
  if (html) {
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('.lista2t .lista2');
    elements.forEach((element) => {
      results.push({
        name: element.children[1].children[0].innerHTML,
        link:
          environment.rarbgUrl +
          element.children[1].children[0].attributes[0].value,
        source: 'RARBG',
        img:
          environment.rarbgApi +
          element.children[0].children[0].children[0].attributes[0].value,
        added: new Date(element.children[3].textContent!).toLocaleDateString(
          'es-ES'
        ),
        size: element.children[4].textContent!,
        seeders: +element.children[5].textContent!,
        leechers: +element.children[6].textContent!,
      });
    });
  }
  return results;
};

export const scrapeHacker = (html: string | null): Result[] => {
  const results: Result[] = [];
  if (html) {
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('tbody tr');
    elements.forEach((element) => {
      results.push({
        name: element.children[0].children[1].innerHTML,
        link:
          environment.hackerUrl +
          element.children[0].children[1].attributes[0].value,
        seeders: +element.children[1].textContent!,
        leechers: +element.children[2].textContent!,
        source: '1337x',
        img: transformHackerImageToRARBGImage(element),
        added: formatDate(element.children[3].textContent!),
        size: element.children[4].textContent!,
      });
    });
  }
  return results;
};

const searchForExtraPages = (doc: Document) => {
  // TODO if required in a future release
};

import { environment } from '../environment.dev';
import { Result } from './shared.model';
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
      if (categories[index].textContent !== '[Offer]') {
        results.push({
          name: element.innerHTML,
          link: element.attributes[0].value,
          source: 'ElAmigos',
          img: environment.elamigosApi + images[index].attributes[1].value,
          category: 'Games',
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
        added: element.children[3].textContent!,
        size: element.children[4].textContent!,
        seeders: +element.children[5].textContent!,
        leechers: +element.children[6].textContent!,
      });
    });
  }
  console.log(results);
  return results;
};

export const scrapeHacker = (html: string | null): Result[] => {
  const results: Result[] = [];
  // const elements = html.getElementsByClassName('.row')
  // console.log(elements);
  return results;
};

const searchForExtraPages = (doc: Document) => {
  // TODO if required in a future release
};

import { environment } from '../environment.dev';
import { Result } from './shared.model';
const parser = new DOMParser();

export const scrapeElAmigos = (html: string): Result[] => {
  const results: Result[] = [];
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
        img: environment.elamigos + images[index].attributes[1].value,
      });
    }
  });
  return results;
};

export const scrapeHacker = (html: string): Result[] => {
  const results: Result[] = [];
  // const elements = html.getElementsByClassName('.row')
  // console.log(elements);
  return results;
};

export const scrapeRARBG = (html: string): Result[] => {
  const results: Result[] = [];
  // const elements = html.getElementsByClassName('.row')
  // console.log(elements);
  return results;
};

const searchForExtraPages = (doc: Document) => {
  // TODO if required in a future release
};

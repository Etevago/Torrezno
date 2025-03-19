import { environment } from '../../environment.dev';

export const transformHackerImageToRARBGImage = (element: Element): string => {
  const torrentImg = element.children[0].children[0] as HTMLAnchorElement;
  const img = torrentImg.href.substring(26).split('/')[0];
  let imgPath = 'static/images/categories/';
  switch (img) {
    case 'tv':
      imgPath += 'cat_new18.gif';
      break;
    case 'music':
      imgPath += 'cat_new23.gif';
      break;
    case 'movies':
      imgPath += 'cat_new17.gif';
      break;
    case 'other':
      imgPath += 'cat_new14.gif';
      break;
    case 'xxx':
      imgPath += 'cat_new4.gif';
      break;
    case 'games':
      imgPath += 'cat_new27.gif';
      break;
    case 'apps':
      imgPath += 'cat_new33.gif';
      break;
  }
  return environment.rarbgApi + imgPath;
};

export const formatDate = (date: string): string => {
  const month = date.substring(0, 3);
  const day = date.substring(5, 7);
  const year = '20' + date.substring(12, 14);
  return new Date(`${month} ${day} ${year}`).toLocaleDateString('es-ES');
};

/*
 * # Directly-Injected Scripts
 * To keep things snappy, these scripts — which load assets
 * into the document — are injected directly into the
 * `head` using Pug.
 */
import requireAssets from './utils/assets';

const assets = [
  {
    uri: '/scripts/app.js',
  },
  {
    uri: '/vendor/drop-in-chart/dist/drop-in-chart.min.js',
    callback: () => {
      const chartsLoaded = new Event('drop-in-charts-loaded');
      document.dispatchEvent(chartsLoaded);
    },
  },
];

/*window.addEventListener('load', () => {
  const webfonts = document.createElement('link');
  webfonts.rel = 'stylesheet';
  webfonts.href = '//cloud.typography.com/6102252/617726/css/fonts.css';
  document.head.appendChild(webfonts);
});*/

/*
 * This is a little hacky, but it seems less fragile than having Pug write the
 * JS based on page names.
 */
const isCostOfLiving = !!document.location.pathname.match(/^\/?cost-of-living/);

if (isCostOfLiving) {
  assets.push({
    uri: '/vendor/cost-of-living/dist/bundle.js',
  });
}

/*
 * Remove the `.no-js` class from the body to signify that JS is enabled.
 */
document.addEventListener('DOMContentLoaded', event => {
  document.body.classList.remove('no-js');

  // Some things (like hoverable tooltips) don't work on touch devices
  if (!('ontouchstart' in window) || !('msmaxtouchpoints' in window.navigator)) {
    document.body.classList.add('js__not-touch');
  }

  // If the page requires FontAwesome, include it.
  if (isCostOfLiving) {
    const faScript = document.createElement('link');
    faScript.rel = 'stylesheet';
    faScript.href = '//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css';
    document.head.appendChild(faScript);
  }
});

/*
 * Load assets asynchronously and store them in localStorage to make subsequent
 * loads snappier. Pulling assets from localStorage also avoids extra requests.
 */
requireAssets(assets);

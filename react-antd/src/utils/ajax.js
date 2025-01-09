import globalConfig from '../config';
import MockAjax from './MockAjax';
import RealAjax from './RealAjax';

const mockAjax = new MockAjax();
const realAjax = new RealAjax();

const tmp = globalConfig.debug === true ? mockAjax : realAjax;
export default tmp;

// http://stackoverflow.com/questions/30378226/circular-imports-with-webpack-returning-empty-object

// if (globalConfig.debug === true) {
//   module.exports = mockAjax;
// } else {
//   module.exports = realAjax;
// }

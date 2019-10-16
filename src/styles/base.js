import css from 'styled-jsx/css'
import { getFont } from '../utils/app'

export default css`
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  @font-face{
    font-family:JioTypeW04-Bold;
    src:url(${getFont('eot/JioTypeW04-Bold.eot?#iefix')});
    src:url(${getFont('eot/JioTypeW04-Bold.eot?#iefix')}) format("eot"),
        url(${getFont('woff/JioTypeW04-Bold.woff2')}) format("woff2"),
        url(${getFont('woff/JioTypeW04-Bold.woff')}) format("woff"),
        url(${getFont()}ttf/JioTypeW04-Bold.ttf) format("truetype");
  }
  @font-face{
    font-family:JioTypeW04-Light;    
    src:url(${getFont('eot/JioTypeW04-Light.eot?#iefix')});
    src:url(${getFont('eot/JioTypeW04-Light.eot?#iefix')}) format("eot"),
        url(${getFont('woff/JioTypeW04-Light.woff2')}) format("woff2"),
        url(${getFont('woff/JioTypeW04-Light.woff')}) format("woff"),
        url(${getFont('ttf/JioTypeW04-Light.ttf')}) format("truetype");
  }
  @font-face{
    font-family:JioTypeW04-Medium;
    src:url(${getFont('eot/JioTypeW04-Medium.eot?#iefix')});
    src:url(${getFont('eot/JioTypeW04-Medium.eot?#iefix')}) format("eot"),
        url(${getFont('woff/JioTypeW04-Medium.woff2')}) format("woff2"),
        url(${getFont('woff/JioTypeW04-Medium.woff')}) format("woff"),
        url(${getFont('ttf/JioTypeW04-Medium.ttf')}) format("truetype");
  }
  @font-face{
    font-family:rupee;
    src:url(${getFont('RupeeForadian.eot')});
    src:url(${getFont('RupeeForadian.eot?#iefix')}) format('embedded-opentype'),
        url(${getFont('RupeeForadian.woff')}) format('woff'),
        url(${getFont('RupeeForadian.ttf')}) format('truetype'),
        url(${getFont('RupeeForadian.svg#rupee')}) format('svg');
    font-weight:400;
    font-style:normal;
  }
`

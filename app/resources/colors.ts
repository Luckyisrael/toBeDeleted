export type ColorKeys =
  | 'transparent'
  | 'transparentWhite'
  | 'transparentRed'
  | 'background'
  | 'overlay'
  | 'white'
  | 'black'
  | 'warning'
  | 'error'
  | 'success'
  | 'primary'
  | 'primary1'
  | 'primary2'
  | 'primary30'
  | 'primary40'
  | 'primaryText'
  | 'secondaryText'
  | 'successd1'
  | 'success1'
  | 'success2'
  | 'success3'
  | 'success4'
  | 'errord2'
  | 'errord1'
  | 'error1'
  | 'error2'
  | 'error3'
  | 'error4'
  | 'grey1'
  | 'grey2'
  | 'grey3'
  | 'grey400'
  | 'grey500'
  | 'grey800'
  | 'grey900'
  | 'grey600'
  | 'warningDark2'
  | 'warningDark1'
  | 'warning1'
  | 'warning2'
  | 'warning3'
  | 'warning4'
  | 'blue2'
  | 'blue1'
  | 'cyan1'
  | 'cyan2'
  | 'secondary'
  | 'green'
  | 'primary90'
  | 'primary60'
  | 'primary80'
| 'primary50'
| 'notificationError'

export type ColorDefinitions = { [key in ColorKeys]: string };

export const LIGHT_COLORS: ColorDefinitions = {
  //Base Colors
  background: '#FFFFFF',
  white: '#FFFFFF',
  black: '#141316',

  transparent: 'transparent',
  transparentWhite: '#F4F5F880',
  transparentRed: '##DB3B2133',
  overlay: 'rgba(0,0,0,.8)',

  warning: '#FC9403',
  error: '#DB3B21',
  success: '#38B776',

  primary: '#17CE89',
  primary1: '#710040',
  primary2: '#AA0061',
  primary30: '#849296',
  primary40: '#5B6D73',
  primary50: '#324950',
  primary60: '#081E26',
  primary80: '#051217',
  primary90: '#030C0F',

  secondary: '#F4AB19', 
  green: '#009951',

  primaryText: '#25396F',
  secondaryText: '#707FA3',
  successd1: '#257A4F',
  success1: '#63CF98',
  success2: '#97DFBA',
  success3: '#CBEFDD',
  success4: '#0F973D',

  errord2: '#49140B',
  errord1: '#922716',
  error1: '#E66B57',
  error2: '#EE9C8F',
  error3: '#F7CEC7',
  error4: '#FDF3F2',

  warningDark2: '#543101',
  warningDark1: '#A86302',
  warning1: '#FDAF42',
  warning2: '#FECA81',
  warning3: '#FEE4C0',
  warning4: '#FFF9F0',

  grey1: '#F5F6F8',
  grey2: '#646A86',
  grey3: '#707FA3',
  grey400: '#98A2B3',
  grey500: '#667185',
  grey600: '#475367',
  grey800: '#7E7E7E',
  grey900: '#101928',

  blue2: '#E2F1FD',
  blue1: '#53A6EB',

  cyan1: '#CB8E15',
  cyan2: '#E2FDFD',

  notificationError: '#DD524D',
} as const;

export const DARK_COLORS: ColorDefinitions = {
  //Base Colors
  background: '#FFF',
  white: '#FFFFFF',
  black: '#141316',

  transparent: 'transparent',
  transparentWhite: '#F4F5F880',
  transparentRed: '#DB3B2133',
  overlay: 'rgba(0,0,0,.8)',

  warning: '#FC9403',
  error: '#DB3B21',
  success: '#38B776',

  primary: '#380020',
  primary1: '#710040',
  primary2: '#EEFCF6',
  primary30: '#109261',
  primary40: '#FFF5FB',
  primary50: '',
  primary60: '',
  primary80: '',
  primary90: '',

  secondary: '',
  green: '',

  primaryText: '#133D27',
  secondaryText: '',
  successd1: '#257A4F',
  success1: '#63CF98',
  success2: '#97DFBA',
  success3: '#CBEFDD',
  success4: '#F3FBF7',

  errord2: '#49140B',
  errord1: '#922716',
  error1: '#E66B57',
  error2: '#EE9C8F',
  error3: '#F7CEC7',
  error4: '#FDF3F2',

  warningDark2: '#543101',
  warningDark1: '#A86302',
  warning1: '#FDAF42',
  warning2: '#FECA81',
  warning3: '#FEE4C0',
  warning4: '#FFF9F0',

  grey1: '#303237',
  grey2: '#565C69',
  grey3: '#7E8494',
  grey400: '#BDC0CE',
  grey500: '#E5E7EF',
  grey600: '',
  grey800: '#999999',
  grey900: '#FAFAFC',

  blue2: '#E2F1FD',
  blue1: '',

  cyan1: '',
  cyan2: '',
  notificationError: ''
} as const;
